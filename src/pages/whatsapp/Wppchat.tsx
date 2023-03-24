import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";

export const Wppchat: React.FC = () => {
  return (
    <LayoutBaseDePagina
      titulo="Whatsapp"
      barraDeFerramentas={
        <FerramentasDaListagem
          textoBotaoNovo="Novo"
        />
      }
      caminho="/wppchat"
      icone="chat">

    </LayoutBaseDePagina>
  );
};