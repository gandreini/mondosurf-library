import { ComponentType } from "react";

export interface IModal<T> {
    show?: boolean;
    title?: string,
    text?: string,
    closeButtonText?: string,
    component?: React.FC<any> | ComponentType,
    componentProps?: T,
    buttonText?: string,
    buttonFunction?: Function,
    classes?: string,
    mobileFromBottom?: boolean
    dataTest?: string;
}