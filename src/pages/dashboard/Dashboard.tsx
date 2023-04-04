import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';

export const Dashboard = () => {
  return (
    <LayoutBaseDePagina
      navegacao={[
        { descricao: "Inicio", caminho: "/" }]}
      barraDeFerramentas={(
        <FerramentasDeDetalhe />
      )}


    >
    </LayoutBaseDePagina>
  );
};