import { convertSizeFromMeters } from 'mondosurf-library/helpers/units.helpers';
import { store } from 'mondosurf-library/redux/store';
import { mondoTranslate } from 'proxies/mondoTranslate';

interface ITideTableWeeklyLevels {
    weeklyLimits: number[];
}

const TideTableWeeklyLevels = async (props: ITideTableWeeklyLevels) => {
    const state = store.getState();
    const lengthUnit: string = state.user.preferences.userPrefsHeight; // Redux
    const lengthUnitLabel = lengthUnit === 'meters' ? mondoTranslate('basics.meters') : mondoTranslate('basics.feet');

    return (
        <div className="ms-tide-table-weekly-levels">
            <p className="ms-tide-table-weekly-levels__title">{mondoTranslate('tide.weekly_tide_levels')}</p>
            <div className="ms-tide-table-weekly-levels__values ms-grid-1-2 ms-grid-v-0 ms-grid-h-0">
                <div className="ms-tide-table-weekly-levels__value">
                    {mondoTranslate('tide.low')}{' '}
                    <span>
                        {convertSizeFromMeters(props.weeklyLimits[0]).toFixed(2)} {lengthUnitLabel}
                    </span>
                </div>
                <div className="ms-tide-table-weekly-levels__value">
                    {mondoTranslate('tide.low_to_medium')}{' '}
                    <span>
                        {convertSizeFromMeters(props.weeklyLimits[1]).toFixed(2)} {lengthUnitLabel}
                    </span>
                </div>
                <div className="ms-tide-table-weekly-levels__value">
                    {mondoTranslate('tide.medium_to_high')}{' '}
                    <span>
                        {convertSizeFromMeters(props.weeklyLimits[2]).toFixed(2)} {lengthUnitLabel}
                    </span>
                </div>
                <div className="ms-tide-table-weekly-levels__value">
                    {mondoTranslate('tide.high')}{' '}
                    <span>
                        {convertSizeFromMeters(props.weeklyLimits[3]).toFixed(2)} {lengthUnitLabel}
                    </span>
                </div>
            </div>
        </div>
    );
};
export default TideTableWeeklyLevels;
