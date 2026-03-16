import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import styles from './Controls.module.css';
import type { SimulationParams } from '../../Types/TrajectoryTypes';

interface ControlsProps {
  onSimulate: (params: SimulationParams) => void;
  onAdd: (params: SimulationParams) => void;
  onClear: () => void;
  disabled?: boolean;
  initialParams?: Partial<SimulationParams>;
}

const Controls: React.FC<ControlsProps> = ({
  onSimulate,
  onAdd,
  onClear,
  disabled = false,
  initialParams = {},
}) => {
  const defaultParams: SimulationParams = {
    V0: initialParams.V0 ?? 20,
    angle: initialParams.angle ?? 45,
    a: initialParams.a ?? 0,
    x0: initialParams.x0 ?? 0,
    y0: initialParams.y0 ?? 0,
  };

  const [params, setParams] = useState<SimulationParams>(defaultParams);

  const handleInternalClear = () => {
  setParams(defaultParams);

  setInputs({
    V0:"0",
    angle: "0",
    a: "0",
    x0: defaultParams.x0.toString(),
    y0: defaultParams.y0.toString(),
  });

  onClear();
};

  const [inputs, setInputs] = useState<Record<keyof SimulationParams, string>>({
    V0: defaultParams.V0.toString(),
    angle: defaultParams.angle.toString(),
    a: defaultParams.a.toString(),
    x0: defaultParams.x0.toString(),
    y0: defaultParams.y0.toString(),
  });

  const handleInputChange = (field: keyof SimulationParams) => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setInputs((prev) => ({ ...prev, [field]: value }));

    const num = parseFloat(value);
    if (!isNaN(num)) {
      setParams((prev) => ({ ...prev, [field]: num }));
    }
  };

  return (
    <div className={styles.controls}>
      <div className={styles.inputGroup}>
        <label>
          Початкова швидкість (м/с):
          <span className={styles.value}>
            {inputs.V0 || params.V0}
          </span>
        </label>
        <input
          type="number"
          value={inputs.V0}
          onChange={handleInputChange('V0')}
          min={1}
          max={200}
          step={1}
          disabled={disabled}
        />
      </div>

      <div className={styles.inputGroup}>
        <label>
          Кут (градуси):
          <span className={styles.value}>
            {inputs.angle || params.angle}
          </span>
        </label>
        <input
          type="number"
          value={inputs.angle}
          onChange={handleInputChange('angle')}
          min={0}
          max={90}
          step={1}
          disabled={disabled}
        />
      </div>

      <div className={styles.inputGroup}>
        <label>
          Прискорення (м/с²):
          <span className={styles.value}>
            {inputs.a !== '' ? inputs.a : params.a.toFixed(1)}
          </span>
        </label>
        <input
          type="number"
          value={inputs.a}
          onChange={handleInputChange('a')}
          min={0}
          max={10}
          step={0.1}
          disabled={disabled}
        />
      </div>

      <div className={styles.inputGroup}>
        <label>
          Початкова X₀ (м):
          <span className={styles.value}>
            {inputs.x0 || params.x0}
          </span>
        </label>
        <input
          type="number"
          value={inputs.x0}
          onChange={handleInputChange('x0')}
          min={-100}
          max={100}
          step={0.1}
          disabled={disabled}
        />
      </div>

      <div className={styles.inputGroup}>
        <label>
          Початкова Y₀ (м):
          <span className={styles.value}>
            {inputs.y0 || params.y0}
          </span>
        </label>
        <input
          type="number"
          value={inputs.y0}
          onChange={handleInputChange('y0')}
          min={-100}
          max={100}
          step={0.1}
          disabled={disabled}
        />
      </div>

      <div className={styles.buttons}>
        <button
          onClick={() => onSimulate(params)}
          disabled={disabled}
          className={styles.btnPrimary}
        >
          Побудувати графік
        </button>
        <button
          onClick={() => onAdd(params)}
          disabled={disabled}
          className={styles.btnSecondary}
        >
          Додати траєкторію
        </button>
        <button onClick={handleInternalClear} disabled={disabled} className={styles.btnDanger}>
          Очистити
        </button>
      </div>
    </div>
  );
};

export default Controls;