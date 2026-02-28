# 🥊 RetireKO — 一拳擊倒你的退休焦慮

> Knock Out Your Retirement Anxiety

一個具備 RWD 的互動式 Web App，透過循序漸進的問答引導，協助你計算專屬的退休目標金額。

## ✨ 功能特色

- 📱 **響應式設計** — Mobile-First，手機與桌機皆有極佳體驗
- 🌐 **雙語支援** — 繁體中文 / English 即時切換
- 🧮 **智慧計算** — 基於 4% 法則（Trinity Study）推算退休目標
- 📊 **清晰報表** — 退休實踐計畫儀表板
- 📄 **PDF 匯出** — 下載個人化退休計畫報表

## 🧠 核心理論：4% 法則

源自 1998 年的 Trinity Study，研究發現：若每年從退休金中提取不超過 4%（等於準備 25 年的生活費），在大多數市場情境下，資金可維持 30 年以上不會枯竭，成功率超過 95%。

**計算公式：** 未來年生活費 × 25 = 退休目標金額

## 🛠️ 技術堆疊

- **React 19** + TypeScript
- **Vite** — 極速開發體驗
- **Tailwind CSS v4** — Utility-First 樣式
- **@react-pdf/renderer** — PDF 生成
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
- [x] **Phase 2** — 核心問答與財務計算邏輯
- [x] **Phase 3** — 結果展示與 PDF 匯出功能
- [x] **Phase 4** — Vercel 部署準備與 README

## 📜 授權

MIT License
