'use client';

import Loader from 'mondosurf-library/components/Loader';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import { postReply } from 'mondosurf-library/helpers/comments.helpers';
import toastService from 'mondosurf-library/services/toastService';
import { Tracker } from 'mondosurf-library/tracker/tracker';
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
    const formRef = useRef<HTMLLIElement | null>(null);

    // Auto-focus the textarea + scroll the form into view on mount. The form
    // sits at the bottom of the reply thread, so on long threads it may be
    // off-screen when the user clicks Reply. preventScroll on focus stops the
    // browser's instant focus-scroll from competing with our smooth scroll.
    useEffect(() => {
        textareaRef.current?.focus({ preventScroll: true });
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    const trimmed = text.trim();
    const canSubmit = trimmed.length > 0 && !submitting;

    const submitReply = () => {
        if (!canSubmit) return;
        setSubmitting(true);
        postReply(props.parentCommentId, props.spotId, trimmed)
            .then(() => {
                // Analytics (Mixpanel): reply recorded server-side.
                Tracker.trackEvent(['mp'], TrackingEvent.CommentReplyAddedApi, {
                    spot_id: props.spotId,
                    parent_comment_id: props.parentCommentId
                });
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitReply();
    };

    // Enter submits the reply; Shift+Enter inserts a newline (chat-style UX).
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitReply();
        }
    };

    return (
        <li ref={formRef} className="ms-comments__comment ms-reply-form">
            <form className="ms-form" onSubmit={handleSubmit}>
                <div className="ms-reply-form__contents">
                    <div className="ms-form__input">
                        <textarea
                            ref={textareaRef}
                            data-test="reply-field"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={mondoTranslate('comments.reply_field_placeholder')}
                        />
                    </div>
                </div>
                <div className="ms-reply-form__buttons">
                    <button
                        className="ms-btn ms-btn-s"
                        type="button"
                        onClick={props.onCancel}
                        disabled={submitting}>
                        {mondoTranslate('basics.cancel')}
                    </button>
                    <button
                        type="submit"
                        className="ms-btn ms-btn-cta ms-btn-s"
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
