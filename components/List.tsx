'use client';

import { mondoTranslate } from 'proxies/mondoTranslate';
import { ReactNode, useState } from 'react';

interface IList {
    pageSize?: number;
    wrapperClasses?: string;
    dataTest?: string;
    buttonLabel?: string;
    components: ReactNode[]; // List of components to show
    // renderComponent: (item: T, key: number) => React.ReactNode; // A function is passed that will render each item in the 'items' array.
}

// It is not possible to pass <T>, it will generate some JSX errors
// Alternatives are <T extends unknown> or <T extends {}>
const List = (props: IList) => {
    const totalItems = props.components.length;
    const [displayedItems, setDisplayedItems] = useState<number>(props.pageSize ? props.pageSize : totalItems);
    const label = props.buttonLabel ? props.buttonLabel : mondoTranslate('basics.load_more');

    function onShowMore(): void {
        if (props.pageSize && totalItems > displayedItems) {
            setDisplayedItems((prevValue: number) => {
                return prevValue + props.pageSize!;
            });
        }
    }

    // Looping the array, and render each item using the props function.
    return (
        <>
            {!props.wrapperClasses &&
                props.components.slice(0, displayedItems).map((component, index) => <>{component}</>)}

            {props.wrapperClasses && (
                <div className={props.wrapperClasses} {...(props.dataTest && { 'data-test': props.dataTest })}>
                    {props.components.slice(0, displayedItems).map((component, index) => (
                        <>{component}</>
                    ))}
                </div>
            )}

            {props.pageSize && totalItems > displayedItems && (
                <button
                    className="ms-list__load-more-btn ms-btn ms-btn-light ms-btn-full"
                    data-test="list-show-more-button"
                    onClick={onShowMore}>
                    {label}
                </button>
            )}
        </>
    );
};
export default List;

/* Usage example:

<List
    components={props.spots.map((item: ISurfSpotPreview, index: number) => (
        <SurfSpotPreview
            key={item.id}
            {...item}
            context="region"
            showDirection={true}
            showMetadata={true}
        />
    ))}
    pageSize={4}
    wrapperClasses="ms-home__good-days ms-grid-1-2 ms-grid-v-2"
    dataTest="home-banners-calendar-banner"
    buttonLabel="More Spots";
/>

*/
