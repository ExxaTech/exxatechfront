import { Avatar, Grid, List, ListItemAvatar, ListItemButton, ListItemText, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useDebounce } from "../../../shared/hooks";
import { IUserList, UserServices } from "../../../shared/services/api/user/UserServices";
import { MessageServices } from "../../../shared/services/api/message/MessageServices";

interface IWppchatContatosProps {
  setUserActive: (user: IUserList) => void;
}

export const WppchatContatos: React.FC<IWppchatContatosProps> = ({ setUserActive }) => {

  const [rows, setRows] = useState<IUserList[]>([]);
  const { debounce } = useDebounce();

  useEffect(() => {
    debounce(() => {
      UserServices.getAllUsersWithChat()
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
  }, []);

  const handleClick = (user: IUserList) => {
    setUserActive(user);
  };

  return (
    <Grid item xs={8} sm={8} md={4} lg={4} xl={2}>
      <List
        style={{ maxHeight: '-webkit-fill-available', overflow: 'auto' }}
        component={Paper}
        variant="outlined"
        sx={{ m: 1 }}
      >
        {rows.map((row) => (
          row.contact !== undefined && (
            <ListItemButton key={row.id} onClick={(_) => handleClick(row)}>
              <ListItemAvatar style={{ minWidth: 35 }}>
                <Avatar
                  style={{ width: 30, height: 30, fontSize: 14 }}
                  src={row.avatar} />
              </ListItemAvatar>
              <ListItemText
                primaryTypographyProps={{ style: { fontSize: 14 } }}
                primary={row.name}
                secondaryTypographyProps={{ style: { fontSize: 12 } }}
                secondary={new Date(row.contact.lastMessageTimeStamp).toLocaleDateString('pt-BR') != new Date().toLocaleDateString('pt-BR')
                  ? new Date(row.contact.lastMessageTimeStamp).toLocaleDateString('pt-BR') :
                  new Date(row.contact.lastMessageTimeStamp).toLocaleTimeString('pt-BR')}
              />
            </ListItemButton>
          )
        ))}
      </List>
    </Grid >
  );
} 