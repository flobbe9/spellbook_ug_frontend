import { useEffect, useState } from "react";
import WPPage from "../abstract/wp/WPPage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { WORDPRESS_BASE_URL, WORDPRESS_CUSTOM_PATH, WORDPRESS_REQUEST_MAPPING } from "../helpers/constants";
import { fetchAny, isHttpStatusCodeAlright } from "../helpers/fetchUtils";
import { log } from "../helpers/genericUtils";


/**
 * @returns list of all published pages in wp
 * @since 0.0.1
 */
export function usePages(): WPPage[] {

    const [pages, setPages] = useState<WPPage[]>([]);

    // fetch pages
    const queryClient = useQueryClient();
    const QUERY_KEY_PAGES = ["pages"];
    const { data } = useQuery<WPPage[]>({
        queryKey: QUERY_KEY_PAGES,
        queryFn: fetchPages,
        gcTime: Infinity,
        initialData: queryClient.getQueryData(QUERY_KEY_PAGES),
    });

    // update state on fetch complete
    useEffect(() => {
        setPages(data || []);

    }, [data]);
    

    async function fetchPages(): Promise<WPPage[]> {

        const url = `${WORDPRESS_BASE_URL}/${WORDPRESS_REQUEST_MAPPING}/${WORDPRESS_CUSTOM_PATH}/allPages`;
        
        const response = await fetchAny(url);

        // case: request failed
        if (!isHttpStatusCodeAlright(response.status))
            return [];

        return await (response as Response).json();
    }


    return pages;
}