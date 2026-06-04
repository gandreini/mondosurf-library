'use client';

import { InputHTMLAttributes, ReactNode } from 'react';

interface IToggleSwitch extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
    id: string;
    label: ReactNode;
    description?: ReactNode;
    dataTest?: string;
}

/**
 * iOS-style toggle switch — label on the left, switch on the right.
 *
 * The backing element is a real <input type="checkbox">. Any extra props
 * (e.g. the spread from react-hook-form's `register('field')`, or
 * `defaultChecked`, `checked`, `onChange`) are forwarded onto the input.
 *
 * Use this for binary on/off settings where the label is the primary
 * content of the row. For terms-acceptance and similar inline forms
 * with no visual prominence, prefer the smaller `.ms-checkbox` component.
 */
const ToggleSwitch: React.FC<IToggleSwitch> = ({ id, label, description, dataTest, disabled, ...inputProps }) => {
    return (
        <label className={'ms-toggle-switch' + (disabled ? ' is-disabled' : '')} htmlFor={id}>
            <span className="ms-toggle-switch__text">
                <span className="ms-toggle-switch__label">{label}</span>
                {description && <span className="ms-toggle-switch__description ms-small-text">{description}</span>}
            </span>
            <span className="ms-toggle-switch__control">
                <input
                    {...inputProps}
                    id={id}
                    type="checkbox"
                    className="ms-toggle-switch__input"
                    disabled={disabled}
                    data-test={dataTest}
                    role="switch"
                />
                <span className="ms-toggle-switch__track" aria-hidden="true" />
                <span className="ms-toggle-switch__thumb" aria-hidden="true" />
            </span>
        </label>
    );
};
export default ToggleSwitch;
