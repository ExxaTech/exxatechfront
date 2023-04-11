import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useField } from "@unform/core";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "../../../shared/hooks";
import { EnderecoServices } from "../../../shared/services/api/endereco/EnderecoServices";


type IAutoCompleteOption = {
  id: number;
  label: string;
}

interface IAutoCompleteEnderecoProps {
  isExternalLoading?: boolean;
}


export const AutoCompleteEndereco: React.FC<IAutoCompleteEnderecoProps> = ({ isExternalLoading = false }) => {

  const [opcoes, setOpcoes] = useState<IAutoCompleteOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [busca, setBusca] = useState('')
  const { debounce } = useDebounce();
  const { fieldName, registerField, defaultValue, error, clearError } = useField('enderecoId')

  const [selectedId, setSelectedId] = useState<number | undefined>(defaultValue)

  useEffect(() => {

    registerField({
      name: fieldName,
      getValue: () => selectedId,
      setValue: (_, newSelectedId) => setSelectedId(newSelectedId),
    });
  }, [registerField, fieldName, selectedId]);

  useEffect(() => {
    setIsLoading(true)
    debounce(() => {
      EnderecoServices.getAll(1, busca)
        .then((result) => {
          setIsLoading(false)
          if (result instanceof Error) {
            console.log(result.message);
          } else {
            setOpcoes(result.data.map(endereco => ({ id: endereco.id, label: endereco.cep })))
          }
        });
    });
  }, [busca])


  const autoCompleteSelectedOption = useMemo(() => {
    if (!selectedId) return null;
    const selectedOption = opcoes.find(opcao => opcao.id === selectedId)
    if (!selectedOption) return null;

    return selectedOption;
  }, [selectedId, opcoes]);

  return (
    <Autocomplete
      value={autoCompleteSelectedOption}
      openText='Abrir'
      closeText='Fechar'
      noOptionsText='Sem opções'
      loadingText='Carregando...'
      popupIcon={(isExternalLoading || isLoading) ? <CircularProgress size={25} /> : undefined}

      disabled={isExternalLoading}
      loading={isLoading}
      options={opcoes}
      disablePortal

      onInputChange={(_, newValue) => setBusca(newValue)}
      onChange={(_, newValue) => { setSelectedId(newValue?.id); setBusca(''); clearError(); }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Cep"
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
};