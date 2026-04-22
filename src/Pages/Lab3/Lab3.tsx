import React, { useState, useReducer } from 'react';
import { 
  Paper, 
  Box, 
  Tabs, 
  Tab, 
  Divider,
} from '@mui/material';
import type { AlgorithmType } from '../../Types/lab3Types';
import InputPanel from '../../Components/InputPanel/InputPanel'; 
import PlaybackControls from '../../Components/PlaybackControls/PlaybackControls'; 
import VisualizerContainer from '../../Components/VisualizerContainer/VisualizerContainer';
import { configReducer, initialConfigState } from '../../store/configReducer'; 
import styles from './Lab3.module.css';

const Lab3: React.FC = () => {
  const [tabValue, setTabValue] = useState<AlgorithmType>('DP');
  const [configState, configDispatch] = useReducer(configReducer, initialConfigState);
  const [status, setStatus] = useState<'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'ERROR'>('IDLE');
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [description, setDescription] = useState('Оберіть алгоритм та натисніть "Старт"');
  const [speed, setSpeed] = useState(50);
  const handlePlay = () => setStatus('RUNNING');
  const handlePause = () => setStatus('PAUSED');
  const handleReset = () => {
    setStatus('IDLE');
    setCurrentStep(0);
    setDescription('Очікування запуску...');
  };
  const handleStepForward = () => {
    if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
  };
  const handleStepBackward = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: AlgorithmType) => {
    setTabValue(newValue);
    handleReset(); 
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
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <div className={styles.controlsWrapper}>
              <PlaybackControls 
                status={status}
                currentStep={currentStep}
                totalSteps={totalSteps}
                description={description}
                speed={speed}
                onSpeedChange={setSpeed}
                onPlay={handlePlay}
                onPause={handlePause}
                onStepForward={handleStepForward}
                onStepBackward={handleStepBackward}
                onReset={handleReset}
              />
            </div>
          </Paper>
        </Box>
      </main>
    </div>
  );
};

export default Lab3;