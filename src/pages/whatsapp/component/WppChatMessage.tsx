
import { Close, Send } from "@mui/icons-material";
import { AppBar, Avatar, Box, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, List, ListItem, ListItemText, Paper, Toolbar, Typography, useTheme } from "@mui/material";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { Environtment } from "../../../shared/environment";
import { useDebounce } from "../../../shared/hooks";
import { IUserList } from "../../../shared/services/api/user/UserServices";
import chatSocketService from "../../../shared/services/websocket/chat/chatSocketService";

interface MessageInput {
  id?: number;
  name: string;
  avatar?: string;
  messages: Message[];
  type: string;
}

interface InputValues {
  [key: string]: string;
}

interface Message {
  text: string;
  sentByUser: boolean;
  timestamp: string
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

export const WppchatMessage: React.FC<{ user: IUserList }> = ({ user }) => {


  const { debounce } = useDebounce();

  const theme = useTheme();
  const [maxHeight, setMaxHeight] = useState(0);
  const [chats, setChats] = useState<MessageInput[]>(generateInitialChats());
  const [inputs, setInputs] = useState<InputValues[]>(generateInitialInputValues());

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    debounce(async () => {

      const existingChat = chats.find(chat => chat.id === user.id);

      if (!existingChat) {

        chatSocketService.getMessages()
          .then((result) => {
            console.info(result);
          }).catch((error) => {
            console.error(error);
          });

        let tempChats: MessageInput[] = [
          { id: user.id, name: user.name, avatar: user.avatar, messages: messages, type: 'chat' }
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

  const handleClick = (index: number) => {
    if (inputs[index][`input${index}`]?.trim() !== '' && inputs[index][`input${index}`] !== undefined) {
      const novaMensagem: Message = { text: inputs[index][`input${index}`].trim(), sentByUser: true, timestamp: new Date().toLocaleTimeString('pt-BR') };
      setMessages((prevMessages) => [...prevMessages, novaMensagem]);
      const novosInputs = [...inputs];
      novosInputs[index][`input${index}`] = '';
      setInputs(novosInputs);
      setChats((prevChats) =>
        prevChats.map((prevChat, i) => {
          if (i === index) {
            return { ...prevChat, messages: [...prevChat.messages, novaMensagem] };
          }
          return prevChat;
        })
      );
    }
  }

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === 'Enter' && inputs[index][`input${index}`] !== undefined) {
      event.preventDefault();
      handleClick(index)
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
    <Box display='flex' flexDirection='row' >

      {chats.map((chat, index) => (
        chat.id !== undefined && chat.id !== 0 && (
          <Box key={chat.id} display='flex' flexDirection='column' sx={{ m: 1 }}>
            <AppBar position="static">
              <Toolbar style={{ minHeight: '4px', paddingLeft: '10px' }}>
                <Grid container item xs={11} direction='row'>
                  <Avatar
                    style={{ width: 30, height: 30, fontSize: 14 }}
                    src={chat.avatar} />
                  <Typography variant="body2" paddingLeft={1} >
                    {chat.name}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <IconButton edge="end" color="inherit" aria-label="fechar" onClick={() => handleRemoveChat(index)}>
                    <Close />
                  </IconButton>
                </Grid>
              </Toolbar>
            </AppBar>

            <Box component={Paper} elevation={3} flex={1}>
              <List style={{ maxHeight: maxHeight, overflowY: 'auto' }}>
                {chat.messages.map((message, i) => (
                  <ListItem key={i} style={{ textAlign: message.sentByUser ? 'right' : 'left' }}>
                    <ListItemText
                      primary={message.text}
                      primaryTypographyProps={{
                        style: { backgroundColor: message.sentByUser ? 'whitesmoke' : 'silver' }
                      }}
                      secondary={message.timestamp}
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
                onKeyPress={(e) => handleKeyPress(e, index)}
                style={{ alignItems: 'baseline', paddingLeft: '10px' }}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      style={{ paddingRight: '15px' }}
                      size="small"
                      onClick={(_) => handleClick(index)}
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