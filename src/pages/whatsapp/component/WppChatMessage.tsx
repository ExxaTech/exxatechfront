import { Close, Send } from "@mui/icons-material";
import { AppBar, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, List, ListItem, ListItemText, Paper, Toolbar, Tooltip, Typography, useTheme } from "@mui/material";
import { format } from "date-fns";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { Environtment } from "../../../shared/environment";
import { useDebounce } from "../../../shared/hooks";
import { IObserver, Observable } from "../../../shared/observer/Observable";
import { IMessage, MessageServices } from "../../../shared/services/api/message/MessageServices";
import { IUserList, UserServices } from "../../../shared/services/api/user/UserServices";


interface IWppchatMessagesProps {
  user: IUserList;
  observable: Observable<IUserList>;
}

interface ChatInput {
  id: number;
  name: string;
  avatar?: string;
  messages?: IMessage[];
  input: string;
  isServiceClosed: boolean;
}

interface InputValues {
  [key: string]: string;
}

function generateInitialChats(): ChatInput[] {
  return Array.from({ length: Environtment.SIZE_CHAT }).map(() => ({
    id: 0,
    name: "",
    avatar: "",
    messages: [],
    input: '',
    isServiceClosed: false
  }));
}

function generateInitialInputValues(): InputValues[] {
  return Array.from({ length: Environtment.SIZE_CHAT }).map(() => ({
    inputValue: "",
    inputType: "text"
  }));
}

async function saveMessage(message: IMessage, observable: Observable<IUserList>) {
  await MessageServices.create(message);
  const userUpdated = await UserServices.updatelastMessageTimeStampById(message.userId, message.timeStamp);

  if (userUpdated instanceof Error) {
    alert(userUpdated.message);
  } else {
    observable.notifyObservers(userUpdated);
  }
}

const UserObserver: IObserver<IUserList> = {
  update: (data: IUserList) => {
    console.log("User list has been updated:", data);
  }
}

export const WppchatMessage: React.FC<IWppchatMessagesProps> = ({ observable, user }) => {

  const { debounce } = useDebounce();
  const theme = useTheme();
  const [maxHeight, setMaxHeight] = useState(0);
  const [chats, setChats] = useState<ChatInput[]>(generateInitialChats());
  const [inputs, setInputs] = useState<InputValues[]>(generateInitialInputValues());
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [chatId, setchatId] = useState(0);
  observable.addObserver(UserObserver);

  useEffect(() => {
    console.log(user)

    debounce(async () => {

      if (!chats.find(chat => chat.id === user.id)) {
        let tempChats: ChatInput[] = [
          {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            messages: user.messages,
            input: 'chat',
            isServiceClosed: user.contact?.isServiceClosed ?? false
          }
        ];

        if (chats.length < 3) {
          tempChats.push(...chats)
        } else {
          tempChats = [...chats.slice(0, 2).filter(chat => chat.id !== 0), ...tempChats];
        }

        setChats(tempChats)
      }

      const handleResize = () => {
        const availableHeight = window.innerHeight;
        const fixedHeight = 300;
        const calculatedMaxHeight = availableHeight - fixedHeight;
        setMaxHeight(calculatedMaxHeight);
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);

    });
  }, [messages, user]);

  const handlePopUpStateChat = (isOpenPopuUp: boolean, chatId: number) => {
    setOpen(isOpenPopuUp);
    setchatId(chatId)
  };

  const handleFinishOrOpenChat = async (isServiceClosed: boolean, chat: ChatInput, index: number) => {

    const userToUpdate = await UserServices.getById(chat.id);
    if (userToUpdate instanceof Error) alert(userToUpdate.message)
    else {
      if (userToUpdate.contact) {
        userToUpdate.contact.isServiceClosed = isServiceClosed;
        UserServices.updateById(chat.id, userToUpdate);

        setChats((prevChats) =>
          prevChats.map((prevChat, i) => {
            if (i === index) {
              prevChat.isServiceClosed = isServiceClosed;
              return { ...prevChat };
            }
            return prevChat;
          })
        );

        observable.notifyObservers(userToUpdate);
      }
    }
    setOpen(false);
  };

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, indice: number) {
    const { name, value } = event.target;
    const novosInputs = [...inputs];
    novosInputs[indice][name] = value;
    setInputs(novosInputs);
  }

  const handleRemoveChat = (index: number) => {
    const removeListChat = [...chats]
    removeListChat.splice(index, 1);
    setChats(removeListChat)
  }

  const handleClick = (index: number, userId: number) => {
    if (inputs[index][`input${index}`]?.trim() !== '' && inputs[index][`input${index}`] !== undefined) {

      const novaMensagem: IMessage = {
        id: 0,
        message: inputs[index][`input${index}`].trim(),
        sentByUser: true,
        timeStamp: format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        userId: userId,
        tenantId: '1' //TODO: verificar a melhor maneira de controlar tenanty nessa aplicação
      };

      saveMessage(novaMensagem, observable);
      novaMensagem.timeStamp = format(new Date(novaMensagem.timeStamp), 'dd/MM/yyyy hh:mm:ss');
      setMessages((prevMessages) => [...prevMessages, novaMensagem]);
      const novosInputs = [...inputs];
      novosInputs[index][`input${index}`] = '';
      setInputs(novosInputs);

      setChats((prevChats) =>
        prevChats.map((prevChat, i) => {
          if (i === index && prevChat.messages) {
            return { ...prevChat, messages: [...prevChat.messages, novaMensagem] };
          }
          return prevChat;
        })
      );
    }
  }

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>, index: number, userId: number) => {
    if (event.key === 'Enter' && inputs[index][`input${index}`] !== undefined) {
      event.preventDefault();
      handleClick(index, userId)
    }
  };

  return (
    <Box display='flex' flexDirection='row' flex={1}>

      {chats.map((chat, index) => (
        chat.id !== undefined && chat.id !== 0 && (
          <Box key={chat.id} display='flex' flexDirection='column' sx={{ m: 1 }} flex={1}>
            <AppBar position="static">
              <Toolbar style={{ minHeight: '4px', paddingLeft: '10px' }}>
                <Grid container item direction='row'>
                  <Tooltip title={chat.name}>
                    <Avatar
                      style={{ width: 30, height: 30, fontSize: 14 }}
                      src={chat.avatar}
                    />
                  </Tooltip>
                  <Typography variant='body2' whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" paddingLeft={1} style={{ maxWidth: 100 }}>
                    {chat.name}
                  </Typography>
                </Grid>
                <Grid item >
                  <Button variant="contained"
                    style={{ backgroundColor: chat.isServiceClosed ? 'slategrey' : 'maroon' }}
                    onClick={() => handlePopUpStateChat(true, chat.id)}
                  >
                    {chat.isServiceClosed ? 'Fechado' : 'Aberto'}
                  </Button>
                  {(chat.id === chatId && (
                    <Dialog
                      open={open}
                      onClose={() => handlePopUpStateChat(true, chat.id)}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle key={`dialog_title_${chat.id}`}>
                        {chat.isServiceClosed ? 'Deseja abrir o atendimento' : "Deseja finalizar o atendimento?"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText key={`dialog_content_${chat.id}`}>
                          {chat.isServiceClosed ?
                            'Ao abrir um atendimento, você devera iteragir e resolver o atendimento em tempo habil' :
                            "Ao finalizar o atendimento ele tera menor prioridade na visibilidade da lista de contatos"
                          }

                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => handlePopUpStateChat(false, chat.id)}>{'Cancelar'}</Button>
                        <Button onClick={() => handleFinishOrOpenChat(!chat.isServiceClosed, chat, index)}>{chat.isServiceClosed ? 'Abrir' : 'Finalizar'}</Button>
                      </DialogActions>
                    </Dialog>
                  ))}
                </Grid>
                <Grid item >
                  <IconButton edge="end" color="inherit" aria-label="fechar" onClick={() => handleRemoveChat(index)}>
                    <Close />
                  </IconButton>
                </Grid>
              </Toolbar>
            </AppBar>

            <Box component={Paper} elevation={3} flex={1}>
              <List style={{ maxHeight: maxHeight, overflowY: 'auto' }}>
                {chat.messages?.map((message, i) => (
                  <ListItem key={i} style={{ textAlign: message.sentByUser ? 'right' : 'left' }}>
                    <ListItemText
                      primary={message.message}
                      primaryTypographyProps={{
                        style: { backgroundColor: message.sentByUser ? 'whitesmoke' : 'silver' }
                      }}
                      secondary={message.timeStamp}
                      secondaryTypographyProps={{
                        style: { fontWeight: 'bold', color: message.sentByUser ? theme.palette.primary.main : theme.palette.text.primary }
                      }}
                    />

                  </ListItem>
                ))}
              </List>
            </Box>
            <FormControl component={Paper} variant="outlined" size='small' style={{ backgroundColor: 'whitesmoke' }}>
              <InputLabel htmlFor={`mensagem-${index}`}>Digite uma mensagem</InputLabel>
              <Input
                id={`mensagem-${index}`}
                name={`input${index}`}
                value={inputs[index][`input${index}`] || ''}
                onChange={(event) => handleChange(event, index)}
                onKeyPress={(e) => handleKeyPress(e, index, chat.id ? chat.id : 0)}
                style={{ alignItems: 'baseline', paddingLeft: '10px' }}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      style={{ paddingRight: '15px' }}
                      size="small"
                      onClick={(_) => handleClick(index, chat.id ? chat.id : 0)}
                      disabled={inputs[index][`input${index}`]?.trim() === ''}
                    >
                      <Send />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
        )
      ))
      }
    </Box >
  );
} 