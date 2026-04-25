import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  LinearProgress, 
  Stack, 
  Chip,
  Divider
} from '@mui/material';
import type { ListStepSnapshot } from '../../Types/lab3Types';

interface ListVisualizerProps {
  snapshot: ListStepSnapshot;
  capacity: number;
}

const ListVisualizer: React.FC<ListVisualizerProps> = ({ snapshot, capacity }) => {
  const { 
    description, 
    currentItemChecking, 
    currentKnapsackItems, 
    currentTotalWeight, 
    currentTotalValue, 
    bestValueSoFar 
  } = snapshot;

  const weightPercentage = Math.min((currentTotalWeight / capacity) * 100, 100);
  const isOverweight = currentTotalWeight > capacity;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3, p: 1 }}>
          <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f8f9fa', borderLeft: '4px solid #1976d2' }}>
        <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
          {description}
        </Typography>
      </Paper>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Card sx={{ flex: 1, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>

              <Typography variant="h6">Фокус уваги</Typography>
            </Box>
            
            {currentItemChecking ? (
              <Box sx={{ p: 2, backgroundColor: '#fff3e0', borderRadius: 2, border: '1px dashed #ffb74d' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {currentItemChecking.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Вага: {currentItemChecking.weight} | Цінність: {currentItemChecking.value}
                </Typography>
                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#e65100' }}>
                  Питома цінність (v/w): {(currentItemChecking.value / currentItemChecking.weight).toFixed(2)}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="body2">Очікування / Аналіз завершено</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
        <Card sx={{ flex: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6">Поточний рюкзак</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                <Typography variant="subtitle2">Рекорд: {bestValueSoFar}</Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">Заповненість ваги</Typography>
                <Typography 
                  variant="body2" 
                  color={isOverweight ? 'error' : 'text.primary'} 
                  sx={{ fontWeight: 'bold' }} 
                >
                  {currentTotalWeight} / {capacity}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={weightPercentage} 
                color={isOverweight ? 'error' : 'primary'}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Вміст (Загальна цінність: <Typography component="span" sx={{ fontWeight: 'bold' }}>{currentTotalValue}</Typography>)
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: '40px' }}>
              {currentKnapsackItems.length > 0 ? (
                currentKnapsackItems.map((item, idx) => (
                  <Chip 
                    key={`${item.id}-${idx}`}
                    label={`${item.name} (v:${item.value}, w:${item.weight})`} 
                    color={isOverweight ? 'error' : 'success'}
                    variant="outlined"
                    sx={{ backgroundColor: isOverweight ? '#ffebee' : '#f1f8e9' }}
                  />
                ))
              ) : (
                <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic', alignSelf: 'center' }}>
                  Порожньо...
                </Typography>
              )}
            </Box>

          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default ListVisualizer;