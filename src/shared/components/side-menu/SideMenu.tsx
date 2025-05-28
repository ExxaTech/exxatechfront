import { 
  Avatar, 
  AppBar, 
  Toolbar, 
  Icon, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  useMediaQuery, 
  useTheme,
  Box,
  Divider
} from '@mui/material';
import { ReactNode } from 'react';
import { useMatch, useNavigate, useResolvedPath } from 'react-router-dom';
import { useAppThemeContext, useAuthContext, useDrawerContext } from '../../contexts';

interface IListItemLinkProps {
  label: string;
  icon: string;
  to: string;
  onClick: (() => void) | undefined;
}

const ListItemLink: React.FC<IListItemLinkProps> = ({ label, icon, to, onClick }) => {
  const navigate = useNavigate();
  const resolvedPath = useResolvedPath(to);
  const match = useMatch({ path: resolvedPath.pathname, end: false });

  const handleClick = () => {
    navigate(to);
    onClick?.();
  };

  return (
    <ListItemButton 
      selected={!!match} 
      onClick={handleClick}
      sx={{
        padding: '8px 12px', // Reduz o padding
        '& .MuiListItemIcon-root': {
          minWidth: 'auto', // Remove o min-width padrão
          marginRight: '4px' // Reduz o espaço entre ícone e texto
        }
      }}
    >
      <ListItemIcon>
        <Icon fontSize="small">{icon}</Icon> {/* Tamanho menor do ícone */}
      </ListItemIcon>
      <ListItemText 
        primary={label} 
        primaryTypographyProps={{ variant: 'body2' }} // Texto um pouco menor
      />
    </ListItemButton>
  );
};

interface ISideMenuData {
  children: ReactNode
}

export const SideMenu: React.FC<ISideMenuData> = ({ children }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const { isDrawerOpen, toggleDrawerOpen, drawerOptions } = useDrawerContext();
  const { toggleTheme } = useAppThemeContext();
  const { logout } = useAuthContext();

  return (
    <>
      <AppBar 
        position="fixed"
        sx={{
          height: '64px', // Altura fixa
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px',
          minHeight: '64px !important' // Força a altura do Toolbar
        }}>
          {/* Lado esquerdo - Avatar/Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              alt="Logo"
              sx={{ 
                height: 40, 
                width: 40,
                marginRight: 2
              }}
              src={window.location.origin + '/testto.png'} 
            />
          </Box>

          {/* Menu central - Itens de navegação */}
          <Box sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            <List 
              component="nav" 
              sx={{ 
                display: 'flex',
                padding: 0,
                '& .MuiListItemButton-root': {
                  padding: '6px 10px' // Padding mais compacto
                }
              }}
            >
              {drawerOptions.map(drawerOption => (
                <ListItemLink
                  key={drawerOption.path}
                  icon={drawerOption.icon}
                  to={drawerOption.path}
                  label={drawerOption.label}
                  onClick={smDown ? toggleDrawerOpen : undefined}
                />
              ))}
            </List>
          </Box>

          {/* Lado direito - Ações */}
          <Box display="flex">
            <ListItemButton 
              onClick={toggleTheme}
              sx={{ 
                padding: '8px',
                '& .MuiListItemIcon-root': {
                  minWidth: 'auto'
                }
              }}
            >
              <Icon fontSize="small">dark_mode</Icon>
            </ListItemButton>
            <ListItemButton 
              onClick={logout}
              sx={{ 
                padding: '8px',
                '& .MuiListItemIcon-root': {
                  minWidth: 'auto'
                }
              }}
            >
              <Icon fontSize="small">logout</Icon>
            </ListItemButton>
          </Box>
        </Toolbar>
      </AppBar>
    
      {/* Conteúdo principal */}
      <Box 
        component="main"
        sx={{
          marginTop: '64px', // Altura do AppBar
          height: 'calc(100vh - 64px)',
          overflow: 'auto'
        }}
      >
        {children}
      </Box>
    </>
  );
};