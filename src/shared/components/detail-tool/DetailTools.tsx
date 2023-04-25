import { ArrowDropDown } from '@mui/icons-material';
import { Box, Button, ButtonGroup, ClickAwayListener, Divider, Grow, Icon, MenuItem, MenuList, Paper, Popper, Skeleton, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useRef, useState } from 'react';

interface IDetailToolsProps {
  newTextButton?: string;

  showNewButton?: boolean;
  showBackButton?: boolean;
  showDeleteButton?: boolean;
  showSaveButton?: boolean;
  showSaveButtonAndClose?: boolean;

  showNewButtonLoading?: boolean;
  showBackButtonLoading?: boolean;
  showDeleteButtonLoading?: boolean;
  showSaveButtonLoading?: boolean;
  showSaveButtonAndCloseLoading?: boolean;

  whenClickingNew?: () => void;
  whenClickingBack?: () => void;
  whenClickingDelete?: () => void;
  whenClickingSave?: () => void;
  whenClickingSaveAndClose?: () => void;
}

export const DetailTools: React.FC<IDetailToolsProps> = ({
  newTextButton = 'Novo',

  showNewButton = true,
  showBackButton = false,
  showDeleteButton = true,
  showSaveButton = true,
  showSaveButtonAndClose = false,

  showNewButtonLoading = false,
  showBackButtonLoading = false,
  showDeleteButtonLoading = false,
  showSaveButtonLoading = false,
  showSaveButtonAndCloseLoading = false,

  whenClickingNew,
  whenClickingBack,
  whenClickingDelete,
  whenClickingSave,
  whenClickingSaveAndClose,
}) => {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const theme = useTheme();
  const options = ['Menu', 'Salvar', 'Apagar', 'Voltar'];
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

      {(showSaveButton && !showSaveButtonLoading && isWeb)
        && (<Button
          color='primary'
          disableElevation
          variant='contained'
          startIcon={<Icon>save</Icon>}
          onClick={whenClickingSave}
        >
          <Typography variant='button' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
            Salvar
          </Typography>

        </Button>)}

      {showSaveButtonLoading && isWeb && (
        <Skeleton width={110} height={60} />
      )}

      {(showSaveButtonAndClose && !showSaveButtonAndCloseLoading && !smDown && !mdDown) && (
        <Button
          color='primary'
          disableElevation
          variant='outlined'
          onClick={whenClickingSaveAndClose}
          startIcon={<Icon>save</Icon>}
        >
          <Typography variant='button' whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
            Salvar e fechar
          </Typography>
        </Button>
      )}

      {(showSaveButtonAndCloseLoading && !smDown && !mdDown) && (
        <Skeleton width={180} height={60} />
      )}

      {
        (showDeleteButton && !showDeleteButtonLoading && isWeb)
        && (<Button
          color='primary'
          disableElevation
          variant='outlined'
          startIcon={<Icon>delete</Icon>}
          onClick={whenClickingDelete}
        >
          <Typography variant='button' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
            Apagar
          </Typography>
        </Button>)
      }

      {
        showDeleteButtonLoading && isWeb && (
          <Skeleton width={110} height={60} />
        )
      }

      {
        (showNewButton && !showNewButtonLoading && isWeb)
        && (<Button
          color='primary'
          disableElevation
          variant='outlined'
          startIcon={<Icon>add</Icon>}
          onClick={whenClickingNew}
        >
          <Typography variant='button' whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
            {newTextButton}
          </Typography>
        </Button>)
      }

      {
        showNewButtonLoading && isWeb && (
          <Skeleton width={110} height={60} />
        )
      }

      {
        (
          showBackButton &&
          (showNewButton || showDeleteButton || showSaveButton || showSaveButtonAndClose)
        ) && (
          <Divider variant='middle' orientation='vertical' />
        )
      }

      {(showBackButton && !showBackButtonLoading && isWeb) && (
        <Button
          color='primary'
          disableElevation
          variant='outlined'
          onClick={whenClickingBack}
          startIcon={<Icon>arrow_back</Icon>}
        >
          <Typography variant='button' whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
            Voltar
          </Typography>
        </Button>
      )}

      {showBackButtonLoading && (
        <Skeleton width={110} height={60} />
      )}

      {!isWeb && (<ButtonGroup variant="contained" ref={anchorRef}>
        <Button onClick={options[selectedIndex] === 'Salvar' ? whenClickingSave : whenClickingDelete}>{options[selectedIndex]}</Button>
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