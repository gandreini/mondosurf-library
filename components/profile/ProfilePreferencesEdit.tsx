// Client
'use client';

import { mondoTranslate } from 'proxies/mondoTranslate';
import { useForm } from 'react-hook-form';
import Button from 'mondosurf-library/components/Button';
import Loader from 'mondosurf-library/components/Loader';
import { useEffect, useState } from 'react';
import { postApiAuthCall } from 'mondosurf-library/api/api';
import { useSelector } from 'react-redux';
import { RootState, store } from 'mondosurf-library/redux/store';
import toastService from 'mondosurf-library/services/toastService';
import { setPreferences } from 'mondosurf-library/redux/userSlice';

interface IProfilePreferencesEdit {
    preferences: {
        userBulletinFrequency: 'daily' | 'weekly' | 'never';
        userBulletinWeekDay: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    };
}

const ProfilePreferencesEdit: React.FC<IProfilePreferencesEdit> = (props) => {
    // React hook form stuff.
    const {
        register,
        handleSubmit,
        clearErrors,
        setError,
        setFocus,
        getValues,
        setValue,
        trigger,
        formState: { errors }
    } = useForm({ reValidateMode: 'onSubmit' });

    // Redux.
    const userName = useSelector((state: RootState) => state.user.userName);
    const accessToken = useSelector((state: RootState) => state.user.accessToken);

    const [savingPreferences, setSavingPreferences] = useState<boolean>(false);
    const [frequencyIsWeekly, setFrequencyIsWeekly] = useState<boolean>(false);

    // Set defaults
    useEffect(() => {
        setValue('preferencesBulletinFrequency', props.preferences.userBulletinFrequency);
        setValue('preferencesBulletinWeekDay', props.preferences.userBulletinWeekDay);
        if (props.preferences.userBulletinFrequency === 'weekly') setFrequencyIsWeekly(true);
    }, []);

    // Save preferences
    const onSaveProfilePreferences = () => {
        setSavingPreferences(true);
        const bulletinFrequency: string = getValues('preferencesBulletinFrequency');
        const bulletinWeekDay: string = getValues('preferencesBulletinWeekDay');

        postApiAuthCall(
            'user-preferences-update',
            accessToken,
            {
                bulletin_frequency: bulletinFrequency,
                bulletin_week_day: bulletinWeekDay
            },
            true
        )
            .then((response: any) => {
                store.dispatch(
                    setPreferences({
                        userBulletinFrequency: bulletinFrequency,
                        userBulletinWeekDay: bulletinWeekDay
                    })
                ); // To redux state
                setSavingPreferences(false);
                toastService.success('Preferences updated correctly');
            })
            .catch((error) => {
                setSavingPreferences(false);
                toastService.error('Error saving your preferences, please try again');
            });
    };

    return (
        <div className="ms-profile-preferences-edit">
            <h3 className="ms-profile-preferences-edit__title ms-body-text">
                {mondoTranslate('profile.preferences_edit_text')}
            </h3>
            <form className="ms-form" onSubmit={handleSubmit(onSaveProfilePreferences)}>
                {errors.profileForm && errors.profileForm.message && errors.profileForm.type === 'wrongProfileForm' && (
                    <p>{errors.profileForm.message.toString()}</p>
                )}
                <div className="ms-profile-preferences-edit__contents">
                    <div className="ms-form__input">
                        <label className="ms-form__label" htmlFor="preferences_bulletin_frequency">
                            {mondoTranslate('profile.bulletin_frequency_label')}
                        </label>
                        <select
                            {...register('preferencesBulletinFrequency')}
                            onChange={(e) => {
                                setFrequencyIsWeekly(e.target.value === 'weekly' ? true : false);
                            }}>
                            <option value="daily">{mondoTranslate('profile.bulletin_frequency_daily')}</option>
                            <option value="weekly">{mondoTranslate('profile.bulletin_frequency_weekly')}</option>
                            <option value="never">{mondoTranslate('profile.bulletin_frequency_never')}</option>
                        </select>
                        <p className="ms-small-text">{mondoTranslate('profile.bulletin_frequency_description')}</p>
                    </div>
                    {frequencyIsWeekly && (
                        <div className="ms-form__input">
                            <label className="ms-form__label" htmlFor="preferences_bulletin_week_day">
                                {mondoTranslate('profile.bulletin_week_day_label')}
                            </label>
                            <select {...register('preferencesBulletinWeekDay')}>
                                <option value="monday">{mondoTranslate('profile.bulletin_week_day_monday')}</option>
                                <option value="tuesday">{mondoTranslate('profile.bulletin_week_day_tuesday')}</option>
                                <option value="wednesday">
                                    {mondoTranslate('profile.bulletin_week_day_wednesday')}
                                </option>
                                <option value="thursday">{mondoTranslate('profile.bulletin_week_day_thursday')}</option>
                                <option value="friday">{mondoTranslate('profile.bulletin_week_day_friday')}</option>
                                <option value="saturday">{mondoTranslate('profile.bulletin_week_day_saturday')}</option>
                                <option value="sunday">{mondoTranslate('profile.bulletin_week_day_sunday')}</option>
                            </select>
                        </div>
                    )}
                </div>
                <div className="ms-profile-preferences-edit__buttons">
                    <button type="submit" className="ms-btn ms-btn-cta ms-btn-l">
                        {savingPreferences && <Loader size="small" />}
                        {!savingPreferences && <>{mondoTranslate('profile.save_preferences')}</>}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default ProfilePreferencesEdit;
