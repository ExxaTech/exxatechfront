import { Box, Button, Divider, Icon, Paper, useTheme } from '@mui/material';

interface IFerramentasDeDetalheProps {
  textoBotaoNovo?: string;

  mostrarBotaoNovo?: boolean;
  mostrarBotaoVoltar?: boolean;
  mostrarBotaoApagar?: boolean;
  mostrarBotaoSalvar?: boolean;
  mostrarBotaoSalvarEFechar?: boolean;

  aoClicarEmNovo?: () => void;
  aoClicarEmVoltar?: () => void;
  aoClicarEmApagar?: () => void;
  aoClicarEmSalvar?: () => void;
  aoClicarEmSavarEFechar?: () => void;
}

export const FerramentasDeDetalhe: React.FC<IFerramentasDeDetalheProps> = ({
  textoBotaoNovo = 'Novo',

  mostrarBotaoNovo = true,
  mostrarBotaoVoltar = true,
  mostrarBotaoApagar = true,
  mostrarBotaoSalvar = true,
  mostrarBotaoSalvarEFechar = false,

  aoClicarEmNovo,
  aoClicarEmVoltar,
  aoClicarEmApagar,
  aoClicarEmSalvar,
  aoClicarEmSavarEFechar,

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
      alignItems='cefnter'
      component={Paper}
    >
      {mostrarBotaoSalvar && (<Button
        color='primary'
        disableElevation
        variant='contained'
        startIcon={<Icon>save</Icon>}
        onClick={aoClicarEmSalvar}
      >Salvar</Button>)}

      {mostrarBotaoSalvarEFechar && (<Button
        color='primary'
        disableElevation
        variant='outlined'
        startIcon={<Icon>save</Icon>}
        onClick={aoClicarEmSavarEFechar}
      >Salvar e voltar</Button>)}

      {mostrarBotaoApagar && (<Button
        color='primary'
        disableElevation
        variant='outlined'
        startIcon={<Icon>delete</Icon>}
        onClick={aoClicarEmApagar}
      >Apagar</Button>)}

      {mostrarBotaoNovo && (<Button
        color='primary'
        disableElevation
        variant='outlined'
        startIcon={<Icon>add</Icon>}
        onClick={aoClicarEmNovo}
      >{textoBotaoNovo}</Button>)}

      <Divider variant='middle' orientation='vertical' />

      {mostrarBotaoVoltar && (<Button
        color='primary'
        disableElevation
        variant='outlined'
        startIcon={<Icon>arrow_back</Icon>}
        onClick={aoClicarEmVoltar}
      >Voltar</Button>)}
    </Box>
  );
};