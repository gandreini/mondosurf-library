interface ISurfSpotComments {
    spotId: string;
}

const SurfSpotComments: React.FC<ISurfSpotComments> = (props) => {
    return (
        <div className="ms-surf-spot-comments">
            <h2 className="ms-surf-spot-comments__title">Comments</h2>
            <ul className="ms-surf-spot-comments__list">
                <li className="ms-surf-spot-comments__comment">asdasda</li>
            </ul>
        </div>
    );
};
export default SurfSpotComments;
