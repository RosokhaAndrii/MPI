import React from 'react';
import { useTrajectories } from '../../Hooks/useTrajectories';
import Chart from '../../Components/Chart/Chart';
import Controls from '../../Components/Controls/Controls';
import Stats from '../../Components/Stats/Stats';
import TrajectoryList from '../../Components/TrajectoryList/TrajectoryList';
import type { SimulationParams } from '../../Types/TrajectoryTypes';
import styles from './Lab1.module.css';


const Lab1: React.FC = () => {
  const { trajectories, addTrajectory, replaceAll, clear, count, error } =
    useTrajectories(8);

  const handleSimulate = (params: SimulationParams) => {
    replaceAll(params);
  };

  const handleAdd = (params: SimulationParams) => {
    const success = addTrajectory(params);
    if (!success && error) {
      alert(error);
    }
  };

  const handleClear = () => {
    clear();
  };

  const lastTrajectory = trajectories[trajectories.length - 1] || null;

  return (
    <div className={styles.lab1}>
      <div className={styles.pageTitle}>
      </div>

      <div className={styles.container}>
        <div className={styles.mainGrid}>
          <div className={styles.chartSection}>
            <Chart
              trajectories={trajectories}
              title=""
            />
          </div>

          <div className={styles.controlsSection}>
            <Controls
              onSimulate={handleSimulate}
              onAdd={handleAdd}
              onClear={handleClear}
            />
          </div>
        </div>

        <div className={styles.statsSection}>
          <Stats trajectory={lastTrajectory} />
        </div>

        {count > 1 && <TrajectoryList trajectories={trajectories} />}

        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
};

export default Lab1;