import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  Box,
  Tooltip
} from '@mui/material';
import type { DPStepSnapshot, Item } from '../../Types/lab3Types';

interface DPTableProps {
  snapshot: DPStepSnapshot;
  items: Item[];
  capacity: number;
}

const DPTable: React.FC<DPTableProps> = ({ snapshot, items, capacity }) => {
  const { dpMatrix, activeCell, comparingCells, description } = snapshot;

  const getCellStyles = (rowIndex: number, colIndex: number) => {
    const isActive = activeCell?.i === rowIndex && activeCell?.w === colIndex;
    const isComparing = comparingCells.some(cell => cell.i === rowIndex && cell.w === colIndex);
    if (rowIndex === 0 || colIndex === 0) {
      return { backgroundColor: '#f5f5f5', color: '#9e9e9e' };
    }

    if (isActive) {
      return { 
        backgroundColor: '#ffb74d', 
        fontWeight: 'bold',
        border: '2px solid #ef6c00',
        transform: 'scale(1.05)', 
        transition: 'all 0.2s ease'
      };
    }

    if (isComparing) {
      return { 
        backgroundColor: '#bbdefb', 
        border: '2px dashed #1976d2',
        fontWeight: 'bold',
        transition: 'all 0.2s ease'
      };
    }

    return { transition: 'all 0.2s ease' }; 
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f8f9fa', borderLeft: '4px solid #1976d2' }}>
        <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
          {description}
        </Typography>
      </Paper>
      <TableContainer component={Paper} elevation={2} sx={{ maxHeight: '500px' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#e0e0e0', fontWeight: 'bold' }}>
                Предмет \ Вага
              </TableCell>
              {Array.from({ length: capacity + 1 }).map((_, w) => (
                <TableCell key={w} align="center" sx={{ backgroundColor: '#e0e0e0', fontWeight: 'bold', width: '40px' }}>
                  {w}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {dpMatrix.map((row, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'medium', whiteSpace: 'nowrap' }}>
                  {i === 0 ? (
                    "0 (База)"
                  ) : (
                    <Tooltip title={`Цінність: ${items[i-1].value}, Вага: ${items[i-1].weight}`}>
                      <span>
                        {i}. {items[i-1].name} <br/>
                        <Typography variant="caption" color="text.secondary">
                          (v:{items[i-1].value}, w:{items[i-1].weight})
                        </Typography>
                      </span>
                    </Tooltip>
                  )}
                </TableCell>
                {row.map((val, w) => (
                  <TableCell 
                    key={w} 
                    align="center" 
                    sx={getCellStyles(i, w)}
                  >
                    {val}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, backgroundColor: '#ffb74d', border: '1px solid #ef6c00' }} />
          <Typography variant="caption">Поточна комірка</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, backgroundColor: '#bbdefb', border: '1px dashed #1976d2' }} />
          <Typography variant="caption">Дані для порівняння</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DPTable;