import React from 'react';
import { Typography, Paper, Box, Divider, Chip } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import type { AlgorithmResult, Item } from '../../Types/lab3Types';
import styles from './FinalResult.module.css';

interface FinalResultProps {
  result: AlgorithmResult;
  allItems: Item[];
  capacity: number;
}

const FinalResult: React.FC<FinalResultProps> = ({ result, allItems, capacity }) => {
  const selectedItemsDetails = result.selectedItemIds.map(id => 
    allItems.find(item => item.id.toString() === id.toString())
  ).filter(Boolean) as Item[];

  return (
    <Paper elevation={0} className={styles.resultCard} sx={{ borderRadius: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="h5" color="success.main" sx={{ fontWeight: 'bold' }}>
          Результат розв'язку
        </Typography>
      </Box>

      <Divider />

      <div className={styles.statsContainer}>
        <div className={styles.statItem}>
          <Typography variant="overline" color="text.secondary">Максимальна цінність</Typography>
          <Typography variant="h3" color="primary" sx={{ fontWeight: 'black' }}>
            {result.maxValue}
          </Typography>
        </div>
        <div className={styles.statItem}>
          <Typography variant="overline" color="text.secondary">Використана вага</Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {result.totalWeight} <Typography component="span" variant="h6" color="text.secondary">/ {capacity}</Typography>
          </Typography>
        </div>
      </div>

      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <ShoppingBagIcon color="action" />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Вміст рюкзака:
          </Typography>
        </Box>
        
        <div className={styles.itemsGrid}>
          {selectedItemsDetails.length > 0 ? (
            selectedItemsDetails.map((item) => (
              <Chip 
                key={item.id} 
                label={`${item.name} (w:${item.weight}, v:${item.value})`} 
                variant="outlined"
                color="primary"
                sx={{ backgroundColor: 'white' }}
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Рюкзак порожній (нічого не вмістилося)
            </Typography>
          )}
        </div>
      </Box>

    </Paper>
  );
};

export default FinalResult;