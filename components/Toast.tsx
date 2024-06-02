'use client';

import { isAppiOs } from 'helpers/device.helpers';
import { TOAST_DURATION } from 'mondosurf-library/constants/constants';
import { screenWiderThan } from 'mondosurf-library/helpers/device.helpers';
import { Toaster } from 'react-hot-toast';

const Toast: React.FC = () => {
    // Sets the position of the toast for larger screens
    const toastPosition = typeof window !== 'undefined' && screenWiderThan(600) ? 'bottom-left' : 'top-center';

    // Returns the top position of the Toast
    const modalTopPosition = () => {
        if (typeof window !== 'undefined' && isAppiOs()) {
            // Retrieves the CSS property "--ios-status-bar-margin".
            const msWrapperElement = document.querySelector('.ms-wrapper');
            const msWrapperStyle = msWrapperElement ? getComputedStyle(msWrapperElement) : null;
            const cssIOSStatusBarMargin = msWrapperStyle
                ? msWrapperStyle.getPropertyValue('--ios-status-bar-margin').trim()
                : '0px';

            if (cssIOSStatusBarMargin === '0' || cssIOSStatusBarMargin === '0px') {
                return 20; // Hot Toast default
            } else {
                return cssIOSStatusBarMargin;
            }
        } else {
            return 20; // Hot Toast default
        }
    };

    return (
        <Toaster
            position={toastPosition}
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
