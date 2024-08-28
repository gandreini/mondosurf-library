import { RootState } from 'mondosurf-library/redux/store';
import { useSelector } from 'react-redux';
import Icon from 'mondosurf-library/components/Icon';
import modalService from 'mondosurf-library/services/modalService';
import { deleteApiAuthCall } from 'mondosurf-library/api/api';
import toastService from 'mondosurf-library/services/toastService';
import { truncateTextAfterNCharacters } from 'mondosurf-library/helpers/strings.helpers';
import { mondoTranslate } from 'proxies/mondoTranslate';

interface IComment {
    commentId?: number;
    commentText: string;
    commentAuthorName: string;
    commentAuthorId: number;
    commentDate: string;
    callback?: () => void;
}

const Comment: React.FC<IComment> = (props) => {
    // Redux.
    const login = useSelector((state: RootState) => state.user.logged);
    const userIdRedux = useSelector((state: RootState) => state.user.userId);
    const accessToken = useSelector((state: RootState) => state.user.accessToken);

    // Delete comment
    const onDeleteComment = () => {
        modalService.openModal({
            title: mondoTranslate('comments.delete_modal_title'),
            text: mondoTranslate('comments.delete_modal_text', {
                comment_text: truncateTextAfterNCharacters(props.commentText, 100, true)
            }),
            classes: 'ms-modal-login',
            buttonText: mondoTranslate('comments.delete_modal_button'),
            buttonFunction: () => {
                deleteApiAuthCall('comments/' + props.commentId, accessToken, {})
                    .then((response) => {
                        toastService.success(mondoTranslate('comments.toast_deletion_successful'));
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
        <li className="ms-comment">
            <div className="ms-comment__header">
                <div className="ms-comment__header-left">
                    <p className="ms-comment__author ms-small-text">{props.commentAuthorName}</p>
                    <p className="ms-small-text"> • </p>
                    <p className="ms-comment__date ms-small-text">{props.commentDate}</p>
                </div>
                {login === 'yes' && props.commentId && userIdRedux === props.commentAuthorId && (
                    <div className="ms-comment__header-right">
                        <button className="ms-comment__delete" onClick={onDeleteComment}>
                            <Icon icon="trash" />
                        </button>
                    </div>
                )}
            </div>
            <div className="ms-comment__content">
                <p className="ms-comment__text ms-body-text">{props.commentText}</p>
            </div>
        </li>
    );
};
export default Comment;
