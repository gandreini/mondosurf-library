// Client
'use client';

import { postApiAuthCall } from 'mondosurf-library/api/api';
import Loader from 'mondosurf-library/components/Loader';
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
    const [frequencyIsWeekly, setFrequencyIsWeekly] = useState<boolean>(false);

    // Set defaults
    useEffect(() => {
        setValue('preferencesBulletinFrequency', props.preferences.userBulletinFrequency);
        setValue('preferencesBulletinWeekDay', props.preferences.userBulletinWeekDay);
        setValue('preferencesHeight', props.preferences.userPrefsHeight);
        setValue('preferencesSpeed', props.preferences.userPrefsSpeed);
        setValue('preferencesTemperature', props.preferences.userPrefsTemperature);
        setValue('notifyCommentReplyEmail', props.preferences.notifyCommentReplyEmail);
        setValue('notifyCommentLikeEmail', props.preferences.notifyCommentLikeEmail);
        setValue('notifyFavoriteSpotCommentEmail', props.preferences.notifyFavoriteSpotCommentEmail);
        if (props.preferences.userBulletinFrequency === 'weekly') setFrequencyIsWeekly(true);
    }, []);

    // Save preferences
    const onSaveProfilePreferences = () => {
        setSavingPreferences(true);
        const bulletinFrequency: string = getValues('preferencesBulletinFrequency');
        const bulletinWeekDay: string = getValues('preferencesBulletinWeekDay');
        const height: string = getValues('preferencesHeight');
        const speed: string = getValues('preferencesSpeed');
        const temperature: string = getValues('preferencesTemperature');
        const notifyReply: boolean = !!getValues('notifyCommentReplyEmail');
        const notifyLike: boolean = !!getValues('notifyCommentLikeEmail');
        const notifyFavSpot: boolean = !!getValues('notifyFavoriteSpotCommentEmail');

        postApiAuthCall(
            'user-preferences-update',
            accessToken,
            {
                bulletin_frequency: bulletinFrequency,
                bulletin_week_day: bulletinWeekDay,
                prefs_height: height,
                prefs_speed: speed,
                prefs_temperature: temperature,
                notify_comment_reply_email: notifyReply,
                notify_comment_like_email: notifyLike,
                notify_favorite_spot_comment_email: notifyFavSpot
            },
            true
        )
            .then(() => {
                store.dispatch(
                    setPreferences({
                        userBulletinFrequency: bulletinFrequency,
                        userBulletinWeekDay: bulletinWeekDay,
                        userPrefsHeight: height,
                        userPrefsSpeed: speed,
                        userPrefsTemperature: temperature,
                        notifyCommentReplyEmail: notifyReply,
                        notifyCommentLikeEmail: notifyLike,
                        notifyFavoriteSpotCommentEmail: notifyFavSpot
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

                    <hr className="ms-profile-preferences-edit__separator" />

                    <h2 className="ms-profile-preferences-edit__section-title ms-h2-title">
                        {mondoTranslate('profile.notifications_section_title')}
                    </h2>
                    <p className="ms-small-text">
                        {mondoTranslate('profile.notifications_section_description')}
                    </p>

                    <div className="ms-form__input ms-form__input--inline">
                        <label className="ms-form__checkbox-label">
                            <input
                                type="checkbox"
                                {...register('notifyCommentReplyEmail')}
                                data-test="pref-notify-reply-email"
                            />
                            <span>{mondoTranslate('profile.notify_comment_reply_email_label')}</span>
                        </label>
                    </div>
                    <div className="ms-form__input ms-form__input--inline">
                        <label className="ms-form__checkbox-label">
                            <input
                                type="checkbox"
                                {...register('notifyCommentLikeEmail')}
                                data-test="pref-notify-like-email"
                            />
                            <span>{mondoTranslate('profile.notify_comment_like_email_label')}</span>
                        </label>
                    </div>
                    <div className="ms-form__input ms-form__input--inline">
                        <label className="ms-form__checkbox-label">
                            <input
                                type="checkbox"
                                {...register('notifyFavoriteSpotCommentEmail')}
                                data-test="pref-notify-favorite-spot-email"
                            />
                            <span>{mondoTranslate('profile.notify_favorite_spot_comment_email_label')}</span>
                        </label>
                    </div>
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
