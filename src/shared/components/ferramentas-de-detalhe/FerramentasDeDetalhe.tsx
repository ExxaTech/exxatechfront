import { ArrowDropDown } from '@mui/icons-material';
import { Box, Button, ButtonGroup, ClickAwayListener, Divider, Grow, Icon, MenuItem, MenuList, Paper, Popper, Skeleton, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useRef, useState } from 'react';

interface IFerramentasDeDetalheProps {
  textoBotaoNovo?: string;
  textoBotaoSalvarEFechar?: string;

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
  textoBotaoSalvarEFechar = 'Salvar e voltar',
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
  const options = ['Menu', 'Novo', 'Salvar e Voltar'];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const isWeb = !smDown && !mdDown;


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

      {(mostrarBotaoSalvar && !mostrarBotaoSalvarCarregando && isWeb)
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

      {mostrarBotaoSalvarCarregando && isWeb && (
        <Skeleton width={110} height={60} />
      )}

      {(mostrarBotaoSalvarEFechar && !mostrarBotaoSalvarEFecharCarregando && isWeb)
        && (<Button
          color='primary'
          disableElevation
          variant='outlined'
          startIcon={<Icon>save</Icon>}
          onClick={aoClicarEmSavarEFechar}
        >
          <Typography variant='button' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
            {textoBotaoSalvarEFechar}
          </Typography>
        </Button>)
      }

      {
        mostrarBotaoSalvarEFecharCarregando && isWeb && (
          <Skeleton width={180} height={60} />
        )
      }

      {
        (mostrarBotaoApagar && !mostrarBotaoApagarCarregando && isWeb)
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
        mostrarBotaoApagarCarregando && isWeb && (
          <Skeleton width={110} height={60} />
        )
      }

      {
        (mostrarBotaoNovo && !mostrarBotaoNovoCarregando && isWeb)
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
        mostrarBotaoNovoCarregando && isWeb && (
          <Skeleton width={110} height={60} />
        )
      }

      {isWeb && (<Divider variant='middle' orientation='vertical' />)}

      {
        (mostrarBotaoVoltar && !mostrarBotaoVoltarCarregando && isWeb)
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
        mostrarBotaoVoltarCarregando && isWeb && (
          <Skeleton width={110} height={60} />
        )
      }

      {!isWeb && (<ButtonGroup variant="contained" ref={anchorRef}>
        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
        <Button onClick={handleToggle}>
          <ArrowDropDown />
        </Button>
      </ButtonGroup>)}

      <Popper
        sx={{ zIndex: 1 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      disabled={index === 0}
                      onClick={(event) => handleMenuItemClick(event, index)}>
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box >
  );
};