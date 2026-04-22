import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Divider,
  Box,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import type { ConfigState, ConfigAction } from '../../Types/lab3Types'; 
import styles from './InputPanel.module.css';

interface InputPanelProps {
  state: ConfigState;
  dispatch: React.Dispatch<ConfigAction>;
}

const InputPanel: React.FC<InputPanelProps> = ({ state, dispatch }) => {
  const [newItem, setNewItem] = useState({ name: '', weight: '', value: '' });

  const handleAddItem = () => {
    const weight = parseInt(newItem.weight);
    const value = parseInt(newItem.value);

    if (newItem.name.trim() && !isNaN(weight) && !isNaN(value)) {
      dispatch({
        type: 'ADD_ITEM',
        payload: { name: newItem.name.trim(), weight, value }
      });
      setNewItem({ name: '', weight: '', value: '' });
    }
  };

  return (
    <div className={styles.panelContainer}>
      <section className={styles.section}>
        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
          Параметри рюкзака
        </Typography>
        <TextField
          label="Максимальна місткість (W)"
          type="number"
          variant="outlined"
          fullWidth
          value={state.capacity}
          onChange={(e) => dispatch({ 
            type: 'SET_CAPACITY', 
            payload: parseInt(e.target.value) || 0 
          })}
        />
      </section>

      <Divider />

      <section className={styles.section}>
        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
          Новий предмет
        </Typography>
        <div className={styles.formGrid}>
          <TextField
            className={styles.fullWidth}
            label="Назва"
            size="small"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <TextField
            label="Вага (w)"
            type="number"
            size="small"
            value={newItem.weight}
            onChange={(e) => setNewItem({ ...newItem, weight: e.target.value })}
          />
          <TextField
            label="Цінність (v)"
            type="number"
            size="small"
            value={newItem.value}
            onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
          />
          <Button 
            className={styles.fullWidth}
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            disabled={!newItem.name || !newItem.weight || !newItem.value}
          >
            Додати предмет
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.listHeader}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Доступні предмети ({state.items.length})
          </Typography>
          <Tooltip title="Видалити всі">
            <span>
              <IconButton 
                size="small" 
                color="error" 
                onClick={() => dispatch({ type: 'CLEAR_ITEMS' })}
                disabled={state.items.length === 0}
              >
                <DeleteSweepIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
        
        <List className={styles.itemList} dense>
          {state.items.map((item, index) => (
            <ListItem
              key={item.id}
              divider={index !== state.items.length - 1}
              secondaryAction={
                <IconButton edge="end" color="error" onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              }
            >
              <ListItemText 
                primary={
                  <Typography sx={{ fontWeight: 'medium' }}>
                    {item.name}
                  </Typography>
                }
                secondary={`Вага: ${item.weight} | Цінність: ${item.value}`} 
              />
            </ListItem>
          ))}
          {state.items.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
              <Typography variant="body2">Немає жодного предмета.</Typography>
              <Typography variant="caption">Додайте їх через форму вище.</Typography>
            </Box>
          )}
        </List>
      </section>

    </div>
  );
};

export default InputPanel;