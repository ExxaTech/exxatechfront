import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useState } from 'react';

const mockData = {
  '12m': [
    { month: 'Jan', occupancy: 80 },
    { month: 'Feb', occupancy: 72 },
    { month: 'Mar', occupancy: 50 },
    { month: 'Apr', occupancy: 90 },
    { month: 'May', occupancy: 45 },
    { month: 'Jun', occupancy: 70 },
    { month: 'Jul', occupancy: 85 },
    { month: 'Aug', occupancy: 92 },
    { month: 'Sep', occupancy: 40 },
    { month: 'Oct', occupancy: 77 },
    { month: 'Nov', occupancy: 88 },
    { month: 'Dec', occupancy: 95 }
  ],
  '6m': [
    { month: 'Jul', occupancy: 85 },
    { month: 'Aug', occupancy: 92 },
    { month: 'Sep', occupancy: 40 },
    { month: 'Oct', occupancy: 77 },
    { month: 'Nov', occupancy: 88 },
    { month: 'Dec', occupancy: 95 }
  ],
  '30d': [
    { month: 'Últimos 30 dias', occupancy: 74 }
  ]
};

export const OccupancyChart = () => {
  const [period, setPeriod] = useState<'12m' | '6m' | '30d'>('12m');
  const data = mockData[period];

  return (
    <Box p={2} width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">Ocupação Anual</Typography>
        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={(e, newValue) => newValue && setPeriod(newValue)}
          size="small"
          color="primary"
        >
          <ToggleButton value="12m" sx={{ color: '#000' }}>12 meses</ToggleButton>
          <ToggleButton value="6m" sx={{ color: '#000' }}>6 meses</ToggleButton>
          <ToggleButton value="30d" sx={{ color: '#000' }}>30 dias</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ left: 30, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#000" />
            <YAxis domain={[0, 100]} stroke="#000" />
            <Tooltip />
            <Bar
            dataKey="occupancy"
            fill="#00FF00"
            isAnimationActive={false}
            radius={[10, 10, 0, 0]}
            >
            {data.map((entry, index) => (
                <Cell
                key={`cell-${index}`}
                fill={entry.occupancy >= 70 ? '#00FF00' : '#FF0000'}
                />
            ))}
            </Bar>
        </BarChart>
    </ResponsiveContainer>

    </Box>
  );
};
