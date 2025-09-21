import UnitDisplay from 'mondosurf-library/components/UnitDisplay';
import { mondoTranslate } from 'proxies/mondoTranslate';

interface ITideTableWeeklyLevels {
    weeklyLimits: number[];
}

const TideTableWeeklyLevels = async (props: ITideTableWeeklyLevels) => {
    return (
        <div className="ms-tide-table-weekly-levels">
            <p className="ms-tide-table-weekly-levels__title">{mondoTranslate('tide.weekly_tide_levels')}</p>
            <div className="ms-tide-table-weekly-levels__values ms-grid-1-2 ms-grid-v-0 ms-grid-h-0">
                <div className="ms-tide-table-weekly-levels__value">
                    {mondoTranslate('tide.low')}{' '}
                    <span>
                        <UnitDisplay unit="height" value={props.weeklyLimits[0]} mode="both" decimals={2} />
                    </span>
                </div>
                <div className="ms-tide-table-weekly-levels__value">
                    {mondoTranslate('tide.low_to_medium')}{' '}
                    <span>
                        <UnitDisplay unit="height" value={props.weeklyLimits[1]} mode="both" decimals={2} />
                    </span>
                </div>
                <div className="ms-tide-table-weekly-levels__value">
                    {mondoTranslate('tide.medium_to_high')}{' '}
                    <span>
                        <UnitDisplay unit="height" value={props.weeklyLimits[2]} mode="both" decimals={2} />
                    </span>
                </div>
                <div className="ms-tide-table-weekly-levels__value">
                    {mondoTranslate('tide.high')}{' '}
                    <span>
                        <UnitDisplay unit="height" value={props.weeklyLimits[3]} mode="both" decimals={2} />
                    </span>
                </div>
            </div>
        </div>
    );
};
export default TideTableWeeklyLevels;
