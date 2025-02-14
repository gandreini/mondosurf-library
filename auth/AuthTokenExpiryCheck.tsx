import jwt_decode from 'jwt-decode';
import { refreshToken } from 'mondosurf-library/helpers/auth.helpers';
import IAccessToken from 'mondosurf-library/model/iAccessToken';
import { RootState } from 'mondosurf-library/redux/store';
import { REFRESH_TOKEN_INTERVAL_SECONDS } from 'proxies/localConstants';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

// Never used

/* const AuthTokenExpiryCheck: React.FC = (props) => {
    const tokenRefreshInterval: number = parseInt(REFRESH_TOKEN_INTERVAL_SECONDS!) * 1000;
    const logged = useSelector((state: RootState) => state.user.logged);
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const [count, setCount] = useState<number>(0);
    const deviceId = useSelector((state: RootState) => state.appConfig.device_id);

    useEffect(() => {
        if (accessToken && logged === 'yes') {
            const timer = setTimeout(() => {
                setCount((c) => c + 1);
                checkToken();
            }, tokenRefreshInterval);
        }
        // return () => clearTimeout(timer);
    }, [count, logged]);

    const checkToken = () => {
        if (accessToken && logged === 'yes') {
            const decodedToken: IAccessToken = jwt_decode(accessToken);
            if (Math.floor(Date.now() / 1000) > decodedToken.exp - 60) {
                refreshToken(accessToken, deviceId);
            }
        }
    };

    return <></>;
};
export default AuthTokenExpiryCheck; */
