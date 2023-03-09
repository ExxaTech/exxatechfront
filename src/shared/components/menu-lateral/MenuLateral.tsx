import HomeIcon from '@mui/icons-material/Home';
import { Avatar, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { ReactNode } from 'react';

interface IMenuLateralrData {
  children: ReactNode
}

export const MenuLateral: React.FC<IMenuLateralrData> = ({ children }) => {
  const theme = useTheme();

  return (
    <>
      <Drawer variant='permanent'>
        <Box width={theme.spacing(28)} display="flex" flexDirection="column" height="100%">
          <Box width="25%" height={theme.spacing(20)} display="flex" alignItems="stretch" justifyContent="stretch">
            <Avatar alt="Remy Sharp"
              sx={{ height: theme.spacing(12), width: theme.spacing(12) }}
              src={window.location.origin + '/logo-docs-256.png'} />
          </Box>
          <Divider />
          <Box flex={1}>
            <List component="nav">
              <ListItemButton>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Pagina Inicial" />
              </ListItemButton>
            </List>
          </Box>
        </Box>
      </Drawer>
      <Box height="100vh" marginLeft={theme.spacing(28)}>
        {children}
      </Box>
    </>
  );
};