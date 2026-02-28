import { useState } from 'react';

interface InfoBlockProps {
  whyTitle: string;
  whyContent: string;
  theoryTitle: string;
  theoryContent: string;
}

export default function InfoBlock({ whyTitle, whyContent, theoryTitle, theoryContent }: InfoBlockProps) {
  const [openSection, setOpenSection] = useState<'why' | 'theory' | null>(null);

  const toggle = (section: 'why' | 'theory') => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="mt-6 space-y-2">
      <button
        onClick={() => toggle('why')}
        className="w-full text-left px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
      >
        <span className="text-amber-700 font-medium text-sm">💡 {whyTitle}</span>
        {openSection === 'why' && (
          <p className="mt-2 text-sm text-amber-800 leading-relaxed">{whyContent}</p>
        )}
      </button>

      <button
        onClick={() => toggle('theory')}
        className="w-full text-left px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
      >
        <span className="text-blue-700 font-medium text-sm">📚 {theoryTitle}</span>
        {openSection === 'theory' && (
          <p className="mt-2 text-sm text-blue-800 leading-relaxed">{theoryContent}</p>
        )}
      </button>
    </div>
  );
}
