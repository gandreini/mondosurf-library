// Client
'use client';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { openLoginModal } from 'features/modal/modal.helpers';
import { postApiAuthCall } from 'mondosurf-library/api/api';
import Loader from 'mondosurf-library/components/Loader';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import { RootState } from 'mondosurf-library/redux/store';
import toastService from 'mondosurf-library/services/toastService';
import { Tracker } from 'mondosurf-library/tracker/tracker';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

interface ICommentsForm {
    resourceId: string;
    resourceName: string;
    callback?: () => void;
}

const CommentsForm: React.FC<ICommentsForm> = (props) => {
    // Dayjs plugins
    dayjs.extend(utc);
    dayjs.extend(timezone);

    // React hook form stuff
    const {
        register,
        handleSubmit,
        clearErrors,
        setError,
        setFocus,
        getValues,
        setValue,
        trigger,
        watch,
        formState: { errors }
    } = useForm({ reValidateMode: 'onSubmit' });

    // Redux
    const accessTokenRedux = useSelector((state: RootState) => state.user.accessToken);
    const login = useSelector((state: RootState) => state.user.logged);
    const userNameRedux = useSelector((state: RootState) => state.user.userName);

    const [savingComment, setSavingComment] = useState<boolean>(false);

    const fieldContent = watch('commentText');

    // Set focus on the textarea when the component mounts
    useEffect(() => {
        setFocus('commentText');
    }, [setFocus]);

    // Save comment (checks for login status and shows the modal if needed)
    const onSaveComment = () => {
        const commentText: string = getValues('commentText');

        // Check user login status!
        if (login !== 'yes') {
            openLoginModal(
                'commentForm',
                undefined,
                mondoTranslate('comments.login_modal_text'),
                (accessToken?: string, userName?: string) => {
                    if (accessToken && userName) {
                        actualCommentSaving(accessToken, userName, props.resourceId, commentText);
                    } // The else should be handle here (if the access Token is not available)
                }
            );
        } else {
            actualCommentSaving(accessTokenRedux, userNameRedux, props.resourceId, commentText);
        }
    };

    // The actual comment saving after login
    const actualCommentSaving = (accessToken: string, userName: string, resourceId: string, commentText: string) => {
        setSavingComment(true);
        postApiAuthCall(
            'comments',
            accessToken,
            {
                comment_text: commentText,
                spot_id: resourceId
            },
            true
        )
            .then((response: any) => {
                setSavingComment(false);
                setValue('commentText', '');
                if (props.callback) props.callback();

                // Tracking
                Tracker.trackEvent(['mp', 'ga'], TrackingEvent.CommentAddedApi, {
                    resourceName: props.resourceName,
                    resourceId: resourceId
                });

                toastService.success(mondoTranslate('comments.toast_comment_added'));
            })
            .catch((error) => {
                setSavingComment(false);
                toastService.error(mondoTranslate('comments.toast_comment_error'));
            });
    };

    return (
        <>
            <li className="ms-comments__comment ms-comments-form">
                <form className="ms-form" onSubmit={handleSubmit(onSaveComment)}>
                    {/*  {errors.profileForm && errors.profileForm.message && errors.profileForm.type === 'wrongProfileForm' && (
                    <p>{errors.profileForm.message.toString()}</p>
                )} */}
                    <div className="ms-comments-form__contents">
                        <div className="ms-form__input">
                            {/* <label className="ms-form__label" htmlFor="commentText">
                                {mondoTranslate('comments.comment_field_label')}
                            </label> */}
                            <textarea
                                {...register('commentText')}
                                data-test="comment-field"
                                placeholder={mondoTranslate('comments.comment_field_placeholder', {
                                    resource_name: props.resourceName
                                })}></textarea>
                        </div>
                    </div>
                    <div className="ms-comments-form__buttons">
                        {(!fieldContent || fieldContent.trim() === '') && (
                            <>
                                <button className="ms-btn ms-btn-m" disabled type="button">
                                    {mondoTranslate('basics.cancel')}
                                </button>
                                <button type="submit" disabled className="ms-btn ms-btn-cta ms-btn-m">
                                    {mondoTranslate('comments.add_a_comment')}
                                </button>
                            </>
                        )}
                        {fieldContent && fieldContent.trim() !== '' && (
                            <>
                                <button
                                    className="ms-btn ms-btn-m"
                                    type="button"
                                    onClick={() => {
                                        setValue('commentText', '');
                                    }}>
                                    {mondoTranslate('basics.cancel')}
                                </button>
                                <button type="submit" className="ms-btn ms-btn-cta ms-btn-m" data-test="comment-submit">
                                    {savingComment && <Loader size="small" />}
                                    {!savingComment && <>{mondoTranslate('comments.add_a_comment')}</>}
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </li>
        </>
    );
};
export default CommentsForm;
