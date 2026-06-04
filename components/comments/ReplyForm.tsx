'use client';

import Loader from 'mondosurf-library/components/Loader';
import { postReply } from 'mondosurf-library/helpers/comments.helpers';
import toastService from 'mondosurf-library/services/toastService';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useEffect, useRef, useState } from 'react';

interface IReplyForm {
    parentCommentId: number;
    spotId: number;
    onCancel: () => void;
    onReplyPosted: () => void;
}

const ReplyForm: React.FC<IReplyForm> = (props) => {
    const [text, setText] = useState<string>('');
    const [submitting, setSubmitting] = useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Auto-focus when the form mounts.
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const trimmed = text.trim();
    const canSubmit = trimmed.length > 0 && !submitting;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        setSubmitting(true);
        postReply(props.parentCommentId, props.spotId, trimmed)
            .then(() => {
                setSubmitting(false);
                setText('');
                props.onReplyPosted();
            })
            .catch(() => {
                setSubmitting(false);
                toastService.error(mondoTranslate('comments.toast_comment_error'));
                // Leave text intact so the user can retry.
            });
    };

    return (
        <li className="ms-comments__comment ms-reply-form">
            <form className="ms-form" onSubmit={handleSubmit}>
                <div className="ms-reply-form__contents">
                    <div className="ms-form__input">
                        <textarea
                            ref={textareaRef}
                            data-test="reply-field"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={mondoTranslate('comments.reply_field_placeholder')}
                        />
                    </div>
                </div>
                <div className="ms-reply-form__buttons">
                    <button
                        className="ms-btn ms-btn-m"
                        type="button"
                        onClick={props.onCancel}
                        disabled={submitting}>
                        {mondoTranslate('basics.cancel')}
                    </button>
                    <button
                        type="submit"
                        className="ms-btn ms-btn-cta ms-btn-m"
                        disabled={!canSubmit}
                        data-test="reply-submit">
                        {submitting && <Loader size="small" />}
                        {!submitting && mondoTranslate('comments.send_reply')}
                    </button>
                </div>
            </form>
        </li>
    );
};
export default ReplyForm;
