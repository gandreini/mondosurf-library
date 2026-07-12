'use client';

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

interface IToggleSwitch extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
    id: string;
    label: ReactNode;
    description?: ReactNode;
    dataTest?: string;
}

/**
 * iOS-style toggle switch — label on the left, switch on the right.
 *
 * The backing element is a real <input type="checkbox">. Extra props
 * (e.g. the spread from react-hook-form's `register('field')`, or
 * `defaultChecked`, `checked`, `onChange`) are forwarded onto the input,
 * and the component is a forwardRef so `register`'s ref reaches the
 * input — required for the form to read the toggle's value.
 *
 * Use this for binary on/off settings where the label is the primary
 * content of the row. For terms-acceptance and similar inline forms
 * with no visual prominence, prefer the smaller `.ms-checkbox` component.
 */
const ToggleSwitch = forwardRef<HTMLInputElement, IToggleSwitch>(function ToggleSwitch(
    { id, label, description, dataTest, disabled, ...inputProps },
    ref
) {
    return (
        <label className={'ms-toggle-switch' + (disabled ? ' is-disabled' : '')} htmlFor={id}>
            <span className="ms-toggle-switch__text">
                <span className="ms-toggle-switch__label">{label}</span>
                {description && <span className="ms-toggle-switch__description ms-small-text">{description}</span>}
            </span>
            <span className="ms-toggle-switch__control">
                <input
                    {...inputProps}
                    ref={ref}
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
});
export default ToggleSwitch;
