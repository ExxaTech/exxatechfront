import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { ListTools } from '../../shared/components';
import { BasePageLayout } from '../../shared/layouts';
import { AddressService } from '../../shared/services/api/address/AddressService';
import { UserServices } from '../../shared/services/api/user/UserServices';

export const Dashboard = () => {

  const [isLoadingUsuarios, setIsLoadingUsuarios] = useState(true);
  const [totalCountUsuarios, setTotalCountUsuarios] = useState(0);

  const [isLoadingEnderecos, setIsLoadingEnderecos] = useState(true);
  const [totalCountEnderecos, setTotalCountEnderecos] = useState(0);

  useEffect(() => {
    setIsLoadingUsuarios(true);
    setIsLoadingEnderecos(true);

    UserServices.getAll(1)
      .then((result) => {
        setIsLoadingUsuarios(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          setTotalCountUsuarios(result.totalCount);
        }
      });

    AddressService.getAll(1)
      .then((result) => {
        setIsLoadingEnderecos(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          setTotalCountEnderecos(result.totalCount);
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

                    {!isLoadingUsuarios && (
                      <Typography variant='h1'>
                        {totalCountUsuarios}
                      </Typography>

                    )}

                    {isLoadingUsuarios &&
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
                    {!isLoadingEnderecos && (
                      <Typography variant='h1'>
                        {totalCountEnderecos}
                      </Typography>

                    )}

                    {isLoadingEnderecos &&
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