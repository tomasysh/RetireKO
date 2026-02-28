import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { useRetirement } from '../context/RetirementContext';
import { useI18n } from '../context/I18nContext';

function formatPlain(amount: number): string {
  return Math.round(amount).toLocaleString('zh-TW');
}

export default function ShareCard() {
  const { state } = useRetirement();
  const { locale } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!state.retirementTarget || !state.yearsToRetire) return null;

  const isZh = locale === 'zh-TW';
  const targetLabel = formatPlain(state.retirementTarget);

  const generate = async () => {
    if (!cardRef.current) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      setImgUrl(canvas.toDataURL('image/png'));
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!imgUrl) return;
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = 'RetireKO-退休目標.png';
    a.click();
  };

  return (
    <>
      {/* Hidden capture target (off-screen) */}
      <div
        ref={cardRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
          fontFamily: "'Noto Sans TC', system-ui, -apple-system, sans-serif",
          overflow: 'hidden',
          padding: '60px',
          boxSizing: 'border-box',
          color: 'white',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', right: '-80px', top: '-80px', width: '360px', height: '360px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', right: '80px', bottom: '-120px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        {/* Big emoji */}
        <div style={{ position: 'absolute', right: '60px', top: '40px', fontSize: '180px', opacity: 0.2, lineHeight: 1 }}>🥊</div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* Top: Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '48px', lineHeight: 1 }}>🥊</span>
            <div>
              <div style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px' }}>RetireKO</div>
              <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
                {isZh ? '一拳擊倒你的退休焦慮' : 'Knock Out Your Retirement Anxiety'}
              </div>
            </div>
          </div>

          {/* Middle: Target */}
          <div>
            <div style={{ fontSize: '22px', color: 'rgba(255,255,255,0.75)', marginBottom: '12px' }}>
              {isZh ? '🎯 我的退休目標' : '🎯 My Retirement Target'}
            </div>
            <div style={{ fontSize: '96px', fontWeight: 900, letterSpacing: '-3px', lineHeight: 1, color: '#6ee7b7' }}>
              NT$ {targetLabel}
            </div>
          </div>

          {/* Bottom: Stats row */}
          <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                {isZh ? '距離退休' : 'Years to Retire'}
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700 }}>{state.yearsToRetire} {isZh ? '年' : 'yrs'}</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                {isZh ? '年化報酬率' : 'Annual Return'}
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700 }}>{state.annualReturn}%</div>
            </div>
            {state.retirementYears && (
              <div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                  {isZh ? '退休後支撐' : 'Retirement Duration'}
                </div>
                <div style={{ fontSize: '32px', fontWeight: 700 }}>{state.retirementYears} {isZh ? '年' : 'yrs'}</div>
              </div>
            )}
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                {isZh ? '4% 法則 × 平均壽命精算' : '4% Rule × Life Expectancy'}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                retireko.vercel.app
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trigger button */}
      <button
        onClick={generate}
        disabled={loading}
        className="flex-1 px-6 py-3 rounded-lg text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition-colors cursor-pointer font-medium flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {isZh ? '產生中…' : 'Generating…'}
          </>
        ) : (
          <>📤 {isZh ? '分享結果卡片' : 'Share Result Card'}</>
        )}
      </button>

      {/* Preview modal */}
      {imgUrl && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setImgUrl(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-4 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={imgUrl} alt="分享卡片" className="w-full rounded-lg mb-4" />
            <div className="flex gap-3">
              <button
                onClick={download}
                className="flex-1 px-4 py-2.5 rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 transition-colors font-medium"
              >
                ⬇️ {isZh ? '下載圖片' : 'Download Image'}
              </button>
              <button
                onClick={() => setImgUrl(null)}
                className="px-4 py-2.5 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors font-medium"
              >
                {isZh ? '關閉' : 'Close'}
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">
              {isZh ? '儲存後分享至 Instagram、LINE 或 Twitter 🚀' : 'Save and share on Instagram, LINE, or Twitter 🚀'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
