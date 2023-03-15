import { FerramentasDaListagem } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';

export const Dashboard = () => {
  return (
    <LayoutBaseDePagina
      titulo='Paginal Incial'
      barraDeFerramentas={(
        <FerramentasDaListagem
          mostrarInputBusca
          textoBotaoNovo='Nova' />
      )}
    >
      Testando
    </LayoutBaseDePagina>
  );
};