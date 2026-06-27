import { IModal } from 'mondosurf-library/model/iModal';

const modalService = {
    // we use the ModalService on() function in order to listen for ‘open’ events.
    on(event: any, callback: Function) {
        document.addEventListener(event, (e) => callback(e.detail), { passive: true });
    },
    // Whenever it hears an ‘open’ event, it is sent two values: a component and props.
    openModal<T>(props: IModal<T>) {
        document.dispatchEvent(
            new CustomEvent('openModal',
                {
                    detail:
                    {
                        title: props.title,
                        text: props.text,
                        component: props.component,
                        componentProps: props.componentProps,
                        buttonText: props.buttonText,
                        buttonFunction: props.buttonFunction,
                        closeButtonText: props.closeButtonText,
                        classes: props.classes,
                        mobileFromBottom: props.mobileFromBottom,
                        dataTest: props.dataTest,
                    }
                })
        );
    },
    closeModal() {
        document.dispatchEvent(
            new CustomEvent('closeModal')
        );
    },
    updateTitle<T>(props: IModal<T>) {
        document.dispatchEvent(
            new CustomEvent('updateTitle',
                {
                    detail:
                    {
                        title: props.title
                    }
                })
        );
    },
    updateClasses<T>(props: IModal<T>) {
        document.dispatchEvent(
            new CustomEvent('updateClasses',
                {
                    detail:
                    {
                        classes: props.classes
                    }
                })
        );
    }
};

export default modalService;