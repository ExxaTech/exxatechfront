import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Icon, IconButton, LinearProgress, Menu, MenuItem, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ListTools } from "../../shared/components";
import { Environment } from "../../shared/environment";
import { useDebounce } from "../../shared/hooks";
import { BasePageLayout } from "../../shared/layouts";
import { IUserList, UserServices } from "../../shared/services/api/user/UserServices";

export const UserList: React.FC = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<IUserList[]>([]);
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
      UserServices.deleteById(id)
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
      UserServices.getAll(pagina, busca)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            console.log(result.message);
          } else {
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
    <BasePageLayout
      navigation={[
        { description: "Inicio", path: "/" },
        { description: "Usuários", path: "/user" }]}
      toolBar={
        <ListTools
          showSearchInput          
          searchText={busca}
          whenClickOnNew={() => navigate('/user/detalhes/nova')}
          whenChangeSearchText={texto => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
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
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.contact?.email}</TableCell>
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
            <caption>{Environment.LIST_EMPTY}</caption>
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
              && totalCount > Environment.LIMIT_ROWS
            ) && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Pagination
                      page={pagina}
                      count={Math.ceil(totalCount / Environment.LIMIT_ROWS)}
                      onChange={(_, newPage) => setSearchParams({ busca, pagina: newPage.toString() }, { replace: true })}
                    />
                  </TableCell>
                </TableRow>
              )}
          </TableFooter>
        </Table>
      </TableContainer>
    </BasePageLayout>
  );
};