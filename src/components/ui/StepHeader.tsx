import { useI18n } from '../../context/I18nContext';

interface StepHeaderProps {
  emoji: string;
  step: number;
  title: string;
}

const gradients = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-violet-500 to-purple-600',
];

export default function StepHeader({ emoji, step, title }: StepHeaderProps) {
  const { t } = useI18n();
  const gradient = gradients[(step - 1) % gradients.length];

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${gradient} p-5 mb-6 flex items-center gap-4`}>
      <div className="text-5xl leading-none flex-shrink-0 select-none">{emoji}</div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">
          {t('app.step')} {step}
        </p>
        <h2 className="text-xl font-bold text-white leading-tight">{title}</h2>
      </div>
      {/* decorative circles */}
      <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute right-6 -bottom-8 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />
    </div>
  );
}
