import React from "react";
import { IconButton, Slider, Typography, Tooltip } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import ReplayIcon from "@mui/icons-material/Replay";
import SpeedIcon from "@mui/icons-material/Speed";
import FastForwardIcon from "@mui/icons-material/FastForward";
import styles from "./PlaybackControls.module.css";

interface PlaybackControlsProps {
  status: "IDLE" | "RUNNING" | "PAUSED" | "COMPLETED" | "ERROR";
  currentStep: number;
  totalSteps: number;
  description: string;
  speed: number;
  onSpeedChange: (newSpeed: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSkipToEnd: () => void;
  onReset: () => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  status,
  currentStep,
  totalSteps,
  description,
  speed,
  onSpeedChange,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onSkipToEnd,
  onReset,
}) => {
  const isRunning = status === "RUNNING";
  const isIdle = status === "IDLE";
  const isCompleted = status === "COMPLETED";

  const canGoBack = currentStep > 0 && !isRunning;
  const canGoForward =
    (status === "PAUSED" || isCompleted) &&
    currentStep < totalSteps &&
    !isRunning;
  const canPlay = status === "IDLE" || status === "PAUSED";
  const canSkipToEnd = status !== "COMPLETED" && status !== "ERROR";

  return (
    <div className={styles.controlsContainer}>
      <Typography className={styles.statusText} variant="body1">
        {description || "Готовий до запуску"}
      </Typography>

      <div className={styles.mainControls}>
        <Tooltip title="Скинути">
          <span>
            <IconButton
              color="default"
              onClick={onReset}
              disabled={isIdle && currentStep === 0}
            >
              <ReplayIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Попередній крок">
          <span>
            <IconButton
              color="primary"
              onClick={onStepBackward}
              disabled={!canGoBack}
            >
              <SkipPreviousIcon />
            </IconButton>
          </span>
        </Tooltip>

        {isRunning ? (
          <Tooltip title="Пауза">
            <IconButton color="secondary" size="large" onClick={onPause}>
              <PauseIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={isCompleted ? "Завершено" : "Запустити"}>
            <span>
              <IconButton
                color="success"
                size="large"
                onClick={onPlay}
                disabled={!canPlay && !isIdle}
              >
                <PlayArrowIcon fontSize="large" />
              </IconButton>
            </span>
          </Tooltip>
        )}

        <Tooltip title="Наступний крок">
          <span>
            <IconButton
              color="primary"
              onClick={onStepForward}
              disabled={!canGoForward && !isIdle}
            >
              <SkipNextIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Показати результат">
          <span>
            <IconButton
              color="secondary"
              onClick={onSkipToEnd}
              disabled={!canSkipToEnd}
            >
              <FastForwardIcon />
            </IconButton>
          </span>
        </Tooltip>
      </div>

      <div className={styles.speedSection}>
        <Tooltip title="Швидкість анімації">
          <SpeedIcon fontSize="small" />
        </Tooltip>
        <Slider
          size="small"
          value={speed}
          min={10}
          max={100}
          step={10}
          onChange={(_, newValue) => onSpeedChange(newValue as number)}
          disabled={isRunning}
          aria-label="Animation Speed"
        />
        <Typography className={styles.stepCounter}>
          Крок: {currentStep}/{totalSteps}
        </Typography>
      </div>
    </div>
  );
};

export default PlaybackControls;
