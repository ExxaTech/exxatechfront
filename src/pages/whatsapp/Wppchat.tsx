import { Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ListTools } from "../../shared/components";
import { BasePageLayout } from "../../shared/layouts";
import { Observable } from "../../shared/observer/Observable";
import { IUserList } from "../../shared/services/api/user/UserServices";
import { WppchatContatos } from "./component/WppChatContact";
import { WppchatMessage } from "./component/WppChatMessage";


export const Wppchat: React.FC = () => {
  const [user, setUser] = useState<IUserList>({ id: 0, name: '' });
  const [searchParams, setSearchParams] = useSearchParams();
  const observable = new Observable<IUserList>();
  observable.addObserver({ update: setUser });

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  return (
    <BasePageLayout
      navigation={[
        { description: "Inicio", path: "/" },
        { description: "Atendimento", path: "/wppchat" }]}
      toolBar={
        <ListTools
          showSearchInput
          searchText={busca}
          showNewButtonText={false}
          whenChangeSearchText={texto => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
        />
      }
    >
      <Grid container
        direction="row"
        flexWrap='nowrap'
        justifyContent='flex-start'
        alignItems='stretch'
        height='-webkit-fill-available'>
        <WppchatContatos
          observable={observable}
          setUserActive={setUser} />
        <WppchatMessage
          observable={observable}
          user={user} />
      </Grid>

    </BasePageLayout>
  );
};