import { TOAST_DURATION } from 'mondosurf-library/constants/constants';
import { Toaster } from 'react-hot-toast';

interface IToast {
    toasterPosition?: 'top-center' | 'bottom-left';
}

const Toast: React.FC<IToast> = (props: IToast) => {
    /**
     * Returns the top position of the Toast.
     */
    const modalTopPosition = () => {
        // Retrieves the CSS property "--ios-status-bar-margin".
        const msWrapperElement = document.querySelector('.ms-wrapper');
        const msWrapperStyle = msWrapperElement ? getComputedStyle(msWrapperElement) : null;
        const cssIOSStatusBarMargin = msWrapperStyle
            ? msWrapperStyle.getPropertyValue('--ios-status-bar-margin').trim()
            : '0px';

        if (cssIOSStatusBarMargin === '0' || cssIOSStatusBarMargin === '0px') {
            return 20; // Hot Toast default.
        } else {
            return cssIOSStatusBarMargin;
        }
    };

    return (
        <Toaster
            position={props.toasterPosition}
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{
                top: modalTopPosition()
            }}
            toastOptions={{
                // Define default options
                className: '',
                duration: TOAST_DURATION,
                style: {
                    background: '#363636',
                    color: '#fff'
                },
                // Default options for specific types
                success: {
                    duration: TOAST_DURATION
                    /* theme: {
                        primary: 'green',
                        secondary: 'black'
                    } */
                }
            }}
        />
    );
};
export default Toast;
