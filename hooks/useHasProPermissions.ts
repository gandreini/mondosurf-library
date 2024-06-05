import { RootState } from 'mondosurf-library/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

/**
 * Custom hook to determine if a user has Pro permissions.
 *
 * This hook utilizes the Redux state to check the user's logged status and account type
 * to determine if the user has Pro permissions. It returns a boolean indicating whether
 * the user has Pro permissions or not.
 *
 * @returns {boolean} hasProPermissions - A boolean value indicating if the user has Pro permissions.
 */
export const useHasProPermissions = () => {
    const [hasProPermissions, setHasProPermissions] = useState(false);
    const logged = useSelector((state: RootState) => state.user.logged);
    const accountType = useSelector((state: RootState) => state.user.accountType);

    useEffect(() => {
        if (logged === "checking" || logged === "no") {
            setHasProPermissions(false);
        } else if (logged === "yes") {
            if (accountType === "admin" || accountType === "pro" || accountType === "trial") {
                setHasProPermissions(true)
            } else {
                setHasProPermissions(false)
            }
        }
    }, [logged, accountType]);

    return hasProPermissions;
}