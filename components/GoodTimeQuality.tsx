import Icon from 'mondosurf-library/components/Icon';

interface IGoodTimeQuality {
    quality: number;
    night?: boolean;
    vertical?: boolean;
    hideLabel?: boolean;
    size?: 's' | 'm';
    singleStar?: boolean;
}

const GoodTimeQuality: React.FC<IGoodTimeQuality> = (props) => {
    return (
        <div
            className={`ms-good-time-quality ms-good-time-quality-${props.quality} ms-good-time-quality-${props.size} ${
                props.vertical && 'ms-good-time-quality-vertical'
            }`}>
            {/* -1 */}
            {props.quality === -1 && (
                <>
                    <div className="ms-good-time-quality__text">
                        <span className="ms-good-time-quality__text">No surf</span>
                    </div>
                </>
            )}

            {/* 0 */}
            {props.quality === 0 && (
                <>
                    <div className="ms-good-time-quality__stars">
                        <Icon icon={'star'} />
                        {!props.singleStar && (
                            <>
                                <Icon icon={'star'} />
                                <Icon icon={'star'} />
                            </>
                        )}
                    </div>
                    {props.hideLabel !== true && (
                        <div className="ms-good-time-quality__text">
                            <span className="ms-good-time-quality__text">Poor</span>
                        </div>
                    )}
                </>
            )}

            {/* 1 */}
            {props.quality === 1 && (
                <>
                    <div className="ms-good-time-quality__stars">
                        <Icon icon={'star'} />
                        {!props.singleStar && (
                            <>
                                <Icon icon={'star'} />
                                <Icon icon={'star'} />
                            </>
                        )}
                    </div>
                    {props.hideLabel !== true && <div className="ms-good-time-quality__text">Good</div>}
                </>
            )}

            {/* 2 */}
            {props.quality === 2 && (
                <>
                    <div className="ms-good-time-quality__stars">
                        <Icon icon={'star'} />
                        {!props.singleStar && (
                            <>
                                <Icon icon={'star'} />
                                <Icon icon={'star'} />
                            </>
                        )}
                    </div>
                    {props.hideLabel !== true && <div className="ms-good-time-quality__text">Very good</div>}
                </>
            )}

            {/* 3 */}
            {props.quality === 3 && (
                <>
                    <div className="ms-good-time-quality__stars">
                        <Icon icon={'star'} />
                        {!props.singleStar && (
                            <>
                                <Icon icon={'star'} />
                                <Icon icon={'star'} />
                            </>
                        )}
                    </div>
                    {props.hideLabel !== true && <div className="ms-good-time-quality__text">Epic</div>}
                </>
            )}
        </div>
    );
};
export default GoodTimeQuality;
