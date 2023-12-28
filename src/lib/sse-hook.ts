"use client"
import { useEffect, useState, useRef } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

import useThreadStore from '@/app/useStore';

type SearchResult = {
  title: string;
  url: string;
  snippet: string;
};

type ThreadMessage = {
  role: string;
  content: string | SearchResult[];
};

function useSSEChat(url: string) {

  const { thread, addMessage, updateLastMessage } = useThreadStore((state) => ({
    thread: state.thread,
    addMessage: state.addMessage,
    updateLastMessage: state.updateLastMessage,
  }))

  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let eventSource: void | EventSource;
  const eventSourceRef = useRef<null | EventSource>(null);

  const threadRef = useRef(thread);

  useEffect(() => {
    threadRef.current = thread;
  }, [thread]);

  const getModelResponse = async (): Promise<void> => {
    setIsLoading(true);
    const modifiedThread = threadRef.current

    try {
      addMessage({ role: 'ai', content: '' });
      eventSourceRef.current = await fetchEventSource('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          modifiedThread
        }),
        onopen(res) {
          return new Promise((resolve, reject) => {
            if (res.ok && res.status === 200) {
              // console.log("Connection made ", res);
              resolve();
            } else if (
              res.status >= 400 &&
              res.status < 500 &&
              res.status !== 429
            ) {
              // console.log("Client side error ", res);
              reject(new Error('Client side error'));
            }
          });
        },
        onmessage(event) {
          const parsedData = JSON.parse(event.data);
          if (typeof parsedData === 'object' && parsedData !== null && 'message' in parsedData) {
            updateLastMessage(parsedData.message);
          }
        },
        onclose() {
          // console.log("Connection closed by the server");
        },
        onerror(err) {
          if (err instanceof Error) {
            setError(err);
          }
        },
      }) as any as EventSource;
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error during fetchEventSource: ", err);
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const stop = (): void => {
    if (eventSourceRef.current) {
      console.log("Before closing: ", eventSourceRef.current.readyState);
      eventSourceRef.current.close();
      console.log("After closing: ", eventSourceRef.current.readyState);
      eventSourceRef.current = null; // Reset the ref after closing
    } else {
      // console.log("EventSource is undefined or null");
    }
  };


  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return { error, isLoading, getModelResponse, stop };
}


export default useSSEChat;