import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard, 
  DetalheDeEnderecos, 
  ListagemDeEnderecos, 
  UserDetail, 
  UserList, 
  Wppchat, 
  Properties,
  Contracts ,
  RentalCalendar
} from '../pages';
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
        path: '/calendar',
        icon: '',
      },
      {
        label: 'Contratos',
        path: '/contract',
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

      {/* Calendário */}
      <Route path="/calendar" element={<RentalCalendar />} />

      {/* Endereços */}

      <Route path="/endereco" element={<ListagemDeEnderecos />} />
      <Route path="/endereco/detalhes/:id" element={<DetalheDeEnderecos />} />

      {/* Whatsapp */}
      <Route path="/wppchat" element={<Wppchat />} />

      {/* Properties */}
      <Route path="/property" element={<Properties />} />

      {/* Properties */}
      <Route path="/contract" element={<Contracts />} />

      {/* Usuários */}
      <Route path="/user" element={<UserList />} />
      <Route path="/user/detalhes/:id" element={<UserDetail />} />

      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes >
  );
};
