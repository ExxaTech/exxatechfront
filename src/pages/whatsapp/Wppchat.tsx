import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";

export const Wppchat: React.FC = () => {
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

    </LayoutBaseDePagina>
  );
};