import { useState, useEffect } from 'react';
import { BotMarkdown } from '@/components/botmarkdown'

import { Zap, Volume2, Copy, CheckCircle2, StopCircle, Info } from 'lucide-react'

const BotMessage = ({ message, isLoading }) => {

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const [selectedText, setSelectedText] = useState('');
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });


    const getSelectionCoordinates = () => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return { x: 0, y: 0 };

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        return {
            x: rect.left,
            y: rect.top - 50
        };
    };

    const handleTextSelect = () => {
        const text = window.getSelection().toString();
        if (text.length > 0) {
            const { x, y } = getSelectionCoordinates();

            setContextMenu({ visible: true, x, y });
        } else {
            setContextMenu(prevState => ({ ...prevState, visible: false }));
        }
        setSelectedText(text);
    };

    useEffect(() => {
        document.addEventListener('mouseup', handleTextSelect);
        document.addEventListener('keyup', handleTextSelect);

        return () => {
            document.removeEventListener('mouseup', handleTextSelect);
            document.removeEventListener('keyup', handleTextSelect);
        };
    }, []);

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
        <div className='msg-container'>
            <div className="msg bot-msg">
                <div className="avatar">
                    <Zap size={15} />
                </div>
                <div className="msg-content">
                    <div className='msg-author'>Lumen</div>
                    <BotMarkdown message={message.content} />
                </div>
            </div>
            <div className={`bot-response-controls`}
                style={{ display: isLoading ? 'none' : 'flex' }}

            >
                {isSpeaking ?
                    <StopCircle size={18} className='control' onClick={() => speakResponse()} />
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
            {contextMenu.visible && (
                <div
                    style={{ position: 'absolute', top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
                >
                    <div className='popover'>
                        <Info className='cursor-pointer' />
                    </div>
                </div>
            )}
        </div >
    )
}

export { BotMessage }