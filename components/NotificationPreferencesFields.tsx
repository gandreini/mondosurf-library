'use client';

import ToggleSwitch from 'mondosurf-library/components/ToggleSwitch';
import { mondoTranslate } from 'proxies/mondoTranslate';

export interface NotificationPreferencesValues {
    bulletin_frequency: string; // 'daily' | 'weekly' | 'never'
    bulletin_week_day: string; // 'monday' … 'sunday'
    notify_comment_reply_email: boolean;
    notify_comment_like_email: boolean;
    notify_favorite_spot_comment_email: boolean;
}

interface INotificationPreferencesFields {
    values: NotificationPreferencesValues;
    onChange: <K extends keyof NotificationPreferencesValues>(key: K, value: NotificationPreferencesValues[K]) => void;
}

const WEEK_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const COMMENT_TOGGLES: { key: keyof NotificationPreferencesValues; dataTest: string }[] = [
    { key: 'notify_comment_reply_email', dataTest: 'pref-notify-reply-email' },
    { key: 'notify_comment_like_email', dataTest: 'pref-notify-like-email' },
    { key: 'notify_favorite_spot_comment_email', dataTest: 'pref-notify-favorite-spot-email' }
];

/**
 * The bulletin + comment-notification fields, shared verbatim by the logged-in
 * profile (ProfilePreferencesEdit) and the no-login tokenized preferences page.
 * Purely presentational and fully controlled — the parent owns the values and
 * the save (JWT there, token here); this component has no auth/context branches.
 */
const NotificationPreferencesFields: React.FC<INotificationPreferencesFields> = ({ values, onChange }) => (
    <>
        <div className="ms-form__input">
            <label className="ms-form__label" htmlFor="notif_bulletin_frequency">
                {mondoTranslate('profile.bulletin_frequency_label')}
            </label>
            <select
                id="notif_bulletin_frequency"
                value={values.bulletin_frequency || 'daily'}
                onChange={(e) => onChange('bulletin_frequency', e.target.value)}
                data-test="pref-bulletin-frequency">
                <option value="daily">{mondoTranslate('profile.bulletin_frequency_daily')}</option>
                <option value="weekly">{mondoTranslate('profile.bulletin_frequency_weekly')}</option>
                <option value="never">{mondoTranslate('profile.bulletin_frequency_never')}</option>
            </select>
            <p className="ms-small-text">{mondoTranslate('profile.bulletin_frequency_description')}</p>
        </div>

        {values.bulletin_frequency === 'weekly' && (
            <div className="ms-form__input">
                <label className="ms-form__label" htmlFor="notif_bulletin_week_day">
                    {mondoTranslate('profile.bulletin_week_day_label')}
                </label>
                <select
                    id="notif_bulletin_week_day"
                    value={values.bulletin_week_day || 'monday'}
                    onChange={(e) => onChange('bulletin_week_day', e.target.value)}
                    data-test="pref-bulletin-week-day">
                    {WEEK_DAYS.map((day) => (
                        <option key={day} value={day}>
                            {mondoTranslate(`profile.bulletin_week_day_${day}`)}
                        </option>
                    ))}
                </select>
            </div>
        )}

        {COMMENT_TOGGLES.map(({ key, dataTest }) => (
            <ToggleSwitch
                key={key}
                id={key}
                label={mondoTranslate(`profile.${key}_label`)}
                description={mondoTranslate(`profile.${key}_description`)}
                dataTest={dataTest}
                checked={!!values[key]}
                onChange={(e) => onChange(key, e.target.checked)}
            />
        ))}
    </>
);

export default NotificationPreferencesFields;
