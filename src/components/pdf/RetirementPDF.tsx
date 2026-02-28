import { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer';
import notoLatinUrl from '@fontsource/noto-sans-tc/files/noto-sans-tc-latin-400-normal.woff?url';
import notoLatinBoldUrl from '@fontsource/noto-sans-tc/files/noto-sans-tc-latin-700-normal.woff?url';
import notoCJKUrl from '@fontsource/noto-sans-tc/files/noto-sans-tc-chinese-traditional-400-normal.woff?url';
import notoCJKBoldUrl from '@fontsource/noto-sans-tc/files/noto-sans-tc-chinese-traditional-700-normal.woff?url';
import { useI18n } from '../../context/I18nContext';
import { useRetirement } from '../../context/RetirementContext';
import { formatCurrency } from '../../utils/calculations';

// Register Latin font (for ASCII, numbers, NT$)
Font.register({
  family: 'NotoSansLatin',
  fonts: [
    { src: notoLatinUrl, fontWeight: 400 },
    { src: notoLatinBoldUrl, fontWeight: 700 },
  ],
});

// Register CJK font (for Traditional Chinese characters)
Font.register({
  family: 'NotoSansCJK',
  fonts: [
    { src: notoCJKUrl, fontWeight: 400 },
    { src: notoCJKBoldUrl, fontWeight: 700 },
  ],
});

function isCJKChar(char: string) {
  const cp = char.codePointAt(0) ?? 0;
  return (
    (cp >= 0x4e00 && cp <= 0x9fff) || // CJK Unified Ideographs
    (cp >= 0x3400 && cp <= 0x4dbf) || // CJK Extension A
    (cp >= 0xf900 && cp <= 0xfaff) || // CJK Compatibility Ideographs
    (cp >= 0x3000 && cp <= 0x303f) || // CJK Symbols & Punctuation
    (cp >= 0xff00 && cp <= 0xffef)    // Fullwidth Forms
  );
}

function splitByScript(text: string) {
  const segments: Array<{ text: string; isCJK: boolean }> = [];
  let current = '';
  let currentIsCJK = false;
  for (const char of text) {
    const charIsCJK = isCJKChar(char);
    if (current === '') {
      current = char;
      currentIsCJK = charIsCJK;
    } else if (charIsCJK !== currentIsCJK) {
      segments.push({ text: current, isCJK: currentIsCJK });
      current = char;
      currentIsCJK = charIsCJK;
    } else {
      current += char;
    }
  }
  if (current) segments.push({ text: current, isCJK: currentIsCJK });
  return segments;
}

import type { Style } from '@react-pdf/types';

// Text component that auto-selects font per character script
function BT({ children, style }: { children: string; style?: Style }) {
  const segments = splitByScript(children);
  const isBold = (style as { fontWeight?: number | string })?.fontWeight === 700;
  return (
    <Text style={style}>
      {segments.map((seg, i) => (
        <Text
          key={i}
          style={{
            fontFamily: seg.isCJK ? 'NotoSansCJK' : 'NotoSansLatin',
            fontWeight: isBold ? 700 : 400,
          }}
        >
          {seg.text}
        </Text>
      ))}
    </Text>
  );
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12 },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#065f46', fontFamily: 'NotoSansLatin' },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 24 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 700, marginBottom: 8, color: '#1f2937' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  label: { color: '#4b5563' },
  value: { fontWeight: 700, color: '#065f46', fontFamily: 'NotoSansLatin' },
  disclaimer: { fontSize: 9, color: '#9ca3af', marginTop: 24, lineHeight: 1.5 },
  highlight: { backgroundColor: '#ecfdf5', padding: 16, borderRadius: 4, marginBottom: 16, textAlign: 'center' },
  highlightLabel: { fontSize: 12, color: '#059669', marginBottom: 4 },
  highlightValue: { fontSize: 22, fontWeight: 700, color: '#065f46', fontFamily: 'NotoSansLatin' },
  ruleBox: { backgroundColor: '#eef2ff', padding: 12, borderRadius: 4, marginBottom: 16 },
  ruleTitle: { fontSize: 11, fontWeight: 700, color: '#4338ca', marginBottom: 4 },
  ruleText: { fontSize: 10, color: '#4f46e5', lineHeight: 1.5 },
});

interface PDFDocumentProps {
  targetAmount: string;
  minimumTarget: string | null;
  yearsToRetire: number;
  retirementYears: number | null;
  lifeExpectancy: number | null;
  futureAnnualExpense: string;
  monthlySaving: string;
  annualReturn: number;
  inflationRate: number;
  currentAge: number;
  retireAge: number;
  monthlyExpense: string;
  locale: string;
}

function RetirementPDFDocument(props: PDFDocumentProps) {
  const isZh = props.locale === 'zh-TW';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>RetireKO</Text>
        <BT style={styles.subtitle}>
          {isZh ? '退休實踐計畫報表' : 'Retirement Action Plan Report'}
        </BT>

        <View style={styles.highlight}>
          <BT style={styles.highlightLabel}>
            {isZh ? '需準備的退休金' : 'Retirement Savings Needed'}
          </BT>
          <Text style={styles.highlightValue}>NT$ {props.targetAmount}</Text>
        </View>

        <View style={styles.section}>
          <BT style={styles.sectionTitle}>{isZh ? '個人資料' : 'Personal Info'}</BT>
          <View style={styles.row}>
            <BT style={styles.label}>{isZh ? '目前年齡' : 'Current Age'}</BT>
            <Text style={styles.value}>{props.currentAge}</Text>
          </View>
          <View style={styles.row}>
            <BT style={styles.label}>{isZh ? '預期退休年齡' : 'Retirement Age'}</BT>
            <Text style={styles.value}>{props.retireAge}</Text>
          </View>
          <View style={styles.row}>
            <BT style={styles.label}>{isZh ? '距離退休' : 'Years to Retire'}</BT>
            <BT style={styles.value}>{`${props.yearsToRetire} ${isZh ? '年' : 'years'}`}</BT>
          </View>
          <View style={styles.row}>
            <BT style={styles.label}>{isZh ? '每月理想生活費' : 'Monthly Expense'}</BT>
            <Text style={styles.value}>NT$ {props.monthlyExpense}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <BT style={styles.sectionTitle}>{isZh ? '計算結果' : 'Results'}</BT>
          <View style={styles.row}>
            <BT style={styles.label}>{isZh ? '退休後支撐年限' : 'Retirement Duration'}</BT>
            <BT style={styles.value}>{props.retirementYears ? `${props.retirementYears} ${isZh ? '年（平均壽命 ' + props.lifeExpectancy + ' 歲）' : 'yrs (life exp. ' + props.lifeExpectancy + ')'}` : '-'}</BT>
          </View>
          <View style={styles.row}>
            <BT style={styles.label}>{isZh ? '退休時預估年開銷' : 'Future Annual Expense'}</BT>
            <Text style={styles.value}>NT$ {props.futureAnnualExpense}</Text>
          </View>
          <View style={styles.row}>
            <BT style={styles.label}>{isZh ? '退休目標（4% 法則，年生活費 × 25）' : 'Target (4% Rule, expense × 25)'}</BT>
            <Text style={styles.value}>NT$ {props.targetAmount}</Text>
          </View>
          {props.minimumTarget && (
            <View style={styles.row}>
              <BT style={styles.label}>{isZh ? '最低需求（平均壽命精算，花到歸零）' : 'Minimum (life expectancy spend-down)'}</BT>
              <Text style={styles.value}>NT$ {props.minimumTarget}</Text>
            </View>
          )}
          <View style={styles.row}>
            <BT style={styles.label}>
              {isZh ? `建議每月投資 (${props.annualReturn}% 年化)` : `Monthly Investment (${props.annualReturn}% return)`}
            </BT>
            <Text style={styles.value}>NT$ {props.monthlySaving}</Text>
          </View>
          <View style={styles.row}>
            <BT style={styles.label}>{isZh ? '通膨率' : 'Inflation Rate'}</BT>
            <Text style={styles.value}>{props.inflationRate}%</Text>
          </View>
        </View>

        <View style={styles.ruleBox}>
          <BT style={styles.ruleTitle}>
            {isZh ? '4% 法則 (Trinity Study)' : 'The 4% Rule (Trinity Study)'}
          </BT>
          <BT style={styles.ruleText}>
            {isZh
              ? `4% 法則（Trinity Study, 1998）：每年從退休金中提取不超過 4%（即準備 25 倍年生活費），歷史上 95% 以上的情境下資金可維持 30 年以上，甚至持續增長。${props.retirementYears ? `根據你的平均壽命，退休金需支撐約 ${props.retirementYears} 年，4% 法則目標可安全覆蓋。` : ''}`
              : `The 4% Rule (Trinity Study, 1998): withdrawing ≤4% per year (saving 25× annual expenses) has a 95%+ historical success rate over 30+ years, with assets potentially continuing to grow.${props.retirementYears ? ` Your retirement fund needs to last ~${props.retirementYears} years; the 4% Rule target safely covers this.` : ''}`}
          </BT>
        </View>

        <BT style={styles.disclaimer}>
          {isZh
            ? '以上計算僅供參考，不構成任何投資建議。實際退休規劃應諮詢專業財務顧問。'
            : 'The above calculations are for reference only and do not constitute investment advice. Please consult a professional financial advisor.'}
        </BT>
      </Page>
    </Document>
  );
}

export default function RetirementPDFDownload() {
  const { t, locale } = useI18n();
  const { state } = useRetirement();
  const [loading, setLoading] = useState(false);

  if (!state.retirementTarget || !state.futureAnnualExpense || !state.yearsToRetire || !state.monthlySaving || !state.currentAge || !state.retireAge || !state.monthlyExpense) {
    return null;
  }

  const handleDownload = async () => {
    setLoading(true);
    try {
      const blob = await pdf(
        <RetirementPDFDocument
          targetAmount={formatCurrency(state.retirementTarget!)}
          minimumTarget={state.minimumTarget != null ? formatCurrency(state.minimumTarget) : null}
          yearsToRetire={state.yearsToRetire!}
          retirementYears={state.retirementYears}
          lifeExpectancy={state.lifeExpectancy}
          futureAnnualExpense={formatCurrency(state.futureAnnualExpense!)}
          monthlySaving={formatCurrency(state.monthlySaving!)}
          inflationRate={state.inflationRate}
          annualReturn={state.annualReturn}
          currentAge={state.currentAge!}
          retireAge={state.retireAge!}
          monthlyExpense={formatCurrency(state.monthlyExpense!)}
          locale={locale}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'RetireKO-退休計畫.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="flex-1 px-6 py-3 rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 disabled:cursor-wait transition-colors cursor-pointer font-medium flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="animate-pulse">{locale === 'zh-TW' ? '產生 PDF 中…' : 'Generating PDF…'}</span>
        </>
      ) : (
        <>📄 {t('app.downloadPdf')}</>
      )}
    </button>
  );
}

