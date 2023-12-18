'use client';

import Image from 'next/image'
import { BotMsg } from '@/components/botmsg'


import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { SendHorizonal, Speech, Zap, User, Square } from 'lucide-react'

import { useChat } from 'ai/react';

export default function Home() {

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    api: '/api/chat',
  });

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <>
      <div className="container ">
        <div className="navbar">
          <h3>Lumen</h3>
        </div>
        <div className="content-container">
          <div className="content space-y-10">
            <div className="chat">
              <ul>
                {messages.map((m, index) => (
                  <li key={index}>
                    {m.role === 'user' ? (
                      <div className="msg user-msg ">
                        <div className="avatar">
                          <User size={15} />
                        </div>
                        <div className="msg-content pt-1 whitespace-pre-wrap">
                          {m.content}
                        </div>
                      </div>
                    ) : (
                      <div className="msg bot-msg">
                        <div className="avatar">
                          <Zap size={15} />
                        </div>
                        <div className="msg-content pt-1">
                          <BotMsg message={m.content} />
                        </div>

                      </div>
                    )}
                  </li>
                ))}

              </ul>
            </div>
          </div >
        </div >
        <div className="footer relative">
          <form onSubmit={handleSubmit}>
            {/* <Button className="speech rounded-full bg-zinc-800 w-fit py-6 px-4 absolute -left-24 top-10">
              <Speech size={16} />
            </Button> */}
            <Textarea
              disabled={isLoading}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}  // Attach the keydown handler here
              className='input-box'
              placeholder='Type your message here.'
            />

            {isLoading ? (
              < Button className="absolute top-10 right-5 rounded-full py-6 px-4" style={{ background: "#FA6608" }}>
                <Square
                  onClick={stop}
                  size={16}
                />
              </Button>

            ) : (
              <Button className="absolute top-10 right-5 rounded-full py-6 px-4" style={{ background: "#FA6608" }}>
                <SendHorizonal size={16} />
              </Button>
            )
            }
          </form>
          {/* <Button className='absolute -top-14 left-3'
            onClick={() => browsetheinterwebs()}
          >
            Browse
          </Button> */}
        </div>
      </div >

    </>

  )
}
