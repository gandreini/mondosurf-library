/**
 * Returns a cookie value, given the name.
 * 
 * @param   {string} cookieName The name of the cookie.
 * @returns {string} The value of the cookie, "" if the cookie is not found.
 */
export const getCookie = (cookieName: string): string => {
    let name = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}