import Icon from 'mondosurf-library/components/Icon';
import MondoLink from 'proxies/MondoLink';

interface IPageTitle {
    title: string;
    flag?: string;
    backlink?: string;
}

const PageTitle: React.FC<IPageTitle> = (props) => {
    return (
        <div className="ms-page-title">
            {props.backlink && (
                <MondoLink className="ms-page-title__icon-wrapper" href={props.backlink}>
                    <Icon icon="arrow-left" />
                </MondoLink>
            )}
            <div className="ms-page-title__flag-title-wrapper">
                {props.flag && <span className="ms-page-title__flag">{props.flag}</span>}
                <h1 className="ms-page-title__title">{props.title}</h1>
            </div>
        </div>
    );
};
export default PageTitle;
