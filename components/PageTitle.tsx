// Client
'use client';

import Icon from 'mondosurf-library/components/Icon';
import MondoLink from 'proxies/MondoLink';
import { useRouterProxy } from 'proxies/useRouter';

interface IPageTitle {
    title: string;
    flag?: string;
    backlink?: string;
    backlinkTitle?: string;
    loading?: boolean;
}

const PageTitle: React.FC<IPageTitle> = (props) => {
    const router = useRouterProxy();

    // Back arrow: history-back when the user actually navigated here in-app,
    // IA-parent fallback (the href) otherwise. The control stays a real
    // <a href={backlink}> so crawlers, no-JS agents and modifier clicks
    // (cmd/ctrl/shift/middle: new tab etc.) keep today's link behavior.
    const onBackClick = (e: React.MouseEvent<Element>) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (router.canGoBack()) {
            e.preventDefault();
            router.back();
        }
    };

    return (
        <>
            {/* Loading */}
            {props.loading && (
                <div className="ms-page-title is-loading">
                    <div className="ms-page-title__icon-wrapper"></div>
                    <div className="ms-page-title__flag-title-wrapper"></div>
                </div>
            )}

            {/* Loaded */}
            {!props.loading && (
                <div className="ms-page-title">
                    {props.backlink && (
                        <MondoLink
                            className="ms-page-title__icon-wrapper"
                            title={props.backlinkTitle || undefined}
                            href={props.backlink}
                            dataTest="page-title-backlink"
                            onClickCallback={onBackClick}>
                            <Icon icon="arrow-left" />
                        </MondoLink>
                    )}
                    <div className="ms-page-title__flag-title-wrapper">
                        {props.flag && <span className="ms-page-title__flag">{props.flag}</span>}
                        <h1
                            className="ms-page-title__title"
                            data-test="page-title">
                            {props.title}
                        </h1>
                    </div>
                </div>
            )}
        </>
    );
};
export default PageTitle;
