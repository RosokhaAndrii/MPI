import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import type { Data, Layout, Config } from 'plotly.js';
import type { TrajectoryResult } from '../../Types/TrajectoryTypes';
import { TRAJECTORY_COLORS } from '../../Utils/constants'; 
import styles from './Chart.module.css';

interface ChartProps {
  trajectories?: TrajectoryResult[];
  title?: string;
  height?: number;
}

const Chart: React.FC<ChartProps> = ({
  trajectories = [],
  title = 'Траєкторія руху',
  height = 500,
}) => {
  const [visiblePoints, setVisiblePoints] = useState<number>(0);

  useEffect(() => {
    if (trajectories.length === 0) {
      setVisiblePoints(0);
      return;
    }
    
    const maxLen = Math.max(...trajectories.map((t) => t.listTrajectories.length));
    
    setVisiblePoints(0);

    const step = Math.max(1, Math.ceil(maxLen / 100));

    const timer = setInterval(() => {
      setVisiblePoints((prev) => {
        if (prev >= maxLen) {
          clearInterval(timer);
          return maxLen;
        }
        return prev + step; 
      });
    }, 16); 

    return () => clearInterval(timer);
  }, [trajectories]);

  const traces: Data[] = trajectories.map((data, index) => {
    const currentPoints = data.listTrajectories.slice(0, visiblePoints);

    return {
      x: currentPoints.map((point) => point.x),
      y: currentPoints.map((point) => point.y),
      mode: 'lines',
      name: `Траєкторія ${index + 1}`,
      type: 'scatter',
      line: {
        color: TRAJECTORY_COLORS[index % TRAJECTORY_COLORS.length],
        width: 3,
        dash: 'dot',
      },
      hovertemplate:
        '<b>Відстань:</b> %{x:.2f} м<br>' +
        '<b>Висота:</b> %{y:.2f} м<br>' +
        '<b>Параметри:</b><br>' +
        `Кут: ${data.params.angle}°<br>` +
        `V₀: ${data.params.V0} м/с<br>` +
        `Прискорення: ${data.params.a} м/с²<br>` +
        '<extra></extra>',
    };
  });

  const minX = Math.min(0, ...trajectories.map(t => Math.min(t.params.x0 || 0, t.maxDistance)));
  const maxX = Math.max(10, ...trajectories.map(t => Math.max(t.params.x0 || 0, t.maxDistance)));
  
  const minY = Math.min(0, ...trajectories.map(t => t.params.y0 || 0));
  const maxY = Math.max(10, ...trajectories.map(t => t.maxHeight));

  const rangeX = [minX < 0 ? minX * 1.1 : -2, maxX > 0 ? maxX * 1.1 : 2];
  const rangeY = [minY < 0 ? minY * 1.2 : -1, maxY * 1.2];

  const layout: Partial<Layout> = {
    title: { text: title, font: { size: 18, color: '#2c3e50' } },
    xaxis: {
      title: { text: 'Відстань X (м)' },
      gridcolor: '#e0e0e0',
      zeroline: true,
      range: rangeX 
    },
    yaxis: {
      title: { text: 'Висота Y (м)' },
      gridcolor: '#e0e0e0',
      zeroline: true,
      range: rangeY 
    },
    plot_bgcolor: '#f8f9fa',
    hovermode: 'closest',
    showlegend: trajectories.length > 1,
    autosize: true,
    margin: { l: 60, r: 150, t: 60, b: 60 },
    height,
  };

  const config: Partial<Config> = { responsive: true, displayModeBar: true };

  return (
    <div className={styles.chartContainer}>
      <Plot
        data={traces}
        layout={layout}
        config={config}
        className={styles.plot}
        useResizeHandler={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default Chart;