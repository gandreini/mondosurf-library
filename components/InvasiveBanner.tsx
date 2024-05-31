// Client
'use client';

import Button from 'mondosurf-library/components/Button';
import { requestAccountVerificationEmail } from 'mondosurf-library/helpers/auth.helpers';
import { RootState } from 'mondosurf-library/redux/store';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useSelector } from 'react-redux';

interface IInvasiveBanner {
    type?: 'info' | 'success' | 'warning' | 'danger';
}

const InvasiveBanner: React.FC<IInvasiveBanner> = (props) => {
    const logged = useSelector((state: RootState) => state.user.logged);
    const accountVerified = useSelector((state: RootState) => state.user.accountVerified);

    return (
        <>
            {logged === 'yes' && accountVerified === false && (
                <div
                    className={`ms-invasive-banner ms-invasive-banner__type-${props.type}`}
                    data-test="invasive-banner">
                    <p className="ms-body-text ms-invasive-banner__text">{mondoTranslate('invasive_banner.text')}</p>

                    <Button
                        additionalClass="ms-invasive-banner__button"
                        callback={requestAccountVerificationEmail}
                        label={mondoTranslate('invasive_banner.button')}
                        size="s"
                        style="cta"
                    />
                </div>
            )}
        </>
    );
};
export default InvasiveBanner;
