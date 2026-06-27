import { mondoTranslate } from 'proxies/mondoTranslate';

interface IDayAstronomyTable {
    civil_dawn: string;
    sunrise: string;
    sunset: string;
    civil_dusk: string;
}

const DayAstronomyTable: React.FC<IDayAstronomyTable> = (props) => {
    return (
        <div className="ms-day-astronomy-table" data-test="astronomy-table">
            <table className="ms-day-astronomy-table__table ms-table">
                <tbody>
                    <tr>
                        <td className="ms-day-astronomy-table__td ms-day-astronomy-table__icon">🌄</td>
                        <td className="ms-day-astronomy-table__td">
                            <span className="ms-day-astronomy-table__label">{mondoTranslate('basics.dawn')}</span>{' '}
                            <span className="ms-day-astronomy-table__value" data-test="day-astronomy-table-dawn">
                                {props.civil_dawn}
                            </span>
                        </td>
                        <td className="ms-day-astronomy-table__td ms-day-astronomy-table__icon">🌞</td>
                        <td className="ms-day-astronomy-table__td">
                            <span className="ms-day-astronomy-table__label">{mondoTranslate('basics.sunrise')}</span>{' '}
                            <span className="ms-day-astronomy-table__value" data-test="day-astronomy-table-sunrise">
                                {props.sunrise}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td className="ms-day-astronomy-table__td ms-day-astronomy-table__icon">🌅</td>
                        <td className="ms-day-astronomy-table__td">
                            <span className="ms-day-astronomy-table__label">{mondoTranslate('basics.sunset')}</span>{' '}
                            <span className="ms-day-astronomy-table__value" data-test="day-astronomy-table-sunset">
                                {props.sunset}
                            </span>
                        </td>
                        <td className="ms-day-astronomy-table__td ms-day-astronomy-table__icon">🌌</td>
                        <td className="ms-day-astronomy-table__td">
                            <span className="ms-day-astronomy-table__label">{mondoTranslate('basics.dusk')}</span>{' '}
                            <span className="ms-day-astronomy-table__value" data-test="day-astronomy-table-dusk">
                                {props.civil_dusk}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
export default DayAstronomyTable;
