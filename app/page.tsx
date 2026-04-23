'use client';

import { useChat } from '@ai-sdk/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  console.log(messages)
  return (
    <div className="flex flex-col w-full px-24 py-12">
      <div>
        {messages.map(message => (
          <>
            <div key={message.id} className="whitespace-pre-wrap">
              {message.role === 'user' ? 'User: ' : 'AI: '}
              {message.parts.map((part, i) => {
                if (
                  (part.type === 'text' || part.type === 'reasoning') &&
                  part.state === 'streaming'
                ) {
                  return <div key={`${message.id}-${i}`}><LoaderCircle className='animate-spin' /></div>;
                }
                switch (part.type) {
                  case 'text':
                    return <div key={`${message.id}-${i}`}>
                      <div className=''>{part.text}</div>
                    </div>;
                  case 'tool-weather':
                    return (
                      <pre key={`${message.id}-${i}`}>
                        {JSON.stringify(part, null, 2)}
                      </pre>
                    );
                  case 'reasoning':
                    return (
                      <div key={`${message.id}-${i}`} className="text-sm text-zinc-500 border-l-2 pl-2 my-1">
                        {part.text}
                      </div>
                    );

                }
              })}
            </div>
          </>
        ))}
      </div>

      <div className='w-full'>
        <form
          onSubmit={e => {
            e.preventDefault();
            sendMessage({ text: input });
            setInput('');
          }}
          className='flex flex-row items-center justify-center'
        >
          <input
            className="fixed dark:bg-zinc-900 bottom-0 w-4/5 p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={e => setInput(e.currentTarget.value)}
          />
          <button type='submit' className='cursor-pointer fixed dark:bg-zinc-900 right-12 bottom-0 p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl'>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}