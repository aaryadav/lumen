'use client';

import { useState, KeyboardEvent, FormEvent } from 'react';

import { UserMessage } from '@/components/usermessage.jsx'
import { SearchResultMessage } from '@/components/searchresultmessage.jsx'
import { BotMessage } from '@/components/botmessage.jsx'

import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"


import { SendHorizonal, Speech, Zap, User, Square, Globe } from 'lucide-react'

import useSSEChat from '@/lib/sse-hook';
import useBrowse from '@/lib/browse-hook'
import useThreadStore from '@/app/useStore';

export default function ChatUI() {

  const [input, setInput] = useState('');
  const [browsingMode, setBrowsingMode] = useState(false);

  const { thread, addMessage } = useThreadStore((state) => ({
    thread: state.thread,
    addMessage: state.addMessage,
  }))

  const handleAddToThread = (text: string) => {
    setInput(input + `\n"${text}"\n`)
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event as unknown as FormEvent<HTMLFormElement>);
      setInput('')
    }
  };

  const { error, isLoading, getModelResponse, stop } = useSSEChat('/api/chat-endpoint');
  const { webResultsError, loadingWebResults, getWebResults } = useBrowse('/api/chat-endpoint');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addMessage({ role: "user", content: input })
    // Browse
    browsingMode && await getWebResults(input);

    // Chat
    setTimeout(getModelResponse, 0);
  };

  return (
    <>
      <div className="chatui container">
        <div className='title font-bold text-xl my-8'>Lumen</div>
        <div className="content-container">
          <div className="content space-y-10">
            <div className="chat">
              <ul className='flex flex-col'>
                {
                  thread && thread.map((message, index) => {
                    const key = index;
                    switch (message.role) {
                      case 'user':
                        return <UserMessage key={key} message={message} />;
                      case 'search_result':
                        return Array.isArray(message.content) && <SearchResultMessage key={key} message={message} />
                      case 'ai':
                        return <BotMessage key={key} onAddToThread={handleAddToThread} message={message} isLoading={isLoading} />;
                      default:
                        return null;
                    }
                  })
                }
              </ul>
            </div>
          </div >
        </div >
        <div className="footer relative">
          <div className='space-x-2 flex'>
            <div>Browsing Mode</div>
            <Switch
              className={cn("data-[state=checked]:bg-white data-[state=unchecked]:bg-zinc-800 mb-3")}
              checked={browsingMode}
              onCheckedChange={() => setBrowsingMode(!browsingMode)}
            />
          </div>
          <form
            onSubmit={handleSubmit}
          >
            {/* <Button className="speech rounded-full bg-zinc-800 w-fit py-6 px-4 absolute -left-24 top-10">
              <Speech size={16} />
            </Button> */}
            <Textarea
              disabled={isLoading}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className='input-box'
              placeholder='Type your message here.'
            />

            {isLoading || loadingWebResults ? (
              // <Button className="absolute top-14 right-5 rounded-full py-6 px-4" style={{ background: "#FA6608" }}>
              //   <Square
              //     onClick={stop}
              //     size={16}
              //   />
              // </Button>
              ""

            ) : (
              <Button className="absolute top-14 right-5 rounded-full py-6 px-4" style={{ background: "#FA6608" }}>
                <SendHorizonal size={16} />
              </Button>
            )
            }
          </form>
        </div>
      </div >

    </>

  )
}
