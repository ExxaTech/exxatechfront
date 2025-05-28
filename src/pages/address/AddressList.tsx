import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ListTools } from "../../shared/components";
import { Environment } from "../../shared/environment";
import { useDebounce } from "../../shared/hooks";
import { BasePageLayout } from "../../shared/layouts";
import { AddressService, IAddressList } from "../../shared/services/api/address/AddressService";

export const ListagemDeEnderecos: React.FC = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { debounce } = useDebounce();

  const [rows, setRows] = useState<IAddressList[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const pagina = useMemo(() => {
    return Number(searchParams.get('pagina')) || 1;
  }, [searchParams]);

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar ? ')) {
      AddressService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows(oldRows => [...oldRows.filter(oldRow => oldRow.id !== id),]);
            alert('Endereço removido com sucesso');
          }
        });
    }
  }

  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      AddressService.getAll(pagina, busca)
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

  return (
    <BasePageLayout
      navigation={[
        { description: "Inicio", path: "/" },
        { description: "Endereços", path: "/endereco" }]}
      toolBar={
        <ListTools
          showSearchInput          
          searchText={busca}
          whenClickOnNew={() => navigate('/endereco/detalhes/novo')}
          whenChangeSearchText={texto => setSearchParams({ busca: texto }, { replace: true })}
        />
      }
    >
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table size="small" aria-label="a dense table">

          <TableHead>
            <TableRow>
              <TableCell align="left">Ações</TableCell>
              <TableCell align="left">Logradouro</TableCell>
              <TableCell align="left">Bairro</TableCell>
              <TableCell align="left">Cidade</TableCell>
              <TableCell align="left">Estado</TableCell>
              <TableCell align="left">CEP</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="left">
                  <IconButton size="small" onClick={() => navigate(`/endereco/detalhes/${row.id}`)}>
                    <Icon>edit</Icon>
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(row.id)}>
                    <Icon>delete</Icon>
                  </IconButton>
                </TableCell>
                <TableCell align="left">{row.logradouro}</TableCell>
                <TableCell align="left">{row.bairro}</TableCell>
                <TableCell align="left">{row.localidade}</TableCell>
                <TableCell align="left">{row.uf}</TableCell>
                <TableCell align="left">{row.cep}</TableCell>
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