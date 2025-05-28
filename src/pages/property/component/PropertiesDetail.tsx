import { Grid, useTheme } from "@mui/material";
import { useDebounce } from "../../../shared/hooks";
import { IObserver, Observable } from "../../../shared/observer/Observable";
import { IProperty } from "../../../shared/types/PropertyTypes";


interface IPropertiesDetailProps {
  property: IProperty;
  observable: Observable<IProperty>;
}


interface InputValues {
  [key: string]: string;
}


const UserObserver: IObserver<IProperty> = {
  update: (data: IProperty) => {
    console.log("User list has been updated:", data);
  }
}

export const PropertiesDetail: React.FC<IPropertiesDetailProps> = ({ observable, property: user }) => {

  const { debounce } = useDebounce();
  const theme = useTheme();
  observable.addObserver(UserObserver);

  return (
    <Grid item xs={8} sm={8} md={4} lg={4} xl={2}>

    </Grid>
  )

} 