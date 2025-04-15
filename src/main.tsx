import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { PrimeReactProvider } from 'primereact/api';
import { UserProvider } from './context/UserContext.tsx';
import { StudyProvider } from './context/StudyContext.tsx';
import { DirectionProvider } from './context/DirectionContext.tsx';
import './index.css';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primeicons/primeicons.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider>
      <UserProvider>
        <AuthProvider>
          <StudyProvider>
            <DirectionProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </DirectionProvider>
          </StudyProvider>
        </AuthProvider>
      </UserProvider>
    </PrimeReactProvider>
  </StrictMode>
);
