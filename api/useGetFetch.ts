import axios from 'axios';
import { isDebug } from 'mondosurf-library/helpers/debug.helpers';
import { PUBLIC_API_URL_V1 } from 'proxies/localConstants';
import { useEffect, useState } from "react";

interface IAxiosState {
    status: "init" | "loading" | "loaded" | "error" | "canceled";
    payload?: any;
    error?: any;
    APIcode?: string;
    APImessage?: string;
    APIstatus?: string;
}

// Abort a request that hangs (e.g. a slow search query spiking to several seconds)
// instead of leaving the UI spinning forever.
const REQUEST_TIMEOUT_MS = 8000;

export default function useGetFetch(url: string, params?: any) {

    const [state, setState] = useState<IAxiosState>({ status: "init", error: null, payload: [] });

    useEffect(() => {

        if (!url || url === '') {
            return;
        }

        // Cancel token + stale guard. When the url changes (or the component unmounts)
        // the cleanup aborts the in-flight request AND flips `ignore`, so a late/slow
        // response can never overwrite the results of a newer query (last-typed wins,
        // not last-resolved).
        const source = axios.CancelToken.source();
        let ignore = false;

        if (isDebug()) console.log("useGetFetch", "url: " + url);

        setState({ status: "loading", error: null, payload: [] });

        axios({
            method: "get",
            url: PUBLIC_API_URL_V1 + url,
            params: { ...params },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            cancelToken: source.token,
            timeout: REQUEST_TIMEOUT_MS,
        })
            .then(function (response) {
                if (ignore) return;
                setState({ status: "loaded", payload: response.data });
            })
            .catch(function (error) {
                // A cancelled request (a newer query took over, or unmount) is not an error.
                if (ignore || axios.isCancel(error)) {
                    return;
                }
                if (error.response) {
                    // The server responded with a status outside the 2xx range.
                    setState({
                        status: "error",
                        error: error,
                        APIcode: error.response.data?.code,
                        APImessage: error.response.data?.message,
                        APIstatus: error.response.status,
                    });
                } else {
                    // No response received (timeout / network) or a request-setup error.
                    setState({ status: "error", error: error });
                }
            });

        return function cleanup() {
            ignore = true;
            source.cancel('Request canceled: query changed or component unmounted');
        };
    }, [url]); // re-fetch when the url changes

    return state;
}
