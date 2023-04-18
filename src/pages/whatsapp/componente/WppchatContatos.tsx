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
      UsuariosServices.getAllUsuariosComChat(pagina, busca)
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
    <Grid item xs={8} sm={8} md={4} lg={4} xl={2}>
      <List
        style={{ maxHeight: '-webkit-fill-available', overflow: 'auto' }}
        component={Paper}
        variant="outlined"
        sx={{ m: 1 }}
      >
        {rows.map((row) => (
          <ListItemButton key={row.id} onClick={handleClick}>
            <ListItemAvatar style={{ minWidth: 35 }}>
              <Avatar
                style={{ width: 30, height: 30, fontSize: 14 }}
                src={row.avatar} />
            </ListItemAvatar>
            <ListItemText
              primaryTypographyProps={{ style: { fontSize: 14 } }}
              primary={row.nomeCompleto}
              secondaryTypographyProps={{ style: { fontSize: 12 } }}
              secondary={new Date(row.lastMessageTimeStamp).toLocaleDateString('pt-BR') != new Date().toLocaleDateString('pt-BR')
                ? new Date(row.lastMessageTimeStamp).toLocaleDateString('pt-BR') :
                new Date(row.lastMessageTimeStamp).toLocaleTimeString('pt-BR')}
            />
          </ListItemButton>
        ))}
      </List>
    </Grid >
  );
} 