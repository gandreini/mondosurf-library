import Button from 'mondosurf-library/components/Button';
import { mondoTranslate } from 'proxies/mondoTranslate';

interface IAppUpdateToastContent {
    type: 'web' | 'android' | 'ios';
}

const AppUpdateToastContent: React.FC<IAppUpdateToastContent> = (props: IAppUpdateToastContent) => {
    return (
        <div className="ms-app-update-toast-content">
            {/* Web */}
            {props.type === 'web' && (
                <p className="ms-small-text">{mondoTranslate('mondosurf:toast.app_latest_version_check.web')}</p>
            )}

            {/* Android */}
            {props.type === 'android' && (
                <>
                    <p className="ms-small-text">
                        {mondoTranslate('mondosurf:toast.app_latest_version_check.android')}
                    </p>
                    <Button
                        label={'Update App'}
                        url={process.env.REACT_APP_ANDROID_STORE_URL}
                        style="normal"
                        size="m"
                        targetBlank={true}
                    />
                </>
            )}

            {/* iOS */}
            {props.type === 'ios' && (
                <>
                    <p className="ms-small-text">{mondoTranslate('mondosurf:toast.app_latest_version_check.ios')}</p>
                    <Button
                        label={'Update App'}
                        url={process.env.REACT_APP_IOS_STORE_URL}
                        style="normal"
                        size="m"
                        targetBlank={true}
                    />
                </>
            )}
        </div>
    );
};
export default AppUpdateToastContent;
