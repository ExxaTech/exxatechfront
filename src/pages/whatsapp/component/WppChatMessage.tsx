
import { Close, Send } from "@mui/icons-material";
import { AppBar, Avatar, Box, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, List, ListItem, ListItemText, Paper, Toolbar, Typography, useTheme } from "@mui/material";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { Environtment } from "../../../shared/environment";
import { useDebounce } from "../../../shared/hooks";
import { IUserList } from "../../../shared/services/api/user/UserServices";
import chatSocketService from "../../../shared/services/websocket/chat/chatSocketService";
import { IMessage, MessageServices } from "../../../shared/services/api/message/MessageServices";
import { format } from "date-fns";

interface MessageInput {
  id?: number;
  name: string;
  avatar?: string;
  messages?: IMessage[];
  type: string;
}

interface InputValues {
  [key: string]: string;
}

function generateInitialChats(): MessageInput[] {
  return Array.from({ length: Environtment.SIZE_CHAT }).map(() => ({
    id: 0,
    name: "",
    avatar: "",
    messages: [],
    type: ''
  }));
}

function generateInitialInputValues(): InputValues[] {
  return Array.from({ length: Environtment.SIZE_CHAT }).map(() => ({
    inputValue: "",
    inputType: "text"
  }));
}

function saveMessage(message: IMessage) {
  MessageServices.create(message)
    .then((result) => {
      if (result instanceof Error) {
        alert(result.message);
      } else {
        console.log(result)
      }
    })

}

export const WppchatMessage: React.FC<{ user: IUserList }> = ({ user }) => {


  const { debounce } = useDebounce();

  const theme = useTheme();
  const [maxHeight, setMaxHeight] = useState(0);
  const [chats, setChats] = useState<MessageInput[]>(generateInitialChats());
  const [inputs, setInputs] = useState<InputValues[]>(generateInitialInputValues());

  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    debounce(async () => {

      const existingChat = chats.find(chat => chat.id === user.id);

      if (!existingChat) {
        // chatSocketService.getMessages()
        //   .then((result) => {
        //     console.info(result);
        //   }).catch((error) => {
        //     console.error(error);
        //   });

        let tempChats: MessageInput[] = [
          { id: user.id, name: user.name, avatar: user.avatar, messages: user.messages, type: 'chat' }
        ];

        if (chats.length < 3) {
          tempChats.push(...chats)
        } else {
          tempChats = [...chats.slice(0, 2).filter(chat => chat.id !== 0), ...tempChats];
        }

        setChats(tempChats)
      }
    });
  }, [messages, user]);

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

  const handleClick = (index: number, userId?: number) => {
    if (inputs[index][`input${index}`]?.trim() !== '' && inputs[index][`input${index}`] !== undefined) {

      const novaMensagem: IMessage = {
        id: 0,
        message: inputs[index][`input${index}`].trim(),
        sentByUser: true,
        timeStamp: format(new Date(), 'dd/MM/yyyy hh:mm:ss'),
        userId: userId,
        tenantId: '1' //TODO: verificar a melhor maneira de controlar tenanty nessa aplicação
      };

      saveMessage(novaMensagem);

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

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>, index: number, userId?: number) => {
    if (event.key === 'Enter' && inputs[index][`input${index}`] !== undefined) {
      event.preventDefault();
      handleClick(index, userId)
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const availableHeight = window.innerHeight;
      const fixedHeight = 300;
      const calculatedMaxHeight = availableHeight - fixedHeight;
      setMaxHeight(calculatedMaxHeight);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Box display='flex' flexDirection='row' flex={1}>

      {chats.map((chat, index) => (
        chat.id !== undefined && chat.id !== 0 && (
          <Box key={chat.id} display='flex' flexDirection='column' sx={{ m: 1 }} flex={1}>
            <AppBar position="static">
              <Toolbar style={{ minHeight: '4px', paddingLeft: '10px' }}>
                <Grid container item direction='row'>
                  <Avatar
                    style={{ width: 30, height: 30, fontSize: 14 }}
                    src={chat.avatar} />
                  <Typography variant="body2" paddingLeft={1} >
                    {chat.name}
                  </Typography>
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
                onKeyPress={(e) => handleKeyPress(e, index, chat.id)}
                style={{ alignItems: 'baseline', paddingLeft: '10px' }}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      style={{ paddingRight: '15px' }}
                      size="small"
                      onClick={(_) => handleClick(index, chat.id)}
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