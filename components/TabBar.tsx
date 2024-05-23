import Icon from 'mondosurf-library/components/Icon';
import { mondoTranslate } from 'proxies/mondoTranslate';
import MondoLink from 'proxies/MondoLink';
import TabBarUser from 'mondosurf-library/components/TabBarUser';

interface ITabBar {
    active?: 'home' | 'favorites' | 'spots' | 'search' | 'map' | 'user';
}

const TabBar: React.FC<ITabBar> = (props: ITabBar) => {
    return (
        <div className="ms-tab-bar">
            <nav className="ms-tab-bar__nav">
                <div className="ms-tab-bar__list-wrapper">
                    <ul className="ms-tab-bar__list">
                        <li className="ms-tab-bar__item">
                            <MondoLink
                                className={
                                    props.active === 'home'
                                        ? 'ms-tab-bar__item-link is-active'
                                        : 'ms-tab-bar__item-link'
                                }
                                title="Homepage"
                                href="/"
                                customKey={mondoTranslate('basics.home')}
                                dataTest="home-tab-bar">
                                {props.active !== 'home' && <Icon icon={'tab-bar-home'} />}
                                {props.active === 'home' && <Icon icon={'tab-bar-active-home'} />}
                                <span className="ms-tab-bar__item-label">{mondoTranslate('basics.home')}</span>
                            </MondoLink>
                        </li>
                        <li className="ms-tab-bar__item">
                            <MondoLink
                                className={
                                    props.active === 'favorites'
                                        ? 'ms-tab-bar__item-link is-active'
                                        : 'ms-tab-bar__item-link'
                                }
                                href="/favorites"
                                title="Your favorites"
                                customKey={mondoTranslate('basics.favorites')}
                                dataTest="favorites-tab-bar">
                                {props.active !== 'favorites' && <Icon icon={'tab-bar-favorites'} />}
                                {props.active === 'favorites' && <Icon icon={'tab-bar-active-favorites'} />}
                                <span className="ms-tab-bar__item-label">{mondoTranslate('basics.favorites')}</span>
                            </MondoLink>
                        </li>
                        <li className="ms-tab-bar__item">
                            <MondoLink
                                className={
                                    props.active === 'spots'
                                        ? 'ms-tab-bar__item-link is-active'
                                        : 'ms-tab-bar__item-link'
                                }
                                href="/surf-spots-guides-forecasts"
                                title="Surf spots"
                                customKey={mondoTranslate('basics.surf_spots')}
                                dataTest="spots-tab-bar">
                                {props.active !== 'spots' && <Icon icon={'tab-bar-spots'} />}
                                {props.active === 'spots' && <Icon icon={'tab-bar-active-spots'} />}
                                <span className="ms-tab-bar__item-label">{mondoTranslate('basics.spots')}</span>
                            </MondoLink>
                        </li>
                        <li className="ms-tab-bar__item">
                            <MondoLink
                                className={
                                    props.active === 'map' ? 'ms-tab-bar__item-link is-active' : 'ms-tab-bar__item-link'
                                }
                                href="/surf-spots-map"
                                title="Surf map"
                                customKey={mondoTranslate('basics.map')}
                                dataTest="map-tab-bar">
                                {props.active !== 'map' && <Icon icon={'tab-bar-map'} />}
                                {props.active === 'map' && <Icon icon={'tab-bar-active-map'} />}
                                <span className="ms-tab-bar__item-label">{mondoTranslate('basics.map')}</span>
                            </MondoLink>
                        </li>
                        <li className="ms-tab-bar__item">
                            <TabBarUser active={props.active === 'user' ? true : false} />
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
};
export default TabBar;
