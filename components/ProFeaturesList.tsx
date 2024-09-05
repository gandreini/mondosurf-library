import { mondoTranslate } from 'proxies/mondoTranslate';

const ProFeatures: React.FC = (props) => {
    return (
        <ul className="ms-pro-features-list">
            <li className="ms-pro-features-list__item">
                <span className="ms-pro-features-list__icon">{mondoTranslate('pro.features_list.icon_4')}</span>
                <span className="ms-pro-features-list__text">{mondoTranslate('pro.features_list.text_4')}</span>
            </li>
            <li className="ms-pro-features-list__item">
                <span className="ms-pro-features-list__icon">{mondoTranslate('pro.features_list.icon_2')}</span>
                <span className="ms-pro-features-list__text">{mondoTranslate('pro.features_list.text_2')}</span>
            </li>
            <li className="ms-pro-features-list__item">
                <span className="ms-pro-features-list__icon">{mondoTranslate('pro.features_list.icon_3')}</span>
                <span className="ms-pro-features-list__text">{mondoTranslate('pro.features_list.text_3')}</span>
            </li>
            <li className="ms-pro-features-list__item">
                <span className="ms-pro-features-list__icon">{mondoTranslate('pro.features_list.icon_1')}</span>
                <span className="ms-pro-features-list__text">{mondoTranslate('pro.features_list.text_1')}</span>
            </li>
        </ul>
    );
};
export default ProFeatures;
