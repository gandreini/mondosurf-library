// Client and server

import MondoLink from 'proxies/MondoLink';

interface IBreadcrumb {
    label: string;
    url: string;
    contentPosition: string;
}

const Breadcrumb: React.FC<IBreadcrumb> = (props) => {
    return (
        <li
            className="ms-breadcrumbs__list-item "
            itemScope
            itemProp="itemListElement"
            itemType="https://schema.org/ListItem">
            <MondoLink itemProp="item" className="ms-breadcrumbs__list-link" href={props.url}>
                <span itemProp="name">{props.label}</span>
            </MondoLink>
            <meta itemProp="position" content={props.contentPosition}></meta>
        </li>
    );
};
export default Breadcrumb;
