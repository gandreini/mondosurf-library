'use client';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { RootState } from 'mondosurf-library/redux/store';
import { useSelector } from 'react-redux';
import Icon from 'mondosurf-library/components/Icon';
import modalService from 'mondosurf-library/services/modalService';
import { deleteApiAuthCall } from 'mondosurf-library/api/api';
import toastService from 'mondosurf-library/services/toastService';
import { truncateTextAfterNCharacters } from 'mondosurf-library/helpers/strings.helpers';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { IComment } from 'mondosurf-library/model/iComment';

const Comment: React.FC<IComment> = (props) => {
    // Dayjs plugins
    dayjs.extend(utc);
    dayjs.extend(timezone);

    // Redux
    const login = useSelector((state: RootState) => state.user.logged);
    const userIdRedux = useSelector((state: RootState) => state.user.userId);
    const accessToken = useSelector((state: RootState) => state.user.accessToken);

    // Delete comment
    const onDeleteComment = () => {
        modalService.openModal({
            title: mondoTranslate('comments.delete_modal_title'),
            text: mondoTranslate('comments.delete_modal_text', {
                comment_text: truncateTextAfterNCharacters(props.comment_text, 100, true)
            }),
            classes: 'ms-modal-login',
            buttonText: mondoTranslate('comments.delete_modal_button'),
            buttonFunction: () => {
                deleteApiAuthCall('comments/' + props.ID, accessToken, {})
                    .then((response) => {
                        toastService.success(
                            mondoTranslate('comments.toast_deletion_successful'),
                            'data-test-toast-comment-deleted'
                        );
                        modalService.closeModal();
                        if (props.callback) props.callback();
                    })
                    .catch((error) => {
                        toastService.success(mondoTranslate('comments.toast_deletion_error'));
                        modalService.closeModal();
                    });
            },
            closeButtonText: 'Cancel'
        });
    };

    return (
        <li className="ms-comment" data-test="comment">
            <div className="ms-comment__header">
                <div className="ms-comment__header-left">
                    {props.commented_spot_name && (
                        <>
                            <p className="ms-comment__spot-name ms-small-text">{props.commented_spot_name}</p>
                            <p className="ms-small-text"> • </p>
                        </>
                    )}
                    <p className="ms-small-text"> by </p>
                    <p className="ms-comment__author ms-small-text">{props.comment_author_name}</p>
                    <p className="ms-small-text"> • </p>
                    <p className="ms-comment__date ms-small-text">
                        {dayjs(props.comment_date).format('DD-MM-YYYY HH:mm')}
                    </p>
                </div>
                {props.allow_editing && login === 'yes' && props.ID && userIdRedux === props.comment_author_id && (
                    <div className="ms-comment__header-right">
                        <button className="ms-comment__delete" onClick={onDeleteComment} data-test="comment-delete">
                            <Icon icon="trash" />
                        </button>
                    </div>
                )}
            </div>
            <div className="ms-comment__content">
                <p className="ms-comment__text ms-body-text">{props.comment_text}</p>
            </div>
        </li>
    );
};
export default Comment;
