import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FerramentasDaListagem } from "../../shared/components";
import { useDebounce } from "../../shared/hooks";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { UsuariosServices } from "../../shared/services/api/usuario/UsuarioServices";

export const ListagemDeUsuarios: React.FC = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  useEffect(() => {

    debounce(() => {
      UsuariosServices.getAll(1, busca)
        .then((result) => {
          if (result instanceof Error) {
            console.log(result.message);
          } else {
            console.log(result);
          }
        });
    });
  }, [busca]);


  return (
    <LayoutBaseDePagina
      titulo="Usuários"
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoBotaoNovo="Novo"
          textoDaBusca={busca}
          aoMudarTextoDaBusca={texto => setSearchParams({ busca: texto }, { replace: true })}
        />
      }
      caminho="/usuario"
      icone="person">

    </LayoutBaseDePagina>
  );
};