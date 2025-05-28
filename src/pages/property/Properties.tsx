import { Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ListTools } from "../../shared/components";
import { BasePageLayout } from "../../shared/layouts";
import { Observable } from "../../shared/observer/Observable";
import { IProperty } from "../../shared/services/api/property/PropertyServices";
import { PropertiesList } from "./component/PropertiesList";
import { PropertiesDetail } from "./component/PropertiesDetail";


export const Properties: React.FC = () => {
  const [property, setProperty] = useState<IProperty>({ id: 0, title: '' });
  const [searchParams, setSearchParams] = useSearchParams();
  const observable = new Observable<IProperty>();
  observable.addObserver({ update: setProperty });

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  return (
    <BasePageLayout
      navigation={[
        { description: "Inicio", path: "/" },
        { description: "Imóveis", path: "/property" }]}
      toolBar={
        <ListTools
          showSearchInput
          searchText={busca}          
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
        <PropertiesList
          observable={observable}
          setPropertyActive={setProperty} />
        <PropertiesDetail
          observable={observable}
          property={property} />
      </Grid>

    </BasePageLayout>
  );
};