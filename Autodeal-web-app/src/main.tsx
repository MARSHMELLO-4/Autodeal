import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { store } from './store/store.ts'
import { LanguageProvider } from './i18n/LanguageContext.tsx'

// Marks the document so scroll-reveal hiding is active (content is never
// hidden without this class — e.g. if JS fails to boot).
document.documentElement.classList.add('js-anim')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </Provider>
  </StrictMode>,
)
