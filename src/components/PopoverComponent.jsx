import React, { forwardRef, useState } from 'react';
import * as Selection from 'selection-popover';
import { Copy, Info, MessageSquarePlus, Quote } from 'lucide-react'

const PopoverComponent = forwardRef(({ children, onAddSelection }, ref) => {

    const [selectedText, setSelectedText] = useState('');
    const [explanationText, setExplanationText] = useState(''); // State to hold the explanation
    const [isLoading, setIsLoading] = useState(false);


    const getSelectedText = () => {
        let text = '';
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type !== "Control") {
            text = document.selection.createRange().text;
        }
        return text;
    };

    const explainSelection = async () => {
        setIsLoading(true)
        const text = getSelectedText();

        let modifiedThread = [];
        modifiedThread.push({ role: "user", content: `I'm a beginner, read the docs and give me a very simple and very short explanation of ${text} is.` })

        const simplifiedText = await fetch('/api/explain', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ modifiedThread }),
        });
        const data = await simplifiedText.json();
        console.log(data);
        setExplanationText(data.response);
        setIsLoading(false);
    }

    const addSelectionToThread = () => {
        const text = getSelectedText();
        onAddSelection(text)
    }

    const handleSelectionChange = (isOpen) => {
        const text = getSelectedText();
        setSelectedText(text);
        if (!isOpen) {
            setExplanationText('');
        }
    };

    return (
        <Selection.Root onOpenChange={handleSelectionChange}>
            <Selection.Trigger asChild>
                <div ref={ref}>{children}</div>
            </Selection.Trigger>
            <Selection.Portal>
                <Selection.Content>
                    <div className='popover'>
                        <div className='explanation'>
                            {isLoading ? <div>Loading...</div> : explanationText && <div className='popover-explanation'>{explanationText}</div>}
                        </div>
                        <div className="popover-controls">
                            <Info className='popover-control'
                                onClick={explainSelection}
                            />
                            <Quote className='popover-control'
                                onClick={addSelectionToThread}
                            />
                            <MessageSquarePlus className='popover-control'
                                onClick={addSelectionToThread}
                            />
                        </div>

                    </div>
                    <Selection.Arrow />
                </Selection.Content>
            </Selection.Portal>
        </Selection.Root>
    );
});

export default PopoverComponent;
