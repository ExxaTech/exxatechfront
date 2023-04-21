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
          mostrarInputBusca
          textoBotaoNovo="Novo"
          textoDaBusca={''}
          aoClicarEmNovo={() => { return }}
        />
      }
    >
      <Grid container
        direction="row"
        flexWrap='nowrap'
        justifyContent='flex-start'
        alignItems='stretch'
        height='-webkit-fill-available'>
        <WppchatContatos />
        <WppchatMensagens />
      </Grid>

    </LayoutBaseDePagina>
  );
};