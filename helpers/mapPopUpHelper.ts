import { mondoTranslate } from 'proxies/mondoTranslate';
import { returnBottomLabel, returnDirectionLabel } from './labels.helpers';

/**
 * Creates the popover that is displayed when clicking on a marker.
 *
 * @param {any} feature Single feature from GeoJSON corresponding to each pin on the map.
 * @param {any} layer   The layer to which the popup is bound.
 * @param {any} router   The layer to which the popup is bound.
 */
export function createPopUp(feature: any, layer: any, router: any): void {
    let mondoLeafletPopup = `<div id="ms_map_popover_${feature.properties.id}" class="ms-map-tooltip__content">`;
    mondoLeafletPopup += '<div class="ms-map-tooltip__title">' + feature.properties.nm + '</div>';
    mondoLeafletPopup += '<div class="ms-map-tooltip__details">';

    if (feature.properties.di !== '' && feature.properties.di !== '0' && feature.properties.di !== null) {
        mondoLeafletPopup +=
            '<span class="ms-label-value"><span class="ms-label">' +
            mondoTranslate('basics.direction') +
            '</span> <span class="ms-value">' +
            returnDirectionLabel(feature.properties.di) +
            '</span></span>';
    }

    if (feature.properties.bo !== '' && feature.properties.bo !== '0' && feature.properties.bo !== null) {
        mondoLeafletPopup +=
            '<span class="ms-label-value"><span class="ms-label">' +
            mondoTranslate('basics.bottom') +
            '</span> <span class="ms-value">' +
            returnBottomLabel(feature.properties.bo) +
            '</span></span>';
    }

    mondoLeafletPopup += '</div></div>';

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
