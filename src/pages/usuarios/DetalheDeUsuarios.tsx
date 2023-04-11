import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from 'yup';
import { FerramentasDeDetalhe } from "../../shared/components";
import { IVFormsError, useVForm, VForm, VTextField } from "../../shared/forms";
import { LayoutBaseDePagina } from "../../shared/layouts";
import { UsuariosServices } from "../../shared/services/api/usuario/UsuarioServices";
import { AutoCompleteEndereco } from "./componente/AutoCompleteEndereco";

interface IFormData {
  email: string;
  enderecoId: number;
  nomeCompleto: string;
}

const formValidationSchema: yup.ObjectSchema<IFormData> = yup.object().shape({
  email: yup.string().required().email(),
  nomeCompleto: yup.string().required().min(3),
  enderecoId: yup.number().required()
})

export const DetalheDeUsuarios: React.FC = () => {

  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

  const { id = 'nova' } = useParams<'id'>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (id !== 'nova') {
      setIsLoading(true);

      UsuariosServices.getById(Number(id))
        .then(result => {
          setIsLoading(false);
          if (result instanceof Error) {
            alert(result.message);
            navigate('/user');
          } else {
            setNome(result.nomeCompleto)
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
      .then((dadosValidados) => {
        setIsLoading(true);

        if (id === 'nova') {
          UsuariosServices
            .create(dadosValidados)
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
          UsuariosServices
            .updateById(Number(id), { id: Number(id), ...dadosValidados })
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
      UsuariosServices.deleteById(id)
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
    <LayoutBaseDePagina
      navegacao={[
        { descricao: "Inicio", caminho: "/" },
        { descricao: "Usuários", caminho: "/user" },
        { descricao: id === 'nova' ? 'Novo Usuário' : `Detalhe do Usuário ${nome}`, caminho: "/user/detalhes/nova" }]}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo="Nova"

          mostrarBotaoNovo={id !== 'nova'}
          mostrarBotaoSalvar
          mostrarBotaoApagar={id !== 'nova'}

          aoClicarEmSalvar={save}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/user/detalhes/nova')} />
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
    </LayoutBaseDePagina>
  )

}