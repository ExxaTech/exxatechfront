import { Card, CardContent, Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BasePageLayout } from "../../shared/layouts";
import { Observable } from "../../shared/observer/Observable";
import { IProperty } from "../../shared/types/PropertyTypes";
import { PropertiesList } from "./component/PropertiesList";
import { RentalCalendarDetail } from "./component/RentalCalendarDetail";
import { ListTools } from "../../shared/components";

export const RentalCalendar: React.FC = () => {
  const [property, setProperty] = useState<IProperty | null>(null);
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
        { description: "Calendário", path: "/rental-calendar" }]}
      toolBar={
              <ListTools
                showSearchInput
                searchText={busca}
                whenChangeSearchText={(texto) =>
                  setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
                }
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
          setPropertyActive={setProperty}
          busca={busca}
          partnerTypeFilter={['DIRECT', 'AIRBNB', 'OTHERS']}
        />
        
        <Grid container  paddingX={2} mt={1}>
          <Grid item xs={12} md={9}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <RentalCalendarDetail
                    property={property}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
      </Grid>
    </BasePageLayout>
  );
};
