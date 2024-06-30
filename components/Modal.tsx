'use client';

import Icon from 'mondosurf-library/components/Icon';
import { objectIsEmpty } from 'mondosurf-library/helpers/object.helpers';
import useKeypress from 'mondosurf-library/hooks/useKeypress';
import { IModal } from 'mondosurf-library/model/iModal';
import { setModalDisplayed, setModalHidden } from 'mondosurf-library/redux/modalSlice';
import modalService from 'mondosurf-library/services/modalService';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// Note 27 April 2022: from bottom Modal disabled because of issues with VH in Safari browser.

const Modal: React.FC = <T,>() => {
    const [modalData, setModalData] = useState<IModal<T>>({}); // Object storing the modal data. Contents are used to fill the modal.
    const [modalVisible, setModalVisible] = useState<boolean>(false); // Boolean to determine if the modal is visible.
    // const modalContent = useRef<HTMLDivElement | null>(null); // Ref to ".ms-modal__content"
    // const [modalContentHeight, setModalContentHeight] = useState<number | undefined>(0); // The height of the modal content. 0 if empty.
    // let timeout = useRef<ReturnType<typeof setInterval> | null>(null); // Timer to empty the modal content.
    // const [fadingOut, setFadingOut] = useState<boolean>(false); // Boolean to determine if the modal is fading out, used only by CSS.
    // const modalIsFromBottom = useRef<boolean>(false); // Use Ref to persist re-rendering.

    // Redux.
    const dispatch = useDispatch();

    useEffect(() => {
        modalService.on(
            'openModal',
            ({
                title,
                text,
                closeButtonText,
                component,
                componentProps,
                buttonText,
                buttonFunction,
                classes,
                mobileFromBottom,
                dataTest
            }: IModal<T>) => {
                // Populates "modalData" with the contents of the modal.
                setModalData({
                    title,
                    text,
                    closeButtonText,
                    component,
                    componentProps,
                    buttonText,
                    buttonFunction,
                    classes,
                    mobileFromBottom,
                    dataTest
                });
            }
        );

        modalService.on('closeModal', () => {
            onCloseModal();
        });

        modalService.on('updateTitle', ({ title }: IModal<T>) => {
            // Updates the title.
            setModalData((data) => ({ ...data, title }));
        });

        modalService.on('updateClasses', ({ classes }: IModal<T>) => {
            // Updates the title.
            setModalData((data) => ({ ...data, classes }));
        });
    }, []);

    useEffect(() => {
        // If the object is not empty, then the modal is displayed.
        if (!objectIsEmpty(modalData)) {
            // modalIsFromBottom.current = modalData.mobileFromBottom ? true : false;
            // if (timeout.current) clearTimeout(timeout.current); // Interrupts the timeout if it was closing a previous modal.
            // setFadingOut(false);
            // ! The modal content height is updated after 100 ms, hope it's enough!
            // setTimeout(() => setModalContentHeight(modalContent.current?.clientHeight), 100);
            setModalVisible(true);
            dispatch(setModalDisplayed()); // To redux state:
            // Scroll modal content back to top.
            document.getElementsByClassName('ms-modal__content')[0].scrollTo({
                top: 0
            });
        }
    }, [modalData]);

    /**
     * Function that handles the closing of the modal.
     * First the height is set to 0, to start the animation.
     * Then the modal is hidden after 600ms.
     */
    const onCloseModal = (): void => {
        emptyModalContent();
        /*
        setModalContentHeight(0);
        setFadingOut(true);
        if (screenWiderThan(CSS_VARIABLES.cssDesktopBreakpoint) || !modalIsFromBottom.current) {
            // Desktop and not-from-bottom: removal is immediate.
            emptyModalContent();
        } else {
            // Mobile!
            timeout.current = setTimeout(() => {
                emptyModalContent();
            }, 500); // The value must be equal to the css transition.
        }
        */
    };

    /**
     * Empties the content of the modal.
     */
    const emptyModalContent = (): void => {
        setModalVisible(false);
        setModalData({}); // When it is called, it sets the modal to an empty object.
        dispatch(setModalHidden()); // To redux state.
        // Scroll modal content back to top.
        document.getElementsByClassName('ms-modal__content')[0].scrollTo({
            top: 0
        });
    };

    /**
     * Catches the EXC keyword press.
     */
    useKeypress('Escape', () => {
        if (!objectIsEmpty(modalData)) {
            onCloseModal();
        }
    });

    /**
     * Determines the top position of the modal window.
     * The result is used in inline style of .ms-modal__window.
     */
    /*
    const returnModalTopPosition = (): string => {
        if (!modalVisible) return '101vh'; // Reset the top:auto on modal close.
        if (!modalIsFromBottom.current) return '0'; // Sets the top to 0 for the classic fullscreen modal.
        let top = '101vh';
        if (modalVisible && modalContentHeight && modalContentHeight > 0) {
            top = window.innerHeight - modalContentHeight + 'px';
            // top = 'calc(100vh - ' + modalContentHeight + 'px)';
        } else if (modalVisible && (!modalContentHeight || modalContentHeight === 0)) {
            top = '101vh';
        }
        return top;
    };
    */

    return (
        <div
            className={`ms-modal ${modalData.classes || undefined} ${modalVisible ? 'is-visible' : ''}`}
            id="ms_modal_forecast_settings"
            {...(modalData.dataTest && { 'data-test': modalData.dataTest })}>
            <div className="ms-modal__overlay" onClick={onCloseModal}></div>
            <div className="ms-modal__window">
                <div className="ms-modal__close" onClick={onCloseModal} data-test="modal-close">
                    <Icon icon="times" />
                </div>
                <div className="ms-modal__content">
                    <div className="ms-modal__content-scroll">
                        {/* Title */}
                        {modalData.title && (
                            <div className="ms-modal__header">
                                <h3 className="ms-modal__header-title ms-h2-title">{modalData.title}</h3>
                            </div>
                        )}

                        {/* Text, component */}
                        <div className="ms-modal__body">
                            {modalData.text && (
                                <section className="ms-modal__text ms-body-text">{modalData.text}</section>
                            )}
                            {modalData.component && !objectIsEmpty(modalData) && (
                                <section className="ms-modal__component">
                                    <modalData.component {...modalData.componentProps} />
                                </section>
                            )}
                        </div>

                        {/* Buttons */}
                        {(modalData.closeButtonText || modalData.buttonText) && (
                            <div className="ms-modal__footer">
                                {modalData.buttonText && modalData.buttonFunction && (
                                    <button
                                        className="ms-btn ms-btn-cta"
                                        onClick={() => modalData.buttonFunction!()}
                                        data-test="modal-button">
                                        {modalData.buttonText}
                                    </button>
                                )}
                                {modalData.closeButtonText && (
                                    <button className="ms-btn" onClick={onCloseModal} data-test="modal-close-button">
                                        {modalData.closeButtonText}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Modal;
