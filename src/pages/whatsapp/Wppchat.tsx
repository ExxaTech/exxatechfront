import { Grid } from "@mui/material";
import { useState } from "react";
import { ListTools } from "../../shared/components";
import { BasePageLayout } from "../../shared/layouts";
import { IUserList } from "../../shared/services/api/user/UserServices";
import { WppchatContatos } from "./component/WppChatContact";
import { WppchatMessage } from "./component/WppChatMessage";


export const Wppchat: React.FC = () => {
  const [user, setUser] = useState<IUserList>({ id: 0, name: '' });

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
        <WppchatContatos setUserActive={setUser} />
        <WppchatMessage user={user} />
      </Grid>

    </BasePageLayout>
  );
};