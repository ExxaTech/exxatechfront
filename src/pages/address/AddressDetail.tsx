import { Box, Grid, Icon, IconButton, LinearProgress, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from 'yup';
import { DetailTools } from "../../shared/components";
import { IVFormsError, VForm, VTextField, useVForm } from "../../shared/forms";
import { BasePageLayout } from "../../shared/layouts";
import { AddressService } from "../../shared/services/api/address/AddressService";

interface IFormData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  numero: string;
}

const formValidationSchema: yup.ObjectSchema<IFormData> = yup.object().shape({
  complemento: yup.string().required(),
  numero: yup.string().required(),
  cep: yup.string().required(),
  logradouro: yup.string().required(),
  bairro: yup.string().required(),
  localidade: yup.string().required(),
  uf: yup.string().required(),
})

export const DetalheDeEnderecos: React.FC = () => {

  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
  const { id = 'novo' } = useParams<'id'>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [cep, setCep] = useState('');


  const handleSearchCep = () => {
    AddressService
      .getByCep(cep)
      .then((response) => {
        if (response instanceof Error) {
          alert(response.message);
        } else {
          formRef.current?.setData(response.data[0]);
        }
      })
  }

  const handleSave = (dados: IFormData) => {
    formValidationSchema.
      validate(dados, { abortEarly: false })
      .then((validateData) => {
        setIsLoading(true);
        if (id === 'novo') {
          AddressService
            .create(validateData)
            .then((result) => {
              setIsLoading(false);
              if (result instanceof Error) {
                alert(result.message);
              } else {
                navigate(`/endereco/detalhes/${result}`);
              }
            })
        }
      }).catch((errors: yup.ValidationError) => {
        const validationErrors: IVFormsError = {};

        errors.inner.forEach(error => {
          console.log(error.path)
          if (!error.path) return;
          validationErrors[error.path] = error.message;
        });

        formRef.current?.setErrors(validationErrors);
      })
  };

  return (
    <BasePageLayout
      navigation={[
        { description: "Inicio", path: "/" },
        { description: "Endereços", path: "/endereco" },
        { description: id === 'novo' ? 'Novo Endereço' : `Detalhe do Endereço ${''}`, path: "/cep/detalhes/novo" }]}
      toolBar={
        <DetailTools
          newTextButton="Novo"

          showNewButton={id !== 'novo'}
          showSaveButton
          showDeleteButton={id !== 'novo'}

          whenClickingSave={save}
          whenClickingNew={() => navigate('/endereco/detalhes/novo')}
        />
      }
    >

      <VForm ref={formRef} onSubmit={(dados) => handleSave(dados)}>
        <Box margin={1} display="flex" flexDirection="column" component={Paper} variant="outlined">
          <Grid container direction="column" padding={2} spacing={2}>
            {isLoading && (
              <Grid item>
                <LinearProgress variant='indeterminate' />
              </Grid>
            )}

            <Grid item>
              <Typography variant='h6'>Geral</Typography>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={4} sm={4} md={4} lg={2} xl={2}>
                <VTextField
                  onChange={e => setCep(e.target.value)}
                  fullWidth
                  name='cep'
                  disabled={isLoading}
                  label='Cep'
                />
              </Grid>
              <Grid item>
                <IconButton onClick={handleSearchCep} color="primary" aria-label="buscar cep" component="label">
                  <input hidden type="button" />
                  <Icon>search</Icon>
                </IconButton>
              </Grid>
            </Grid>
            <Grid container item direction="row" spacing={2}>
              <Grid item xs={10} sm={10} md={10} lg={10} xl={5}>
                <VTextField
                  fullWidth
                  name='logradouro'
                  disabled={true}
                  label='Endereço'
                />
              </Grid>
              <Grid item xs={2} sm={2} md={2} lg={2} xl={1}>
                <VTextField
                  fullWidth
                  name='numero'
                  disabled={false}
                  label='Numero'
                />
              </Grid>
            </Grid>


            <Grid container item direction="row" spacing={2}>
              <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                <VTextField
                  fullWidth
                  name='complemento'
                  disabled={false}
                  label='Complemento'
                />
              </Grid>
              <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                <VTextField
                  fullWidth
                  name='bairro'
                  disabled={true}
                  label='Bairro'
                />
              </Grid>
              <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                <VTextField
                  fullWidth
                  name='localidade'
                  disabled={true}
                  label='Cidade'
                />
              </Grid>
              <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                <VTextField
                  fullWidth
                  name='uf'
                  disabled={true}
                  label='Estado'
                />
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </VForm>
    </BasePageLayout>

  )

}