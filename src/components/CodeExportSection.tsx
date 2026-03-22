import { useState } from 'react';
import { Copy, Terminal, CheckCircle2, Download } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { codeSnippets } from '../data/models';

interface CodeExportSectionProps {
  modelType: 'ca' | 'abm';
  preset: string;
}

export function CodeExportSection({ modelType, preset }: CodeExportSectionProps) {
  const [activeLang, setActiveLang] = useState<'python' | 'r'>('python');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const code = codeSnippets[modelType]?.[preset]?.[activeLang] || '# Code not available';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const code = codeSnippets[modelType]?.[preset]?.[activeLang] || '# Code not available';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${preset}.${activeLang === 'python' ? 'py' : 'R'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const displayCode = codeSnippets[modelType]?.[preset]?.[activeLang] || '# Code not available for this preset yet.';

  return (
    <div className="mt-8 bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/15 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center shrink-0">
          <Terminal className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-headline text-2xl font-extrabold text-on-surface">Code Export</h3>
          <p className="text-sm text-on-surface-variant">Export this model to Python or R for further analysis.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-48 flex flex-col gap-4 shrink-0">
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveLang('python')}
              className={`py-3 px-4 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${activeLang === 'python' ? 'bg-tertiary-container text-on-tertiary-container border-2 border-tertiary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-2 border-transparent'}`}
            >
              Python
            </button>
            <button 
              onClick={() => setActiveLang('r')}
              className={`py-3 px-4 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 ${activeLang === 'r' ? 'bg-secondary-container text-on-secondary-container border-2 border-secondary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-2 border-transparent'}`}
            >
              R Script
            </button>
          </div>
        </div>

        <div className="flex-1 bg-[#1e1e1e] rounded-2xl overflow-hidden flex flex-col shadow-inner border border-outline-variant/20">
          <div className="bg-[#2d2d2d] px-4 py-3 flex items-center justify-between border-b border-black/20 shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-3">
                <div className="w-2.5 h-2.5 rounded-full bg-error"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-tertiary"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {preset}.{activeLang === 'python' ? 'py' : 'R'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-[10px] font-bold transition-colors"
              >
                <Download className="w-3 h-3" />
                DOWNLOAD
              </button>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-[10px] font-bold transition-colors"
              >
                {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'COPIED' : 'COPY CODE'}
              </button>
            </div>
          </div>
          <div className="p-4 overflow-y-auto max-h-[400px]">
            <SyntaxHighlighter 
              language={activeLang} 
              style={vscDarkPlus}
              customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '12px' }}
              wrapLines={true}
            >
              {displayCode}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
}
