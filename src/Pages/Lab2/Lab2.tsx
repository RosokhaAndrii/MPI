import React from "react";
import { useTrajectories } from "../../Hooks/useTrajectories";
import { calculateLab2 } from "../../Utils/CalculateLab2";
import Chart from "../../Components/Chart/Chart";
import Controls from "../../Components/Controls/Controls";
import Stats from "../../Components/Stats/Stats";
import TrajectoryList from "../../Components/TrajectoryList/TrajectoryList";
import type { SimulationParams } from "../../Types/TrajectoryTypes";
import styles from "../Lab1/Lab1.module.css";

const Lab2: React.FC = () => {
  const { trajectories, addTrajectory, replaceAll, clear, count, error } =
    useTrajectories(calculateLab2, 8);

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
      <div className={styles.pageTitle}></div>

      <div className={styles.container}>
        <div className={styles.mainGrid}>
          <div className={styles.chartSection}>
            <Chart
              trajectories={trajectories}
              title="Рух тіла, кинутого під кутом до горизонту"
            />
          </div>

          <div className={styles.controlsSection}>
            <Controls
              onSimulate={handleSimulate}
              onAdd={handleAdd}
              onClear={handleClear}
              hideAcceleration={true}
              initialParams={{ V0: 20, angle: 45, x0: 0, y0: 0 }}
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

export default Lab2;
