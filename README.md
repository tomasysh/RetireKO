# 🥊 RetireKO — 一拳擊倒你的退休焦慮

> Knock Out Your Retirement Anxiety

一個具備 RWD 的互動式 Web App，透過循序漸進的問答引導，協助你計算專屬的退休目標金額。

## ✨ 功能特色

- 📱 **響應式設計** — Mobile-First，手機與桌機皆有極佳體驗
- 🌐 **雙語支援** — 繁體中文 / English 即時切換
- 🧮 **智慧計算** — 結合台灣平均壽命（113年內政部數據）與有限年金公式精算退休目標
- 🕯️ **平均壽命整合** — 男性 77.42 歲 / 女性 84.30 歲，精準計算退休金需支撐年數
- 📊 **清晰報表** — 退休實踐計畫儀表板，含年化報酬率自訂（預設 6%）
- 🔭 **情境模擬器** — 「換個角度看看」拉桿，互動探索不同投資策略的影響
- 📤 **分享結果卡片** — 一鍵產生精美結果圖片，分享至 Instagram / LINE / Twitter
- 📄 **PDF 匯出** — 下載個人化退休計畫報表（含 CJK 中文字型）
- ⌨️ **鍵盤快捷鍵** — Enter 鍵直接進入下一步

## 🧠 核心理論：有限年金 × 4% 法則

傳統 4% 法則假設資金永久不枯竭，但本工具更進一步：

1. **平均壽命精算** — 根據你的性別與預計退休年齡，計算退休金實際需支撐的年數
2. **有限年金公式** — 以真實報酬率（年化報酬率 ÷ 通膨率）推算需儲備的總資產，更精準
3. **通膨調整** — 將今日生活費換算為退休當年的實際花費

**計算公式：** PV = PMT × (1 - (1 + r_real)^(-n)) / r_real

其中 r_real = (1 + 名目報酬率) / (1 + 通膨率) - 1，n = 退休年數

## 🛠️ 技術堆疊

- **React 19** + TypeScript
- **Vite** — 極速開發體驗
- **Tailwind CSS v4** — Utility-First 樣式
- **@react-pdf/renderer** — PDF 生成（含 Noto Sans TC CJK 字型）
- **html2canvas** — 分享卡片截圖生成
- **React Context + useReducer** — 狀態管理

## 🚀 本地啟動

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 📦 部署

本專案已準備好部署至 [Vercel](https://vercel.com)：

1. Fork 或 Clone 此 Repo
2. 在 Vercel 匯入專案
3. Build Command: `npm run build`
4. Output Directory: `dist`

## 📋 開發進度

- [x] **Phase 1** — 專案初始化與 UI/UX 基礎框架
- [x] **Phase 2** — 核心問答與財務計算邏輯（含年化報酬率自訂、通膨推估）
- [x] **Phase 3** — 結果展示與 PDF 匯出功能
- [x] **Phase 4** — Vercel 部署準備與 README
- [x] **Phase 5** — 進階功能：情境模擬器、平均壽命精算、分享卡片、鍵盤快捷鍵

## 📜 授權

MIT License

---

Made with ❤️ by [卡片表哥 Zettel Cousin](https://zettelcousin.tw/)
