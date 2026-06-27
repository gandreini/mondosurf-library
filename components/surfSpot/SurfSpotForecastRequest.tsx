'use client';

import EmptyState from 'mondosurf-library/components/EmptyState';
import Loader from 'mondosurf-library/components/Loader';
import { requestForecastStep1 } from 'mondosurf-library/helpers/forecast.helpers';
import { RootState } from 'mondosurf-library/redux/store';
import { useState } from 'react';
import { useSelector } from 'react-redux';

interface ISurfSpotForecastRequest {
    spotId: string;
    spotName: string;
}

const SurfSpotForecastRequest: React.FC<ISurfSpotForecastRequest> = (props) => {
    // Redux
    const logged = useSelector((state: RootState) => state.user.logged);

    // State variables.
    const [requestForecastState, setRequestForecastState] = useState<
        'notRequested' | 'requesting' | 'requested' | 'failed'
    >('notRequested');

    // Triggered when the user clicks on the forecast request button
    const onClickRequestButton = () => {
        setRequestForecastState('requesting');
        requestForecastStep1(logged, props.spotId)
            .then((result) => {
                setRequestForecastState('requested');
            })
            .catch((error) => {
                setRequestForecastState('failed');
            });
    };

    return (
        <div className="ms-surf-spot__main-content ms-surf-spot-forecast-request">
            {requestForecastState === 'requesting' && (
                <div className="is-full-height-and-center">
                    <Loader />
                </div>
            )}
            {requestForecastState === 'requested' && (
                <EmptyState
                    emoji="✅"
                    title={`Request sent!`}
                    text="Forecast request sent successfully. You'll receive an email from our team"
                />
            )}
            {requestForecastState === 'notRequested' && (
                <EmptyState
                    title={`Forecast not available`}
                    text={`The forecast for ${props.spotName} is currently not available. Click the button below to send a request and we'll add it for you.`}
                    buttonLabel="Request Forecast"
                    buttonSize="l"
                    buttonStyle="cta"
                    buttonCallback={() => {
                        onClickRequestButton();
                    }}
                />
            )}
            {requestForecastState === 'failed' && (
                <EmptyState
                    title={`Request failed, try again`}
                    text={`The forecast for ${props.spotName} is currently not available. Click the button below to send a request and we'll add it for you.`}
                    buttonLabel="Request Forecast"
                    buttonSize="l"
                    buttonStyle="cta"
                    buttonCallback={() => {
                        onClickRequestButton();
                    }}
                />
            )}
        </div>
    );
};
export default SurfSpotForecastRequest;
