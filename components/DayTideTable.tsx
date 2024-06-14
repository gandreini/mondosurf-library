import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { removeFirstAndLastItem } from 'mondosurf-library/helpers/arrays.helpers';
import { hourMinFormat } from 'mondosurf-library/helpers/date.helpers';
import { ISurfSpotForecastDayTideHighLow } from 'mondosurf-library/model/iSurfSpot';

interface IDayTideTable {
    highLows: ISurfSpotForecastDayTideHighLow[];
    timezone: string;
}

const DayTideTable: React.FC<IDayTideTable> = (props) => {
    // Dayjs
    dayjs.extend(utc);
    dayjs.extend(timezone);

    return (
        <div className="ms-day-tide-table">
            <table className="ms-day-tide-table__table">
                <tbody>
                    {removeFirstAndLastItem(props.highLows).map(
                        (value: ISurfSpotForecastDayTideHighLow, key: number) => (
                            <tr
                                key={key}
                                className={`ms-day-tide-table__row ${
                                    value.type === 'high' ? 'ms-day-tide-table__row-high' : ''
                                } ${value.type === 'low' ? 'ms-day-tide-table__row-low' : ''}"`}
                                data-test="day-data-table-row">
                                <td className="ms-day-tide-table__icon">
                                    {value.type === 'high' && <>🔼</>}
                                    {value.type === 'low' && <>🔽</>}
                                </td>
                                <td className="ms-day-tide-table__size">{value.height.toFixed(2)}</td>
                                <td className="ms-day-tide-table__time">
                                    ⏰ {dayjs(value.time).tz(props.timezone).format(hourMinFormat())}
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
};
export default DayTideTable;
