import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { Notifications, Person } from "@mui/icons-material";
import { BasePageLayout } from "../../shared/layouts";
import { OccupancyChart } from './component/OccupancyChart';


interface MetricCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  subtitle: React.ReactNode;
  color: string;
  actionButton?: React.ReactNode;
}

const MetricCard = ({
  icon,
  value,
  label,
  subtitle,
  color,
  actionButton,
}: MetricCardProps) => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <Box mr={1} fontSize={24}>
            {icon}
          </Box>
          <Typography variant="subtitle1" color="textPrimary">
            {label}
          </Typography>
        </Box>
        <Typography variant="h4" fontWeight="bold" color={color}>
          {value}
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={actionButton ? 1 : 0}>
          {subtitle}
        </Typography>
        {actionButton && <Box>{actionButton}</Box>}
      </CardContent>
    </Card>
  );
};

export const Dashboard = () => {
  const theme = useTheme();

  const [occupancy, setOccupancy] = useState(85);
  const [revenue, setRevenue] = useState(42500);
  const [activeContracts, setActiveContracts] = useState(24);
  const [expiringSoon, setExpiringSoon] = useState(2);
  const [delayedPayments, setDelayedPayments] = useState(3);

  return (
    <Box>
      <BasePageLayout navigation={[{ description: "Início", path: "/" }]} toolBar={false}>
        <Grid container spacing={3} padding={2}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon="🏠"
              label="Ocupação Mensal"
              value={`${occupancy}%`}
              subtitle="Média em 30 dias"
              color={
                occupancy > 70
                  ? theme.palette.success.main
                  : occupancy < 50
                  ? theme.palette.error.main
                  : theme.palette.text.primary
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon="💰"
              label="Receita Total"
              value={`R$ ${revenue.toLocaleString("pt-BR")}`}
              subtitle="+12% vs mês passado"
              color={theme.palette.success.main}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon="📝"
              label="Contratos Ativos"
              value={activeContracts}
              subtitle={`${expiringSoon} perto do vencimento`}
              color={theme.palette.text.primary}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              icon="⚠️"
              label="Pagamentos Atrasados"
              value={delayedPayments}
              subtitle={delayedPayments > 0 ? "Há pagamentos atrasados" : "Sem atrasos"}
              color={theme.palette.error.main}
              actionButton={
                delayedPayments > 0 && (
                  <Button variant="contained" size="small" sx={{ mt: 1, bgcolor: theme.palette.error.main }}>
                    Cobrar agora
                  </Button>
                )
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} paddingX={2} mt={1}>
          <Grid item xs={12} md={9}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <OccupancyChart />
              </CardContent>
            </Card>
          </Grid>
        </Grid>


      </BasePageLayout>
    </Box>
  );
};
