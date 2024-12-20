import './globals.css';
import { AnalysisProvider } from './context/AnalysisProvider';

export const metadata = {
  title: 'Flalingo',
  description: 'Konuşma ve Metin Hata Analizi',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AnalysisProvider>
          {children}
        </AnalysisProvider>
      </body>
    </html>
  )
}
