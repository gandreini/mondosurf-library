import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import TideGoodMoments from 'mondosurf-library/components/tide/TideGoodMoments';
import { removeFirstAndLastItem } from 'mondosurf-library/helpers/arrays.helpers';
import { extDayFormat, hourMinFormat } from 'mondosurf-library/helpers/date.helpers';
import { convertSizeFromMeters } from 'mondosurf-library/helpers/units.helpers';
import { hasProPermissions } from 'mondosurf-library/helpers/user.helpers';
import { ISurfSpotForecastDay, ISurfSpotForecastDayTideHighLow } from 'mondosurf-library/model/iSurfSpot';
import { store } from 'mondosurf-library/redux/store';
import { mondoTranslate } from 'proxies/mondoTranslate';

interface ITideTableDays {
    days: any;
    timezone: string;
}

const TideTableDays = async (props: ITideTableDays) => {
    // Dayjs
    dayjs.extend(utc);
    dayjs.extend(timezone);

    const state = store.getState();
    const lengthUnit: string = state.units.lengthUnit; // Redux.
    const lengthUnitLabel = lengthUnit === 'mt' ? mondoTranslate('basics.meters') : mondoTranslate('basics.feet');

    return (
        <table className="ms-tide-table-days">
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
                                    {hasProPermissions() && (
                                        <div className="ms-tide-table-days__good-moments">
                                            <p className="ms-tide-table-days__good-moments-text">
                                                <TideGoodMoments
                                                    good_tide={value.tide.good_tide}
                                                    timezone={props.timezone}
                                                />
                                            </p>
                                        </div>
                                    )}
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
                                                                {convertSizeFromMeters(value.height).toFixed(2)}{' '}
                                                                {lengthUnitLabel}
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
