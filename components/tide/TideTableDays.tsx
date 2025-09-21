import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { removeFirstAndLastItem } from 'mondosurf-library/helpers/arrays.helpers';
import { extDayFormat, hourMinFormat } from 'mondosurf-library/helpers/date.helpers';
import UnitDisplay from 'mondosurf-library/components/UnitDisplay';
import { ISurfSpotForecastDay, ISurfSpotForecastDayTideHighLow } from 'mondosurf-library/model/iSurfSpot';

interface ITideTableDays {
    days: any;
    timezone: string;
}

const TideTableDays: React.FC<ITideTableDays> = (props) => {
    // Dayjs
    dayjs.extend(utc);
    dayjs.extend(timezone);

    return (
        <table className="ms-tide-table-days ms-table">
            <tbody>
                {props.days &&
                    props.days
                        .filter((element: ISurfSpotForecastDay) =>
                            element.tide && element.tide.high_low ? true : false
                        )
                        .map((value: ISurfSpotForecastDay, key: number) => (
                            <tr key={key}>
                                <td className="ms-tide-table-days__date">
                                    {dayjs(value.civil_dawn).tz(props.timezone).format(extDayFormat())}
                                </td>
                                <td className="ms-tide-table-days__values">
                                    {/* {hasProPermissions() && (
                                        <div className="ms-tide-table-days__good-moments">
                                            <p className="ms-tide-table-days__good-moments-text">
                                                <TideGoodMoments
                                                    good_tide={value.tide.good_tide}
                                                    timezone={props.timezone}
                                                />
                                            </p>
                                        </div>
                                    )} */}
                                    <table className="ms-tide-table-days__details">
                                        <tbody>
                                            <tr>
                                                {removeFirstAndLastItem(value.tide.high_low).map(
                                                    (value: ISurfSpotForecastDayTideHighLow, key: number) => (
                                                        <td
                                                            className={value.type === 'high' ? 'is-high' : 'is-low'}
                                                            key={key}>
                                                            <span className="ms-tide-table-days__details-main-info">
                                                                <span className="ms-tide-table-days__icon">
                                                                    {value.type === 'low' && <>🔽</>}
                                                                    {value.type === 'high' && <>🔼</>}
                                                                </span>
                                                                {dayjs(value.time)
                                                                    .tz(props.timezone)
                                                                    .format(hourMinFormat())}
                                                            </span>
                                                            <span className="ms-tide-table-days__size">
                                                                <UnitDisplay
                                                                    unit="height"
                                                                    value={value.height}
                                                                    mode="both"
                                                                    decimals={2}
                                                                />
                                                            </span>
                                                        </td>
                                                    )
                                                )}
                                                {removeFirstAndLastItem(value.tide.high_low).length <= 3 && <td></td>}
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        ))}
            </tbody>
        </table>
    );
};
export default TideTableDays;
