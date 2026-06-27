// Client and server

import MondoLink from 'proxies/MondoLink';
import { mondoTranslate } from 'proxies/mondoTranslate';

const BreadcrumbHome: React.FC = () => {
    return (
        <li
            className="ms-breadcrumbs__list-item "
            itemScope
            itemProp="itemListElement"
            itemType="https://schema.org/ListItem">
            <MondoLink itemProp="item" className="ms-breadcrumbs__list-link" href="/">
                <span itemProp="name">{mondoTranslate('basics.home')}</span>
            </MondoLink>
            <meta itemProp="position" content="1"></meta>
        </li>
    );
};
export default BreadcrumbHome;
