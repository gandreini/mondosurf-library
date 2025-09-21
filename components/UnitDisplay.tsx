'use client';

import { useSelector } from 'react-redux';
import { RootState } from 'mondosurf-library/redux/store';
import {
    convertSizeFromMeters,
    convertSpeedFromKph,
    convertTemperatureFromC
} from 'mondosurf-library/helpers/units.helpers';
import {
    returnLengthUnitLabel,
    returnLengthUnitShortLabel,
    returnSpeedUnitLabel,
    returnSpeedUnitShortLabel
} from 'mondosurf-library/helpers/labels.helpers';
import { oneDecimal } from 'mondosurf-library/helpers/various.helpers';

interface IUnitDisplayProps {
    unit: 'height' | 'speed' | 'temperature';
    mode?: 'value' | 'unit' | 'both';
    value?: number;
    shortLabel?: boolean;
    decimals?: number;
}

const UnitDisplay: React.FC<IUnitDisplayProps> = ({ unit, value, mode = 'both', shortLabel = true, decimals = 1 }) => {
    // Force re-render when user preferences change
    const userPreferences = useSelector((state: RootState) => state.user.preferences);
    const userLoggedIn = useSelector((state: RootState) => state.user.logged);
    
    // Wait until user preferences are loaded to prevent flash of wrong units
    // If user is not logged in or still checking, show loading state to avoid flash
    const isPreferencesReady = userLoggedIn === 'yes' || userLoggedIn === 'no';
    
    if (!isPreferencesReady) {
        return null; // Or return a loading placeholder if you prefer
    }

    const getConvertedValue = (): number => {
        if (value === undefined) return 0;

        switch (unit) {
            case 'height':
                return convertSizeFromMeters(value);
            case 'speed':
                return convertSpeedFromKph(value);
            case 'temperature':
                return convertTemperatureFromC(value);
            default:
                return value;
        }
    };

    const getUnitLabel = (): string => {
        switch (unit) {
            case 'height':
                return shortLabel ? returnLengthUnitShortLabel() : returnLengthUnitLabel();
            case 'speed':
                return shortLabel ? returnSpeedUnitShortLabel() : returnSpeedUnitLabel();
            case 'temperature':
                return userPreferences.userPrefsTemperature === 'f' ? '°F' : '°C';
            default:
                return '';
        }
    };

    if (mode === 'unit') {
        return <>{getUnitLabel()}</>;
    }

    if (value === undefined) {
        return null;
    }

    const convertedValue = getConvertedValue();
    const formattedValue = decimals === 0 ? Math.round(convertedValue).toString() : oneDecimal(convertedValue);

    if (mode === 'value') {
        return <>{formattedValue}</>;
    }

    // mode === 'both'
    return (
        <>
            {formattedValue} {getUnitLabel()}
        </>
    );
};

export default UnitDisplay;
