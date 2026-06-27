// Client
// 'use client';

import { ISurfForecastRow, ISurfSpotGoodConditions } from 'mondosurf-library/model/iSurfSpot';
import ForecastRow from 'mondosurf-library/components/ForecastRow';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
// import { useEffect } from 'react';

interface ISurfSpotForecastDay {
    day: ISurfForecastRow[];
    dayId: number;
    timezone: string;
    goodConditions: ISurfSpotGoodConditions;
    dayToShow?: number;
    hourToShow?: number;
}

const SurfSpotForecastDay: React.FC<ISurfSpotForecastDay> = (props: ISurfSpotForecastDay) => {
    // Dayjs plugins.
    dayjs.extend(utc);
    dayjs.extend(timezone);

    /* useEffect(() => {
        // Scroll
        setTimeout(function () {
            const elementToShow = document.getElementById(`day-${props.dayToShow}-hour-${props.hourToShow}`);
            console.log('elementToShow', elementToShow);
            const elementToScroll = document.getElementsByClassName('ms-modal__content')[0];
            console.log('elementToScroll', elementToScroll);

            if (elementToShow && elementToScroll) {
                console.log('Scrolla vai!');
                const elementToShowTop = elementToShow.getBoundingClientRect().top;
                const elementToScrollTop = document
                    .getElementsByClassName('ms-modal__content')[0]
                    .getBoundingClientRect().top;
                const offsetPosition = elementToShowTop - 37 - elementToScrollTop; // 84 is the sum of the height of `.ms-tabs` and `.ms-surf-forecast-day__day`
                elementToScroll.scroll({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 800);
    }, []);
 */
    return (
        <div className="ms-surf-forecast-day">
            <div className="ms-surf-forecast-day__header">
                <p className="ms-surf-forecast-day__day">Surf</p>
                <p className="ms-surf-forecast-day__swell">Swell</p>
                <p className="ms-surf-forecast-day__wind">Wind</p>
                <p className="ms-surf-forecast-day__secondary-swell">Secondary swell</p>
            </div>
            <div className="ms-surf-forecast-day__rows">
                {props.day.map((row, key) => (
                    <ForecastRow key={key} row={row} goodConditions={props.goodConditions} timezone={props.timezone} />
                ))}
            </div>
        </div>
    );
};
export default SurfSpotForecastDay;
