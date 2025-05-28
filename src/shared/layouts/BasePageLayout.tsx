import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs, Icon, IconButton, Link, Theme, useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrawerContext } from '../contexts';

interface IBasePageLayoutProps {
  children: ReactNode;
  navigation: { description: string; path: string; }[];
  toolBar: ReactNode;
}

export const BasePageLayout: React.FC<IBasePageLayoutProps> = ({
  navigation: navigation,
  children,
  toolBar: toolBar,
}
) => {

  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const theme = useTheme();
  const { toggleDrawerOpen } = useDrawerContext();
  const navigate = useNavigate();


  return (
    <Box height='100%' display="flex" flexDirection="column" gap={2}>
      {
        toolBar && (<Box>
          {toolBar}
        </Box>)
      }
      <Box padding={1} display="flex" alignItems="center" flexWrap="wrap" height={theme.spacing(smDown ? 2 : mdDown ? 3 : 4)} gap={1}>
        {smDown && (
          <IconButton onClick={toggleDrawerOpen}>
            <Icon>menu</Icon>
          </IconButton>)}
        <Box display="flex" height={theme.spacing(2)}>
          <Breadcrumbs separator={<NavigateNextIcon />} >
            {
              navigation.map((item) =>
                <Link component="button"
                  variant="body2"
                  key={item.path}
                  onClick={() => navigate(item.path)}>
                  {item.description}
                </Link>)
            }
          </Breadcrumbs>
        </Box>
      </Box>
      
      <Box flex={1} overflow='auto' >
        {children}
      </Box>
    </Box >
  );
};