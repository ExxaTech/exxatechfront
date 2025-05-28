import { FiberManualRecord } from "@mui/icons-material";
import { Avatar, Grid, List, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Paper } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../shared/hooks";
import { IObserver, Observable } from "../../../shared/observer/Observable";
import { IProperty, PropertyServices } from "../../../shared/services/api/property/PropertyServices";

interface IPropertiesListProps {
  setPropertyActive: (user: IProperty) => void;
  observable: Observable<IProperty>;
}


export const PropertiesList: React.FC<IPropertiesListProps> = ({ observable, setPropertyActive: setPropertyActive }) => {

  const [rows, setRows] = useState<IProperty[]>([]);
  const { debounce } = useDebounce();
  const [searchParams, setSearchParams] = useSearchParams();

  const PropertyObserver: IObserver<IProperty> = {
    update: (data: IProperty) => {
      setRows((prevRows) => {
        const newRows = [...prevRows];
        const index = newRows.findIndex((row) => row.id === data.id);
        if (index >= 0) {
          newRows[index] = data;
        } else {
          newRows.push(data);
        }
        return newRows;
      });
    }
  };

  observable.addObserver(PropertyObserver);

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  useEffect(() => {
    debounce(async () => {
      const propertiesList = await PropertyServices.getAll(1, busca);
      if (propertiesList instanceof Error) {
        console.log(propertiesList.message);
      } else {
        propertiesList.data.map((property, index) => {
          const promiseMesage = PropertyServices.getById(property.id)
          Promise.resolve(promiseMesage).then((resultMesage) => {
            if (resultMesage instanceof Error) {
              console.error(resultMesage.message)
            } else {
              propertiesList.data[index].description = resultMesage.description;
            }
          })
        })
        setRows(propertiesList.data)
      }
    });
  }, [busca]);

  const handleClick = (property: IProperty) => {
    setPropertyActive(property);
  };

  function handleDate(date?: string) {
    let formatDate = '';

    if (date) {
      formatDate = new Date(date).toLocaleDateString('pt-BR') != new Date().toLocaleDateString('pt-BR')
        ? new Date(date).toLocaleDateString('pt-BR') : new Date(date).toLocaleTimeString('pt-BR');
    }

    return formatDate;
  }

  function validateShowRows(row: IProperty) {

    if (busca) {
      return true
    } else {
      return true
    }
  }

return (
    <Grid item xs={8} sm={8} md={4} lg={4} xl={2}>
      <List
        style={{ maxHeight: '-webkit-fill-available', overflow: 'auto' }}
        component={Paper}
        variant="outlined"
        sx={{ m: 1 }}
      >
        {rows.map((row) => (
          validateShowRows(row) && (
            <ListItemButton key={row.id} onClick={(_) => handleClick(row)}>
              <ListItemAvatar style={{ minWidth: 35 }}>
                <Avatar
                  style={{ width: 30, height: 30, fontSize: 14 }}
                  src={row.images?.at(0)} />
              </ListItemAvatar>
              <ListItemText
                primaryTypographyProps={{ style: { fontSize: 14 } }}    
                primary={
                  <>
                    {row.title}
                    <ListItemIcon style={{ minWidth: 'unset' }}>
                      <FiberManualRecord style={{ color: row.color }} />
                    </ListItemIcon>
                  </>
                }           
                secondaryTypographyProps={{ style: { fontSize: 12 } }}     
                secondary={
                  <>
                  | {row.address?.bairro}/{row.address?.localidade}   
                  </>
                }        
              />
            </ListItemButton>
          )
        ))}
      </List>
    </Grid >
  );
} 