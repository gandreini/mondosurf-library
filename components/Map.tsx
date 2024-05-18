'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { MaptilerLayer } from '@maptiler/leaflet-maptilersdk';
import { basicMapFiltersCheck } from 'features/map/mapFilters.helpers';
import { Feature, FeatureCollection } from 'geojson';
import {
    control as LeafletControl,
    GeoJSON,
    LatLng,
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
    createPopUp,
    placeIcon,
    positionMap,
    tilesLayerToggle
} from 'mondosurf-library/helpers/map.helpers';
import { getUrlParameter } from 'mondosurf-library/helpers/various.helpers';
import { RootState } from 'mondosurf-library/redux/store';
import toastService from 'mondosurf-library/services/toastService';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

interface IMap {
    lat?: number;
    lng?: number;
    // advancedFilters?: boolean;
    hideGeolocationButton?: boolean;
    geojson?: FeatureCollection;
    draggableMarker?: boolean;
    topPadding?: number;
    cluster?: boolean;
    customIcon?: string;
    noDragOnMobile?: boolean;
    updateLatLngCallback?: (lat: number, lng: number) => void;
    regionId?: number;
    countryId?: number;
}

const Map: React.FC<IMap> = (props: IMap) => {
    // Constants
    const mapLatLngZoom: number = 15;
    const maxZoom: number = 30;
    const zoomSnap: number = 0.1; // By default, the zoom level snaps to the nearest integer; lower values (e.g. 0.5 or 0.1) allow for greater zoom granularity
    const defaultPadding = 70;
    const topPadding: number = props.topPadding ? props.topPadding : defaultPadding;
    const cluster: boolean = props.cluster === false ? false : true;

    // The map style: vector or satellite.
    const [mapStyle, setMapStyle] = useState<'satellite1' | 'satellite2' | 'vector'>('vector');

    // Lat and long to center the map
    const lat: number | null = props.lat ? props.lat : getUrlParameter('lat') ? Number(getUrlParameter('lat')) : null;
    const lng: number | null = props.lng ? props.lng : getUrlParameter('lng') ? Number(getUrlParameter('lng')) : null;

    // If the map is draggable
    const isDraggable = !screenWiderThan(760) && props.noDragOnMobile ? false : true;

    // Used to avoid the error "Map container is already initialized.".
    let map = useRef<LeafletMap | null>(null);

    const geojsonLayer = useRef<GeoJSON | null>(null);
    const markers = useRef<LeafletMarkerClusterGroup | null>(null);

    const [userIsPro, setUserIsPro] = useState<boolean | 'checking'>('checking');

    // Geolocation request status: used to show a loader inside the button.
    const [geolocationStatus, setGeolocationStatus] = useState<
        'INIT' | 'REQUESTING' | 'RETRIEVED' | 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT'
    >('INIT');

    // Redux.
    const logged = useSelector((state: RootState) => state.user.logged);
    const accountType = useSelector((state: RootState) => state.user.accountType);

    // We check if the user is pro before initializing the map
    useEffect(() => {
        if (logged === 'no') setUserIsPro(false);
        if (logged === 'yes') {
            if (accountType === 'admin' || accountType === 'pro' || accountType === 'trial') {
                setUserIsPro(true);
            } else {
                setUserIsPro(true);
            }
        }
    }, [accountType, logged]);

    useEffect(() => {
        // Removes the map when leaving the page
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    // Tiles
    /* const vectorTiles = useRef<TileLayer>(
        tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], // Only for Google stuff
            noWrap: true,
            attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>'
        })
    ); */

    const vectorTiles = useRef<TileLayer>(
        new MaptilerLayer({
            apiKey: 'jkkNWMxIibSduqPbQtcw',
            style: '51fb4646-7688-4b5d-a227-09837b7b7770'
        })
    );

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

    const initializeMap = useCallback(
        (mapNode: HTMLDivElement | null) => {
            if (typeof window !== 'undefined' && mapNode !== null && !map.current) {
                // Wrap the createMarker function to pass the additional parameter
                const wrappedCreateMarker = (feature: Feature, latlng: LatLng) => {
                    return createMarker(feature, latlng, userIsPro);
                };

                // Map creation
                map.current = new LeafletMap(mapNode, {
                    dragging: isDraggable,
                    zoomControl: false,
                    attributionControl: false,
                    maxZoom: maxZoom, // Depends on the tiles you use
                    touchZoom: true,
                    zoomSnap: zoomSnap,
                    wheelPxPerZoomLevel: 20, // Smaller values will make wheel-zooming faster
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

                    // Map positioning
                    positionMap(map.current, mapLatLngZoom, defaultPadding, topPadding, geojsonLayer.current, lat, lng);

                    // Draggable marker
                    placeIcon(
                        map.current,
                        lat,
                        lng,
                        props.draggableMarker,
                        props.customIcon,
                        props.updateLatLngCallback
                    );
                } else if (lat && lng && !props.draggableMarker) {
                    // Surf spot page: loads the JSON and centers the map

                    // Adds spots
                    geojsonLayer.current = new GeoJSON(props.geojson, {
                        // Swaps Lat and Lng in case they are swapped
                        coordsToLatLng: function (coords: number[]) {
                            return new LatLng(coords[0], coords[1], coords[2]);
                        },
                        pointToLayer: wrappedCreateMarker,
                        onEachFeature: createPopUp, // Popover
                        // Filter
                        filter: (feature) => {
                            return basicMapFiltersCheck(feature, props.countryId, props.regionId);
                        }
                    });

                    // Add the actual markers and clusters on the map
                    addMarkersOnMap(
                        map.current,
                        geojsonLayer.current,
                        markers.current,
                        defaultPadding,
                        topPadding,
                        userIsPro,
                        false
                    );

                    // Map positioning
                    positionMap(map.current, mapLatLngZoom, defaultPadding, topPadding, geojsonLayer.current, lat, lng);
                } else if (props.geojson && props.geojson.features && props.geojson.features.length > 0) {
                    // Map page: GeoJson layer with all surf spots
                    geojsonLayer.current = new GeoJSON(props.geojson, {
                        // Swaps Lat and Lng in case they are swapped
                        coordsToLatLng: function (coords: number[]) {
                            return new LatLng(coords[0], coords[1], coords[2]);
                        },
                        pointToLayer: wrappedCreateMarker,
                        onEachFeature: createPopUp, // Popover
                        // Filter
                        filter: (feature) => {
                            return basicMapFiltersCheck(feature, props.countryId, props.regionId);
                        }
                    });

                    // Add the actual markers and clusters on the map
                    addMarkersOnMap(
                        map.current,
                        geojsonLayer.current,
                        markers.current,
                        defaultPadding,
                        topPadding,
                        userIsPro,
                        cluster
                    );

                    positionMap(map.current, mapLatLngZoom, defaultPadding, topPadding, geojsonLayer.current, lat, lng);
                }
            }
        },
        [cluster, isDraggable, lat, lng, props, topPadding, userIsPro]
    );

    // We check if the user is pro before initializing the map
    const mapRef = useCallback(
        (mapNode: HTMLDivElement | null) => {
            if (userIsPro !== 'checking') {
                initializeMap(mapNode);
            }
        },
        [initializeMap, userIsPro]
    );

    // Gets feedback about user geolocation from centerMapOnUserPosition
    const updateUserGeolocation = (outcome: 'RETRIEVED' | 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT') => {
        if (outcome === 'PERMISSION_DENIED' || outcome === 'POSITION_UNAVAILABLE' || outcome === 'TIMEOUT') {
            toastService.error('There was a problem retrieving your position');
        }
        setGeolocationStatus(outcome);
    };

    return (
        <>
            {/* The map */}
            <div
                ref={mapRef}
                className="ms-map-global__container"
                itemScope
                itemProp="hasMap"
                itemType="http://schema.org/Map"
                data-test="surf-spot-map"
            />

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
