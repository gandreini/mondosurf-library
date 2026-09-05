import { returnBottomLabel, returnDirectionLabel } from 'mondosurf-library/helpers/labels.helpers';
import { mondoTranslate } from 'proxies/mondoTranslate';

/**
 * Inner HTML of the spot popover (title + labelled Direction/Bottom rows).
 * SINGLE source of truth for the popover content, shared by the Leaflet maps
 * (createPopUpWeb/App below) and the MapLibre map (MapGl's showSpotPopup):
 * markup and classes must never fork between the two map engines. Styles:
 * _map-tooltip.scss.
 */
export function spotPopupInnerHtml(p: { name: string; direction?: string | null; bottom?: string | null }): string {
    let html = `<div class="ms-map-tooltip__title">${p.name}</div>`;
    html += '<div class="ms-map-tooltip__details">';
    if (p.direction && p.direction !== '0') {
        html +=
            '<span class="ms-label-value"><span class="ms-label">' +
            mondoTranslate('basics.direction') +
            '</span> <span class="ms-value">' +
            returnDirectionLabel(p.direction) +
            '</span></span>';
    }
    if (p.bottom && p.bottom !== '0') {
        html +=
            '<span class="ms-label-value"><span class="ms-label">' +
            mondoTranslate('basics.bottom') +
            '</span> <span class="ms-value">' +
            returnBottomLabel(p.bottom) +
            '</span></span>';
    }
    html += '</div>';
    return html;
}

/**
 * Creates the popover that is displayed when clicking on a marker.
 *
 * @param {any} feature Single feature from GeoJSON corresponding to each pin on the map.
 * @param {any} layer   The layer to which the popup is bound.
 * @param {any} router   The layer to which the popup is bound.
 */
export function createPopUpWeb(feature: any, layer: any, router: any): void {
    const mondoLeafletPopup =
        `<a id="ms_map_popover_${feature.properties.id}" class="ms-map-tooltip__content" href="/surf-spot/${feature.properties.sg}/guide/${feature.properties.id}">` +
        spotPopupInnerHtml({ name: feature.properties.nm, direction: feature.properties.di, bottom: feature.properties.bo }) +
        '</a>';

    var customOptions = { minWidth: '180', maxWidth: '500', className: 'ms-map-tooltip' };
    layer.bindPopup(mondoLeafletPopup, customOptions);
}

export function createPopUpApp(feature: any, layer: any, router: any): void {
    const mondoLeafletPopup =
        `<div id="ms_map_popover_${feature.properties.id}" class="ms-map-tooltip__content">` +
        spotPopupInnerHtml({ name: feature.properties.nm, direction: feature.properties.di, bottom: feature.properties.bo }) +
        '</div>';

    var customOptions = { minWidth: '180', maxWidth: '500', className: 'ms-map-tooltip' };
    layer.bindPopup(mondoLeafletPopup, customOptions);

    // Function to handle the click event
    const handleClick = () => {
        router.push(`/surf-spot/${feature.properties.sg}/guide/${feature.properties.id}`);
    };

    // Add event listener for click events on the popup
    layer.on('popupopen', () => {
        const popupNode = document.getElementById(`ms_map_popover_${feature.properties.id}`);
        if (popupNode) {
            popupNode.removeEventListener('click', handleClick);
            popupNode.addEventListener('click', handleClick);
        }
    });
}
