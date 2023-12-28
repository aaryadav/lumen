import { useState } from 'react';
import { BotMarkdown } from '@/components/botmarkdown'

import { Zap, Volume2, Copy, CheckCircle2 } from 'lucide-react'

import PopoverComponent from '@/components/PopoverComponent';

const BotMessage = ({ message, isLoading, onAddToThread }) => {

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const speakResponse = () => {
        if (!window.speechSynthesis) {
            alert("Text-to-speech not supported in this browser.");
            return;
        }
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            const utterance = new SpeechSynthesisUtterance(message.content);
            utterance.onend = () => {
                setIsSpeaking(false);
            };
            utterance.onerror = (event) => {
                console.error("Speech synthesis error", event);
                setIsSpeaking(false);
            };
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    }

    const copyResponse = () => {
        navigator.clipboard.writeText(message.content).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 3000);
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    }

    return (
        <div className='msg-container relative'>
            <div className="msg bot-msg">
                <div className="avatar">
                    <Zap size={15} />
                </div>
                <div className="msg-content">
                    <div className='msg-author'>Lumen</div>
                    <PopoverComponent onAddSelection={onAddToThread}>
                        <BotMarkdown message={message.content} />
                    </PopoverComponent>
                </div>
            </div>
            <div className={`bot-response-controls`}
                style={{ display: isLoading ? 'none' : 'flex' }}

            >
                {isSpeaking ?
                    <CheckCircle2 size={18} className='control' />
                    :
                    <Volume2 size={18}
                        className='control'
                        onClick={() => speakResponse()}
                    />
                }

                {isCopied ?
                    <CheckCircle2 size={18} className='control' />
                    :
                    <Copy size={18}
                        className='control'
                        onClick={() => copyResponse()}
                    />
                }
            </div>
        </div >
    )
}

export { BotMessage }