import { Box, Button, Icon, Paper, TextField, useTheme } from '@mui/material';

import { Environtment } from '../../environment';

interface IListToolsProps {
  searchText?: string;
  showSearchInput?: boolean;
  whenChangeSearchText?: (novoText: string) => void;
  newButtonText?: string;
  showNewButtonText?: boolean;
  whenClickOnNew?: () => void;
}

export const ListTools: React.FC<IListToolsProps> = ({
  searchText: searchText = '',
  showSearchInput = false,
  whenChangeSearchText: whenChangeSearchText,
  whenClickOnNew: whenClickOnNew,
  newButtonText: newButtonText = 'Novo',
  showNewButtonText = true,
}) => {
  const theme = useTheme();

  return (
    <Box
      height={theme.spacing(5)}
      marginX={1}
      padding={1}
      paddingX={2}
      display="flex"
      gap={1}
      alignItems='center'
      component={Paper}
    >
      {showSearchInput && (<TextField
        size='small'
        value={searchText}
        onChange={(e) => whenChangeSearchText?.(e.target.value)}
        placeholder={Environtment.SEARCH_INPUT} />)}

      <Box flex={1} display='flex' justifyContent='end' alignItems='center'>
        {showNewButtonText && (<Button
          color='primary'
          disableElevation
          variant='contained'
          onClick={whenClickOnNew}
          endIcon={<Icon>add</Icon>}
        >{newButtonText}</Button>)}
      </Box>
    </Box>
  );
};