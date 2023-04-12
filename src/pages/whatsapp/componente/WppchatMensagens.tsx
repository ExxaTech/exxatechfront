import { Person, SupportAgent } from "@mui/icons-material";
import SendIcon from '@mui/icons-material/Send';
import { Avatar, Box, Button, FormControl, Input, InputAdornment, InputLabel, List, ListItem, ListItemAvatar, ListItemText, Paper, useTheme } from "@mui/material";
import { useState } from "react";

export const WppchatMensagens: React.FC = () => {

  const [messages, setMessages] = useState<{ text: string; sentByUser: boolean }[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const theme = useTheme();

  const handleSend = () => {
    if (messageInput) {
      setMessages([...messages, { text: messageInput, sentByUser: true }]);
      setMessageInput('');
    }
  };

  return (
    <Box display='flex' flexDirection='row' >

      <Box display='flex' flexDirection='column'>
        <Box component={Paper} elevation={3} sx={{ m: 1 }} flex={1}>
          __<List>
            {messages.map((message, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar>
                    {message.sentByUser ? <SupportAgent /> : <Person />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={message.text} />
              </ListItem>
            ))}
          </List>
        </Box>
        <FormControl >
          <InputLabel htmlFor="message-input-01">Mensagem</InputLabel>
          <Input
            id="message-input-01"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSend}
                >
                  <SendIcon />
                </Button>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>

      <Box display='flex' flexDirection='column'>
        <Box component={Paper} elevation={3} sx={{ m: 1 }} flex={1}>
          __<List>
            {messages.map((message, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar>
                    {message.sentByUser ? <SupportAgent /> : <Person />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={message.text} />
              </ListItem>
            ))}
          </List>
        </Box>
        <FormControl >
          <InputLabel htmlFor="message-input-02">Mensagem</InputLabel>
          <Input
            id="message-input-02"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSend}
                >
                  <SendIcon />
                </Button>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
    </Box>

  );
} 