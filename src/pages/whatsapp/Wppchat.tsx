import { Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FerramentasDaListagem } from "../../shared/components";
import { useDebounce } from "../../shared/hooks";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { ChatServices, IListagemChat } from "../../shared/services/api/chat/ChatServices";


export const Wppchat: React.FC = () => {

  const [rows, setRows] = useState<IListagemChat[]>([]);
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
      ChatServices.getAllByChatUsuarioId(pagina, busca)
        .then((result) => {

          if (result instanceof Error) {
            console.log(result.message);
          }
        });
    });
  }, [busca, pagina]);

  return (
    <LayoutBaseDePagina
      navegacao={[
        { descricao: "Inicio", caminho: "/" },
        { descricao: "Whatsapp", caminho: "/wppchat" }]}
      barraDeFerramentas={
        <FerramentasDaListagem
          textoBotaoNovo="Novo"
        />
      }
    >
      <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
        <Grid container direction="column" padding={2} spacing={2}>
          <Grid item>
            <Typography variant='h6'>Chat</Typography>
          </Grid>

          <Grid container item direction="row" spacing={2}>
            <Grid item xs={4} sm={4} md={4} lg={2} xl={2}>
              <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
                <Table size="small" aria-label="a dense table">
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell align="left">{row.chatMessageId}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Box>

    </LayoutBaseDePagina>
  );
};