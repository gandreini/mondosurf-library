import { mondoTranslate } from 'proxies/mondoTranslate';
import Icon from 'mondosurf-library/components/Icon';

const WhereToStart: React.FC = (props) => {
    return (
        <>
            <p className="ms-body-text">{mondoTranslate('pro.subscription_confirmed.where_to_start_title')}</p>
            <div className="ms-subscription-confirmed__start">
                <Icon icon="heart" />
                <div>
                    <p className="ms-body-text">{mondoTranslate('pro.subscription_confirmed.where_to_start_text_1')}</p>
                    <small className="ms-small-text">
                        {mondoTranslate('pro.subscription_confirmed.where_to_start_subtext_1')}
                    </small>
                </div>
                <Icon icon="add-calendar" />
                <div>
                    <p className="ms-body-text">{mondoTranslate('pro.subscription_confirmed.where_to_start_text_2')}</p>
                    <small className="ms-small-text">
                        {mondoTranslate('pro.subscription_confirmed.where_to_start_subtext_2')}
                    </small>
                </div>
            </div>
        </>
    );
};
export default WhereToStart;
