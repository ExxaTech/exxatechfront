import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { SideMenu } from './shared/components';
import { Login } from './shared/components/login/Login';
import { AppThemeProvider, AuthProvider, DrawerProvider } from './shared/contexts';
import './shared/forms/TranslateYup';

export const App = () => {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <Login>
          <DrawerProvider>
            <BrowserRouter>

              <SideMenu>
                <AppRoutes />
              </SideMenu>

            </BrowserRouter>
          </DrawerProvider>
        </Login>
      </AppThemeProvider>
    </AuthProvider>
  );
};