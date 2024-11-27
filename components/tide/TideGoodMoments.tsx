import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { hourMinFormat } from 'mondosurf-library/helpers/date.helpers';
import { mondoTranslate } from 'proxies/mondoTranslate';

interface ITideGoodMoments {
    good_tide: string[][] | [-1];
    timezone: string;
}

const TideGoodMoments: React.FC<ITideGoodMoments> = (props) => {
    // Dayjs
    dayjs.extend(utc);
    dayjs.extend(timezone);

    return (
        <>
            {props.good_tide[0] === -1 && (
                <span className="ms-tide-good-moments__always">{mondoTranslate('tide.tide_always_good')}</span>
            )}
            {props.good_tide[0] !== -1 && (
                <span className="ms-tide-good-moments__text">
                    {mondoTranslate('tide.tide_good')}{' '}
                    {props.good_tide.map((value: string[] | any, key: number) => (
                        <span key={key}>
                            {mondoTranslate('basics.from')}{' '}
                            <strong>{dayjs(value[0]).tz(props.timezone).format(hourMinFormat())}</strong>{' '}
                            {mondoTranslate('basics.to')}{' '}
                            <strong>{dayjs(value[1]).tz(props.timezone).format(hourMinFormat())}</strong>
                            {key < props.good_tide.length - 1 && <>, </>}
                        </span>
                    ))}
                </span>
            )}
        </>
    );
};
export default TideGoodMoments;
