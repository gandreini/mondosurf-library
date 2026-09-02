import type { GeoJSONSource, Map as MapLibreMap, StyleSpecification } from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { GEOJSON_FILE_URL } from 'mondosurf-library/constants/constants';
import { IMAGES_URL } from 'proxies/localConstants';

/**
 * Layer keys reuse the existing `ms_map_style` localStorage values so the
 * preference carries over from the old Leaflet map:
 *   vector     -> street (OpenFreeMap vector)
 *   satellite1 -> satellite (Esri World Imagery)
 *   satellite2 -> hybrid    (Esri imagery + place/boundary labels)
 */
export type MapGlLayer = 'vector' | 'satellite1' | 'satellite2';

// Street: OpenFreeMap vector style — keyless, free, commercial-OK.
const OPENFREEMAP_STREET = 'https://tiles.openfreemap.org/styles/liberty';

const ESRI_ATTRIBUTION = 'Imagery © Esri, Maxar, Earthstar Geographics';
const ESRI_REFERENCE_TILES =
    'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';

/**
 * Esri World Imagery raster tiles. With an ArcGIS Location Platform key in
 * `NEXT_PUBLIC_ARCGIS_API_KEY` we use the licensed (tokened) endpoint; without
 * one we fall back to the untokened endpoint so satellite works out of the box.
 * The key can be added later with no code change.
 * NOTE: confirm the exact tokened URL when the key is added (see vault handoff).
 */
const esriImageryTiles = (): string => {
    const key = process.env.NEXT_PUBLIC_ARCGIS_API_KEY;
    return key
        ? `https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?token=${key}`
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
};

const satelliteStyle = (withLabels: boolean): StyleSpecification => {
    const sources: StyleSpecification['sources'] = {
        'esri-imagery': {
            type: 'raster',
            tiles: [esriImageryTiles()],
            tileSize: 256,
            attribution: ESRI_ATTRIBUTION
        }
    };
    const layers: StyleSpecification['layers'] = [
        { id: 'esri-imagery', type: 'raster', source: 'esri-imagery' }
    ];
    if (withLabels) {
        sources['esri-reference'] = {
            type: 'raster',
            tiles: [ESRI_REFERENCE_TILES],
            tileSize: 256
        };
        layers.push({ id: 'esri-reference', type: 'raster', source: 'esri-reference' });
    }
    // Raster styles ship no glyphs; point at OpenFreeMap's font endpoint so the
    // cluster-count labels render over satellite too (same font as the vector style).
    return { version: 8, glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf', sources, layers };
};

/** Returns a MapLibre style: a URL string for the vector basemap, or a raster style object. */
export const getMapGlStyle = (layer: MapGlLayer): string | StyleSpecification => {
    switch (layer) {
        case 'satellite1':
            return satelliteStyle(false);
        case 'satellite2':
            return satelliteStyle(true);
        case 'vector':
        default:
            return OPENFREEMAP_STREET;
    }
};

/** Reads the user's last-used layer from localStorage (street on first visit / SSR). */
export const readMapGlLayer = (): MapGlLayer => {
    if (typeof window === 'undefined') return 'vector';
    const value = window.localStorage.getItem('ms_map_style');
    return value === 'satellite1' || value === 'satellite2' ? value : 'vector';
};

/** Persists the chosen layer so the next map mount opens in it. */
export const writeMapGlLayer = (layer: MapGlLayer): void => {
    if (typeof window !== 'undefined') window.localStorage.setItem('ms_map_style', layer);
};

/** Cycle order for the layer toggle button: street → satellite → hybrid → street. */
export const nextMapGlLayer = (current: MapGlLayer): MapGlLayer =>
    current === 'vector' ? 'satellite1' : current === 'satellite1' ? 'satellite2' : 'vector';

/** Enables or disables all pan/zoom interaction handlers (used for the inline preview → fullscreen toggle). */
export const setMapInteractivity = (map: MapLibreMap, enabled: boolean): void => {
    const handlers = [
        map.dragPan,
        map.scrollZoom,
        map.boxZoom,
        map.dragRotate,
        map.keyboard,
        map.doubleClickZoom,
        map.touchZoomRotate
    ];
    for (const handler of handlers) {
        if (enabled) handler.enable();
        else handler.disable();
    }
};

// --- Clustered all-spots layer (fullscreen exploration + the world map page) ---

export const SPOTS_SOURCE_ID = 'ms-spots';
export const CLUSTERS_LAYER_ID = 'ms-spots-clusters';
export const CLUSTER_COUNT_LAYER_ID = 'ms-spots-cluster-count';
export const POINTS_LAYER_ID = 'ms-spots-points';
export const POINT_STARS_LAYER_ID = 'ms-spots-point-stars';

// --- Surf-quality visuals (parity with the Leaflet map) ---------------------
// gd (surf quality) drives pin stars and cluster colors exactly like the old
// Leaflet map: star fill per quality on pins, cluster bubble colored by the
// BEST quality among its children. Hex values mirror the CSS custom properties
// in styles/_color-properties.scss (--color-forecast-*): GL paint can't read
// CSS variables, so they are duplicated here on purpose — keep in sync.
export const QUALITY_COLORS: Record<number, string> = {
    0: '#86e090', // --color-forecast-poor
    1: '#45c46f', // --color-forecast-good
    2: '#1e8f4e', // --color-forecast-very-good
    3: '#124d31'  // --color-forecast-epic
};
const CLUSTER_TEXT_DARK = '#4b4e53'; // --color-text
const CLUSTER_RING_NEUTRAL = '#bbbec3'; // --color-gray-04
const CLUSTER_SIZE = 36; // px diameter — $map-cluster-size, same as the Leaflet clusters

/** The 16x16 star path used by the Leaflet quality markers (single source for
 *  the DOM markers' inline SVG and the GL star images below). */
export const QUALITY_STAR_PATH =
    'M7.70679 0.571557C7.81526 0.310742 8.18474 0.310742 8.29322 0.571557L10.2807 5.35008C10.3264 5.46003 10.4298 5.53515 10.5486 5.54467L15.7074 5.95825C15.9889 5.98082 16.1031 6.33221 15.8886 6.51598L11.9581 9.88285C11.8677 9.96032 11.8282 10.0819 11.8558 10.1977L13.0566 15.2318C13.1222 15.5066 12.8233 15.7238 12.5822 15.5765L8.16553 12.8788C8.06391 12.8168 7.93609 12.8168 7.83447 12.8788L3.41781 15.5765C3.17674 15.7238 2.87783 15.5066 2.94337 15.2318L4.1442 10.1977C4.17183 10.0819 4.13233 9.96032 4.04189 9.88285L0.111421 6.51598C-0.103107 6.33221 0.0110668 5.98082 0.292639 5.95825L5.45145 5.54467C5.57015 5.53515 5.67355 5.46003 5.71929 5.35008L7.70679 0.571557Z';

const starImageId = (quality: number): string => `ms-quality-star-${quality}`;

/** Draws the 4 colored quality stars into the map's image registry (canvas,
 *  white stroke + drop shadow like the CSS version). Idempotent; call after
 *  each setStyle too (setStyle wipes custom images). */
export const ensureQualityStarImages = (map: MapLibreMap): void => {
    for (const q of [0, 1, 2, 3]) {
        const id = starImageId(q);
        if (map.hasImage(id)) continue;
        // 24px logical star (the CSS scales the 16px SVG by 1.5), drawn @2x.
        const logical = 24;
        const canvas = document.createElement('canvas');
        canvas.width = logical * 2;
        canvas.height = logical * 2;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.scale((logical * 2) / 16, (logical * 2) / 16); // path is on a 16x16 grid
        const path = new Path2D(QUALITY_STAR_PATH);
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 2;
        ctx.fillStyle = QUALITY_COLORS[q];
        ctx.fill(path);
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 16 / logical; // ≈1px at rendered size, like the CSS stroke
        ctx.stroke(path);
        map.addImage(id, ctx.getImageData(0, 0, logical * 2, logical * 2), { pixelRatio: 2 });
    }
};

// SINGLE SOURCE OF TRUTH: wave direction → pin art basename. Both renderers
// derive from this — the inline DOM markers (SVG, see pinSvgUrl) and the
// fullscreen GL symbol layer (PNG) — so the direction→icon rule lives in one
// place instead of being repeated per render mechanism.
const PIN_STEM_BY_DIRECTION: Record<string, string> = {
    A: 'map-pin-a-frame',
    L: 'map-pin-left',
    R: 'map-pin-right'
};
const DEFAULT_PIN_STEM = 'map-pin';
const pinStem = (direction?: string): string => (direction && PIN_STEM_BY_DIRECTION[direction]) || DEFAULT_PIN_STEM;

/** Inline DOM markers: the SVG pin URL for a wave direction. */
export const pinSvgUrl = (direction?: string): string => `${IMAGES_URL}map-pins/${pinStem(direction)}.svg`;

// Fullscreen GL symbol layer: PNG images registered under an id derived from the
// same stem, loaded lazily via `styleimagemissing` so they survive setStyle.
const pinImageId = (direction?: string): string => `ms-${pinStem(direction)}`;
const PIN_IMAGE_FILES: Record<string, string> = Object.fromEntries(
    [undefined, ...Object.keys(PIN_STEM_BY_DIRECTION)].map((d) => [pinImageId(d), `${pinStem(d)}.png`])
);
// MapLibre `match` on di → the per-direction image id, default pin last.
const PIN_ICON_IMAGE_EXPRESSION = [
    'match',
    ['get', 'di'],
    ...Object.keys(PIN_STEM_BY_DIRECTION).flatMap((d) => [d, pinImageId(d)]),
    pinImageId()
];

/** Loads a single pin PNG into the map's image registry on demand. pixelRatio 2: the 70×110 art renders crisp at ~35×55 css px. (maplibre-gl v3 uses the callback form of loadImage.) */
const loadPinImageOnDemand = (map: MapLibreMap, id: string): void => {
    const file = PIN_IMAGE_FILES[id];
    if (!file || map.hasImage(id)) return;
    map.loadImage(IMAGES_URL + 'map-pins/' + file, (error, image) => {
        // Missing art is non-fatal: the symbol just renders without an icon.
        if (error || !image || map.hasImage(id)) return;
        map.addImage(id, image, { pixelRatio: 2 });
    });
};

/** Wire lazy pin-image loading once at init; re-fires automatically after each setStyle. */
export const wirePinImages = (map: MapLibreMap): void => {
    map.on('styleimagemissing', (e) => loadPinImageOnDemand(map, e.id));
};

/** Fetches the world spots file (already lean, ~185 KB gz, CDN-cached). */
export const fetchAllSpots = async (): Promise<FeatureCollection> => {
    const res = await fetch(GEOJSON_FILE_URL);
    if (!res.ok) throw new Error(`spots fetch failed: ${res.status}`);
    return (await res.json()) as FeatureCollection;
};

/**
 * Normalises the stored feature coordinates ([lat, lng], often strings) into the
 * [lng, lat] numbers MapLibre needs. Do this ONCE (cache the result) — re-running
 * it on every layer switch would re-allocate all ~5,500 features on the main thread.
 */
export const normaliseSpots = (data: FeatureCollection): FeatureCollection => ({
    type: 'FeatureCollection',
    // flatMap so features with missing/non-numeric coords are dropped rather than
    // emitted as [NaN, NaN] (which would poison the cluster index).
    features: data.features.flatMap((f) => {
        if (!f.geometry || f.geometry.type !== 'Point') return [f];
        const [lat, lng] = f.geometry.coordinates as (number | string)[];
        const lngN = Number(lng);
        const latN = Number(lat);
        if (!Number.isFinite(lngN) || !Number.isFinite(latN)) return [];
        return [{ ...f, geometry: { type: 'Point' as const, coordinates: [lngN, latN] } }];
    })
});

/**
 * Adds the clustered spots source + layers to a loaded map. `data` must already
 * be normalised (see normaliseSpots). Call again after a `setStyle` (which wipes
 * custom sources/layers) to re-add — it's idempotent via setData.
 */
export const addSpotsClusterLayers = (map: MapLibreMap, data: FeatureCollection): void => {
    if (map.getSource(SPOTS_SOURCE_ID)) {
        (map.getSource(SPOTS_SOURCE_ID) as GeoJSONSource).setData(data);
        return;
    }

    map.addSource(SPOTS_SOURCE_ID, {
        type: 'geojson',
        data,
        cluster: true,
        clusterRadius: 50,
        clusterMaxZoom: 14,
        // Best surf quality among the cluster's children (gd is a string in the
        // world file, hence to-number; -1 = no forecast). Drives the bubble
        // color exactly like the Leaflet iconCreateFunction did.
        clusterProperties: {
            maxGd: ['max', ['to-number', ['get', 'gd'], -1]]
        }
        // NB: do NOT set a low source `maxzoom` here — capping it below the view
        // zoom stops the source generating tiles and nothing renders.
    });

    // Parity with .ms-map-cluster in _map.scss: fixed 36px bubble; white with a
    // gray ring (no forecast) or a poor-green ring (quality 0); solid green
    // fills with a white ring for quality 1-3.
    const maxGd = ['get', 'maxGd'] as never;
    map.addLayer({
        id: CLUSTERS_LAYER_ID,
        type: 'circle',
        source: SPOTS_SOURCE_ID,
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': [
                'step', maxGd,
                '#ffffff', // < 0: no forecast
                0, '#ffffff',
                1, QUALITY_COLORS[1],
                2, QUALITY_COLORS[2],
                3, QUALITY_COLORS[3]
            ] as never,
            'circle-stroke-width': 2.5,
            'circle-stroke-color': [
                'step', maxGd,
                CLUSTER_RING_NEUTRAL,
                0, QUALITY_COLORS[0],
                1, '#ffffff'
            ] as never,
            'circle-radius': CLUSTER_SIZE / 2
        }
    });

    map.addLayer({
        id: CLUSTER_COUNT_LAYER_ID,
        type: 'symbol',
        source: SPOTS_SOURCE_ID,
        filter: ['has', 'point_count'],
        layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            // Use a font the glyph endpoints actually serve (OpenFreeMap vector +
            // the Esri raster styles' glyphs below). The MapLibre default font
            // ('Open Sans Regular, Arial Unicode MS Regular') 404s on these.
            'text-font': ['Noto Sans Regular'],
            'text-size': 13
        },
        // Dark text on the light bubbles (no forecast / quality 0), white on the
        // solid green ones — same as the CSS.
        paint: {
            'text-color': ['step', maxGd, CLUSTER_TEXT_DARK, 1, '#ffffff'] as never
        }
    });

    // Individual (non-clustered) spots: teardrop pins matching the inline preview.
    map.addLayer({
        id: POINTS_LAYER_ID,
        type: 'symbol',
        source: SPOTS_SOURCE_ID,
        filter: ['!', ['has', 'point_count']],
        layout: {
            'icon-image': PIN_ICON_IMAGE_EXPRESSION as never,
            // 0.8 of the 55px logical image = 44px tall — same as the DOM markers
            // (markerElement) and the app's Leaflet pins, so the pin size doesn't
            // jump between the inline preview and fullscreen.
            'icon-size': 0.8,
            'icon-anchor': 'bottom',
            'icon-allow-overlap': true
        }
    });

    // Quality star on top of each unclustered pin (parity with the Leaflet
    // divIcon markers: 24px star at the pin's top-right, fill by quality).
    ensureQualityStarImages(map);
    map.addLayer({
        id: POINT_STARS_LAYER_ID,
        type: 'symbol',
        source: SPOTS_SOURCE_ID,
        filter: ['all', ['!', ['has', 'point_count']], ['>=', ['to-number', ['get', 'gd'], -1], 0]],
        layout: {
            'icon-image': [
                'concat', 'ms-quality-star-', ['to-string', ['to-number', ['get', 'gd'], -1]]
            ] as never,
            // Pin is 44px tall / 28 wide, anchored at its tip: the star sits at
            // the pin's top-right like the CSS (top -2, right 2).
            'icon-anchor': 'center',
            'icon-offset': [4, -38] as never,
            'icon-allow-overlap': true,
            'icon-ignore-placement': true
        }
    });
};

/** Removes the clustered source + layers (inverse of addSpotsClusterLayers). */
export const removeSpotsClusterLayers = (map: MapLibreMap): void => {
    for (const id of [CLUSTERS_LAYER_ID, CLUSTER_COUNT_LAYER_ID, POINTS_LAYER_ID, POINT_STARS_LAYER_ID]) {
        if (map.getLayer(id)) map.removeLayer(id);
    }
    if (map.getSource(SPOTS_SOURCE_ID)) map.removeSource(SPOTS_SOURCE_ID);
};

/** A clicked individual spot: properties + position, for the preview popover. */
export interface SpotPointClick {
    id: number;
    slug: string;
    name: string;
    direction?: string;
    lngLat: [number, number];
}

/**
 * Wires cluster-click (zoom in) and point-click (open preview popover) + pointer
 * cursors. `onPointClick` receives the spot details + position so the caller can
 * show a popover (issue: "bring back the popover preview") instead of navigating
 * straight to the guide.
 */
export const wireSpotsClusterEvents = (map: MapLibreMap, onPointClick: (spot: SpotPointClick) => void): void => {
    map.on('click', CLUSTERS_LAYER_ID, (e) => {
        const feature = e.features?.[0];
        const clusterId = feature?.properties?.cluster_id;
        if (clusterId === undefined) return;
        (map.getSource(SPOTS_SOURCE_ID) as GeoJSONSource).getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err || zoom == null) return;
            const geom = feature!.geometry;
            if (geom.type === 'Point') {
                map.easeTo({ center: geom.coordinates as [number, number], zoom });
            }
        });
    });

    map.on('click', POINTS_LAYER_ID, (e) => {
        const feature = e.features?.[0];
        const props = feature?.properties;
        if (!props || props.sg === undefined || props.id === undefined) return;
        const coords =
            feature!.geometry.type === 'Point'
                ? (feature!.geometry.coordinates as [number, number])
                : [e.lngLat.lng, e.lngLat.lat];
        onPointClick({
            id: Number(props.id),
            slug: String(props.sg),
            name: String(props.nm ?? ''),
            direction: props.di ? String(props.di) : undefined,
            lngLat: coords as [number, number]
        });
    });

    for (const layer of [CLUSTERS_LAYER_ID, POINTS_LAYER_ID]) {
        map.on('mouseenter', layer, () => (map.getCanvas().style.cursor = 'pointer'));
        map.on('mouseleave', layer, () => (map.getCanvas().style.cursor = ''));
    }
};
