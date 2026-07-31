// Client and server

import MondoLink from 'proxies/MondoLink';

interface IBreadcrumb {
    label: string;
    url: string;
    contentPosition: string;
}

// Structured data lives in the page-level JSON-LD graph (BreadcrumbList),
// so this component is presentation-only.
const Breadcrumb: React.FC<IBreadcrumb> = (props) => {
    return (
        <li className="ms-breadcrumbs__list-item ">
            <MondoLink className="ms-breadcrumbs__list-link" href={props.url}>
                <span>{props.label}</span>
            </MondoLink>
        </li>
    );
};
export default Breadcrumb;
