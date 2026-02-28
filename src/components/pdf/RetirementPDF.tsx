import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { useI18n } from '../../context/I18nContext';
import { useRetirement } from '../../context/RetirementContext';
import { formatCurrency } from '../../utils/calculations';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 12 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#065f46' },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 24 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#1f2937' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  label: { color: '#4b5563' },
  value: { fontWeight: 'bold', color: '#065f46' },
  disclaimer: { fontSize: 9, color: '#9ca3af', marginTop: 24, lineHeight: 1.5 },
  highlight: { backgroundColor: '#ecfdf5', padding: 16, borderRadius: 4, marginBottom: 16, textAlign: 'center' },
  highlightLabel: { fontSize: 12, color: '#059669', marginBottom: 4 },
  highlightValue: { fontSize: 22, fontWeight: 'bold', color: '#065f46' },
  ruleBox: { backgroundColor: '#eef2ff', padding: 12, borderRadius: 4, marginBottom: 16 },
  ruleTitle: { fontSize: 11, fontWeight: 'bold', color: '#4338ca', marginBottom: 4 },
  ruleText: { fontSize: 10, color: '#4f46e5', lineHeight: 1.5 },
});

interface PDFDocumentProps {
  targetAmount: string;
  yearsToRetire: number;
  futureAnnualExpense: string;
  monthlySaving: string;
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
        <Text style={styles.subtitle}>
          {isZh ? '退休實踐計畫報表' : 'Retirement Action Plan Report'}
        </Text>

        <View style={styles.highlight}>
          <Text style={styles.highlightLabel}>
            {isZh ? '需準備的退休金' : 'Retirement Savings Needed'}
          </Text>
          <Text style={styles.highlightValue}>NT$ {props.targetAmount}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{isZh ? '個人資料' : 'Personal Info'}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{isZh ? '目前年齡' : 'Current Age'}</Text>
            <Text style={styles.value}>{props.currentAge}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{isZh ? '預期退休年齡' : 'Retirement Age'}</Text>
            <Text style={styles.value}>{props.retireAge}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{isZh ? '距離退休' : 'Years to Retire'}</Text>
            <Text style={styles.value}>{props.yearsToRetire} {isZh ? '年' : 'years'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{isZh ? '每月理想生活費' : 'Monthly Expense'}</Text>
            <Text style={styles.value}>NT$ {props.monthlyExpense}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{isZh ? '計算結果' : 'Results'}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{isZh ? '退休時預估年開銷' : 'Future Annual Expense'}</Text>
            <Text style={styles.value}>NT$ {props.futureAnnualExpense}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{isZh ? '退休目標金額' : 'Retirement Target'}</Text>
            <Text style={styles.value}>NT$ {props.targetAmount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{isZh ? '建議每月儲蓄 (6% 年化)' : 'Monthly Savings (6% return)'}</Text>
            <Text style={styles.value}>NT$ {props.monthlySaving}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{isZh ? '通膨率' : 'Inflation Rate'}</Text>
            <Text style={styles.value}>{props.inflationRate}%</Text>
          </View>
        </View>

        <View style={styles.ruleBox}>
          <Text style={styles.ruleTitle}>
            {isZh ? '4% 法則 (Trinity Study)' : 'The 4% Rule (Trinity Study)'}
          </Text>
          <Text style={styles.ruleText}>
            {isZh
              ? '將未來年生活費 × 25 = 退休目標金額。每年僅提取總資產的 4%，根據歷史數據，有超過 95% 的機率資金可維持 30 年以上。'
              : 'Future annual expense × 25 = Retirement target. Withdrawing only 4% per year, historical data shows over 95% probability of funds lasting 30+ years.'}
          </Text>
        </View>

        <Text style={styles.disclaimer}>
          {isZh
            ? '⚠️ 以上計算僅供參考，不構成任何投資建議。實際退休規劃應諮詢專業財務顧問。'
            : '⚠️ The above calculations are for reference only and do not constitute investment advice. Please consult a professional financial advisor.'}
        </Text>
      </Page>
    </Document>
  );
}

export default function RetirementPDFDownload() {
  const { t, locale } = useI18n();
  const { state } = useRetirement();

  if (!state.retirementTarget || !state.futureAnnualExpense || !state.yearsToRetire || !state.monthlySaving || !state.currentAge || !state.retireAge || !state.monthlyExpense) {
    return null;
  }

  return (
    <PDFDownloadLink
      document={
        <RetirementPDFDocument
          targetAmount={formatCurrency(state.retirementTarget)}
          yearsToRetire={state.yearsToRetire}
          futureAnnualExpense={formatCurrency(state.futureAnnualExpense)}
          monthlySaving={formatCurrency(state.monthlySaving)}
          inflationRate={state.inflationRate}
          currentAge={state.currentAge}
          retireAge={state.retireAge}
          monthlyExpense={formatCurrency(state.monthlyExpense)}
          locale={locale}
        />
      }
      fileName="RetireKO-退休計畫.pdf"
      className="flex-1 px-6 py-3 rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-pointer font-medium text-center"
    >
      {({ loading }) => (loading ? '...' : t('app.downloadPdf'))}
    </PDFDownloadLink>
  );
}
