import { Grid } from "@mui/material";
import { ListTools } from "../../shared/components";
import { BasePageLayout } from "../../shared/layouts";
import { WppchatContatos } from "./component/WppChatContact";
import { WppchatMessage } from "./component/WppChatMessage";


export const Wppchat: React.FC = () => {

  return (
    <BasePageLayout
      navigation={[
        { description: "Inicio", path: "/" },
        { description: "Atendimento", path: "/wppchat" }]}
      toolBar={
        <ListTools
          showSearchInput
          newButtonText="Novo"
          searchText={''}
          whenClickOnNew={() => { return }}
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
        <WppchatMessage />
      </Grid>

    </BasePageLayout>
  );
};