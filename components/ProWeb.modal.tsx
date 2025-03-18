import Button from 'mondosurf-library/components/Button';
import Loader from 'mondosurf-library/components/Loader';
import LoginButton from 'mondosurf-library/components/LoginButton';
import ProFeaturesList from 'mondosurf-library/components/ProFeaturesList';
import {
    STRIPE_MONTHLY_SUBSCRIPTION_CANCEL_URL,
    STRIPE_MONTHLY_SUBSCRIPTION_SUCCESS_URL,
    STRIPE_YEARLY_SUBSCRIPTION_CANCEL_URL,
    STRIPE_YEARLY_SUBSCRIPTION_SUCCESS_URL
} from 'mondosurf-library/constants/constants';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import { proPriceMonth, proPriceYear } from 'mondosurf-library/helpers/pro.helpers';
import { RootState } from 'mondosurf-library/redux/store';
import modalService from 'mondosurf-library/services/modalService';
import { Tracker } from 'mondosurf-library/tracker/tracker';
import { BACKEND_BASE_URL, STRIPE_CHECKOUT_SESSION_URL_WEB } from 'proxies/localConstants';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useSelector } from 'react-redux';

const ProWeb: React.FC = (props) => {
    // Redux
    const userLogged = useSelector((state: RootState) => state.user.logged);
    const userEmail = useSelector((state: RootState) => state.user.userEmail);
    const userId = useSelector((state: RootState) => state.user.userId);
    const accountType = useSelector((state: RootState) => state.user.accountType);
    const stripeYearlyProduct = useSelector((state: RootState) => state.appConfig.stripe_yearly_product);
    const stripeMonthlyProduct = useSelector((state: RootState) => state.appConfig.stripe_monthly_product);

    // Handles click on Yearly button on web just for tracking
    const onYearlyWebButton = () => {
        // Tracking
        Tracker.trackEvent(['mp'], TrackingEvent.ModalProTap, { subscriptionDuration: 'yearly' });
    };

    // Handles click on Monthly button on web just for tracking
    const onMonthlyWebButton = () => {
        // Tracking
        Tracker.trackEvent(['mp'], TrackingEvent.ModalProTap, { subscriptionDuration: 'monthly' });
    };

    return (
        <section className="ms-pro" data-test="pro-modal-content">
            {userLogged === 'checking' && <Loader />}

            {userLogged === 'yes' &&
                (accountType === 'free' || accountType === 'trial') &&
                stripeYearlyProduct &&
                stripeMonthlyProduct && (
                    <>
                        {/* <p className="ms-pro__text ms-body-text">{mondoTranslate('pro.pro_modal.text_1')}</p> */}
                        <ProFeaturesList />
                        {/* <p className="ms-pro__text ms-body-text">{mondoTranslate('pro.pro_modal.text_2')}</p> */}

                        <form action={`${BACKEND_BASE_URL}${STRIPE_CHECKOUT_SESSION_URL_WEB}`} method="POST">
                            <input type="hidden" name="customer_email" value={userEmail} />
                            <input type="hidden" name="user_id" value={userId} />
                            <input type="hidden" name="success_url" value={STRIPE_YEARLY_SUBSCRIPTION_SUCCESS_URL} />
                            <input type="hidden" name="cancel_url" value={STRIPE_YEARLY_SUBSCRIPTION_CANCEL_URL} />
                            <input type="hidden" name="product_id" value={stripeYearlyProduct} />
                            <button
                                className="ms-btn ms-btn-cta ms-btn-xl ms-btn-full ms-btn-with-tag"
                                onClick={onYearlyWebButton}
                                data-test="pro-modal-web-yearly-button"
                                type="submit">
                                <span>
                                    {proPriceYear()}
                                    {mondoTranslate('pro.slash_year')}
                                </span>
                                <span>{mondoTranslate('pro.yearly_saving')}</span>
                            </button>
                        </form>
                        <form action={`${BACKEND_BASE_URL}${STRIPE_CHECKOUT_SESSION_URL_WEB}`} method="POST">
                            <input type="hidden" name="customer_email" value={userEmail} />
                            <input type="hidden" name="user_id" value={userId} />
                            <input type="hidden" name="success_url" value={STRIPE_MONTHLY_SUBSCRIPTION_SUCCESS_URL} />
                            <input type="hidden" name="cancel_url" value={STRIPE_MONTHLY_SUBSCRIPTION_CANCEL_URL} />
                            <input type="hidden" name="product_id" value={stripeMonthlyProduct} />
                            <button
                                className="ms-btn ms-btn-xl ms-btn-full"
                                onClick={onMonthlyWebButton}
                                data-test="pro-modal-web-monthly-button"
                                type="submit">
                                {proPriceMonth()}
                                {mondoTranslate('pro.slash_month')}
                            </button>
                        </form>

                        <small className="ms-pro__small-text ms-small-text">
                            {mondoTranslate('pro.pro_modal.subtext')}
                        </small>
                    </>
                )}

            {/* Error with stripe product codes */}
            {(stripeYearlyProduct === '' || stripeMonthlyProduct === '') && (
                <>
                    <p className="ms-body-text">Error retrieving Pro subscription inf0, try to reload the app</p>
                    <Button additionalClass="ms-btn ms-btn-xl ms-btn-full" label="Button" url="/" />
                </>
            )}

            {/* User is already Pro */}
            {userLogged === 'yes' && accountType === 'pro' && (
                <>
                    <p className="ms-body-text">{mondoTranslate('pro.pro_modal.already_pro')}</p>
                    <button className="ms-btn ms-btn-xl ms-btn-full" onClick={() => modalService.closeModal()}>
                        {mondoTranslate('basics.close')}
                    </button>
                </>
            )}

            {/* User is not logged */}
            {userLogged === 'no' && (
                <>
                    {/* ! Translate! */}
                    <p className="ms-pro__text ms-body-text">Login to activate your Pro account</p>
                    <LoginButton classes="ms-center-with-margin" context="proModal" />
                </>
            )}
        </section>
    );
};
export default ProWeb;
