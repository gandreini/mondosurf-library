// Client
'use client';

import { postApiAuthCall } from 'mondosurf-library/api/api';
import { RootState, store } from 'mondosurf-library/redux/store';
import toastService from 'mondosurf-library/services/toastService';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Loader from '../Loader';

interface ISurfSpotCommentsForm {
    spotId: string;
}

const SurfSpotCommentsForm: React.FC<ISurfSpotCommentsForm> = (props) => {
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
    const accessToken = useSelector((state: RootState) => state.user.accessToken);

    const [savingComment, setSavingComment] = useState<boolean>(false);

    // Save comment
    const onSaveComment = () => {
        console.log('test');
        // Check user login status!

        setSavingComment(true);
        const commentText: string = getValues('commentText');

        postApiAuthCall(
            'comments',
            accessToken,
            {
                comment_text: commentText,
                spot_id: props.spotId
            },
            true
        )
            .then((response: any) => {
                /* store.dispatch(
                    setPreferences({
                        userBulletinFrequency: bulletinFrequency,
                        userBulletinWeekDay: bulletinWeekDay
                    })
                ); */ // To redux state
                setSavingComment(false);
                toastService.success('Preferences updated correctly');
            })
            .catch((error) => {
                setSavingComment(false);
                toastService.error('Error saving your preferences, please try again');
            });
    };

    return (
        <div className="ms-surf-spot-comments-form">
            <form className="ms-form" onSubmit={handleSubmit(onSaveComment)}>
                {/*  {errors.profileForm && errors.profileForm.message && errors.profileForm.type === 'wrongProfileForm' && (
                    <p>{errors.profileForm.message.toString()}</p>
                )} */}
                <div className="ms-surf-spot-comments-form__contents">
                    <div className="ms-form__input">
                        <label className="ms-form__label" htmlFor="commentText">
                            {mondoTranslate('profile.bulletin_frequency_label')}
                        </label>
                        <textarea {...register('commentText')}></textarea>
                        <p className="ms-small-text">{mondoTranslate('profile.bulletin_frequency_description')}</p>
                    </div>
                </div>
                <div className="ms-surf-spot-comments-form__buttons">
                    <button type="submit" className="ms-btn ms-btn-cta ms-btn-l">
                        {savingComment && <Loader size="small" />}
                        {!savingComment && <>{mondoTranslate('profile.add_comment')}</>}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default SurfSpotCommentsForm;
