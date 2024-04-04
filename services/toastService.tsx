import { requestAccountVerificationEmail } from 'features/auth/auth.helpers';
import { TOAST_DURATION } from 'mondosurf-library/constants/constants';
import { mondoTranslate } from 'proxies/mondoTranslate';
import toast from 'react-hot-toast';

const toastService = {
    success(message: string, classes?: string, duration?: number) {
        const msToast = toast.success(message, {
            className: classes ?? '',
            duration: 20000 // Default value, overwritten by duration param
        });
        // SetTimeout needed to fix the issue: https://github.com/timolins/react-hot-toast/issues/128
        setTimeout(function () {
            toast.dismiss(msToast);
        }, duration ?? TOAST_DURATION);
    },
    error(message: string, classes?: string, duration?: number) {
        const msToast = toast.error(message, {
            className: classes ?? '',
            duration: 20000 // Default value, overwritten by duration param
        });
        // SetTimeout needed to fix the issue: https://github.com/timolins/react-hot-toast/issues/128
        setTimeout(function () {
            toast.dismiss(msToast);
        }, duration ?? TOAST_DURATION);
    },
    noIcon(message: string, classes?: string, duration?: number) {
        const msToast = toast(message, {
            className: classes ?? '',
            duration: 20000 // Default value, overwritten by duration param
        });
        // SetTimeout needed to fix the issue: https://github.com/timolins/react-hot-toast/issues/128
        setTimeout(function () {
            toast.dismiss(msToast);
        }, duration ?? TOAST_DURATION); // Uses TOAST_DURATION if duration null or undefined.
    },
    emoji(message: string, emoji: string, classes?: string, duration?: number) {
        const msToast = toast(message, {
            icon: emoji,
            className: classes ?? '',
            duration: 20000 // Default value, overwritten by duration param
        });
        // SetTimeout needed to fix the issue: https://github.com/timolins/react-hot-toast/issues/128
        setTimeout(function () {
            toast.dismiss(msToast);
        }, duration ?? TOAST_DURATION);
    },
    verifyAccountToast() {
        const msToast = toast(
            (t) => (
                <div>
                    <div>
                        {mondoTranslate('mondosurf:toast.auth.verify_account') as string}

                        <div className="ms-toast__buttons">
                            <button
                                className="ms-btn ms-btn-s"
                                onClick={(e) => {
                                    toast.dismiss(t.id);
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}>
                                {mondoTranslate('mondosurf:basics.close') as string}
                            </button>
                            <button
                                className="ms-toast__buttons-text-link"
                                onClick={(e) => {
                                    requestAccountVerificationEmail();
                                    toast.dismiss(t.id);
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}>
                                {mondoTranslate('mondosurf:toast.auth.send_verification_email_button') as string}
                            </button>
                        </div>
                    </div>
                </div>
            ),
            {
                duration: Infinity,
                id: 'verifyAccountToast'
            }
        );
        // SetTimeout needed to fix the issue: https://github.com/timolins/react-hot-toast/issues/128
        setTimeout(function () {
            toast.dismiss(msToast);
        }, 12000);
    },
    customToast() {},
    closeToast() {},
    on(event: any, callback: Function) {
        document.addEventListener(event, (e) => callback(e.detail), { passive: true });
    }
};

export default toastService;
