import { useState } from 'react';
import { useI18n } from '../context/I18nContext';
import type { WithdrawalRow } from '../utils/calculations';
import { formatCurrency } from '../utils/calculations';

interface Props {
  schedule: WithdrawalRow[];
}

export default function WithdrawalScheduleTable({ schedule }: Props) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  if (schedule.length === 0) return null;

  const PREVIEW_HEAD = 5;
  const PREVIEW_TAIL = 5;
  const needCollapse = schedule.length > PREVIEW_HEAD + PREVIEW_TAIL + 2;

  const visibleRows = expanded || !needCollapse
    ? schedule
    : [...schedule.slice(0, PREVIEW_HEAD), ...schedule.slice(-PREVIEW_TAIL)];

  const depleted = schedule[schedule.length - 1].eoyBalance <= 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
      <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <h3 className="text-sm font-bold text-amber-800">📊 {t('withdrawalSchedule.title')}</h3>
        <p className="text-xs text-amber-600 mt-0.5">{t('withdrawalSchedule.subtitle')}</p>
      </div>

      <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-gray-50 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-3 py-2 text-left text-gray-600 font-semibold">{t('withdrawalSchedule.colYear')}</th>
              <th className="px-3 py-2 text-center text-gray-600 font-semibold">{t('withdrawalSchedule.colAge')}</th>
              <th className="px-3 py-2 text-right text-gray-600 font-semibold">{t('withdrawalSchedule.colBoyBalance')}</th>
              <th className="px-3 py-2 text-right text-gray-600 font-semibold">{t('withdrawalSchedule.colWithdrawal')}</th>
              <th className="px-3 py-2 text-right text-gray-600 font-semibold">{t('withdrawalSchedule.colEoyBalance')}</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, idx) => {
              const showDivider = !expanded && needCollapse && idx === PREVIEW_HEAD;
              return (
                <>
                  {showDivider && (
                    <tr key="divider" className="bg-gray-50">
                      <td colSpan={5} className="px-3 py-2 text-center text-gray-400 text-xs">
                        ⋯ {schedule.length - PREVIEW_HEAD - PREVIEW_TAIL} {t('withdrawalSchedule.yearUnit')} ⋯
                      </td>
                    </tr>
                  )}
                  <tr
                    key={row.year}
                    className={`border-b border-gray-100 ${row.eoyBalance <= 0 ? 'bg-red-50' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                  >
                    <td className="px-3 py-1.5 text-gray-700 tabular-nums">{row.year}</td>
                    <td className="px-3 py-1.5 text-center text-gray-700 tabular-nums">{row.age}</td>
                    <td className="px-3 py-1.5 text-right text-gray-700 tabular-nums">NT$ {formatCurrency(row.boyBalance)}</td>
                    <td className="px-3 py-1.5 text-right text-orange-600 font-medium tabular-nums">-NT$ {formatCurrency(row.withdrawal)}</td>
                    <td className={`px-3 py-1.5 text-right font-medium tabular-nums ${row.eoyBalance <= 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                      {row.eoyBalance <= 0 ? t('withdrawalSchedule.fundDepleted') : `NT$ ${formatCurrency(row.eoyBalance)}`}
                    </td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {needCollapse && (
        <div className="px-4 py-2 border-t border-gray-100 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-amber-600 hover:text-amber-800 font-medium cursor-pointer"
          >
            {expanded ? `▲ ${t('withdrawalSchedule.collapse')}` : `▼ ${t('withdrawalSchedule.showAll')}`}
          </button>
        </div>
      )}

      {depleted && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-100 text-center">
          <p className="text-xs text-red-600 font-medium">⚠️ {t('withdrawalSchedule.fundDepleted')}</p>
        </div>
      )}
    </div>
  );
}
