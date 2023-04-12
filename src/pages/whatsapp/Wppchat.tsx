import { Grid } from "@mui/material";
import { FerramentasDaListagem } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { WppchatContatos } from "./componente/WppchatContatos";
import { WppchatMensagens } from "./componente/WppchatMensagens";


export const Wppchat: React.FC = () => {

  return (
    <LayoutBaseDePagina
      navegacao={[
        { descricao: "Inicio", caminho: "/" },
        { descricao: "Atendimento", caminho: "/wppchat" }]}
      barraDeFerramentas={
        <FerramentasDaListagem
          textoBotaoNovo="Novo"
        />
      }
    >
      <Grid container direction="row" flexWrap='nowrap' alignContent='stretch' justifyContent='space-between' alignItems='flex-start'>
        <WppchatContatos />
        <WppchatMensagens />
      </Grid>

    </LayoutBaseDePagina>
  );
};