// Client and server

import MondoLink from 'proxies/MondoLink';
import { mondoTranslate } from 'proxies/mondoTranslate';

const BreadcrumbHome: React.FC = () => {
    return (
        <li className="ms-breadcrumbs__list-item ">
            <MondoLink className="ms-breadcrumbs__list-link" href="/">
                <span>{mondoTranslate('basics.home')}</span>
            </MondoLink>
        </li>
    );
};
export default BreadcrumbHome;
