// Client
'use client';

import { revoke } from 'mondosurf-library/helpers/auth.helpers';
import Button from 'mondosurf-library/components/Button';
import { RootState } from 'mondosurf-library/redux/store';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useSelector } from 'react-redux';

interface ILogoutButton {
    parentFunction?: () => void;
}

const LogoutButton: React.FC<ILogoutButton> = (props) => {
    // Redux.
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const deviceId = useSelector((state: RootState) => state.appConfig.device_id);

    // Revokes the token and logs out the user
    const onLogout = () => {
        revoke(accessToken, deviceId)
            .then((response) => {
                if (response && response.data.success === true) {
                    if (props.parentFunction) props.parentFunction();
                }
            })
            .catch(function (error) {
                // What happens if there's a logout error? We try to logout the user anyway:
                if (props.parentFunction) props.parentFunction();
            });
    };
    return <Button label={mondoTranslate('basics.logout')} style="cta" size="l" callback={onLogout} />;
};
export default LogoutButton;
