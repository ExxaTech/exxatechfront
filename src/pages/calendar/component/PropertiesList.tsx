import { Avatar, Grid, List, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Paper } from "@mui/material";
import { FiberManualRecord } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "../../../shared/hooks";
import { IObserver, Observable } from "../../../shared/observer/Observable";
import { IProperty } from "../../../shared/types/PropertyTypes";
import { PropertyServices } from "../../../shared/services/api/property/PropertyServices";

interface IPropertiesListProps {
  setPropertyActive: (property: IProperty) => void;
  observable: Observable<IProperty>;
  busca: string;
  partnerTypeFilter: string[]; // ex: ['DIRECT', 'AIRBNB', 'OTHERS']
}

export const PropertiesList: React.FC<IPropertiesListProps> = ({ observable, setPropertyActive, busca, partnerTypeFilter }) => {
  const [rows, setRows] = useState<IProperty[]>([]);
  const { debounce } = useDebounce();

  useEffect(() => {
    debounce(async () => {
      const response = await PropertyServices.getAll(1, busca);
      if (!(response instanceof Error)) {
        // filtrar partnerType
        const filtered = response.data.filter(p =>
          p.partnerInfo?.partnerType && partnerTypeFilter.includes(p.partnerInfo.partnerType)
        );
        setRows(filtered);
      }
    });
  }, [busca, partnerTypeFilter]);

  const handleClick = (property: IProperty) => {
    setPropertyActive(property);
  };

  return (
    <Grid item xs={12} sm={5} md={4} lg={3} xl={2}>
      <List
        style={{ maxHeight: '-webkit-fill-available', overflowY: 'auto' }}
        component={Paper}
        variant="outlined"
        sx={{ m: 1 }}
      >
        {rows.map(row => (
          <ListItemButton key={row.id} onClick={() => handleClick(row)}>
            <ListItemAvatar style={{ minWidth: 35 }}>
              <Avatar
                style={{ width: 30, height: 30, fontSize: 14 }}
                src={row.images?.[0]}
              />
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
              secondary={`${row.address?.neighborhood || ''}/${row.address?.city || ''}`}
            />
          </ListItemButton>
        ))}
      </List>
    </Grid>
  );
};
