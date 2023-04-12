import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard, DetalheDeEnderecos, DetalheDeUsuarios, ListagemDeEnderecos, ListagemDeUsuarios, Wppchat } from '../pages';
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
        label: 'Atendimento',
        path: '/wppchat',
        icon: 'chat',
      },
      {
        label: 'Endereços',
        path: '/endereco',
        icon: 'location_city',
      },
      {
        label: 'Usuários',
        path: '/user',
        icon: 'person',
      }
    ]);
  }, []);


  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Dashboard />} />

      {/* Endereços */}

      <Route path="/endereco" element={<ListagemDeEnderecos />} />
      <Route path="/endereco/detalhes/:id" element={<DetalheDeEnderecos />} />

      {/* Whatsapp */}
      <Route path="/wppchat" element={<Wppchat />} />

      {/* Usuários */}
      <Route path="/user" element={<ListagemDeUsuarios />} />
      <Route path="/user/detalhes/:id" element={<DetalheDeUsuarios />} />

      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes >
  );
};
