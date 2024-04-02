import Repeater from 'mondosurf-library/components/Repeater';
import MondoLink from 'proxies/MondoLink';

interface ITabs {
    links: {
        url: string;
        label: string;
        disabled?: boolean;
        dataTest?: string;
    }[];
    selectedTab?: 1 | 2 | 3 | 4 | 5;
    loading?: boolean;
}

const Tabs: React.FC<ITabs> = (props: ITabs) => {
    const classes = (key: number) => {
        let returnClasses = ' ms-tabs__link ';
        if (props.selectedTab === key + 1) returnClasses += ' is-active ';
        return returnClasses;
    };

    return (
        <div className={`ms-tabs ms-horizontal-scroll ${props.loading ? ' is-loading ' : ''}`}>
            <div className="ms-tabs__items">
                {/* Loaded */}
                {!props.loading &&
                    props.links &&
                    props.links
                        .filter((value) => value.url) // Only if the url is not empty.
                        .map((value, key) => {
                            return (
                                <div className="ms-tabs__item" key={key}>
                                    {/* Active link */}
                                    {!value.disabled && (
                                        <MondoLink
                                            customKey={key.toString()}
                                            className={classes(key)}
                                            {...(value.dataTest && {
                                                'data-test': value.dataTest
                                            })}
                                            href={value.url}>
                                            {value.label}
                                        </MondoLink>
                                    )}

                                    {/* Disabled link */}
                                    {value.disabled && <div className="ms-tabs__link is-disabled">{value.label}</div>}
                                </div>
                            );
                        })}

                {/* Loading */}
                {props.loading && (
                    <Repeater repetitions={3}>
                        <div className="ms-tabs__item">
                            <div className="ms-tabs__link"></div>
                        </div>
                    </Repeater>
                )}
            </div>
        </div>
    );
};
export default Tabs;
