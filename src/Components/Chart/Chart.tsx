import React from 'react';
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
  const traces: Data[] = trajectories.map((data, index) => ({
    x: data.listTrajectories.map((point) => point.x),
    y: data.listTrajectories.map((point) => point.y),
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
      `<b>Параметри:</b><br>` +
      `Кут: ${data.params.angle}°<br>` +
      `V₀: ${data.params.V0} м/с<br>` +
      `Прискорення: ${data.params.a}<br>` +
      '<extra></extra>',
  }));

  const layout: Partial<Layout> = {
    title: {
      text: title,
      font: { size: 18, color: '#2c3e50' },
    },
    xaxis: {
      title: {
        text: 'Відстань X (м)',
      },
      gridcolor: '#e0e0e0',
      zeroline: true,
    },
    yaxis: {
      title: {
        text: 'Висота Y (м)',
      },
      gridcolor: '#e0e0e0',
      zeroline: true,
    },
    plot_bgcolor: '#f8f9fa',
    hovermode: 'closest',
    showlegend: trajectories.length > 1,
    autosize: true,
    margin: { l: 60, r: 150, t: 60, b: 60 },
    height,
  };

  const config: Partial<Config> = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
  };

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