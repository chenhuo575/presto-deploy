import { useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import c from 'highlight.js/lib/languages/c';
import 'highlight.js/styles/github.css';
import { detectLanguage } from '../utils/languageDetector';
import type { CodeElement } from '../types';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('c', c);

interface CodeBlockProps {
    element: CodeElement;
    onDoubleClick: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
}

const CodeBlock = ({ element, onDoubleClick, onContextMenu }: CodeBlockProps) => {
  const codeRef = useRef<HTMLElement>(null);
  const detectedLang = detectLanguage(element.code);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.removeAttribute('data-highlighted');
      hljs.highlightElement(codeRef.current);
    }
  }, [element.code, detectedLang]);

  return (
    <div
      style={{
        position: 'absolute',
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}%`,
        height: `${element.height}%`,
        border: '1px solid #ccc',
        overflow: 'auto',
        backgroundColor: '#f6f8fa',
        zIndex: element.layer,
        boxSizing: 'border-box',
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e);
      }}
    >
      <pre style={{ margin: 0, height: '100%', overflow: 'auto' }}>
        <code
          ref={codeRef}
          className={`language-${detectedLang}`}
          style={{
            fontSize: `${element.fontSize}em`,
            fontFamily: 'monospace',
            whiteSpace: 'pre',
            display: 'block',
          }}
        >
          {element.code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;