// Client
'use client';

import { openCalendarModal } from 'features/modal/modal.helpers';
import FavoriteAddButton from 'mondosurf-library/components/FavoriteAddButton';
import Icon from 'mondosurf-library/components/Icon';

interface ISurfSpotHeaderActions {
    spotName: string;
    spotId: number;
}

const SurfSpotHeaderActions: React.FC<ISurfSpotHeaderActions> = (props) => {
    return (
        <>
            <FavoriteAddButton spotName={props.spotName} spotId={props.spotId} context="spotPageBigButton" />
            <div
                className="ms-surf-spot-header__calendar-icon"
                onClick={() => openCalendarModal(props.spotId, props.spotName)}
                data-test="calendar-add-button">
                <Icon icon={'add-calendar'} />
            </div>
        </>
    );
};
export default SurfSpotHeaderActions;
