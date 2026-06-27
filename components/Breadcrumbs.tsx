// Client and server

interface IBreadcrumbs {
    loading?: boolean;
    children: React.ReactNode;
}

// Component.
const Breadcrumbs: React.FC<IBreadcrumbs> = (props) => {
    return (
        <nav className={props.loading ? 'ms-breadcrumbs is-loading' : 'ms-breadcrumbs'}>
            <ol className="ms-breadcrumbs__list" itemScope itemType="https://schema.org/BreadcrumbList">
                {props.children}
            </ol>
        </nav>
    );
};
export default Breadcrumbs;
