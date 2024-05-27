// Client and server

interface IBreadcrumbCurrent {
    label: string;
    contentPosition: string;
    href: string;
}

const BreadcrumbCurrent: React.FC<IBreadcrumbCurrent> = (props) => {
    return (
        <li
            className="ms-breadcrumbs__list-item is-active"
            itemScope
            itemProp="itemListElement"
            itemType="https://schema.org/ListItem">
            <a itemProp="item" className="ms-breadcrumbs__list-link" href="">
                <span itemProp="name">{props.label}</span>
            </a>
            <meta itemProp="position" content={props.contentPosition}></meta>
        </li>
    );
};
export default BreadcrumbCurrent;
