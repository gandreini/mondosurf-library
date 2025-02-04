import useGetFetch from "mondosurf-library/api/useGetFetch";
import { hasProPermissions } from "mondosurf-library/helpers/user.helpers";
import { useEffect, useState } from "react";

/**
 * Custom hook to fetch GeoJSON data based on user permissions.
 *
 * This hook manages the fetching of a GeoJSON file, dynamically adjusting 
 * query parameters based on the user's permissions (e.g., "pro" users). It 
 * ensures the correct API endpoint and parameters are set for the request 
 * and includes cleanup logic to reset the query when the component is unmounted.
 *
 * @returns {object} fetchedMap - The data fetched from the GeoJSON API.
 */
export const useGeoJsonFetch = () => {
    // State to store the API endpoint query
    const [geoJsonQuery, setGeoJsonQuery] = useState<string>('');
    // State to store query parameters for the API call
    const [geoJsonQueryParams, setGeoJsonQueryParams] = useState<object>({});
    // Custom hook to fetch data based on the query and parameters
    const fetchedMap = useGetFetch(geoJsonQuery || '', geoJsonQueryParams);

    useEffect(() => {
        // Check if the user has "pro" permissions
        if (hasProPermissions()) {
            // Set query parameters for pro users
            setGeoJsonQueryParams({ "is_pro": true });
            setGeoJsonQuery('geojson');
        } else {
            // Set the API endpoint for non-pro users
            setGeoJsonQuery('geojson');
        }

        // Cleanup function to reset the query when the component is unmounted
        return function cleanup() {
            setGeoJsonQuery(''); // Clear the query to avoid unnecessary calls
        };
    }, []);

    // Return the fetched map data
    return fetchedMap;
};