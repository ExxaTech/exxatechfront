import { Person } from "@mui/icons-material";
import { Avatar, Grid, List, ListItemAvatar, ListItemButton, ListItemText, Paper } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../shared/hooks";
import { IListagemUsuario, UsuariosServices } from "../../../shared/services/api/usuario/UsuarioServices";


export const WppchatContatos: React.FC = () => {

  const [rows, setRows] = useState<IListagemUsuario[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();

  const pagina = useMemo(() => {
    return Number(searchParams.get('pagina')) || 1;
  }, [searchParams]);

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  useEffect(() => {
    debounce(() => {
      UsuariosServices.getAll(pagina, busca)
        .then((result) => {
          if (result instanceof Error) {
            console.log(result.message);
          } else {
            setRows(result.data)
          }
        });
    });
  }, [busca, pagina]);

  const handleClick = () => {
    console.log('clique do contato')
  };

  return (
    <Grid item xs={8} sm={8} md={4} lg={4} xl={2} style={{ height: '100vh', overflow: 'auto' }}>
      <List component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        {rows.map((row) => (
          <ListItemButton key={row.id} onClick={handleClick}>
            <ListItemAvatar>
              <Avatar>
                <Person />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={row.email} />
          </ListItemButton>
        ))}
      </List>
    </Grid>
  );
} 