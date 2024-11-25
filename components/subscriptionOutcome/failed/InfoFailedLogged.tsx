import { MAIN_CONTACT_EMAIL } from 'mondosurf-library/constants/constants';
import MondoLink from 'proxies/MondoLink';
import { mondoTranslate } from 'proxies/mondoTranslate';

const InfoFailedLogged: React.FC = (props) => {
    return (
        <>
            <p className="ms-body-text">{mondoTranslate('pro.subscription_confirmed.cancel_text_1')}</p>
            <p className="ms-body-text">{mondoTranslate('pro.subscription_confirmed.cancel_text_2_alt')}</p>
            <MondoLink href="/" className="ms-home-hero__btn ms-btn ms-btn-l">
                {mondoTranslate('basics.home')}
            </MondoLink>
            <small className="ms-small-text">
                {mondoTranslate('pro.subscription_confirmed.cancel_subtext_1')}{' '}
                <a href={`mailto:${MAIN_CONTACT_EMAIL}`} rel="noreferrer" target="_blank">
                    {MAIN_CONTACT_EMAIL}
                </a>{' '}
                {mondoTranslate('pro.subscription_confirmed.cancel_subtext_2')}
            </small>
        </>
    );
};
export default InfoFailedLogged;
