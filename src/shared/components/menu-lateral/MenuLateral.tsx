import { Avatar, Divider, Drawer, Icon, List, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/system';
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
    <ListItemButton selected={!!match} onClick={handleClick}>
      <ListItemIcon>
        <Icon> {icon} </Icon>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
};

interface IMenuLateralrData {
  children: ReactNode
}

export const MenuLateral: React.FC<IMenuLateralrData> = ({ children }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const { isDrawerOpen, toggleDrawerOpen, drawerOptions } = useDrawerContext();
  const { toggleTheme } = useAppThemeContext();
  const { logout } = useAuthContext();

  return (
    <>
      <Drawer open={isDrawerOpen} variant={smDown ? 'temporary' : 'permanent'} onClose={toggleDrawerOpen}>
        <Box width={theme.spacing(28)} display="flex" flexDirection="column" height="100%">
          <Box width="100%" height={theme.spacing(15)} display="flex" alignItems="center" justifyContent="center">
            <Avatar alt="Remy Sharp"
              sx={{ height: theme.spacing(10), width: theme.spacing(10) }}
              src={window.location.origin + '/exxa.png'} />
          </Box>
          <Divider />
          <Box flex={1}>
            <List component="nav">
              {drawerOptions.map(drawerOptions => (
                <ListItemLink
                  key={drawerOptions.path}
                  icon={drawerOptions.icon}
                  to={drawerOptions.path}
                  label={drawerOptions.label}
                  onClick={smDown ? toggleDrawerOpen : undefined}
                />
              ))}
            </List>
          </Box>
          <Box>
            <List component="nav">
              <ListItemButton onClick={toggleTheme}>
                <ListItemIcon>
                  <Icon> dark_mode </Icon>
                </ListItemIcon>
                <ListItemText />
              </ListItemButton>
              <ListItemButton onClick={logout}>
                <ListItemIcon>
                  <Icon> logout </Icon>
                </ListItemIcon>
                <ListItemText />
              </ListItemButton>
            </List>
          </Box>
        </Box>
      </Drawer>
      <Box height="100vh" marginLeft={smDown ? 0 : theme.spacing(28)}>
        {children}
      </Box>
    </>
  );
};