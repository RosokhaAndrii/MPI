import React from 'react';
import { motion } from 'framer-motion';
import { Box, Paper, Typography, LinearProgress, Divider } from '@mui/material';
import type { ListStepSnapshot, Item } from '../../Types/lab3Types';

interface BruteForceVisualizerProps {
  snapshot: ListStepSnapshot;
  capacity: number;
  allItems: Item[];
}

const BruteForceVisualizer: React.FC<BruteForceVisualizerProps> = ({ snapshot, capacity, allItems }) => {
  const { description, currentKnapsackItems, currentTotalWeight, currentTotalValue, bestValueSoFar } = snapshot;

  const isOverweight = currentTotalWeight > capacity;
  const weightPercentage = Math.min((currentTotalWeight / capacity) * 100, 100);
  const currentIds = new Set(currentKnapsackItems.map(item => item.id.toString()));

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3, p: 1 }}>
      <Paper elevation={1} sx={{ p: 2, borderLeft: '4px solid #9c27b0', backgroundColor: '#f3e5f5' }}>
        <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '1.1rem', color: '#6a1b9a' }}>
          {description}
        </Typography>
      </Paper>
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', backgroundColor: '#fafafa', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom color="text.secondary" align="center">
          Поточна комбінація
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', my: 3 }}>
          {allItems.map(item => {
            const isActive = currentIds.has(item.id.toString());

            return (
              <motion.div
                key={item.id}
                layout
                animate={{
                  scale: isActive ? 1.05 : 0.9,
                  opacity: isActive ? 1 : 0.4,
                  y: isActive ? -5 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{
                  width: '120px',
                  padding: '12px',
                  backgroundColor: isActive ? '#fff' : '#eeeeee',
                  border: isActive ? '2px solid #9c27b0' : '2px dashed #bdbdbd',
                  borderRadius: '12px',
                  boxShadow: isActive ? '0 8px 16px rgba(156, 39, 176, 0.2)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Typography sx={{ fontWeight: 'bold', color: isActive ? '#7b1fa2' : 'text.secondary' }} align="center">
                  {item.name}
                </Typography>
                <Divider sx={{ width: '100%', my: 1 }} />
                <Typography variant="caption">v: {item.value} | w: {item.weight}</Typography>
                <Box sx={{ 
                  mt: 1, 
                  px: 1.5, 
                  py: 0.5, 
                  borderRadius: 4, 
                  backgroundColor: isActive ? '#e1bee7' : '#e0e0e0',
                  color: isActive ? '#6a1b9a' : '#9e9e9e',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}>
                  {isActive ? 'УВІМКНЕНО' : 'ВИМКНЕНО'}
                </Box>
              </motion.div>
            );
          })}
        </Box>
      </Paper>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Paper elevation={1} sx={{ flex: 1, p: 2, border: `2px solid ${isOverweight ? '#f44336' : '#4caf50'}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="h6" color={isOverweight ? 'error' : 'success.main'}>
              {isOverweight ? 'Перевантаження!' : 'Вага в нормі'}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
            {currentTotalWeight} <Typography component="span" color="text.secondary">/ {capacity}</Typography>
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={weightPercentage} 
            color={isOverweight ? 'error' : 'success'} 
            sx={{ height: 12, borderRadius: 6 }} 
          />
        </Paper>
        <Paper elevation={1} sx={{ flex: 1, p: 2, backgroundColor: '#fff8e1', border: '2px solid #ffc107' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="h6" sx={{ color: '#ff8f00' }}>Результати</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Поточна цінність</Typography>
              <Typography variant="h4" sx={{ color: isOverweight ? '#9e9e9e' : '#333', textDecoration: isOverweight ? 'line-through' : 'none' }}>
                {currentTotalValue}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Найкращий результат</Typography>
              <Typography variant="h4" sx={{ color: '#ff8f00', fontWeight: 'black' }}>
                {bestValueSoFar}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default BruteForceVisualizer;