import { mondoTranslate } from 'proxies/mondoTranslate';
import LoginButton from 'mondosurf-library/components/LoginButton';
import MondoLink from 'proxies/MondoLink';
import { MAIN_CONTACT_EMAIL } from 'mondosurf-library/constants/constants';

const InfoFailedNotLogged: React.FC = (props) => {
    return (
        <>
            <p className="ms-body-text">{mondoTranslate('pro.subscription_confirmed.cancel_text_1')}</p>
            <p className="ms-body-text">{mondoTranslate('pro.subscription_confirmed.cancel_text_2')}</p>
            <LoginButton classes="ms-btn-l ms-btn-full" context="subscriptionConfirmed" />
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
export default InfoFailedNotLogged;
