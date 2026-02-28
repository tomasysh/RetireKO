import { useState } from 'react';
import { useI18n } from '../context/I18nContext';

interface InfoBlockProps {
  content: string;
  links?: Array<{ label: string; url: string }>;
}

export default function InfoBlock({ content, links }: InfoBlockProps) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <div className="mt-5">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="info-block-content"
        className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        <span className="text-slate-600 font-medium text-sm">{t('app.learnMore')}</span>
        <span className="text-slate-400 text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div id="info-block-content" className="mt-1 px-4 py-4 rounded-lg bg-slate-50 border border-slate-200 border-t-0 rounded-t-none">
          <p className="text-sm text-slate-700 leading-relaxed mb-3">{content}</p>
          {links && links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 underline"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
