import LoginButton from 'mondosurf-library/components/LoginButton';
import { mondoTranslate } from 'proxies/mondoTranslate';

const LoginSuccess: React.FC = (props) => {
    return (
        <>
            <p className="ms-body-text">{mondoTranslate('pro.subscription_confirmed.log_in_text')}</p>
            <LoginButton classes="ms-btn-full" context="subscriptionConfirmed" />
        </>
    );
};
export default LoginSuccess;
