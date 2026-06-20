'use client';

import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
}

export default function MarkdownRenderer({ content }: Props) {
  return (
    <div>
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-3xl font-bold text-gray-900 mt-10 mb-4 leading-snug">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 leading-snug">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-3">{children}</h3>,
          h4: ({ children }) => <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-2">{children}</h4>,
          p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-5 text-[15px]">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-6 mb-5 space-y-2 text-gray-700 text-[15px]">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-gray-700 text-[15px]">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
          em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
          a: ({ children, href }) => (
            <a href={href} className="text-primary underline underline-offset-2 hover:opacity-75 transition-opacity" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/40 pl-5 py-1 my-6 bg-cream-50 rounded-r-xl italic text-gray-600">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
          ),
          pre: ({ children }) => (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto mb-5 text-sm">{children}</pre>
          ),
          hr: () => <hr className="border-cream-200 my-8" />,
          img: ({ src, alt }) => (
            <img src={src} alt={alt} className="rounded-xl w-full object-cover my-6 border border-cream-200" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
