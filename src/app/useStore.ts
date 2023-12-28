import { create } from 'zustand';

type SearchResult = {
    title: string;
    url: string;
    snippet: string;
};

type ThreadMessage = {
    role: 'user' | 'ai' | 'search_result';
    content: string | SearchResult[];
};

interface ThreadStore {
    thread: ThreadMessage[];
    addMessage: (message: ThreadMessage) => void;
    updateLastMessage: (chunk: string) => void;
}

const useThreadStore = create<ThreadStore>((set) => ({
    thread: [],
    addMessage: (message) => {
        set((state) => {
            const updatedThread = [...state.thread, message];
            return { thread: updatedThread };
        })
    },
    updateLastMessage: (chunk: string) => {
        set(state => {
            const newThread = [...state.thread];
            const lastMessage = newThread[newThread.length - 1];
            lastMessage.content += chunk;
            return { thread: newThread };
        })
    },
}));

export default useThreadStore;
