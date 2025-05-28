import { Box, IconButton, Paper, TextField, useTheme } from '@mui/material';
import { Add } from '@mui/icons-material'; // Importando o ícone do Material-UI
import { Environment } from '../../environment';

interface IListToolsProps {
  searchText?: string;
  showSearchInput?: boolean;
  whenChangeSearchText?: (novoText: string) => void;
  showNewButton?: boolean;
  whenClickOnNew?: () => void;
}

export const ListTools: React.FC<IListToolsProps> = ({
  searchText = '',
  showSearchInput = false,
  whenChangeSearchText,
  whenClickOnNew,
  showNewButton = true,
}) => {
  const theme = useTheme();

  return (
    <Box
      height={theme.spacing(5)}
      marginX={1}
      marginTop={2}
      padding={1}
      paddingX={2}
      display="flex"
      gap={1}
      alignItems='center'
      component={Paper}
    >
      {showSearchInput && (
        <TextField
          size='small'
          value={searchText}
          onChange={(e) => whenChangeSearchText?.(e.target.value)}
          placeholder={Environment.SEARCH_INPUT}
        />
      )}

      <Box flex={1} display='flex' justifyContent='end' alignItems='center'>
        {showNewButton && (
          <IconButton
            color='primary'
            onClick={whenClickOnNew}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            <Add />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};