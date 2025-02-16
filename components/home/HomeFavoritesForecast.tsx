import EmptyState from 'mondosurf-library/components/EmptyState';
import GoodTime from 'mondosurf-library/components/GoodTime';
import LastUpdate from 'mondosurf-library/components/LastUpdate';
import List from 'mondosurf-library/components/List';
import Loader from 'mondosurf-library/components/Loader';
import IGoodTime from 'mondosurf-library/model/iGoodTime';
import { mondoTranslate } from 'proxies/mondoTranslate';

interface IHomeFavoritesForecast {
    status: 'noFavorites' | 'loading' | 'empty' | 'goodTimes' | 'error';
    goodTimes: IGoodTime[] | null;
    lastUpdate: number | null;
}

const HomeFavoritesForecast: React.FC<IHomeFavoritesForecast> = (props: IHomeFavoritesForecast) => {
    return (
        <div className="ms-home-favorites-spots-forecast">
            <div className="ms-desktop-max-width ms-side-spacing">
                {/* Loading */}
                {props.status === 'loading' && (
                    <div className="ms-home-favorites-spots-forecast__loading">
                        <Loader />
                    </div>
                )}

                {/* User has no favourites */}
                {props.status === 'noFavorites' && (
                    <div
                        className="ms-home-favorites-spots-forecast__no-favourites ms-centered ms-max-width"
                        data-test="home-favorites-forecast-no-favs">
                        <EmptyState
                            title={mondoTranslate('home.favourites.no_favourites_text')}
                            text={mondoTranslate('profile.favourite_spots_empty_text')}
                            emoji="🤖"
                            buttonLabel={mondoTranslate('basics.browse_spots')}
                            buttonUrl="/surf-spots-guides-forecasts"
                            buttonStyle="cta"
                            buttonSize="l"
                        />
                    </div>
                )}

                {/* No good times */}
                {props.status === 'empty' && (
                    <div className="ms-home-favorites-spots-forecast__empty ms-centered ms-max-width">
                        <EmptyState
                            title={mondoTranslate('home.favourites.no_good_times_title')}
                            text={mondoTranslate('home.favourites.no_good_times_text')}
                            emoji={mondoTranslate('home.favourites.no_good_times_icon')}
                        />
                        {props.lastUpdate && (
                            <div className="ms-home-favorites-spots-forecast__last-update">
                                <LastUpdate lastUpdate={props.lastUpdate}></LastUpdate>
                            </div>
                        )}
                    </div>
                )}

                {/* God times */}
                {props.status === 'goodTimes' && (
                    <div className="ms-home-favorites-spots-forecast__good-times">
                        <h3 className="ms-home-favorites-spots-forecast__good-times-title ms-h2-title">
                            {mondoTranslate('home.favourites.title')}
                        </h3>

                        <List
                            components={props.goodTimes!.map((goodTime: any, index: number) => (
                                <GoodTime
                                    key={index}
                                    {...goodTime}
                                    defaultClickBehavior={true}
                                    context="homeFavorites"
                                />
                            ))}
                            pageSize={4}
                            dataTest="home-favorites-forecast-good-times"
                            wrapperClasses="ms-home__good-days ms-grid-2 ms-grid-v-1"
                        />

                        {props.lastUpdate && (
                            <div className="ms-home-favorites-spots-forecast__last-update">
                                <LastUpdate lastUpdate={props.lastUpdate}></LastUpdate>
                            </div>
                        )}
                    </div>
                )}

                {props.status === 'error' && (
                    <div className="ms-home-favorites-spots-forecast__error ms-centered ms-max-width">
                        <p className="ms-home-favorites-spots-forecast__error-text ms-body-text">
                            {mondoTranslate('home.favourites.error')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default HomeFavoritesForecast;
