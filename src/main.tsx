import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from './context/I18nContext.tsx'
import { WizardProvider } from './context/WizardContext.tsx'
import { RetirementProvider } from './context/RetirementContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <RetirementProvider>
        <WizardProvider>
          <App />
        </WizardProvider>
      </RetirementProvider>
    </I18nProvider>
  </StrictMode>,
)
