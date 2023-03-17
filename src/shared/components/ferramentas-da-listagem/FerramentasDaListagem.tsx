import { Box, Button, Icon, Paper, TextField, useTheme } from '@mui/material';

import { Environtment } from '../../environment';

interface IFerramentasDaListagemProps {
  textoDaBusca?: string;
  mostrarInputBusca?: boolean;
  aoMudarTextoDaBusca?: (novoText: string) => void;
  textoBotaoNovo?: string;
  mostrarBotaoNovo?: boolean;
  aoClicarEmNovo?: () => void;
}

export const FerramentasDaListagem: React.FC<IFerramentasDaListagemProps> = ({
  textoDaBusca = '',
  mostrarInputBusca = false,
  aoMudarTextoDaBusca,
  aoClicarEmNovo,
  textoBotaoNovo = 'Novo',
  mostrarBotaoNovo = true,
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
      {mostrarInputBusca && (<TextField
        size='small'
        value={textoDaBusca}
        onChange={(e) => aoMudarTextoDaBusca?.(e.target.value)}
        placeholder={Environtment.INPUT_DE_BUSCA} />)}
      <Box flex={1} display='flex' justifyContent='end' alignItems='center'>
        {mostrarBotaoNovo && (<Button
          color='primary'
          disableElevation
          variant='contained'
          onClick={aoClicarEmNovo}
          endIcon={<Icon>add</Icon>}
        >{textoBotaoNovo}</Button>)}
      </Box>
    </Box>
  );
};