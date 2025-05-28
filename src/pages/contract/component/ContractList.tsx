import { FiberManualRecord } from "@mui/icons-material";
import {
  Avatar,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../shared/hooks";
import { ContractServices } from "../../../shared/services/api/contract/contractService";
import { IContract } from "../../../shared/types/Contract";

interface ContractsListProps {
  onContractClick: (contract: IContract) => void;
}

export const ContractsList: React.FC<ContractsListProps> = ({
  onContractClick,
}) => {
  const [rows, setRows] = useState<IContract[]>([]);
  const { debounce } = useDebounce();
  const [searchParams] = useSearchParams();

  const busca = useMemo(() => searchParams.get("busca") || "", [searchParams]);

  useEffect(() => {
    debounce(async () => {
      const result = await ContractServices.getAll(1, busca);
      if (result instanceof Error) {
        console.error(result.message);
      } else {
        setRows(result.data);
      }
    });
  }, [busca]);

  const formatDate = (date?: string) => {
    if (!date) return "";
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("pt-BR");
  };

  return (
    <Grid item xs={8} sm={8} md={4} lg={4} xl={2}>
      <List
        style={{ maxHeight: "-webkit-fill-available", overflow: "auto" }}
        component={Paper}
        variant="outlined"
        sx={{ m: 1 }}
      >
        {rows.map((row) => (
          <ListItemButton key={row.id} onClick={() => onContractClick(row)}>
            <ListItemAvatar style={{ minWidth: 35 }}>
              <Avatar
                style={{ width: 30, height: 30, fontSize: 14 }}
                src={row.tenant?.avatarUrl}
              />
            </ListItemAvatar>
            <ListItemText
              primaryTypographyProps={{ style: { fontSize: 14 } }}
              primary={
                <>
                  {row.title}
                  <ListItemIcon style={{ minWidth: "unset", marginLeft: 6 }}>
                    <FiberManualRecord
                      style={{
                        color: row.status === "pending" ? "green" : "gray",
                        fontSize: 10,
                      }}
                    />
                  </ListItemIcon>
                </>
              }
              secondaryTypographyProps={{ style: { fontSize: 12 } }}
              secondary={
                <>
                  {row.tenant?.name} | {formatDate(row.startDate)} → {formatDate(row.endDate)}
                </>
              }
            />
          </ListItemButton>
        ))}
      </List>
    </Grid>
  );
};
