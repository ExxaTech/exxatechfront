import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard, DetalheDeEnderecos, ListagemDeEnderecos, UserDetail, UserList, Wppchat, Properties } from '../pages';
import { useDrawerContext } from '../shared/contexts';

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        label: 'Inicio',
        path: '/pagina-inicial',
        icon: '',
      },
      {
        label: 'Calendário',
        path: '/pagina-inicial',
        icon: '',
      },
      {
        label: 'Contratos',
        path: '/pagina-inicial',
        icon: '',
      },
      {
        label: 'Imóvel',
        path: '/property',
        icon: '',
      }

      // {
      //   label: 'Conversas',
      //   path: '/wppchat',
      //   icon: 'chat',
      // },
      // {
      //   label: 'Endereços',
      //   path: '/endereco',
      //   icon: 'location_city',
      // },
      // {
      //   label: 'Usuários',
      //   path: '/user',
      //   icon: 'person',
      // }
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

      {/* Properties */}
      <Route path="/property" element={<Properties />} />

      {/* Usuários */}
      <Route path="/user" element={<UserList />} />
      <Route path="/user/detalhes/:id" element={<UserDetail />} />

      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes >
  );
};
