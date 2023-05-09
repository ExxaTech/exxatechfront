import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { ListTools } from '../../shared/components';
import { BasePageLayout } from '../../shared/layouts';
import { AddressService } from '../../shared/services/api/address/AddressService';
import { UserServices } from '../../shared/services/api/user/UserServices';

export const Dashboard = () => {

  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [totalCountUsers, setTotalCountUsers] = useState(0);

  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [totalCountContacts, setTotalCountContacts] = useState(0);

  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [totalCountChats, setTotalCountChats] = useState(0);

  const [isLoadingOpenChats, setIsLoadingOpenChats] = useState(true);
  const [totalCountOpenChats, setTotalCountOpenChats] = useState(0);

  const [isLoadingCloseChats, setIsLoadingCloseChats] = useState(true);
  const [totalCountCloseChats, setTotalCountCloseChats] = useState(0);

  const [isLoadingAddress, setIsLoadingAddress] = useState(true);
  const [totalCountAddress, setTotalCountAddress] = useState(0);

  useEffect(() => {
    setIsLoadingUsers(true);
    setIsLoadingContacts(true);

    setIsLoadingChats(true);
    setIsLoadingOpenChats(true);
    setIsLoadingCloseChats(true);

    setIsLoadingAddress(true);


    UserServices.getUsersWithChat()
      .then((result) => {
        setIsLoadingChats(false);
        setIsLoadingOpenChats(false);
        setIsLoadingCloseChats(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {

          const userWithChatOpen = result.data.filter((user) => user.contact?.isServiceClosed === false).length
          const userWithChatClosed = result.data.filter((user) => user.contact?.isServiceClosed === true).length

          setTotalCountOpenChats(userWithChatOpen);
          setTotalCountCloseChats(userWithChatClosed);
          setTotalCountChats(result.totalCount);
        }
      });

    UserServices.getUsersContact('', 1)
      .then((result) => {
        setIsLoadingContacts(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          setTotalCountContacts(result.totalCount);
        }
      });


    UserServices.getAll(1)
      .then((result) => {
        setIsLoadingUsers(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          setTotalCountUsers(result.totalCount);
        }
      });

    AddressService.getAll(1)
      .then((result) => {
        setIsLoadingAddress(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          setTotalCountAddress(result.totalCount);
        }
      });
  }, [])

  return (
    <BasePageLayout
      navigation={[
        { description: "Inicio", path: "/" }]}
      toolBar={(
        <ListTools showNewButtonText={false} />
      )}
    >
      <Box width='100%' display='flex'>
        <Grid container margin={1}>
          <Grid item container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={2} >
              <Card>
                <CardContent>
                  <Typography variant='h5' align='center'>
                    Total Usuários
                  </Typography>
                  <Box display='flex' padding={6} justifyContent='center' alignItems='center'>

                    {!isLoadingUsers && (
                      <Typography variant='h1'>
                        {totalCountUsers}
                      </Typography>

                    )}

                    {isLoadingUsers &&
                      (<Typography variant='h6'>
                        Carregando...
                      </Typography>
                      )}

                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={2} >
              <Card>
                <CardContent>
                  <Typography variant='h5' align='center'>
                    Total Contatos
                  </Typography>
                  <Box display='flex' padding={6} justifyContent='center' alignItems='center'>

                    {!isLoadingContacts && (
                      <Typography variant='h1'>
                        {totalCountContacts}
                      </Typography>
                    )}

                    {isLoadingContacts &&
                      (<Typography variant='h6'>
                        Carregando...
                      </Typography>
                      )}

                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={2} >
              <Card>
                <CardContent>
                  <Typography variant='h5' align='center'>
                    Total Chat
                  </Typography>
                  <Box display='flex' padding={6} justifyContent='center' alignItems='center'>

                    {!isLoadingChats && (
                      <Typography variant='h1'>
                        {totalCountChats}
                      </Typography>

                    )}

                    {isLoadingChats &&
                      (<Typography variant='h6'>
                        Carregando...
                      </Typography>
                      )}

                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={2} >
              <Card>
                <CardContent>
                  <Typography variant='h5' align='center'>
                    Total Chat Abertos
                  </Typography>
                  <Box display='flex' padding={6} justifyContent='center' alignItems='center'>

                    {!isLoadingOpenChats && (
                      <Typography variant='h1'>
                        {totalCountOpenChats}
                      </Typography>

                    )}

                    {isLoadingOpenChats &&
                      (<Typography variant='h6'>
                        Carregando...
                      </Typography>
                      )}

                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={2} >
              <Card>
                <CardContent>
                  <Typography variant='h5' align='center'>
                    Total Chat Finalizados
                  </Typography>
                  <Box display='flex' padding={6} justifyContent='center' alignItems='center'>

                    {!isLoadingCloseChats && (
                      <Typography variant='h1'>
                        {totalCountCloseChats}
                      </Typography>

                    )}

                    {isLoadingCloseChats &&
                      (<Typography variant='h6'>
                        Carregando...
                      </Typography>
                      )}

                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={2} >
              <Card>
                <CardContent>
                  <Typography variant='h5' align='center'>
                    Total Endereços
                  </Typography>
                  <Box display='flex' padding={6} justifyContent='center' alignItems='center'>
                    {!isLoadingAddress && (
                      <Typography variant='h1'>
                        {totalCountAddress}
                      </Typography>

                    )}

                    {isLoadingAddress &&
                      (<Typography variant='h6'>
                        Carregando...
                      </Typography>
                      )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </BasePageLayout>
  );
};