import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard } from '../pages';
import { useDrawerContext } from '../shared/contexts';

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        label: 'Pagina inicial',
        path: '/pagina-inicial',
        icon: 'home',
      },
      {
        label: 'WhatsApp',
        path: '/wpp',
        icon: 'chat',
      }
    ]);
  });


  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Dashboard />} />

      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes >
  );
};
