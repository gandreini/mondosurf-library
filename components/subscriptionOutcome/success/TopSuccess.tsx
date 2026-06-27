import { mondoTranslate } from 'proxies/mondoTranslate';

const TopSuccess: React.FC = (props) => {
    return (
        <>
            <h2 className="ms-h2-title" data-test="subscription-success-title">
                {mondoTranslate('pro.subscription_confirmed.success_title')}
            </h2>
            <p className="ms-body-text">
                <strong>{mondoTranslate('pro.subscription_confirmed.subscription_started')}</strong>
            </p>
        </>
    );
};
export default TopSuccess;
