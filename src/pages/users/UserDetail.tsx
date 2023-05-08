import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from 'yup';
import { DetailTools } from "../../shared/components";
import { IVFormsError, VForm, VTextField, useVForm } from "../../shared/forms";
import { BasePageLayout } from "../../shared/layouts";
import { UserServices } from "../../shared/services/api/user/UserServices";
import { AutoCompleteEndereco } from "./component/AddressAutoComplete";

interface IFormData {
  addressId?: number;
  name: string;
  avatar?: string;
  contact?: IContact;
  security?: ISecurity;
}

interface ISecurity {
  user: string;
  pass: string;
}

interface IContact {
  phone: string;
  email: string;
  lastMessage: string;
  lastMessageTimeStamp: string;
}

const contactSchema = yup.object().shape({
  phone: yup.string().required(),
  email: yup.string().email().required(),
  lastMessage: yup.string().required(),
  lastMessageTimeStamp: yup.string().required(),
});

const formValidationSchema: yup.ObjectSchema<IFormData> = yup.object().shape({
  name: yup.string().required().min(3),
  addressId: yup.number().optional(),
  avatar: yup.string().optional(),
  contact: contactSchema.optional(),
  security: yup.object().shape({
    user: yup.string().required(),
    pass: yup.string().required(),
  }).optional(),
})

export const UserDetail: React.FC = () => {

  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true);

      UserServices.getById(Number(id))
        .then(result => {
          setIsLoading(false);
          if (result instanceof Error) {
            alert(result.message);
            navigate('/user');
          } else {
            setNome(result.name)
            formRef.current?.setData(result);
          }
        });
    } else {
      formRef.current?.setData({
        email: '',
        nomeCompleto: '',
        enderecoId: undefined,
      });
    }
  }, [id]);


  const handleSave = (dados: IFormData) => {
    formValidationSchema.
      validate(dados, { abortEarly: false })
      .then((validateData) => {
        setIsLoading(true);

        if (id === 'nova') {
          UserServices
            .create(validateData)
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/user');
                } else {
                  navigate(`/user/detalhes/${result}`);
                }
              }
            });
        } else {
          UserServices
            .updateById(Number(id), { id: Number(id), ...validateData })
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/user');
                }
              }
            });
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: IVFormsError = {};

        errors.inner.forEach(error => {
          console.log(error.path)
          if (!error.path) return;
          validationErrors[error.path] = error.message;
        });

        formRef.current?.setErrors(validationErrors);
      });
  };

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar ? ')) {
      UserServices.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Usuário removido com sucesso');
            navigate('/user');
          }
        });
    }
  }

  return (
    <BasePageLayout
      navigation={[
        { description: "Inicio", path: "/" },
        { description: "Usuários", path: "/user" },
        { description: id === 'nova' ? 'Novo Usuário' : `Detalhe do Usuário ${nome}`, path: "/user/detalhes/nova" }]}
      toolBar={
        <DetailTools
          newTextButton="Nova"

          showNewButton={id !== 'nova'}
          showSaveButton
          showDeleteButton={id !== 'nova'}

          whenClickingSave={save}
          whenClickingDelete={() => handleDelete(Number(id))}
          whenClickingNew={() => navigate('/user/detalhes/nova')} />
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
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='nomeCompleto'
                  disabled={isLoading}
                  label='Nome completo'
                  onChange={e => setNome(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  name='email'
                  label='Email'
                  disabled={isLoading}
                />
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <AutoCompleteEndereco
                  isExternalLoading={isLoading} />

              </Grid>
            </Grid>
          </Grid>
        </Box>

      </VForm>
    </BasePageLayout>
  )

}