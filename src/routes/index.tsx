import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard, ListagemDeCep, Wppchat } from '../pages';
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
        path: '/wppchat',
        icon: 'chat',
      },
      {
        label: 'Endereços',
        path: '/cep',
        icon: 'location_city',
      }
    ]);
  });


  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Dashboard />} />

      {/* Endereços */}

      <Route path="/cep" element={<ListagemDeCep />} />
      <Route path="/cep/detahles/:id" element={<ListagemDeCep />} />

      {/* Whatsapp */}
      <Route path="/wppchat" element={<Wppchat />} />

      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes >
  );
};
