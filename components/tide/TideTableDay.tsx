import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { removeFirstAndLastItem } from 'mondosurf-library/helpers/arrays.helpers';
import { hourMinFormat } from 'mondosurf-library/helpers/date.helpers';
import UnitDisplay from 'mondosurf-library/components/UnitDisplay';
import { ISurfSpotForecastDayTideHighLow } from 'mondosurf-library/model/iSurfSpot';

interface ITideTableDay {
    highLows: ISurfSpotForecastDayTideHighLow[];
    timezone: string;
}

const TideTableDay: React.FC<ITideTableDay> = (props) => {
    // Dayjs
    dayjs.extend(utc);
    dayjs.extend(timezone);

    return (
        <table className="ms-tide-table-day ms-table">
            <tbody>
                {removeFirstAndLastItem(props.highLows).map((value: ISurfSpotForecastDayTideHighLow, key: number) => (
                    <tr
                        key={key}
                        className={`ms-tide-table-day__row ${
                            value.type === 'high' ? 'ms-tide-table-day__row-high' : ''
                        } ${value.type === 'low' ? 'ms-tide-table-day__row-low' : ''}`}
                        data-test="day-data-table-row">
                        <td className="ms-tide-table-day__icon">
                            {value.type === 'high' && <>🔼</>}
                            {value.type === 'low' && <>🔽</>}
                        </td>
                        <td className="ms-tide-table-day__size">
                            <UnitDisplay unit="height" value={value.height} mode="both" decimals={2} />
                        </td>
                        <td className="ms-tide-table-day__time">
                            ⏰ {dayjs(value.time).tz(props.timezone).format(hourMinFormat())}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
export default TideTableDay;
