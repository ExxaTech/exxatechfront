import { Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import { IProperty } from "../../../shared/types/PropertyTypes";
import { Observable } from "../../../shared/observer/Observable";

interface IPropertiesDetailProps {
  property: IProperty;
  observable: Observable<IProperty>;
}

export const PropertiesDetail: React.FC<IPropertiesDetailProps> = ({ property }) => {
  if (!property || property.id === 0) {
    return (
      <Grid item xs>
        <Typography variant="h6" sx={{ m: 2 }}>
          Selecione um imóvel para visualizar os detalhes
        </Typography>
      </Grid>
    );
  }

  return (
    <Grid item xs>
      <Card sx={{ m: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Informações Gerais</Typography>
          <Typography><strong>Título:</strong> {property.title}</Typography>
          <Typography><strong>Descrição:</strong> {property.description || '-'}</Typography>
          <Typography><strong>Tipo:</strong> {property.type}</Typography>
          <Typography><strong>Status:</strong> {property.status}</Typography>
          <Typography><strong>Ativo:</strong> {property.isActive ? 'Sim' : 'Não'}</Typography>
          <Typography><strong>Quartos:</strong> {property.bedrooms || '-'}</Typography>
          <Typography><strong>Banheiros:</strong> {property.bathrooms || '-'}</Typography>
          <Typography><strong>Área (m²):</strong> {property.area || '-'}</Typography>
          <Typography><strong>Comodidades:</strong> {property.amenities?.join(', ') || '-'}</Typography>
        </CardContent>
        <Divider />

        <CardContent>
          <Typography variant="h6" gutterBottom>Endereço</Typography>
          {property.address ? (
            <>
              <Typography><strong>Rua:</strong> {property.address.street}, {property.address.number}</Typography>
              <Typography><strong>Bairro:</strong> {property.address.neighborhood}</Typography>
              <Typography><strong>Cidade/UF:</strong> {property.address.city} / {property.address.state}</Typography>
              <Typography><strong>Complemento:</strong> {property.address.complement || '-'}</Typography>
              <Typography><strong>CEP:</strong> {property.address.zipCode}</Typography>
            </>
          ) : (
            <Typography>Endereço não informado.</Typography>
          )}
        </CardContent>
        <Divider />

        <CardContent>
          <Typography variant="h6" gutterBottom>Preço</Typography>
          {property.pricing ? (
            <>
              <Typography><strong>Valor Base:</strong> R$ {property.pricing.basePrice.toFixed(2)}</Typography>
              <Typography><strong>Tipo de Preço:</strong> {property.pricing.pricingType}</Typography>
            </>
          ) : (
            <Typography>Informações de preço não disponíveis.</Typography>
          )}
        </CardContent>
        <Divider />

        <CardContent>
          <Typography variant="h6" gutterBottom>Informações do Parceiro</Typography>
          {property.partnerInfo ? (
            <>
              <Typography><strong>Tipo:</strong> {property.partnerInfo.partnerType}</Typography>
              <Typography><strong>Nome:</strong> {property.partnerInfo.partnerName || '-'}</Typography>
              <Typography><strong>ID do Parceiro:</strong> {property.partnerInfo.partnerId || '-'}</Typography>
            </>
          ) : (
            <Typography>Sem informações de parceiro.</Typography>
          )}
        </CardContent>
        <Divider />

        <CardContent>
          <Typography variant="h6" gutterBottom>Metadados</Typography>
          <Typography><strong>Criado em:</strong> {property.createdAt ? new Date(property.createdAt).toLocaleString() : '-'}</Typography>
          <Typography><strong>Atualizado em:</strong> {property.updatedAt ? new Date(property.updatedAt).toLocaleString() : '-'}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};
