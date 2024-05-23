// Client
'use client';

import { openLoginModal } from 'features/modal/modal.helpers';
import Icon from 'mondosurf-library/components/Icon';
import Loader from 'mondosurf-library/components/Loader';
import { hasProPermissions } from 'mondosurf-library/helpers/user.helpers';
import { RootState } from 'mondosurf-library/redux/store';
import MondoLink from 'proxies/MondoLink';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useSelector } from 'react-redux';

interface ITabBarUser {
    active?: boolean;
}

const TabBarUser: React.FC<ITabBarUser> = (props: ITabBarUser) => {
    // Redux
    const logged = useSelector((state: RootState) => state.user.logged);
    const userName = useSelector((state: RootState) => state.user.userName);

    // Opens the login modal
    const onLoginClick = () => {
        openLoginModal('tabBar');
    };

    return (
        <div className="ms-tab-bar-user">
            {logged === 'checking' && <Loader size="small" />}

            {logged === 'no' && (
                <div className="ms-tab-bar__item-link" onClick={onLoginClick} data-test="login-tab-bar">
                    <Icon icon="tab-bar-me" />
                    <span className="ms-tab-bar__item-label">{mondoTranslate('basics.login')}</span>
                </div>
            )}

            {logged === 'yes' && (
                <>
                    <MondoLink
                        className={`ms-tab-bar__item-link ${props.active && 'is-active'}`}
                        href="/profile"
                        title="Your profile"
                        dataTest="user-tab-bar">
                        <>
                            <Icon icon={props.active ? 'tab-bar-active-me' : 'tab-bar-me'} />
                            <span className="ms-tab-bar__item-label">{userName}</span>
                            {hasProPermissions() && <span className="ms-tab-bar__pro">PRO</span>}
                        </>
                    </MondoLink>
                </>
            )}
        </div>
    );
};
export default TabBarUser;
