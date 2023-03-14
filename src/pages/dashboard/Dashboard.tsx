import { BarraDeFerramentas } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';

export const Dashboard = () => {
  return (
    <LayoutBaseDePagina
      titulo='Paginal Incial'
      barraDeFerramentas={(
        <BarraDeFerramentas
          mostrarInputBusca
          textoBotaoNovo='Nova' />
      )}
    >
      Testando
    </LayoutBaseDePagina>
  );
};