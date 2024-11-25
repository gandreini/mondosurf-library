// Client
'use client';

import dayjs from 'dayjs';
import { openProModal } from 'features/modal/modal.helpers';
import { proPriceMonth } from 'features/pro/pro.helpers';
import { daysInUNIX } from 'mondosurf-library/helpers/date.helpers';
import { RootState } from 'mondosurf-library/redux/store';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface IProButton {
    classes?: string;
    parentFunction?: () => void;
}

const ProButton: React.FC<IProButton> = (props) => {
    // Redux
    const userLogged = useSelector((state: RootState) => state.user.logged);
    const accountType = useSelector((state: RootState) => state.user.accountType);
    const trialActivation = useSelector((state: RootState) => state.user.trialActivation);
    const userTrialDuration: number = useSelector((state: RootState) => state.user.trialDuration);

    // View controller
    const [view, setView] = useState<'hidden' | 'pro'>('hidden');

    useEffect(() => {
        if (
            // User logged, free, and already used the trial or still in trial but approaching expiration date.
            (userLogged === 'yes' && accountType === 'free') ||
            (userLogged === 'yes' &&
                accountType === 'trial' &&
                dayjs().unix() > trialActivation + daysInUNIX(userTrialDuration - 5))
        ) {
            setView('pro');
        }
    }, [accountType, trialActivation, userLogged, userTrialDuration]);

    return (
        <>
            {view === 'pro' && (
                <>
                    <button
                        className={'ms-btn ms-btn-l ms-btn-cta ms-btn-multiline ' + props.classes}
                        onClick={() => openProModal(undefined, mondoTranslate('pro.pro_modal.default_text'))}
                        data-test="pro-button">
                        <span>{mondoTranslate('home.pro_cta.pro.button_text_1')}</span>
                        <span>{mondoTranslate('home.pro_cta.pro.button_text_2', { price: proPriceMonth() })}</span>
                    </button>
                </>
            )}
        </>
    );
};
export default ProButton;
