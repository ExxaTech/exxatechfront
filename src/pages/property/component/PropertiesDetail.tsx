import { Close, Send } from "@mui/icons-material";
import { AppBar, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, List, ListItem, ListItemText, Paper, Toolbar, Tooltip, Typography, useTheme } from "@mui/material";
import { format } from "date-fns";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { Environment } from "../../../shared/environment";
import { useDebounce } from "../../../shared/hooks";
import { IObserver, Observable } from "../../../shared/observer/Observable";
import { IMessage, MessageServices } from "../../../shared/services/api/message/MessageServices";
import { IProperty, PropertyServices } from "../../../shared/services/api/property/PropertyServices";


interface IPropertiesDetailProps {
  property: IProperty;
  observable: Observable<IProperty>;
}


interface InputValues {
  [key: string]: string;
}


const UserObserver: IObserver<IProperty> = {
  update: (data: IProperty) => {
    console.log("User list has been updated:", data);
  }
}

export const PropertiesDetail: React.FC<IPropertiesDetailProps> = ({ observable, property: user }) => {

  const { debounce } = useDebounce();
  const theme = useTheme();
  observable.addObserver(UserObserver);

  return (
    <Grid item xs={8} sm={8} md={4} lg={4} xl={2}>

    </Grid>
  )

} 