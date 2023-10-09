import dayjs from 'dayjs';
import { FORECAST_UPDATE_PERIOD } from '@/mondosurf-library/constants/constants';
import { hourMinFormat } from '@/mondosurf-library/helpers/date.helpers';

interface ILastUpdate {
    lastUpdate: number;
}

const LastUpdate: React.FC<ILastUpdate> = (props) => {
    return (
        <div className="ms-last-update">
            <p className="ms-last-update__last-update">
                <span className="ms-last-update__label">Last update:</span>{' '}
                <span className="ms-last-update__value">{dayjs.unix(props.lastUpdate).format(hourMinFormat())}</span>
            </p>{' '}
            <p className="ms-last-update__next-update">
                <span className="ms-last-update__label">Next update:</span>{' '}
                <span className="ms-last-update__value">
                    {dayjs.unix(props.lastUpdate + FORECAST_UPDATE_PERIOD).format(hourMinFormat())}
                </span>
            </p>
        </div>
    );
};
export default LastUpdate;
