import { Box, Button, Divider, Icon, Paper, Skeleton, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';

interface IFerramentasDeDetalheProps {
  textoBotaoNovo?: string;

  mostrarBotaoNovo?: boolean;
  mostrarBotaoVoltar?: boolean;
  mostrarBotaoApagar?: boolean;
  mostrarBotaoSalvar?: boolean;
  mostrarBotaoSalvarEFechar?: boolean;

  mostrarBotaoSalvarCarregando?: boolean;
  mostrarBotaoNovoCarregando?: boolean;
  mostrarBotaoVoltarCarregando?: boolean;
  mostrarBotaoApagarCarregando?: boolean;
  mostrarBotaoSalvarEFecharCarregando?: boolean;

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

  mostrarBotaoSalvarEFecharCarregando = false,
  mostrarBotaoNovoCarregando = false,
  mostrarBotaoVoltarCarregando = false,
  mostrarBotaoApagarCarregando = false,
  mostrarBotaoSalvarCarregando = false,

  aoClicarEmNovo,
  aoClicarEmVoltar,
  aoClicarEmApagar,
  aoClicarEmSalvar,
  aoClicarEmSavarEFechar,

}) => {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
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
      {(mostrarBotaoSalvar && !mostrarBotaoSalvarCarregando)
        && (<Button
          color='primary'
          disableElevation
          variant='contained'
          startIcon={<Icon>save</Icon>}
          onClick={aoClicarEmSalvar}
        >
          <Typography variant='button' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
            Salvar
          </Typography>

        </Button>)}

      {mostrarBotaoSalvarCarregando && (
        <Skeleton width={110} height={60} />
      )}

      {(mostrarBotaoSalvarEFechar && !mostrarBotaoSalvarEFecharCarregando)
        && (<Button
          color='primary'
          disableElevation
          variant='outlined'
          startIcon={<Icon>save</Icon>}
          onClick={aoClicarEmSavarEFechar}
        >
          <Typography variant='button' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
            Salvar e voltar
          </Typography>
        </Button>)
      }

      {
        mostrarBotaoSalvarEFecharCarregando && (
          <Skeleton width={180} height={60} />
        )
      }

      {
        (mostrarBotaoApagar && !mostrarBotaoApagarCarregando)
        && (<Button
          color='primary'
          disableElevation
          variant='outlined'
          startIcon={<Icon>delete</Icon>}
          onClick={aoClicarEmApagar}
        >
          <Typography variant='button' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
            Apagar
          </Typography>
        </Button>)
      }

      {
        mostrarBotaoApagarCarregando && (
          <Skeleton width={110} height={60} />
        )
      }

      {
        (mostrarBotaoNovo && !mostrarBotaoNovoCarregando)
        && (<Button
          color='primary'
          disableElevation
          variant='outlined'
          startIcon={<Icon>add</Icon>}
          onClick={aoClicarEmNovo}
        >
          <Typography variant='button' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
            {textoBotaoNovo}
          </Typography>
        </Button>)
      }

      {
        mostrarBotaoNovoCarregando && (
          <Skeleton width={110} height={60} />
        )
      }

      <Divider variant='middle' orientation='vertical' />

      {
        (mostrarBotaoVoltar && !mostrarBotaoVoltarCarregando)
        && (<Button
          color='primary'
          disableElevation
          variant='outlined'
          startIcon={<Icon>arrow_back</Icon>}
          onClick={aoClicarEmVoltar}
        >
          <Typography variant='button' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
            Voltar
          </Typography>
        </Button>)
      }

      {
        mostrarBotaoVoltarCarregando && (
          <Skeleton width={110} height={60} />
        )
      }
    </Box >
  );
};