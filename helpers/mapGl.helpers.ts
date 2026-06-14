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
        clusterMaxZoom: 14
        // NB: do NOT set a low source `maxzoom` here — capping it below the view
        // zoom stops the source generating tiles and nothing renders.
    });

    map.addLayer({
        id: CLUSTERS_LAYER_ID,
        type: 'circle',
        source: SPOTS_SOURCE_ID,
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': '#1a8fe3',
            'circle-opacity': 0.85,
            'circle-radius': ['step', ['get', 'point_count'], 16, 25, 22, 100, 30]
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
        paint: { 'text-color': '#ffffff' }
    });

    // Individual (non-clustered) spots: teardrop pins matching the inline preview.
    map.addLayer({
        id: POINTS_LAYER_ID,
        type: 'symbol',
        source: SPOTS_SOURCE_ID,
        filter: ['!', ['has', 'point_count']],
        layout: {
            'icon-image': PIN_ICON_IMAGE_EXPRESSION as never,
            'icon-size': 0.7,
            'icon-anchor': 'bottom',
            'icon-allow-overlap': true
        }
    });
};

/** Removes the clustered source + layers (inverse of addSpotsClusterLayers). */
export const removeSpotsClusterLayers = (map: MapLibreMap): void => {
    for (const id of [CLUSTERS_LAYER_ID, CLUSTER_COUNT_LAYER_ID, POINTS_LAYER_ID]) {
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
