'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// import { MaptilerLayer } from '@maptiler/leaflet-maptilersdk';
// import { basicMapFiltersCheck } from 'features/map/mapFilters.helpers';
import { Feature, FeatureCollection } from 'geojson';
import { isApp } from 'helpers/device.helpers';
import {
    control as LeafletControl,
    GeoJSON,
    LatLng,
    Layer,
    Map as LeafletMap,
    MarkerClusterGroup as LeafletMarkerClusterGroup,
    TileLayer,
    tileLayer
} from 'leaflet';
import Icon from 'mondosurf-library/components/Icon';
import Loader from 'mondosurf-library/components/Loader';
import { screenWiderThan } from 'mondosurf-library/helpers/device.helpers';
import {
    addMarkersOnMap,
    centerMapOnUserPosition,
    createMarker,
    placeIcon,
    positionMap,
    tilesLayerToggle
} from 'mondosurf-library/helpers/map.helpers';
import { createPopUpApp, createPopUpWeb } from 'mondosurf-library/helpers/mapPopUpHelper';
import { getUrlParameter } from 'mondosurf-library/helpers/various.helpers';
import toastService from 'mondosurf-library/services/toastService';
import { useRouterProxy } from 'proxies/useRouter';
import { useEffect, useRef, useState } from 'react';

interface IMap {
    lat?: number;
    lng?: number;
    // advancedFilters?: boolean;
    hideGeolocationButton?: boolean;
    showCenterButton?: boolean;
    geojson?: FeatureCollection;
    draggableMarker?: boolean;
    topPadding?: number;
    cluster?: boolean;
    customIcon?: string;
    noDragOnMobile?: boolean;
    // regionId?: number;
    // countryId?: number;
    updateLatLngCallback?: (lat: number, lng: number) => void;
}

const Map: React.FC<IMap> = (props: IMap) => {
    // React router
    const router = useRouterProxy();

    // Constants
    const mapLatLngZoom: number = 15;
    const maxZoom: number = 18;
    // const zoomSnap: number = 0.1; // By default, the zoom level snaps to the nearest integer; lower values (e.g. 0.5 or 0.1) allow for greater zoom granularity
    const defaultPadding = 70;
    const topPadding: number = props.topPadding ? props.topPadding : defaultPadding;
    const cluster: boolean = props.cluster === false ? false : true;

    // The map style: vector or satellite.
    const [mapStyle, setMapStyle] = useState<'satellite1' | 'satellite2' | 'vector'>('vector');

    // Lat and long to center the map
    const lat: number | null = props.lat ? props.lat : getUrlParameter('lat') ? Number(getUrlParameter('lat')) : null;
    const lng: number | null = props.lng ? props.lng : getUrlParameter('lng') ? Number(getUrlParameter('lng')) : null;
    const countryId: number | null = Number(getUrlParameter('country')) ?? null;
    const regionId: number | null = Number(getUrlParameter('region')) ?? null;

    // If the map is draggable
    const isDraggable = !screenWiderThan(760) && props.noDragOnMobile ? false : true;

    // Holds the Leaflet map instance (not a DOM element)
    const map = useRef<LeafletMap | null>(null);
    // Holds a reference to the DOM div element: Container ref for the map div
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    const geojsonLayer = useRef<GeoJSON | null>(null);
    const markers = useRef<LeafletMarkerClusterGroup | null>(null);

    // Geolocation request status: used to show a loader inside the button.
    const [geolocationStatus, setGeolocationStatus] = useState<
        'INIT' | 'REQUESTING' | 'RETRIEVED' | 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT'
    >('INIT');

    // Initialize map on mount and cleanup on unmount.
    // We use useEffect instead of a callback ref for React 18 StrictMode compatibility.
    // StrictMode double-renders components, and callback refs don't re-fire when React
    // reuses the same DOM element, causing the map to be destroyed but not re-created.
    useEffect(() => {
        // Get the DOM element where Leaflet will render the map
        const mapNode = mapContainerRef.current;
        // Only initialize if: 1) the DOM element exists, 2) map hasn't been created yet
        if (mapNode && !map.current) {
            initializeMap(mapNode);
        }

        // Cleanup: removes the map when the component unmounts
        return () => {
            if (map.current) {
                map.current.remove(); // Leaflet cleanup: removes all layers and event listeners
                map.current = null; // Reset ref so map can be re-initialized if component remounts
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty deps = run once on mount. initializeMap is intentionally omitted.

    // Tiles
    const vectorTiles = useRef<TileLayer>(
        tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], // Only for Google stuff
            noWrap: true,
            attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>'
        })
    );

    /* const vectorTiles = useRef<TileLayer>(
        new MaptilerLayer({
            apiKey: 'jkkNWMxIibSduqPbQtcw',
            style: '51fb4646-7688-4b5d-a227-09837b7b7770'
        })
    ); */

    const satelliteTiles1 = useRef<TileLayer>(
        tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], // Only for Google stuff
            noWrap: true,
            attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>'
        })
    );
    const satelliteTiles2 = useRef<TileLayer>(
        tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            noWrap: true,
            attribution: 'Tiles &copy; Esri'
        })
    );

    const initializeMap = (mapNode: HTMLDivElement | null) => {
        if (typeof window !== 'undefined' && mapNode !== null && !map.current) {
            // Wrap createPopUp to inject the router dependency
            const wrappedCreatePopUp = (feature: Feature, layer: Layer) => {
                return isApp() ? createPopUpApp(feature, layer, router) : createPopUpWeb(feature, layer, router);
            };

            // Map creation
            map.current = new LeafletMap(mapNode, {
                dragging: isDraggable,
                zoomControl: false,
                attributionControl: false,
                maxZoom: maxZoom,
                minZoom: 1.5,
                touchZoom: true,
                wheelPxPerZoomLevel: 20,
                maxBoundsViscosity: 1.0
            });

            // Sets the bounds for the dragging of the map
            map.current.setMaxBounds([
                [-90, -180],
                [90, 180]
            ]);

            // Attribution/Copyright position
            LeafletControl.attribution({
                position: 'topright'
            }).addTo(map.current);

            // Adds map layer based on user preferences set in local storage
            if (localStorage.getItem('ms_map_style') === 'satellite1') {
                map.current.addLayer(satelliteTiles1.current);
                setMapStyle('satellite1');
            } else if (localStorage.getItem('ms_map_style') === 'satellite2') {
                map.current.addLayer(satelliteTiles2.current);
                setMapStyle('satellite2');
            } else {
                map.current.addLayer(vectorTiles.current);
                setMapStyle('vector');
            }

            if (lat && lng && props.draggableMarker) {
                // Edit surf spot: centers on a spot and draggable marker
                positionMap(map.current, mapLatLngZoom, defaultPadding, topPadding, geojsonLayer.current, lat, lng);

                placeIcon(
                    map.current,
                    lat,
                    lng,
                    props.draggableMarker,
                    props.customIcon,
                    props.updateLatLngCallback
                );
            } else {
                // Main map with all spots
                geojsonLayer.current = new GeoJSON(props.geojson, {
                    // Swaps Lat and Lng in case they are swapped
                    coordsToLatLng: function (coords: number[]) {
                        return new LatLng(coords[0], coords[1], coords[2]);
                    },
                    pointToLayer: createMarker,
                    onEachFeature: wrappedCreatePopUp
                });

                addMarkersOnMap(
                    map.current,
                    geojsonLayer.current,
                    markers.current,
                    defaultPadding,
                    topPadding,
                    cluster
                );

                positionMap(
                    map.current,
                    mapLatLngZoom,
                    defaultPadding,
                    topPadding,
                    geojsonLayer.current,
                    lat,
                    lng,
                    countryId,
                    regionId
                );
            }
        }
    };

    // Gets feedback about user geolocation from centerMapOnUserPosition
    const updateUserGeolocation = (outcome: 'RETRIEVED' | 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT') => {
        if (outcome === 'PERMISSION_DENIED' || outcome === 'POSITION_UNAVAILABLE' || outcome === 'TIMEOUT') {
            toastService.error('There was a problem retrieving your position');
        }
        setGeolocationStatus(outcome);
    };

    // Centers the map
    const centerMapOnLatLng = (resetZoom: boolean = true): void => {
        if (map.current && props.lat && props.lng) {
            const newZoom = resetZoom ? mapLatLngZoom : map.current.getZoom();
            map.current.setView(new LatLng(props.lat, props.lng), newZoom);
        }
    };

    return (
        <>
            {/* The map */}
            <div ref={mapContainerRef} className="ms-map-global__container" data-test="surf-spot-map" />

            {/* Controls */}
            <div className="ms-map__controls" data-test="surf-spot-map-controls">
                <div className="ms-map__zoom">
                    <div
                        id="map_zoom_in"
                        className="ms-map__zoom-in"
                        onClick={() => {
                            if (map.current) map.current.setZoom(map.current.getZoom() + 1);
                        }}>
                        <Icon icon="plus" />
                    </div>
                    <div
                        id="map_zoom_out"
                        className="ms-map__zoom-out"
                        onClick={() => {
                            if (map.current) map.current.setZoom(map.current.getZoom() - 1);
                        }}>
                        <Icon icon="minus" />
                    </div>
                </div>
                <div
                    id="map_global_switch-button"
                    className={
                        mapStyle === 'satellite1' || mapStyle === 'satellite2'
                            ? 'ms-map__switch is-active'
                            : 'ms-map__switch'
                    }
                    onClick={() => {
                        tilesLayerToggle(
                            map.current,
                            vectorTiles.current,
                            satelliteTiles1.current,
                            satelliteTiles2.current,
                            setMapStyle
                        );
                    }}>
                    <Icon icon="image" />
                </div>

                {props.showCenterButton && (
                    <div className="ms-map__controls_bottom">
                        <div className="ms-btn ms-btn-multiline" onClick={() => centerMapOnLatLng(false)}>
                            Reset position
                        </div>
                        <div className="ms-btn ms-btn-multiline" onClick={() => centerMapOnLatLng(true)}>
                            Reset position and zoom
                        </div>
                    </div>
                )}
            </div>

            {!props.hideGeolocationButton && (
                <div
                    className="ms-map__center is-displayed"
                    onClick={() => {
                        if (map.current) {
                            setGeolocationStatus('REQUESTING');
                            centerMapOnUserPosition(map.current, updateUserGeolocation);
                        }
                    }}
                    data-test="surf-spot-map-center">
                    {geolocationStatus === 'REQUESTING' && <Loader size="small" />}
                    {geolocationStatus !== 'REQUESTING' && <Icon icon="crosshair" />}
                </div>
            )}

            {/* {props.advancedFilters && (
                <I18nProviderClient locale="en">
                    <MapFilters callbackFunction={updateAdvancedFilters} />
                </I18nProviderClient>
            )} */}
        </>
    );
};
export default Map;
