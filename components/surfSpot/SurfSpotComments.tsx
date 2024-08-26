import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ISurfSpotComment } from 'mondosurf-library/model/iSurfSpotComment';
import SurfSpotCommentsForm from './SurfSpotCommentsForm';

interface ISurfSpotComments {
    comments: ISurfSpotComment[];
    spotId: string;
}

const SurfSpotComments: React.FC<ISurfSpotComments> = (props) => {
    // Dayjs plugins.
    dayjs.extend(utc);
    dayjs.extend(timezone);

    return (
        <div className="ms-surf-spot-comments">
            <h2 className="ms-surf-spot-comments__title">Comments</h2>
            <div className="ms-surf-spot-comments_form">
                <SurfSpotCommentsForm spotId={props.spotId} />
            </div>
            <ul className="ms-surf-spot-comments__list">
                {props.comments.map((comment) => (
                    <>
                        <li className="ms-surf-spot-comments__comment">
                            <div className="ms-surf-spot-comments__comment-header">
                                <p className="ms-surf-spot-comments__comment-author">{comment.comment_author_name}</p>
                                <p className="ms-surf-spot-comments__comment-date">
                                    {dayjs(comment.comment_date).format('DD-MM-YYYY HH:mm')}
                                </p>
                            </div>
                            <div className="ms-surf-spot-comments__comment-content">
                                <p>{comment.comment_text}</p>
                            </div>
                        </li>
                    </>
                ))}
            </ul>
        </div>
    );
};
export default SurfSpotComments;
