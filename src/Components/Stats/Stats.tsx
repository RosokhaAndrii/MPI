import React from 'react';
import type { TrajectoryResult } from '../../Types/TrajectoryTypes';
import styles from './Stats.module.css';

interface StatsProps {
  trajectory: TrajectoryResult | null;
}

interface StatCardProps {
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value}) => {
  return (
    <div className={styles.statCard}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
    </div>
  );
};

const Stats: React.FC<StatsProps> = ({ trajectory }) => {
  if (!trajectory) {
    return (
      <div className={styles.stats}>
        <StatCard label="Максимальна висота" value="0 м" />
        <StatCard label="Дальність польоту" value="0 м" />
        <StatCard label="Час польоту" value="0 с" />
        <StatCard label="Максимальна швидкість" value="0 м/с" />
      </div>
    );
  }

  return (
    <div className={styles.stats}>
      <StatCard
        label="Максимальна висота"
        value={`${trajectory.maxHeight.toFixed(2)} м`}
      />
      <StatCard
        label="Дальність польоту"
        value={`${trajectory.maxDistance.toFixed(2)} м`}
      />
      <StatCard
        label="Час польоту"
        value={`${trajectory.flightTime.toFixed(2)} с`}
      />
      <StatCard
        label="Максимальна швидкість"
        value={`${trajectory.maxSpeed.toFixed(2)} м/с`}
      />
    </div>
  );
};

export default Stats;