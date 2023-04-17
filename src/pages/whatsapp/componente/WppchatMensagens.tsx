
import { Close, Person, SupportAgent } from "@mui/icons-material";
import { AppBar, Avatar, Box, Button, FormControl, Grid, Icon, IconButton, Input, InputAdornment, InputLabel, List, ListItem, ListItemAvatar, ListItemText, Paper, Toolbar, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useDebounce } from "../../../shared/hooks";

interface InputMsgChat {
  id: string;
  name: string;
  avatar: string;
  message: string;
  timestamp: string;
  type: string;
}


export const WppchatMensagens: React.FC = () => {

  const [messages, setMessages] = useState<{ text: string; sentByUser: boolean }[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [chats, setChats] = useState<InputMsgChat[]>([]);
  const theme = useTheme();
  const [maxHeight, setMaxHeight] = useState(0);

  const [minimized, setMinimized] = useState(false);
  const [open, setOpen] = useState(false);

  const { debounce } = useDebounce();

  const handleSend = () => {
    if (messageInput) {
      setMessages([...messages, { text: messageInput, sentByUser: true }]);
      setMessageInput('');
    }
  };

  const handleRemoveChat = (index: number) => {
    const removeListChat = [...chats]
    removeListChat.splice(index, 1);
    setChats(removeListChat)
  }

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

  useEffect(() => {
    debounce(() => {
      setChats([...chats,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: 'João R',
        avatar: 'https://picsum.photos/200/300',
        message: '',
        timestamp: '',
        type: 'chat'
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        name: 'Pedro F.',
        avatar: 'https://picsum.photos/200/301',
        message: '',
        timestamp: '',
        type: 'chat'
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        name: 'Maria',
        avatar: 'https://picsum.photos/200/302',
        message: '',
        timestamp: '',
        type: 'chat'
      }
      ]);
    });
  }, []);

  return (
    <Box display='flex' flexDirection='row' >

      {chats.map((chat) => (
        <Box key={chat.id} display='flex' flexDirection='column' sx={{ m: 1 }}>
          <div>
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
                  <IconButton edge="end" color="inherit" aria-label="fechar" onClick={() => handleRemoveChat(Number(chat.id))}>
                    <Close />
                  </IconButton>
                </Grid>
              </Toolbar>
            </AppBar>
          </div>
          <Box component={Paper} elevation={3} flex={1}>
            <Grid item display='flex' alignItems='center' padding={theme.spacing(1)}>
            </Grid>
            <List style={{ maxHeight, overflow: 'auto' }}>
              {messages.map((message, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar>
                      {message.sentByUser ? <SupportAgent /> : <Person />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primaryTypographyProps={{ style: { fontSize: 14 } }}
                    primary={message.text} />
                </ListItem>
              ))}
            </List>
          </Box>
          <FormControl component={Paper} variant="outlined">
            <InputLabel htmlFor="mesdsage-input">Mensagem</InputLabel>
            <Input
              id="message-input"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onClick={handleSend}
              endAdornment={<InputAdornment position="end">
                <Button
                  color='primary'
                  disableElevation
                  startIcon={<Icon>send</Icon>}
                  onClick={handleSend} />
              </InputAdornment>} />
          </FormControl>
        </Box>
      ))
      }
    </Box >

  );
} 