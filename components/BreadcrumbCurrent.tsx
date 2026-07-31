// Client and server

interface IBreadcrumbCurrent {
    label: string;
    contentPosition: string;
    href: string;
}

// Current page: non-interactive by design (the old anchor rendered href="" and the
// CSS sets cursor: default on it). Callers still pass href/contentPosition; both are
// intentionally unused so the shared API stays stable for the app.
const BreadcrumbCurrent: React.FC<IBreadcrumbCurrent> = (props) => {
    return (
        <li className="ms-breadcrumbs__list-item is-active">
            <span className="ms-breadcrumbs__list-link">{props.label}</span>
        </li>
    );
};
export default BreadcrumbCurrent;
