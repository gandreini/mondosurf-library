import TideTableDays from 'mondosurf-library/components/tide/TideTableDays';

export interface ITideTable {
    days: any;
    timezone: string;
    weeklyLimits?: number[];
}

const TideTable: React.FC<ITideTable> = (props) => {
    return (
        <div>
            {/* <TideTableWeeklyLevels weeklyLimits={props.weeklyLimits} /> */}
            <TideTableDays days={props.days} timezone={props.timezone} />
        </div>
    );
};
export default TideTable;
