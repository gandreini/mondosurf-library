import Icon from '@/mondosurf-library/components/Icon';
import { mondoTranslate } from '@/helpers/translations.helper';

interface IGoodTimeQuality {
    quality: number;
    night?: boolean;
    vertical?: boolean;
}

const GoodTimeQuality: React.FC<IGoodTimeQuality> = (props) => {
    return (
        <div
            className={`ms-good-time-quality ms-good-time-quality-${props.quality} ${
                props.vertical && 'ms-good-time-quality-vertical'
            }`}>
            {/* -1 */}
            {props.quality === -1 && (
                <>
                    <div className="ms-good-time-quality__text">
                        <span className="ms-good-time-quality__text">Np good</span>
                    </div>
                </>
            )}

            {/* 0 */}
            {props.quality === 0 && (
                <>
                    <div className="ms-good-time-quality__stars">
                        <Icon icon={'star'} />
                        <Icon icon={'star'} />
                        <Icon icon={'star'} />
                    </div>
                    <div className="ms-good-time-quality__text">
                        <span className="ms-good-time-quality__text">Poor</span>
                    </div>
                </>
            )}

            {/* 1 */}
            {props.quality === 1 && (
                <>
                    <div className="ms-good-time-quality__stars">
                        <Icon icon={'star'} />
                        <Icon icon={'star'} />
                        <Icon icon={'star'} />
                    </div>
                    <div className="ms-good-time-quality__text">Good</div>
                </>
            )}

            {/* 2 */}
            {props.quality === 2 && (
                <>
                    <div className="ms-good-time-quality__stars">
                        <Icon icon={'star'} />
                        <Icon icon={'star'} />
                        <Icon icon={'star'} />
                    </div>
                    <div className="ms-good-time-quality__text">Very good</div>
                </>
            )}

            {/* 3 */}
            {props.quality === 3 && (
                <>
                    <div className="ms-good-time-quality__stars">
                        <Icon icon={'star'} />
                        <Icon icon={'star'} />
                        <Icon icon={'star'} />
                    </div>
                    <div className="ms-good-time-quality__text">Epic</div>
                </>
            )}
        </div>
    );
};
export default GoodTimeQuality;
