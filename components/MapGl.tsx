'use client';

// MapLibre GL map. CLIENT-ONLY (WebGL) — per library convention.
// One component for every map surface:
//   - guide inline preview  : pins + interactive=false
//   - guide fullscreen      : interactive + loadAllSpots + showControls
//   - /surf-spots-map        : loadAllSpots + interactive + showControls
//   - forecast-edit          : draggableMarker + onMarkerDragEnd
import 'maplibre-gl/dist/maplibre-gl.css';

import maplibregl, { AttributionControl, Map as MapLibreMap, Marker, Popup } from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { useEffect, useRef, useState } from 'react';
import { IMAGES_URL } from 'proxies/localConstants';
import { getUserLocation } from 'proxies/getUserLocation';
import { isApp } from 'helpers/device.helpers';
import { useRouterProxy } from 'proxies/useRouter';
import { mondoTranslate } from 'proxies/mondoTranslate';
import Icon from 'mondosurf-library/components/Icon';
import Loader from 'mondosurf-library/components/Loader';
import { returnDirectionLabel } from 'mondosurf-library/helpers/labels.helpers';
import toastService from 'mondosurf-library/services/toastService';
import {
    addSpotsClusterLayers,
    fetchAllSpots,
    getMapGlStyle,
    nextMapGlLayer,
    normaliseSpots,
    pinSvgUrl,
    QUALITY_STAR_PATH,
    readMapGlLayer,
    removeSpotsClusterLayers,
    setMapInteractivity,
    type SpotPointClick,
    SPOTS_SOURCE_ID,
    wirePinImages,
    wireSpotsClusterEvents,
    writeMapGlLayer,
    type MapGlLayer
} from 'mondosurf-library/helpers/mapGl.helpers';

export interface IMapGlPin {
    id: number;
    slug: string;
    name: string;
    lat: number;
    lng: number;
    direction?: string;
    quality?: number;
}

interface IMapGl {
    lat?: number;
    lng?: number;
    zoom?: number;
    /** Local pins (e.g. guide spot + nearby). Shown only when not in loadAllSpots mode. */
    pins?: IMapGlPin[];
    /** Pan/zoom enabled. Toggled at runtime for the inline → fullscreen grow. */
    interactive?: boolean;
    /** Fetch the world spots file and render it clustered (fullscreen / map page). */
    loadAllSpots?: boolean;
    /** Show the classic top-left controls (zoom in/out + layer switch), same markup/style as the Leaflet map. */
    showControls?: boolean;
    /** Show the classic bottom-left geolocation (crosshair) button (map page only). */
    showGeolocationButton?: boolean;
    /** Viewport padding (px): the point the map centres on sits at the middle of
     *  the UNPADDED area — used by the guide map to centre the spot inside the
     *  in-flow window of its fixed, viewport-sized layer. Applied once at init. */
    padding?: { top: number; bottom: number };
    /** Single draggable marker at lat/lng (forecast-edit). */
    draggableMarker?: boolean;
    /** Marker icon filename under map-pins/ (e.g. parking). */
    customIcon?: string;
    onMarkerDragEnd?: (lat: number, lng: number) => void;
}

// Shared marker DOM builder (used by spot pins and the draggable edit marker).
const markerElement = (src: string, opts: { alt?: string; quality?: number } = {}): HTMLElement => {
    const el = document.createElement('div');
    // quality class (and the star below) only for GOOD quality (1-3), matching
    // the Leaflet map's observed behavior: its parseFloat(gd) || -1 collapsed
    // quality 0 (poor) into -1, so poor spots never showed a star either.
    const hasQuality = opts.quality !== undefined && opts.quality >= 1;
    el.className = 'ms-map-marker-icon' + (hasQuality ? ' quality-' + opts.quality : '');
    const img = document.createElement('img');
    img.className = 'ms-map-marker-icon__image';
    img.src = src;
    img.alt = opts.alt ?? '';
    // All pin art shares the 35:55 (70:110) canvas. Explicit attributes pin the
    // DOM markers to the same 44px height as the GL symbol pins (icon-size 0.8)
    // and the app's Leaflet map — without them the SVG renders at its intrinsic
    // 35x55 and the size jumps between inline preview and fullscreen.
    img.width = 28;
    img.height = 44;
    el.appendChild(img);
    // Quality star: same markup as the Leaflet createMarker so the shared CSS
    // (fill by .quality-N, white stroke, drop shadow) applies unchanged.
    if (hasQuality) {
        const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        star.setAttribute('width', '16');
        star.setAttribute('height', '16');
        star.setAttribute('viewBox', '0 0 16 16');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', QUALITY_STAR_PATH);
        star.appendChild(path);
        el.appendChild(star);
    }
    return el;
};

// Keyboard-accessible, clickable spot pin.
const createPinElement = (pin: IMapGlPin): HTMLElement => {
    const el = markerElement(pinSvgUrl(pin.direction), { alt: pin.name, quality: pin.quality });
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', pin.name);
    el.style.cursor = 'pointer';
    return el;
};

const MapGl: React.FC<IMapGl> = ({
    lat,
    lng,
    zoom = 12,
    pins = [],
    interactive = false,
    loadAllSpots = false,
    showControls = false,
    showGeolocationButton = false,
    padding,
    draggableMarker = false,
    customIcon,
    onMarkerDragEnd
}: IMapGl) => {
    const router = useRouterProxy();

    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MapLibreMap | null>(null);
    const markersRef = useRef<Marker[]>([]);
    const popupRef = useRef<Popup | null>(null);
    const allSpotsRef = useRef<FeatureCollection | null>(null);
    const layerRef = useRef<MapGlLayer>('vector');
    // Mirrors layerRef for rendering (the switch button's is-active state).
    const [activeLayer, setActiveLayer] = useState<MapGlLayer>('vector');
    // Shows a loader inside the geolocation button while the position is being fetched.
    const [geolocationStatus, setGeolocationStatus] = useState<'IDLE' | 'REQUESTING'>('IDLE');
    const loadedAllRef = useRef(false);
    // Tracks the LATEST desired world state so an async loadWorld that resolves
    // after a collapse doesn't add world clusters onto the inline preview.
    const wantWorldRef = useRef(false);

    const closePopup = () => {
        popupRef.current?.remove();
        popupRef.current = null;
    };

    // Clicking a clustered spot opens a small preview popover (name + direction)
    // that links to the guide — instead of navigating away immediately.
    const showSpotPopup = (spot: SpotPointClick) => {
        const map = mapRef.current;
        if (!map) return;
        const path = `/surf-spot/${spot.slug}/guide/${spot.id}`;
        const link = document.createElement('a');
        link.className = 'ms-map-popup__link';
        link.href = path;
        // Same structure/content as the old Leaflet popover (mapPopUpHelper):
        // bold title + labelled "Direction: …" row. ("Bottom" is omitted: the
        // lean world geojson doesn't carry it.)
        const dir = spot.direction && spot.direction !== '0' ? returnDirectionLabel(spot.direction) : '';
        link.innerHTML =
            `<span class="ms-map-popup__title">${spot.name}</span>` +
            (dir
                ? `<span class="ms-map-popup__details"><span class="ms-label-value">` +
                  `<span class="ms-label">${mondoTranslate('basics.direction')}</span> ` +
                  `<span class="ms-value">${dir}</span></span></span>`
                : '');
        // In the app, route via the SPA router rather than a full navigation.
        link.addEventListener('click', (ev) => {
            if (isApp()) {
                ev.preventDefault();
                router.push(path);
            }
        });
        closePopup();
        popupRef.current = new Popup({ offset: 28, closeButton: true, className: 'ms-map-popup' })
            .setLngLat(spot.lngLat)
            .setDOMContent(link)
            .addTo(map);
    };

    // Same behaviour as the clustered world points (and the old Leaflet map):
    // clicking a pin opens the preview popover, never navigates directly.
    const pinClick = (pin: IMapGlPin) =>
        showSpotPopup({ id: pin.id, slug: pin.slug, name: pin.name, direction: pin.direction, lngLat: [pin.lng, pin.lat] });

    // --- init once ---
    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const layer = readMapGlLayer();
        layerRef.current = layer;
        setActiveLayer(layer);

        // No WebGL (old device, blocklisted GPU, some headless/bot renderers):
        // the constructor THROWS, and an uncaught throw in this effect would
        // unmount the whole React tree — a blank page over a map. Catch it and
        // leave the static placeholder instead.
        let map: MapLibreMap;
        try {
            map = new maplibregl.Map({
                container: containerRef.current,
                style: getMapGlStyle(layer),
                center: lat != null && lng != null ? [lng, lat] : [0, 20],
                zoom: lat != null && lng != null ? zoom : 1.5,
                attributionControl: false,
                fadeDuration: 0
            });
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('MapGl: map init failed (WebGL unavailable?)', e);
            return;
        }
        mapRef.current = map;

        // Constant viewport padding (e.g. the guide window): set once, before the
        // first frame — the centre point then renders in the padded focus area.
        if (padding && lat != null && lng != null) {
            map.jumpTo({ center: [lng, lat], zoom, padding: { top: padding.top, bottom: padding.bottom, left: 0, right: 0 } });
        }

        // Attribution: small, top-right — same spot as the old Leaflet map
        // (compact: false keeps it always visible instead of the ⓘ toggle).
        map.addControl(new AttributionControl({ compact: false }), 'top-right');

        if (!interactive) setMapInteractivity(map, false);
        // Controls are plain React buttons rendered next to the canvas (see the JSX below).

        // Lazy-load the teardrop pin images for the clustered points layer (survives setStyle).
        wirePinImages(map);

        // Wire cluster/point click + hover ONCE. Handlers are bound by layer id, so
        // they survive setStyle and tolerate the layers not existing yet — no re-wiring.
        wireSpotsClusterEvents(map, showSpotPopup);

        // DOM markers are HTML overlays: they do NOT depend on the style/tiles
        // being loaded, so add them immediately. Gating them on map 'load' made
        // pins wait (sometimes minutes) on slow tile servers.
        if (draggableMarker && lat != null && lng != null) {
            const el = customIcon ? markerElement(IMAGES_URL + 'map-pins/' + customIcon) : undefined;
            const marker = new Marker({ element: el, draggable: true, anchor: 'bottom' })
                .setLngLat([lng, lat])
                .addTo(map);
            marker.on('dragend', () => {
                const p = marker.getLngLat();
                if (onMarkerDragEnd) onMarkerDragEnd(p.lat, p.lng);
            });
            markersRef.current.push(marker);
        } else if (!loadAllSpots) {
            // World loading is owned solely by the loadAllSpots effect (single owner).
            markersRef.current = addDomPins(map, pins, pinClick);
        }

        // Re-add the clustered source/layers after a layer switch (setStyle wipes
        // sources/layers; the layer-id click/hover handlers above survive).
        map.on('styledata', () => {
            if (loadedAllRef.current && allSpotsRef.current && map.isStyleLoaded() && !map.getSource(SPOTS_SOURCE_ID)) {
                addSpotsClusterLayers(map, worldClusterData(allSpotsRef.current));
            }
        });

        // Resize when the container changes size (inline → fullscreen grow, orientation,
        // viewport) — replaces a fragile fixed timeout. Guard against the rAF firing
        // after unmount (map.resize() on a removed map throws).
        let resizeRaf: number | undefined;
        const ro = new ResizeObserver(() => {
            if (resizeRaf) cancelAnimationFrame(resizeRaf);
            resizeRaf = requestAnimationFrame(() => {
                if (mapRef.current === map) map.resize();
            });
        });
        ro.observe(containerRef.current);

        return () => {
            ro.disconnect();
            if (resizeRaf) cancelAnimationFrame(resizeRaf);
            closePopup();
            markersRef.current.forEach((m) => m.remove());
            markersRef.current = [];
            map.remove();
            mapRef.current = null;
            loadedAllRef.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // init once

    // --- react to interactive toggle (inline → fullscreen grow) ---
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;
        setMapInteractivity(map, interactive);
        // Resize on the grow is handled by the ResizeObserver (container size change).
        // Fullscreen: drop the window padding so the spot recentres in the FULL
        // viewport (the inline padding centred it in the small window). The
        // collapse path restores the padding in unloadWorld's easeTo.
        if (interactive && padding) {
            map.easeTo({ padding: { top: 0, bottom: 0, left: 0, right: 0 }, duration: 320 });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interactive]);

    // --- control handlers (the classic ms-map buttons, same behavior as the Leaflet map) ---
    const zoomBy = (delta: number) => {
        const map = mapRef.current;
        // easeTo (not setZoom) so the +/- buttons animate like pinch/scroll zoom.
        if (map) map.easeTo({ zoom: map.getZoom() + delta, duration: 300 });
    };

    // Cycles street → satellite → hybrid and persists the choice.
    const toggleLayer = () => {
        const map = mapRef.current;
        if (!map) return;
        closePopup(); // setStyle won't remove an open spot popover
        const next = nextMapGlLayer(layerRef.current);
        layerRef.current = next;
        setActiveLayer(next);
        writeMapGlLayer(next);
        map.setStyle(getMapGlStyle(next));
    };

    // Centers on the user (map page's crosshair button): drop a current-location
    // marker and ease there — mirrors the old Leaflet centerMapOnUserPosition.
    const centerOnUser = () => {
        const map = mapRef.current;
        if (!map || geolocationStatus === 'REQUESTING') return;
        setGeolocationStatus('REQUESTING');
        getUserLocation()
            .then((response: GeolocationPosition) => {
                if (mapRef.current !== map) return;
                const { latitude, longitude } = response.coords;
                markersRef.current.push(
                    new Marker({
                        element: markerElement(IMAGES_URL + 'map-pins/current-location.png'),
                        anchor: 'bottom'
                    })
                        .setLngLat([longitude, latitude])
                        .addTo(map)
                );
                map.easeTo({ center: [longitude, latitude], zoom: 16 });
            })
            .catch(() => undefined) // denied/unavailable: silently keep the current view (as the old map did)
            .finally(() => setGeolocationStatus('IDLE'));
    };

    // --- react to loadAllSpots toggling (fullscreen open/close) ---
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;
        wantWorldRef.current = loadAllSpots;
        if (loadAllSpots && !loadedAllRef.current) {
            if (map.isStyleLoaded()) void loadWorld(map);
            else map.once('load', () => void loadWorld(map));
        } else if (!loadAllSpots && loadedAllRef.current) {
            unloadWorld(map);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadAllSpots]);

    // World data minus the spots already shown as DOM pins: they must never be
    // swallowed into a cluster, so they simply don't enter the clustered source.
    const worldClusterData = (data: FeatureCollection): FeatureCollection => {
        const pinIds = new Set(pins.map((p) => Number(p.id)));
        if (!pinIds.size) return data;
        return { ...data, features: data.features.filter((f) => !pinIds.has(Number(f.properties?.id))) };
    };

    // Load the world spots: fetch (once, cached) + cluster. The local DOM pins
    // (spot + near spots) STAY on top and their spots are excluded from the
    // clustered source — so zooming never swallows them into a cluster.
    // Cluster click/hover handlers were wired once at init (survive setStyle).
    const loadWorld = async (map: MapLibreMap) => {
        if (loadedAllRef.current) return;
        loadedAllRef.current = true;
        try {
            const data = allSpotsRef.current ?? normaliseSpots(await fetchAllSpots());
            // Bail if the map was replaced/removed OR the user collapsed back to the
            // inline preview during the fetch — otherwise we'd dump world clusters
            // onto the small map.
            if (mapRef.current !== map || !wantWorldRef.current) {
                loadedAllRef.current = false;
                return;
            }
            allSpotsRef.current = data; // cached already-normalised — no re-map on layer switch / re-open
            addSpotsClusterLayers(map, worldClusterData(data));
        } catch (e) {
            // Non-blocking: the map stays usable; local pins (if any) were already shown.
            loadedAllRef.current = false;
            // eslint-disable-next-line no-console
            console.error('MapGl: failed to load world spots', e);
            toastService.error(mondoTranslate('surf_spot.map_spots_load_error'));
        }
    };

    // Collapse back to the inline preview: remove cluster layers/source and
    // recenter on the spot. The DOM pins never left. World data stays cached.
    const unloadWorld = (map: MapLibreMap) => {
        closePopup();
        removeSpotsClusterLayers(map);
        loadedAllRef.current = false;
        if (lat != null && lng != null) {
            map.easeTo({
                center: [lng, lat],
                zoom,
                // Restore the inline-window padding dropped on expand.
                ...(padding ? { padding: { top: padding.top, bottom: padding.bottom, left: 0, right: 0 } } : {}),
                duration: 300
            });
        }
    };

    return (
        <>
            <div ref={containerRef} className="ms-map-gl" data-test="surf-spot-map" />

            {/* The classic controls (same markup/classes as the Leaflet map): top-left,
                zoom in / zoom out / layer switch. No center button — the guide map is
                already centred on the spot. */}
            {showControls && (
                <div className="ms-map__controls" data-test="surf-spot-map-controls">
                    <div className="ms-map__zoom">
                        <div id="map_zoom_in" className="ms-map__zoom-in" onClick={() => zoomBy(1)}>
                            <Icon icon="plus" />
                        </div>
                        <div id="map_zoom_out" className="ms-map__zoom-out" onClick={() => zoomBy(-1)}>
                            <Icon icon="minus" />
                        </div>
                    </div>
                    <div
                        id="map_global_switch-button"
                        title={mondoTranslate('surf_spot.switch_map_layer')}
                        className={
                            activeLayer === 'satellite1' || activeLayer === 'satellite2'
                                ? 'ms-map__switch is-active'
                                : 'ms-map__switch'
                        }
                        onClick={toggleLayer}>
                        <Icon icon="image" />
                    </div>
                </div>
            )}

            {showGeolocationButton && (
                <div className="ms-map__center is-displayed" onClick={centerOnUser} data-test="surf-spot-map-center">
                    {geolocationStatus === 'REQUESTING' ? <Loader size="small" /> : <Icon icon="crosshair" />}
                </div>
            )}
        </>
    );
};

// --- helpers kept local to the component (DOM/control glue) ---

function addDomPins(map: MapLibreMap, pins: IMapGlPin[], onClick: (pin: IMapGlPin) => void): Marker[] {
    const created: Marker[] = [];
    for (const pin of pins) {
        if (!Number.isFinite(pin.lat) || !Number.isFinite(pin.lng)) continue;
        const el = createPinElement(pin);
        el.addEventListener('click', (e) => {
            // Don't let the click reach the map: the popover has closeOnClick,
            // so the same bubbled click would close it in the same instant.
            e.stopPropagation();
            onClick(pin);
        });
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(pin);
            }
        });
        created.push(new Marker({ element: el, anchor: 'bottom' }).setLngLat([pin.lng, pin.lat]).addTo(map));
    }
    return created;
}

export default MapGl;
