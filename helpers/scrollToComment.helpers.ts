/**
 * Reads `#comment-{id}` from the URL hash and smoothly scrolls to that element.
 * No-op if the hash isn't present or the element isn't in the DOM.
 *
 * (The transient background-flash highlight was removed per design — it read as
 * distracting. The scroll itself is the deep-link affordance.)
 *
 * Safe to call multiple times — caller should debounce by gating on
 * "comments loaded" state.
 */
export const scrollToCommentFromHash = (): number | null => {
    if (typeof window === 'undefined') return null;

    const hash = window.location.hash;
    const match = hash.match(/^#comment-(\d+)$/);
    if (!match) return null;

    const commentId = parseInt(match[1], 10);
    const el = document.getElementById(`comment-${commentId}`);
    if (!el) return commentId; // Element not in DOM yet — return id so caller can retry.

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return commentId;
};
