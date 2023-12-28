import { useEffect, useState } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

import useThreadStore from '@/app/useStore';

interface SearchResult {
    title: string;
    url: string;
    snippet: string;
}

interface SearchData {
    searchResults: SearchResult[];
}

function useBrowse(url: string) {
    const [webResultsError, setWebResultsError] = useState<Error | null>(null);
    const [loadingWebResults, setLoadingWebResults] = useState<boolean>(false);


    const { thread, addMessage, updateLastMessage } = useThreadStore((state) => ({
        thread: state.thread,
        addMessage: state.addMessage,
        updateLastMessage: state.updateLastMessage,
    }))

    const getWebResults = async (input: string): Promise<void> => {
        setLoadingWebResults(true);
        setWebResultsError(null);

        try {
            const searchResponse = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: input }),
            });

            if (!searchResponse.ok) {
                throw new Error(`HTTP error! status: ${searchResponse.status}`);
            }

            const searchData: SearchData = await searchResponse.json();
            addMessage({ role: "search_result", content: searchData.searchResults });
        } catch (error) {
            if (error instanceof Error) {
                console.error("Fetching search results failed:", error);
                setWebResultsError(error);
            }
        } finally {
            setLoadingWebResults(false);
        }
    }

    return { webResultsError, loadingWebResults, getWebResults };
}

export default useBrowse;
