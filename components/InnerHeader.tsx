import Button from 'mondosurf-library/components/Button';
import Metadata from 'mondosurf-library/components/Metadata';
import PageTitle from 'mondosurf-library/components/PageTitle';
import { IIcon } from 'mondosurf-library/model/iIcon';

interface IInnerHeader {
    title: string;
    flag?: string;
    backLink: string;
    backLinkTitle: string;
    buttonUrl?: string;
    buttonText?: string;
    buttonIcon?: IIcon['icon'] | undefined;
    buttonTest?: string;
    metadata?: { label: string; value: string }[];
    children: React.ReactNode;
}

const InnerHeader: React.FC<IInnerHeader> = (props) => {
    return (
        <div className="ms-inner-header">
            {/* Breadcrumbs */}
            {props.children && <div className="ms-inner-header__breadcrumbs ms-side-spacing">{props.children}</div>}

            {/* Page title */}
            <div className="ms-inner-header__title-buttons">
                <PageTitle
                    title={props.title}
                    flag={props.flag ?? undefined}
                    backlink={props.backLink}
                    backlinkTitle={props.backLinkTitle}
                />
                {props.buttonText && props.buttonUrl && (
                    <Button
                        label={props.buttonText}
                        url={props.buttonUrl}
                        size="s"
                        icon={props.buttonIcon ?? undefined}
                        dataTest={props.buttonTest ?? undefined}
                    />
                )}
            </div>

            {/* Metadata */}
            {props.metadata && props.metadata.length > 0 && (
                <div className="ms-inner-header__metadata">
                    {props.metadata.map((item) => (
                        <Metadata label={item.label} value={item.value} inline={true} />
                    ))}
                </div>
            )}
        </div>
    );
};
export default InnerHeader;
