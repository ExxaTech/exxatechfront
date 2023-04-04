import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Icon, IconButton, LinearProgress, Menu, MenuItem, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FerramentasDaListagem } from "../../shared/components";
import { Environtment } from "../../shared/environment";
import { useDebounce } from "../../shared/hooks";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { IListagemUsuario, UsuariosServices } from "../../shared/services/api/usuario/UsuarioServices";

export const ListagemDeUsuarios: React.FC = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<IListagemUsuario[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);


  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get('pagina')) || 1;
  }, [searchParams]);

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar ? ')) {
      UsuariosServices.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows(oldRows => [...oldRows.filter(oldRow => oldRow.id !== id),]);
            alert('Usuário removido com sucesso');
          }
        });
    }
  }

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      UsuariosServices.getAll(pagina, busca)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            console.log(result.message);
          } else {
            console.log(result);

            setTotalCount(result.totalCount);
            setRows(result.data)
          }
        });
    });
  }, [busca, pagina]);

  const ITEM_HEIGHT = 48;
  const itemsMenu: string[] = ['Deletar', 'Editar'];

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEvents = (action: string, id: number) => {
    console.log(`Action = ${action} ID = ${id}`);
    handleClose();
  };


  return (
    <LayoutBaseDePagina
      navegacao={[
        { descricao: "Inicio", caminho: "/" },
        { descricao: "Usuários", caminho: "/user" }]}
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoBotaoNovo="Novo"
          textoDaBusca={busca}
          aoClicarEmNovo={() => navigate('/user/detalhes/nova')}
          aoMudarTextoDaBusca={texto => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
        />
      }
    >

      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Ações</TableCell>
              <TableCell align="left">Nome</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="center" width={10}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="left">
                  <IconButton size="small" onClick={() => navigate(`/user/detalhes/${row.id}`)}>
                    <Icon>edit</Icon>
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(row.id)}>
                    <Icon>delete</Icon>
                  </IconButton>
                </TableCell>
                <TableCell align="left">{row.nomeCompleto}</TableCell>
                <TableCell align="left">{row.email}</TableCell>
                <TableCell align="left">
                  <IconButton
                    aria-label="more"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    MenuListProps={{
                      'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                      },
                    }}
                  >
                    {itemsMenu.map((option) => (
                      <MenuItem
                        key={option}
                        selected={option === 'Pyxis'}
                        onClick={() => handleEvents(option, row.id)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </Menu>

                </TableCell>
              </TableRow>
            ))}

          </TableBody>

          {totalCount === 0 && !isLoading && (
            <caption>{Environtment.LISTAGEM_VAZIA}</caption>
          )}

          <TableFooter>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4}>
                  <LinearProgress variant="indeterminate" />
                </TableCell>
              </TableRow>
            )}
            {(totalCount > 0
              && totalCount > Environtment.LIMITE_DE_LINHAS
            ) && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Pagination
                      page={pagina}
                      count={Math.ceil(totalCount / Environtment.LIMITE_DE_LINHAS)}
                      onChange={(_, newPage) => setSearchParams({ busca, pagina: newPage.toString() }, { replace: true })}
                    />
                  </TableCell>
                </TableRow>
              )}
          </TableFooter>
        </Table>
      </TableContainer>
    </LayoutBaseDePagina>
  );
};