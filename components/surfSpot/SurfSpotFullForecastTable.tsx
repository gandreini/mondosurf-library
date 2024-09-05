// Server

import { limitForecastToDaysRange } from 'mondosurf-library/helpers/forecast.helpers';
import { ISurfSpot, ISurfSpotForecast } from 'mondosurf-library/model/iSurfSpot';
import SurfSpotFullForecastTableFree from 'mondosurf-library/components/surfSpot/SurfSpotFullForecastTableFree';
import SurfSpotFullForecastTablePro from 'mondosurf-library/components/surfSpot/SurfSpotFullForecastTablePro';
import LastUpdate from 'mondosurf-library/components/LastUpdate';

interface ISurfSpotFullForecastTable {
    spot: ISurfSpot;
    spotForecast: ISurfSpotForecast;
}

const SurfSpotFullForecastTable: React.FC<ISurfSpotFullForecastTable> = (props) => {
    const freeForecast = limitForecastToDaysRange(props.spotForecast, 3, props.spot.timezone);
    const proForecast = limitForecastToDaysRange(props.spotForecast, 7, props.spot.timezone, 3);

    return (
        <div className="ms-surf-spot-full-forecast-table" data-test="full-forecast">
            <SurfSpotFullForecastTableFree spot={props.spot} freeSpotForecast={freeForecast} />
            <SurfSpotFullForecastTablePro spot={props.spot} proSpotForecast={proForecast} />

            {/* Last update */}
            <div className="ms-surf-spot-forecast__good-times-update">
                <LastUpdate lastUpdate={freeForecast.last_forecast_update} />
            </div>
        </div>
    );
};
export default SurfSpotFullForecastTable;
