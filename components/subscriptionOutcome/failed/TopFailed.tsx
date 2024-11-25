import { mondoTranslate } from 'proxies/mondoTranslate';

const TopFailed: React.FC = (props) => {
    return (
        <h2 className="ms-h2-title" data-test="subscription-failed-title">
            {mondoTranslate('pro.subscription_confirmed.cancel_title')}
        </h2>
    );
};
export default TopFailed;
