import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import gfm from 'remark-gfm';
import math from 'remark-math';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import '../app/dark_dimmed.css';



const BotMarkdown = ({ message }) => {
    return (
        <div className="markdown-body">
            <ReactMarkdown
                remarkPlugins={[gfm, math]}
                components={{
                    code: ({ node, inline, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                children={String(children).replace(/\n$/, '')}
                                {...props}
                                className='coder-boi'
                            />
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    inlineMath: ({ value }) => <InlineMath math={value} />,
                    math: ({ value }) => <BlockMath math={value} />
                }}
            >

                {message}
            </ReactMarkdown>
        </div>
    )
}

export { BotMarkdown }