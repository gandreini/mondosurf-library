export interface IModal<T> {
    show?: boolean;
    title?: string,
    text?: string,
    closeButtonText?: string,
    component?: React.FC<any>,
    componentProps?: T,
    buttonText?: string,
    buttonFunction?: Function,
    classes?: string,
    mobileFromBottom?: boolean
    dataTest?: string;
}