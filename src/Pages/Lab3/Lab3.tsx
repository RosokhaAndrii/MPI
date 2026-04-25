import React, { useState, useReducer } from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Tabs, 
  Tab, 
  Divider,
  Alert
} from '@mui/material';
import type { AlgorithmType } from '../../Types/lab3Types';
import InputPanel from '../../Components/InputPanel/InputPanel'; 
import PlaybackControls from '../../Components/PlaybackControls/PlaybackControls'; 
import VisualizerContainer from '../../Components/VisualizerContainer/VisualizerContainer';
import { configReducer, initialConfigState } from '../../store/configReducer'; 
import { useAlgorithmExecution } from '../../Hooks/useAlgorithmExecution'; 
import styles from './Lab3.module.css';

const Lab3: React.FC = () => {
  const [tabValue, setTabValue] = useState<AlgorithmType>('DP');
  const [configState, configDispatch] = useReducer(configReducer, initialConfigState);

  const execution = useAlgorithmExecution({
    algorithm: tabValue,
    items: configState.items,
    capacity: configState.capacity
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: AlgorithmType) => {
    setTabValue(newValue);
  };

  return (
    <div className={styles.labContainer}>

      <main className={styles.mainGrid}>
        <aside className={styles.sidebar}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <InputPanel 
              state={configState} 
              dispatch={configDispatch} 
            />
          </Paper>
          
          <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
            <strong>Варіант 4:</strong> Оптимальна цінність для W=9 має бути 12 (предмети 2, 3, 5).
          </Alert>
        </aside>
        
        <Box sx={{ width: '100%' }}>
          <Paper elevation={3} className={styles.visualizationPaper} sx={{ borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant="scrollable" 
                scrollButtons="auto"
              >
                <Tab label="Динамічне програмування" value="DP" />
                <Tab label="Жадібний алгоритм" value="GREEDY" />
                <Tab label="Повний перебір" value="BRUTE_FORCE" />
                <Tab label="Рекурсія" value="RECURSION" />
                <Tab label="Гілки" value="BRANCH_AND_BOUND" />
              </Tabs>
            </Box>

            <Box sx={{ flexGrow: 1, position: 'relative', minHeight: '400px' }}>
              <VisualizerContainer 
                algorithm={tabValue}
                items={configState.items}
                capacity={configState.capacity}
                currentSnapshot={execution.currentSnapshot}
                status={execution.status}
                finalResult={execution.finalResult}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <div className={styles.controlsWrapper}>
              <PlaybackControls 
                status={execution.status}
                currentStep={execution.currentStep}
                totalSteps={execution.totalSteps}
                description={execution.description}
                speed={execution.speed}
                onSpeedChange={execution.setSpeed}
                onPlay={execution.handlePlay}
                onPause={execution.handlePause}
                onStepForward={execution.handleStepForward}
                onStepBackward={execution.handleStepBackward}
                onReset={execution.handleReset}
              />
            </div>
          </Paper>
        </Box>
      </main>
    </div>
  );
};

export default Lab3;