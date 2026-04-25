import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Paper, Typography, LinearProgress, Divider } from '@mui/material';
import type { ListStepSnapshot, Item } from '../../Types/lab3Types';

interface GreedyVisualizerProps {
  snapshot: ListStepSnapshot;
  capacity: number;
  allItems: Item[];
}

const GreedyVisualizer: React.FC<GreedyVisualizerProps> = ({ snapshot, capacity, allItems }) => {
  const { description, currentItemChecking, currentKnapsackItems, currentTotalWeight, currentTotalValue } = snapshot;

  const isSorted = !description.includes('Крок 1');

  const displayItems = isSorted
    ? [...allItems].sort((a, b) => (b.value / b.weight) - (a.value / a.weight))
    : [...allItems];
  const [rejectedIds, setRejectedIds] = useState<Set<string | number>>(new Set());

  useEffect(() => {
    if (description.includes('Не влазить') || description.includes('Пропускаємо')) {
      if (currentItemChecking) {
        setRejectedIds(prev => new Set(prev).add(currentItemChecking.id));
      }
    }
    
    if (currentTotalValue === 0 && !currentItemChecking && description.includes('Крок 1')) {
      setRejectedIds(new Set());
    }
  }, [description, currentItemChecking, currentTotalValue]);

  const inBackpackIds = new Set(currentKnapsackItems.map(i => i.id));
  const queueItems = displayItems.filter(item => !inBackpackIds.has(item.id));
  const weightPercentage = Math.min((currentTotalWeight / capacity) * 100, 100);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3, p: 1 }}>
      
      <Paper elevation={1} sx={{ p: 2, borderLeft: '4px solid #1976d2', backgroundColor: '#f8f9fa' }}>
        <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
          {description}
        </Typography>
      </Paper>
      <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Черга (Доступні предмети)
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', minHeight: '120px', alignItems: 'center' }}>
          <AnimatePresence>
            {queueItems.map(item => {
              const isChecking = currentItemChecking?.id === item.id;
              const isRejected = rejectedIds.has(item.id);

              return (
                <motion.div
                  key={item.id}
                  layoutId={`item-${item.id}`} 
                  layout 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: isRejected ? 0.4 : 1,
                    scale: isChecking ? 1.15 : 1,
                    y: isChecking ? -15 : 0 
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  style={{
                    padding: '12px',
                    backgroundColor: isChecking ? '#fff3e0' : 'white',
                    border: isChecking ? '3px solid #ff9800' : '1px solid #ddd',
                    borderRadius: '12px',
                    width: '130px',
                    position: 'relative',
                    boxShadow: isChecking ? '0 8px 16px rgba(255, 152, 0, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)',
                    zIndex: isChecking ? 10 : 1
                  }}
                >
                  <Typography align="center" sx={{ fontWeight: 900 }}>{item.name}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="caption" sx={{ display: 'block' }}>Цінність: <strong>{item.value}</strong></Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>Вага: <strong>{item.weight}</strong></Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: '#e65100', fontWeight: 'bold' }}>v/w: {(item.value/item.weight).toFixed(2)}</Typography>
                  {isRejected && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      style={{ position: 'absolute', top: '50%', left: 0, height: '4px', backgroundColor: 'red', transform: 'rotate(-15deg)' }} 
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Box>
      </Box>
      <Box sx={{ p: 2, border: '3px dashed #4caf50', borderRadius: 2, backgroundColor: '#f1f8e9' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle1" color="success.main" sx={{ fontWeight: 'bold' }}>Вміст рюкзака (Цінність: {currentTotalValue})</Typography>
          <Typography variant="subtitle1" color="success.main" sx={{ fontWeight: 'bold' }}>Вага: {currentTotalWeight} / {capacity}</Typography>
        </Box>
        <LinearProgress variant="determinate" value={weightPercentage} color="success" sx={{ mb: 3, height: 12, borderRadius: 6 }} />

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', minHeight: '120px', alignItems: 'center' }}>
          <AnimatePresence>
            {currentKnapsackItems.map(item => (
              <motion.div
                key={item.id}
                layoutId={`item-${item.id}`} 
                layout
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{
                  padding: '12px',
                  backgroundColor: '#c8e6c9',
                  border: '2px solid #4caf50',
                  borderRadius: '12px',
                  width: '130px',
                  boxShadow: '0 4px 8px rgba(76, 175, 80, 0.2)'
                }}
              >
                <Typography align="center" sx={{ fontWeight: 900, color: '#2e7d32' }}>{item.name}</Typography>
                <Divider sx={{ my: 1, borderColor: '#a5d6a7' }} />
                <Typography variant="caption" sx={{ display: 'block', color: '#2e7d32' }}>Цінність: <strong>{item.value}</strong></Typography>
                <Typography variant="caption" sx={{ display: 'block', color: '#2e7d32' }}>Вага: <strong>{item.weight}</strong></Typography>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {currentKnapsackItems.length === 0 && (
            <Typography variant="body1" color="text.secondary" sx={{ width: '100%', textAlign: 'center', fontStyle: 'italic' }}>
              Рюкзак порожній
            </Typography>
          )}
        </Box>
      </Box>

    </Box>
  );
};

export default GreedyVisualizer;