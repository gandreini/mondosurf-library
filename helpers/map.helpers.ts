import 'leaflet.markercluster';

import { Feature } from 'geojson';
import {
    divIcon as LeafletDivIcon,
    GeoJSON,
    Icon as LeafletIcon,
    icon as LeafletIcon2,
    IconOptions,
    LatLng,
    LatLngBounds,
    latLngBounds,
    Map as LeafletMap,
    Marker as LeafletMarker,
    marker as LeafletMarker2,
    marker as Marker,
    MarkerClusterGroup as LeafletMarkerClusterGroup,
    markerClusterGroup as markerClusterGroup2,
    TileLayer
} from 'leaflet';
import { getUserLocation } from 'proxies/getUserLocation';
import { IMAGES_URL } from 'proxies/localConstants';

/**
 * Provides the right icon for each point.
 * Checks wave direction and if there are good days.
 * 
 * @param {geojson.Feature} feature Single feature from GeoJSON which corresponds to a single pin on the map.
 * @param {L.LatLng} latlng Lat and long of the pin on the map.
 */
export function createMarker(
    feature: Feature,
    latlng: LatLng,
    userIsPro: boolean | 'checking'

): LeafletMarker {
    // Properties of the spot
    const properties = feature.properties || {};

    // Determine the base icon URL based on the direction
    const baseUrl = IMAGES_URL + "map-pins/";
    const iconUrl = properties.di === 'A' ? `${baseUrl}map-pin-a-frame.svg` :
        properties.di === 'L' ? `${baseUrl}map-pin-left.svg` :
            properties.di === 'R' ? `${baseUrl}map-pin-right.svg` :
                `${baseUrl}map-pin.svg`;

    // Icon class
    const surfQuality = extractSurfQualityFromGeojsonFeature(properties.gd, userIsPro);
    const iconClass = 'quality-' + surfQuality.toString();

    const icon = LeafletDivIcon({
        html: surfQuality >= 0 ? `
        <div class="ms-map-marker-icon ${iconClass}"> 
            <img class="ms-map-marker-icon__image" src="${iconUrl}" alt="${properties.nm}">
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.70679 0.571557C7.81526 0.310742 8.18474 0.310742 8.29322 0.571557L10.2807 5.35008C10.3264 5.46003 10.4298 5.53515 10.5486 5.54467L15.7074 5.95825C15.9889 5.98082 16.1031 6.33221 15.8886 6.51598L11.9581 9.88285C11.8677 9.96032 11.8282 10.0819 11.8558 10.1977L13.0566 15.2318C13.1222 15.5066 12.8233 15.7238 12.5822 15.5765L8.16553 12.8788C8.06391 12.8168 7.93609 12.8168 7.83447 12.8788L3.41781 15.5765C3.17674 15.7238 2.87783 15.5066 2.94337 15.2318L4.1442 10.1977C4.17183 10.0819 4.13233 9.96032 4.04189 9.88285L0.111421 6.51598C-0.103107 6.33221 0.0110668 5.98082 0.292639 5.95825L5.45145 5.54467C5.57015 5.53515 5.67355 5.46003 5.71929 5.35008L7.70679 0.571557Z"/>
            </svg>
        </div>` : `<div class="ms-map-marker-icon"><img class="ms-map-marker-icon__image" src="${iconUrl}" alt="${properties.nm}"></div > `,
        iconSize: [44, 44],        // Set the size of the icon
        iconAnchor: [22, 44],      // Set the anchor point of the icon
        popupAnchor: [1, -44],     // Set the anchor point for popups
    });

    return new LeafletMarker(latlng, { icon });
}

/**
 * Toggle of the layer in the map.
 * 
 * @param {LeafletMap | null} map                    The map leaflet object.
 * @param {TileLayer | null} vectorTiles      Layer tiles with vector map.
 * @param {TileLayer | null} satelliteTiles1   Layer tiles with satellite map.
 * @param {TileLayer | null} satelliteTiles2   Layer tiles with satellite map.
 * @param {Function} setMapStyle                Function that is in charge of modifying the mapStyle variable in map.tsx.
 */
export const tilesLayerToggle = (
    map: LeafletMap | null,
    vectorTiles: TileLayer | null,
    satelliteTiles1: TileLayer | null,
    satelliteTiles2: TileLayer | null,
    setMapStyle: Function
): void => {
    if (map !== null && vectorTiles !== null && satelliteTiles1 !== null && satelliteTiles2 !== null) {
        if (map.hasLayer(vectorTiles)) {
            map.removeLayer(vectorTiles);
            map.addLayer(satelliteTiles1);
            localStorage.setItem('ms_map_style', 'satellite1');
            setMapStyle('satellite1');
        } else if (map.hasLayer(satelliteTiles1)) {
            map.removeLayer(satelliteTiles1);
            map.addLayer(satelliteTiles2);
            localStorage.setItem('ms_map_style', 'satellite2');
            setMapStyle('satellite2');
        } else if (map.hasLayer(satelliteTiles2)) {
            map.removeLayer(satelliteTiles2);
            map.addLayer(vectorTiles);
            localStorage.setItem('ms_map_style', 'vector');
            setMapStyle('vector');
        }
    }
}

/**
 * Handles the click each popover, and links to the destination.
 * 
 * @param {LeafletMap} map           The map.
 * @param {AppRouterInstance} router   Object representing the navigation history.
 */
/* export function handleClickOnPopover(
    map: LeafletMap,
    router: AppRouterInstance
) {
    map.on('popupopen', function (e: any) {
        // ! TODO Possible error is here!
        const popover = document.getElementById("ms_map_popover");
        if (popover) {
            popover.addEventListener("click", function () {
                const clickedPopover = this;
                router.push(`/surf-spot/${clickedPopover.dataset.slug}/guide/${clickedPopover.dataset.id}`);
            }, false);
        }
    });
} */

/**
 * Positions the Leaflet map. Various options available:
 * 1. Lat and Lng are provided via props or via url parameters: the position of the map is forced.
 * 2. The whole world is displayed.
 * 3. The map is positioned to fit all the markers on it.
 *
 * @param   {LeafletMap} map The Leaflet Map.
 * @param   {number} mapLatLngZoom Zoom level of the map.
 * @param   {number} defaultPadding Zoom level of the map.
 * @param   {number} topPadding Zoom level of the map.
 * @param   {L.GeoJSON | null} geojsonLayer GeoJson layer with all the markers..
 * @param   {number | null} lat Latitude of the map: provided only if the Map position must be forced.
 * @param   {number | null} lng Longitude of the map: provided only if the Map position must be forced.
 * @param   {number | null} countryId Id of the country to focus on.
 * @param   {number | null} regionId Id of the region to focus on
 */
export const positionMap = (map: LeafletMap, mapLatLngZoom: number, defaultPadding: number, topPadding: number, geojsonLayer: L.GeoJSON | null, lat?: number | null, lng?: number | null, countryId?: number | null, regionId?: number | null) => {
    if (lat && lng) {
        // 1. Lat and Lng are provided via props or via url parameters: the position of the map is forced.
        map.setView([lat, lng], mapLatLngZoom);
    } else if (geojsonLayer && geojsonLayer.getLayers().length > 0 && geojsonLayer.getBounds() !== null) {

        let mapBounds: LatLngBounds;

        if (countryId) {
            // 2. The map is positioned to fit the markers in a given country.
            let countryFeatures: LatLng[] = [];
            geojsonLayer.eachLayer(function (layer) {
                if (layer instanceof LeafletMarker && layer.feature && layer.feature.properties.ci === countryId) {
                    countryFeatures.push(layer.getLatLng());
                }
            });
            if (countryFeatures.length === 0) {
                mapBounds = geojsonLayer.getBounds();
            } else {
                mapBounds = latLngBounds(countryFeatures);
            }
        } else if (regionId) {
            // 2. The map is positioned to fit the markers in a given region.
            let regionFeatures: LatLng[] = [];
            geojsonLayer.eachLayer(function (layer) {
                if (layer instanceof LeafletMarker && layer.feature && layer.feature.properties.ri === regionId) {
                    regionFeatures.push(layer.getLatLng());
                }
            });
            if (regionFeatures.length === 0) {
                mapBounds = geojsonLayer.getBounds();
            } else {
                mapBounds = latLngBounds(regionFeatures);
            }
        } else {
            // 3. The map is positioned to fit all the markers on it.
            mapBounds = geojsonLayer.getBounds()
        }

        map.fitBounds(mapBounds, {
            padding: [defaultPadding, defaultPadding],
            paddingTopLeft: [defaultPadding, topPadding]
        });
    }
};

/**
 * Places an icon on the given Leaflet map at the specified latitude and longitude.
 *
 * @param {LeafletMap} map - The Leaflet map instance where the icon will be placed.
 * @param {number} lat - The latitude coordinate for the icon placement.
 * @param {number} lng - The longitude coordinate for the icon placement.
 * @param {boolean} [draggable=false] - Optional. Whether the icon should be draggable. Defaults to false.
 * @param {string} [customIcon] - Optional. The URL of a custom icon to be used. If not provided, a default icon will be used.
 * @param {(lat: number, lng: number) => void} [callbackFunction] - Optional. A callback function to be called when the icon is dragged. Receives the new latitude and longitude as arguments.
 *
 * @example
 * placeIcon(map, 51.505, -0.09);
 * placeIcon(map, 51.505, -0.09, false, 'custom-icon.svg');
 */
export const placeIcon = (map: LeafletMap, lat: number, lng: number, draggable?: boolean, customIcon?: string, callbackFunction?: (lat: number, lng: number) => void) => {
    const iconOptions: IconOptions = {
        iconSize: [44, 44],
        iconAnchor: [22, 44],
        popupAnchor: [1, -44],
        iconUrl: customIcon
            ? IMAGES_URL + 'map-pins/' + customIcon
            : IMAGES_URL + 'map-pins/map-pin-a-frame.svg',
        className: "no-custom-class" || ''
    };

    const marker: LeafletMarker<any> = Marker([lat, lng], {
        draggable: draggable && draggable === true ? true : false,
        icon: new LeafletIcon(iconOptions)
    }).addTo(map);

    // Draggable pin
    if (draggable) {
        marker.on('dragend', function (e) {
            var latlng = marker.getLatLng();
            lat = latlng.lat;
            lng = latlng.lng;
            map.setView([lat, lng]);
            if (callbackFunction) callbackFunction(lat, lng);
        });
    }
}

/**
 * Adds markers to the map, either as individual markers or as a clustered group, depending on the specified parameters.
 *
 * @param {LeafletMap} map - The Leaflet map instance to which the markers will be added.
 * @param {GeoJSON} geojsonLayer - The GeoJSON layer containing the marker data.
 * @param {LeafletMarkerClusterGroup | null} markers - An optional Leaflet marker cluster group. If null, markers will not be clustered.
 * @param {number} defaultPadding - The default padding to be used when zooming to bounds.
 * @param {number} topPadding - The top padding to be used when zooming to bounds.
 * @param {boolean | 'checking'} userIsPro - If the user has access to pro features.
 * @param {boolean} [cluster] - Optional parameter to specify whether markers should be clustered. Defaults to false.
 *
 */
export const addMarkersOnMap = (map: LeafletMap, geojsonLayer: GeoJSON, markers: LeafletMarkerClusterGroup | null, defaultPadding: number, topPadding: number, userIsPro: boolean | 'checking', cluster?: boolean) => {
    // Clean the map
    map.removeLayer(geojsonLayer);
    if (markers) map.removeLayer(markers);

    if (geojsonLayer.getLayers().length > 0) {
        // Custom icons for clusters, with 'is-good' if there's some surf
        markers = markerClusterGroup2({
            iconCreateFunction: function (cluster) {
                let highestMarkerQuality = -1;
                for (let i = 0; i < cluster.getAllChildMarkers().length; i++) {
                    const currentMarker = cluster.getAllChildMarkers()[i];
                    const spotSurfQuality = extractSurfQualityFromGeojsonFeature(currentMarker.feature!.properties.gd, userIsPro);
                    if (spotSurfQuality > highestMarkerQuality) highestMarkerQuality = spotSurfQuality;

                }
                return LeafletDivIcon({
                    html:
                        '<div class="ms-map-cluster quality-' + highestMarkerQuality.toString() + '"><span class="ms-map-cluster__text">' +
                        cluster.getChildCount() +
                        '</span></div>'
                });
            },
            showCoverageOnHover: false,
            zoomToBoundsOnClick: false,
            maxClusterRadius: 40
        });

        // Click on clusters.
        markers.on('clusterclick', function (a) {
            a.propagatedFrom.zoomToBounds({
                padding: [defaultPadding, defaultPadding],
                paddingTopLeft: [defaultPadding, topPadding]
            });
        });

        // To cluster or not to cluster
        if (cluster === true) {
            markers.addLayer(geojsonLayer);
            map.addLayer(markers);
        } else {
            map.addLayer(geojsonLayer);
        }
    }
    positionMap(map, 10, defaultPadding, topPadding, geojsonLayer);
}

/**
 * Centers the given Leaflet map on the user's current position and places a marker at that location.
 * 
 * @param {LeafletMap} map - The Leaflet map instance to be centered on the user's position.
 * @param {(outcome: 'RETRIEVED' | 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT') => void} [callbackFunction] - 
 * Optional callback function to handle the outcome of the geolocation request.
 * 
 */
export const centerMapOnUserPosition = (map: LeafletMap, callbackFunction?: (outcome: 'RETRIEVED' | 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT') => void): void => {
    getUserLocation()
        .then((response) => {
            if (map) {
                // Centering map on user position.
                map.setView(new LatLng(response.coords.latitude, response.coords.longitude), 16);

                // Adding an icon where the user is.
                const userIcon = LeafletIcon2({
                    iconUrl: IMAGES_URL + 'map-pins/current-location.png',
                    iconSize: [35, 55], // size of the icon
                    iconAnchor: [17, 55] // point of the icon which will correspond to marker's location
                });
                LeafletMarker2([response.coords.latitude, response.coords.longitude], { icon: userIcon }).addTo(
                    map
                );

                if (callbackFunction) callbackFunction('RETRIEVED');
            }
        })
        .catch((error) => {
            if (callbackFunction) {
                if (error.code === 1) callbackFunction('PERMISSION_DENIED');
                if (error.code === 2) callbackFunction('POSITION_UNAVAILABLE');
                if (error.code === 3) callbackFunction('TIMEOUT');
            }
        });
}

/**
 * Extracts the surf quality from a GeoJSON feature based on the user's pro status, eg [1,0]
 *
 * @param {(number | null)[]} gd - An array containing surf quality values, which can be numbers or null.
 * @param {boolean | 'checking'} userIsPro - A flag indicating if the user is a pro (true) or not (false), or in a checking state.
 * @returns {string} The surf quality as a string, or "-1" if the value is null.
 */
const extractSurfQualityFromGeojsonFeature = (gd: (number | null)[], userIsPro: boolean | 'checking'): number => {
    const index = userIsPro === true ? 0 : 1; // Determine the index based on userIsPro
    return gd[index] !== null ? gd[index] as number : -1; // Return the value or "-1" if null
}