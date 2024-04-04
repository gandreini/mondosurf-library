import axios from 'axios';
import { PUBLIC_API_URL_V1 } from 'proxies/localConstants';
import { isDebug } from 'mondosurf-library/helpers/debug.helpers';
import { useEffect, useState } from "react";

interface IAxiosState {
    status: "init" | "loading" | "loaded" | "error" | "canceled";
    payload?: any;
    error?: any;
    APIcode?: string;
    APImessage?: string;
    APIstatus?: string;
}

export default function useGetFetch(url: string, params?: any) {

    // Abort controller to abort the fetch request.
    const source = axios.CancelToken.source();
    const [state, setState] = useState<IAxiosState>({ status: "init", error: null, payload: [] })

    // useEffect to launch the fetch.
    useEffect(() => {

        if (!url || url === '') {
            source.cancel('Api is being aborted due to empty URL');
            return;
        }

        // Debug.
        if (isDebug()) console.log("useGetFetch", "url: " + url);

        setState({ ...state, status: "loading" });

        axios({
            method: "get",
            url: PUBLIC_API_URL_V1 + url,
            params: { ...params },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
            .then(function (response) {
                setState({ ...state, status: "loaded", payload: response.data });
            })
            .catch(function (error) {
                if (axios.isCancel(error)) {
                    setState({ ...state, status: "canceled", error: error, APImessage: error.message });
                } else {
                    if (error.response) {
                        // The request was made and the server responded with a status code that falls out of the range of 2xx.
                        setState({ ...state, status: "error", error: error, APIcode: error.response.data.code, APImessage: error.response.data.message, APIstatus: error.response.status });
                    } else if (error.request) {
                        // The request was made but no response was received, `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in Node.js
                        // console.log(error.request);
                        setState({ ...state, status: "error", error: error });
                    } else {
                        // Something happened in setting up the request and triggered an Error
                        // console.log('Error', error.message);
                        setState({ ...state, status: "error", error: error });
                    }
                }
            });

        return function cleanup() {
            source.cancel('Api is being canceled');
        };
    }, [url]); // Fetch launched as the url changes.

    return state;
}
