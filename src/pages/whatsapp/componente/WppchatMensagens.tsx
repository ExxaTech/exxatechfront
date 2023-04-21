
import { Close, Send } from "@mui/icons-material";
import { AppBar, Avatar, Box, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, List, ListItem, ListItemText, Paper, Toolbar, Typography, useTheme } from "@mui/material";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { useDebounce } from "../../../shared/hooks";

interface MessageInput {
  id: string;
  name: string;
  avatar: string;
  messages: Message[];
  timestamp: string;
  type: string;
}

interface InputValues {
  [key: string]: string;
}

interface Message {
  text: string;
  sentByUser: boolean
}

export const WppchatMensagens: React.FC = () => {

  const [messages, setMessages] = useState<Message[]>([]);

  const [chats, setChats] = useState<MessageInput[]>([
    {
      id: Math.random().toString(36).substr(2, 9),
      name: 'João R',
      avatar: 'https://picsum.photos/200/300',
      messages: messages,
      timestamp: '',
      type: 'chat'
    },
    {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Pedro F.',
      avatar: 'https://picsum.photos/200/301',
      messages: messages,
      timestamp: '',
      type: 'chat'
    },
    {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Maria',
      avatar: 'https://picsum.photos/200/302',
      messages: messages,
      timestamp: '',
      type: 'chat'
    }
  ]);

  const [inputs, setInputs] = useState<InputValues[]>(chats.map(() => ({})));

  const theme = useTheme();
  const [maxHeight, setMaxHeight] = useState(0);
  const { debounce } = useDebounce();


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

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputs[index][`input${index}`].trim() !== '') {
        const novaMensagem: Message = { text: inputs[index][`input${index}`].trim(), sentByUser: true };
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

  // useEffect(() => {
  //   debounce(() => {
  //     setChats([...chats,
  //     {
  //       id: Math.random().toString(36).substr(2, 9),
  //       name: 'João R',
  //       avatar: 'https://picsum.photos/200/300',
  //       messages: [],
  //       timestamp: '',
  //       type: 'chat'
  //     },
  //     {
  //       id: Math.random().toString(36).substr(2, 9),
  //       name: 'Pedro F.',
  //       avatar: 'https://picsum.photos/200/301',
  //       messages: [],
  //       timestamp: '',
  //       type: 'chat'
  //     },
  //     {
  //       id: Math.random().toString(36).substr(2, 9),
  //       name: 'Maria',
  //       avatar: 'https://picsum.photos/200/302',
  //       messages: [],
  //       timestamp: '',
  //       type: 'chat'
  //     }
  //     ]);
  //   });
  // }, []);

  return (
    <Box display='flex' flexDirection='row' >

      {chats.map((chat, index) => (
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
                <ListItem key={i} alignItems='flex-start'>
                  <ListItemText
                    primary={message.text}
                    secondary={message.sentByUser ? 'Você' : chat.name}
                    secondaryTypographyProps={{
                      style: {
                        fontWeight: 'bold',
                        color: message.sentByUser ? theme.palette.primary.main : theme.palette.text.primary
                      }
                    }}
                  />

                </ListItem>
              ))}
            </List>
          </Box>
          <FormControl component={Paper} variant="outlined" size='small'>
            <InputLabel htmlFor={`mensagem-${index}`}>Digite uma mensagem</InputLabel>
            <Input
              id={`mensagem-${index}`}
              name={`input${index}`}
              value={inputs[index][`input${index}`] || ''}
              onChange={(event) => handleChange(event, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              style={{ paddingLeft: '10px' }}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    // onClick={(e) => handleKeyPress(e, index)}
                    disabled={inputs[index][`input${index}`]?.trim() === ''}
                  >
                    <Send />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
      ))
      }
    </Box >
  );
} 