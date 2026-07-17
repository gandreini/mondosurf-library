'use client';

import { callApiNew } from 'mondosurf-library/api/api';
import Loader from 'mondosurf-library/components/Loader';
import { TrackingEvent } from 'mondosurf-library/constants/trackingEvent';
import {
    buildSubscribePayload,
    mapSubscribeError,
    mapSubscribeSuccess,
    SubscribeOutcome
} from 'mondosurf-library/helpers/spotSubscribe.helpers';
import { Tracker } from 'mondosurf-library/tracker/tracker';
import { mondoTranslate } from 'proxies/mondoTranslate';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

interface ISpotSubscribeForm {
    spotId: number;
    spotName: string;
}

// Local, lenient email shape — the WP endpoint is the authority; this only
// stops an obviously-broken submit before a round-trip.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * No-account per-spot subscribe form (spot-email-alerts). Renders unconditionally
 * (NOT consent-gated); only the analytics events respect consent, self-gated
 * inside Tracker.trackEvent. Anti-bot: an off-screen honeypot field + a
 * min-time-to-submit signal (form render timestamp) the server verifies.
 */
const SpotSubscribeForm: React.FC<ISpotSubscribeForm> = ({ spotId, spotName }) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<{ email: string; website: string }>({ reValidateMode: 'onSubmit' });

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [outcome, setOutcome] = useState<SubscribeOutcome | null>(null);
    const [submittedEmail, setSubmittedEmail] = useState<string>('');
    const renderedAtRef = useRef<number>(Date.now());

    // Impression fires once on mount; also (re)stamp the render time used for
    // the min-time-to-submit bot check.
    useEffect(() => {
        renderedAtRef.current = Date.now();
        Tracker.trackEvent(['mp'], TrackingEvent.SpotSubscribeShow, { spotId, spotName });
    }, [spotId, spotName]);

    const onSubmit = (data: { email: string; website: string }) => {
        setSubmitting(true);
        setOutcome(null);
        setSubmittedEmail(data.email.trim());
        Tracker.trackEvent(['mp'], TrackingEvent.SpotSubscribeSubmitTap, { spotId, spotName });

        const payload = buildSubscribePayload(
            data.email,
            spotId,
            renderedAtRef.current,
            data.website || '',
            typeof window !== 'undefined' ? window.location.href : ''
        );

        callApiNew('spot-subscription-subscribe/', 'POST', payload)
            .then((res: { code?: string }) => {
                const o = mapSubscribeSuccess(res);
                setOutcome(o);
                setSubmitting(false);
                Tracker.trackEvent(['mp'], TrackingEvent.SpotSubscribeSubmitOk, { spotId, spotName, result: o.state });
            })
            .catch((err: { code?: string }) => {
                const o = mapSubscribeError(err);
                setOutcome(o);
                setSubmitting(false);
                Tracker.trackEvent(
                    ['mp'],
                    o.state === 'cap' ? TrackingEvent.SpotSubscribeCapReached : TrackingEvent.SpotSubscribeSubmitErr,
                    { spotId, spotName, code: err?.code }
                );
            });
    };

    // Terminal success / already-subscribed → replace the form with a confirmation.
    if (outcome && (outcome.state === 'success' || outcome.state === 'already')) {
        return (
            <div className="ms-spot-subscribe ms-spot-subscribe--done" data-test="spot-subscribe-success">
                <p className="ms-spot-subscribe__success-title">{mondoTranslate('spotSubscribe.success_title')}</p>
                <p className="ms-spot-subscribe__success-text">
                    {mondoTranslate(outcome.messageKey, { email: submittedEmail })}
                </p>
            </div>
        );
    }

    return (
        <div className="ms-spot-subscribe" data-test="spot-subscribe">
            <p className="ms-spot-subscribe__title">{mondoTranslate('spotSubscribe.title', { spotName })}</p>
            <p className="ms-spot-subscribe__subtitle">{mondoTranslate('spotSubscribe.subtitle', { spotName })}</p>

            <form className="ms-form ms-spot-subscribe__form" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Honeypot: hidden from humans and assistive tech; bots fill it and
                    the server silently drops the request. */}
                <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="ms-spot-subscribe__hp"
                    {...register('website')}
                />

                <div className="ms-spot-subscribe__row">
                    <input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        aria-label={mondoTranslate('spotSubscribe.email_placeholder')}
                        placeholder={mondoTranslate('spotSubscribe.email_placeholder')}
                        className="ms-spot-subscribe__input"
                        data-test="spot-subscribe-email"
                        {...register('email', { required: true, pattern: EMAIL_PATTERN })}
                    />
                    <button
                        type="submit"
                        className="ms-btn ms-btn-cta ms-btn-m"
                        data-test="spot-subscribe-submit"
                        disabled={submitting}>
                        {submitting ? <Loader size="small" /> : mondoTranslate('spotSubscribe.submit')}
                    </button>
                </div>

                {(errors.email || (outcome && outcome.state === 'error')) && (
                    <p className="ms-spot-subscribe__error" data-test="spot-subscribe-error">
                        {errors.email
                            ? mondoTranslate('spotSubscribe.error_email_invalid')
                            : mondoTranslate(outcome!.messageKey)}
                    </p>
                )}

                {outcome && outcome.state === 'cap' && (
                    <p className="ms-spot-subscribe__cap" data-test="spot-subscribe-cap">
                        {mondoTranslate(outcome.messageKey)}{' '}
                        <a
                            href="https://www.mondo.surf/profile"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() =>
                                Tracker.trackEvent(['mp'], TrackingEvent.SpotSubscribeUpgradeTap, { spotId, spotName })
                            }>
                            {mondoTranslate('spotSubscribe.cap_upgrade_cta')}
                        </a>
                    </p>
                )}
            </form>

            <p className="ms-spot-subscribe__trust">{mondoTranslate('spotSubscribe.trust')}</p>
        </div>
    );
};

export default SpotSubscribeForm;
