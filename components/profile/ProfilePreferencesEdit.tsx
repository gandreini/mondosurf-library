// Client
'use client';

import { postApiAuthCall } from 'mondosurf-library/api/api';
import Loader from 'mondosurf-library/components/Loader';
import NotificationPreferencesFields, {
    NotificationPreferencesValues
} from 'mondosurf-library/components/NotificationPreferencesFields';
import { RootState, store } from 'mondosurf-library/redux/store';
import { setPreferences } from 'mondosurf-library/redux/userSlice';
import toastService from 'mondosurf-library/services/toastService';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

interface IProfilePreferencesEdit {
    preferences: {
        userBulletinFrequency: 'daily' | 'weekly' | 'never';
        userBulletinWeekDay: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
        userPrefsHeight: 'meters' | 'feet';
        userPrefsSpeed: 'kph' | 'mph' | 'kn';
        userPrefsTemperature: 'c' | 'f';
        notifyCommentReplyEmail: boolean;
        notifyCommentLikeEmail: boolean;
        notifyFavoriteSpotCommentEmail: boolean;
    };
}

const ProfilePreferencesEdit: React.FC<IProfilePreferencesEdit> = (props) => {
    const {
        register,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors }
    } = useForm({ reValidateMode: 'onSubmit' });

    const accessToken = useSelector((state: RootState) => state.user.accessToken);

    const [savingPreferences, setSavingPreferences] = useState<boolean>(false);

    // The bulletin + comment-notification fields are shared with the no-login
    // preferences page via NotificationPreferencesFields, which is fully
    // controlled — so they live in state here (units stay on react-hook-form).
    const [notifValues, setNotifValues] = useState<NotificationPreferencesValues>({
        bulletin_frequency: props.preferences.userBulletinFrequency,
        bulletin_week_day: props.preferences.userBulletinWeekDay,
        notify_comment_reply_email: props.preferences.notifyCommentReplyEmail,
        notify_comment_like_email: props.preferences.notifyCommentLikeEmail,
        notify_favorite_spot_comment_email: props.preferences.notifyFavoriteSpotCommentEmail
    });
    const updateNotif = <K extends keyof NotificationPreferencesValues>(
        key: K,
        value: NotificationPreferencesValues[K]
    ) => setNotifValues((prev) => ({ ...prev, [key]: value }));

    // Seed the unit selects once on mount (the notification fields are
    // controlled via state).
    useEffect(() => {
        setValue('preferencesHeight', props.preferences.userPrefsHeight);
        setValue('preferencesSpeed', props.preferences.userPrefsSpeed);
        setValue('preferencesTemperature', props.preferences.userPrefsTemperature);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Save preferences
    const onSaveProfilePreferences = () => {
        setSavingPreferences(true);
        const height: string = getValues('preferencesHeight');
        const speed: string = getValues('preferencesSpeed');
        const temperature: string = getValues('preferencesTemperature');

        postApiAuthCall(
            'user-preferences-update',
            accessToken,
            {
                bulletin_frequency: notifValues.bulletin_frequency,
                bulletin_week_day: notifValues.bulletin_week_day,
                prefs_height: height,
                prefs_speed: speed,
                prefs_temperature: temperature,
                notify_comment_reply_email: notifValues.notify_comment_reply_email,
                notify_comment_like_email: notifValues.notify_comment_like_email,
                notify_favorite_spot_comment_email: notifValues.notify_favorite_spot_comment_email
            },
            true
        )
            .then(() => {
                store.dispatch(
                    setPreferences({
                        userBulletinFrequency: notifValues.bulletin_frequency,
                        userBulletinWeekDay: notifValues.bulletin_week_day,
                        userPrefsHeight: height,
                        userPrefsSpeed: speed,
                        userPrefsTemperature: temperature,
                        notifyCommentReplyEmail: notifValues.notify_comment_reply_email,
                        notifyCommentLikeEmail: notifValues.notify_comment_like_email,
                        notifyFavoriteSpotCommentEmail: notifValues.notify_favorite_spot_comment_email
                    })
                );
                setSavingPreferences(false);
                toastService.success('Preferences updated correctly');
            })
            .catch(() => {
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
                    <NotificationPreferencesFields values={notifValues} onChange={updateNotif} disabled={savingPreferences} />

                    <hr className="ms-profile-preferences-edit__separator" />

                    <h2 className="ms-profile-preferences-edit__section-title ms-h2-title">
                        {mondoTranslate('profile.units')}
                    </h2>
                    <div className="ms-form__input">
                        <label className="ms-form__label" htmlFor="preferences_height">
                            {mondoTranslate('profile.height_unit_label')}
                        </label>
                        <select {...register('preferencesHeight')}>
                            <option value="meters">{mondoTranslate('profile.height_unit_meters')}</option>
                            <option value="feet">{mondoTranslate('profile.height_unit_feet')}</option>
                        </select>
                    </div>
                    <div className="ms-form__input">
                        <label className="ms-form__label" htmlFor="preferences_speed">
                            {mondoTranslate('profile.speed_unit_label')}
                        </label>
                        <select {...register('preferencesSpeed')}>
                            <option value="kph">{mondoTranslate('profile.speed_unit_kph')}</option>
                            <option value="mph">{mondoTranslate('profile.speed_unit_mph')}</option>
                            <option value="kn">{mondoTranslate('profile.speed_unit_kn')}</option>
                        </select>
                    </div>
                    <div className="ms-form__input">
                        <label className="ms-form__label" htmlFor="preferences_temperature">
                            {mondoTranslate('profile.temperature_unit_label')}
                        </label>
                        <select {...register('preferencesTemperature')}>
                            <option value="c">{mondoTranslate('profile.temperature_unit_celsius')}</option>
                            <option value="f">{mondoTranslate('profile.temperature_unit_fahrenheit')}</option>
                        </select>
                    </div>
                </div>
                <div className="ms-profile-preferences-edit__buttons">
                    <button type="submit" className="ms-btn ms-btn-cta ms-btn-l" disabled={savingPreferences}>
                        {savingPreferences && <Loader size="small" />}
                        {!savingPreferences && <>{mondoTranslate('profile.save_preferences')}</>}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default ProfilePreferencesEdit;
