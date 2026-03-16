import React from 'react';
import type { TrajectoryResult } from '../../Types/TrajectoryTypes';
import { TRAJECTORY_COLORS } from '../../Utils/constants';
import styles from './TrajectoryList.module.css';

interface TrajectoryListProps {
  trajectories: TrajectoryResult[];
}

const TrajectoryList: React.FC<TrajectoryListProps> = ({ trajectories }) => {
  if (trajectories.length <= 1) {
    return null;
  }

  return (
    <div className={styles.trajectoryList}>
      <h3>Додані траєкторії:</h3>
      <div className={styles.items}>
        {trajectories.map((data, index) => {
          const { params, maxHeight, maxDistance, flightTime } = data;
          return (
            <div key={index} className={styles.trajectoryItem}>
              <div className={styles.itemContent}>
                <div
                  className={styles.color}
                  style={{
                    background: TRAJECTORY_COLORS[index % TRAJECTORY_COLORS.length],
                  }}
                />
                <div className={styles.info}>
                  <strong>Траєкторія {index + 1}:</strong>
                  Кут {params.angle}°, V₀ {params.V0} м/с, Прискорення {params.a}{' '}
                  м/с², X₀ {params.x0} м, Y₀ {params.y0} м
                  <br />
                  <small className={styles.stats}>
                     {maxDistance.toFixed(1)} м |  {maxHeight.toFixed(1)} м | {' '}
                    {flightTime.toFixed(2)} с
                  </small>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrajectoryList;