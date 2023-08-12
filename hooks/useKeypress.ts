import { useEffect } from 'react';

/**
 * useKeyPress
 * @param {string} key - the name of the key to respond to, compared against event.key
 * @param {function} action - the action to perform on key press
 * @param {any} updateVariable - any variable that when updated will update the content of the useEffect hook
 */
export default function useKeypress(key: string, action: Function, updateVariable: any = null) {
    useEffect(() => {
        function onKeyup(e: KeyboardEvent) {
            if (e.key === key) {
                e.preventDefault();
                action(e);
            }
        }
        window.addEventListener('keyup', onKeyup);
        return () => window.removeEventListener('keyup', onKeyup);
    }, [updateVariable]);
}