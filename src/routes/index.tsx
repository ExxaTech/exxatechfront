import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard, ListagemDeCidade, Wppchat } from '../pages';
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
        label: 'Cidades',
        path: '/cidades',
        icon: 'location_city',
      }
    ]);
  });


  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Dashboard />} />

      {/* Cidades */}

      <Route path="/cidades" element={<ListagemDeCidade />} />
      <Route path="/cidades/detahles/:id" element={<ListagemDeCidade />} />

      {/* Whatsapp */}
      <Route path="/wppchat" element={<Wppchat />} />

      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes >
  );
};
