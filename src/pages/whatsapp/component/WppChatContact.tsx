import { FiberManualRecord } from "@mui/icons-material";
import { Avatar, Grid, List, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Paper } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../../shared/hooks";
import { MessageServices } from "../../../shared/services/api/message/MessageServices";
import { IUserList, UserServices } from "../../../shared/services/api/user/UserServices";

interface IWppchatContatosProps {
  setUserActive: (user: IUserList) => void;
}

export const WppchatContatos: React.FC<IWppchatContatosProps> = ({ setUserActive }) => {

  const [rows, setRows] = useState<IUserList[]>([]);
  const { debounce } = useDebounce();
  const [searchParams, setSearchParams] = useSearchParams();

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  useEffect(() => {
    debounce(() => {
      UserServices.getUsersWithChat(busca)
        .then((resultUser) => {
          if (resultUser instanceof Error) {
            console.log(resultUser.message);
          } else {
            resultUser.data.map((user, index) => {
              const promiseMesage = MessageServices.getAllByUerId(user.id)
              Promise.resolve(promiseMesage).then((resultMesage) => {
                if (resultMesage instanceof Error) {
                  console.error(resultMesage.message)
                } else {
                  resultUser.data[index].messages = resultMesage.data;
                }
              })
            })
            setRows(resultUser.data)
          }
        });
    });
  }, [busca]);

  const handleClick = (user: IUserList) => {
    setUserActive(user);
  };

  function handleDate(date?: string) {
    let formatDate = '';

    if (date) {
      formatDate = new Date(date).toLocaleDateString('pt-BR') != new Date().toLocaleDateString('pt-BR')
        ? new Date(date).toLocaleDateString('pt-BR') : new Date(date).toLocaleTimeString('pt-BR');
    }

    return formatDate;
  }

  function validateShowRows(row: IUserList) {

    if (busca) {
      return true
    } else {
      return row.contact?.lastMessageTimeStamp !== ''
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
                  src={row.avatar} />
              </ListItemAvatar>
              <ListItemText
                primaryTypographyProps={{ style: { fontSize: 14 } }}
                primary={
                  <>
                    {row.name}
                    <ListItemIcon style={{ minWidth: 'unset' }}>
                      <FiberManualRecord style={{ color: row.contact?.isServiceClosed ? 'slategrey' : 'maroon' }} />
                    </ListItemIcon>
                  </>
                }
                secondaryTypographyProps={{ style: { fontSize: 12 } }}
                secondary={handleDate(row.contact?.lastMessageTimeStamp)}
              />
            </ListItemButton>
          )
        ))}
      </List>
    </Grid >
  );
} 