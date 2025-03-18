// Client
'use client';

import { openLoginModal } from 'features/modal/modal.helpers';
import Button from 'mondosurf-library/components/Button';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import { LoginModalContext } from 'mondosurf-library/model/loginModalContext';
import { Tracker } from 'mondosurf-library/tracker/tracker';
import { mondoTranslate } from 'proxies/mondoTranslate';

interface ILoginButton {
    classes?: string;
    dataTest?: string;
    trackingEvent?: TrackingEvent;
    context: LoginModalContext;
    size?: 'l' | 'm' | 's';
    parentFunction?: () => void;
    callback?: () => void;
}

const LoginButton: React.FC<ILoginButton> = (props) => {
    // Handles click on login button, including tracking
    const onLoginClick = () => {
        // Tracking.
        if (props.trackingEvent) {
            Tracker.trackEvent(['mp'], TrackingEvent.NavLoginTap, {
                context: props.context
            });
        }
        openLoginModal(props.context, undefined, undefined, props.callback);
    };

    return (
        <Button
            label={mondoTranslate('basics.login')}
            style="cta"
            size={props.size || 'l'}
            additionalClass={props.classes}
            callback={onLoginClick}
            dataTest={props.dataTest}
        />
    );
};
export default LoginButton;
