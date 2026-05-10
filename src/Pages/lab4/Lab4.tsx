import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  TextField,
  Slider, 
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

import PlotVisualizer from "../../Components/PlotVizualiser/PlotVizualiser";
import { calculateLagrange } from "./calcs/calculateLagrange";
import { calculateLSA } from "./calcs/calculateLSA";
import type { Point } from "../../Types/lab4types";
import styles from "./Lab4.module.css";

const DATASETS = {
  5: [
    { x: -2, y: 4.1 }, { x: -1, y: 1.2 }, { x: 0, y: 0.1 }, { x: 1, y: 0.9 }, { x: 2, y: 3.8 }
  ],
  10: [
    { x: -4, y: 16.1 }, { x: -3, y: 9.1 }, { x: -2, y: 4.2 }, { x: -1, y: 1.1 }, { x: 0, y: 0.1 }, 
    { x: 1, y: 1.2 }, { x: 2, y: 4.3 }, { x: 3, y: 9.2 }, { x: 4, y: 16.1 }, { x: 5, y: 25.2 }
  ],
  20: [
    { x: -4.5, y: 20.3 }, { x: -4, y: 16.1 }, { x: -3.5, y: 12.3 }, { x: -3, y: 9.1 }, 
    { x: -2.5, y: 6.3 }, { x: -2, y: 4.1 }, { x: -1.5, y: 2.3 }, { x: -1, y: 1.1 }, 
    { x: -0.5, y: 0.3 }, { x: 0, y: 0.1 }, { x: 0.5, y: 0.3 }, { x: 1, y: 0.9 }, 
    { x: 1.5, y: 2.4 }, { x: 2, y: 3.8 }, { x: 2.5, y: 6.4 }, { x: 3, y: 9.1 }, 
    { x: 3.5, y: 12.2 }, { x: 4, y: 16.1 }, { x: 4.5, y: 20.4 }, { x: 5, y: 25.1 }
  ]
};

const Lab4 = () => {
  const [method, setMethod] = useState<"INTERPOLATION" | "LSA" | "ALL">("ALL");
  const [degree, setDegree] = useState<number>(2);
  const [isAnimating, setIsAnimating] = useState(false);
  const [datasetSize, setDatasetSize] = useState<5 | 10 | 20>(5);
  
  const [animDuration, setAnimDuration] = useState<number>(4);
  
  const activeDataset = DATASETS[datasetSize];

  const [globalProgress, setGlobalProgress] = useState(1); 
  const [visiblePointsCount, setVisiblePointsCount] = useState(activeDataset.length);
  const prevLagrangeRef = useRef<((x: number) => number) | undefined>(undefined);

  useEffect(() => {
    setIsAnimating(false);
    setVisiblePointsCount(activeDataset.length);
    setGlobalProgress(1);
    setDegree(2); 
  }, [datasetSize, activeDataset.length]);

  useEffect(() => {
    if (!isAnimating) return;

    const DURATION = animDuration * 1000; 
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      let progress = Math.min(elapsed / DURATION, 1);

      setGlobalProgress(progress);

      if (method === "INTERPOLATION" || method === "ALL") {
        const totalSteps = activeDataset.length - 1; 
        const currentStep = Math.floor(progress * totalSteps);
        const pointsToShow = Math.min(2 + currentStep, activeDataset.length);
        
        setVisiblePointsCount(prev => {
          if (prev !== pointsToShow) {
             prevLagrangeRef.current = calculateLagrange(activeDataset.slice(0, prev)).evaluate;
          }
          return pointsToShow;
        });
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    if (method === "INTERPOLATION" || method === "ALL") setVisiblePointsCount(2);
    if (method === "LSA") setVisiblePointsCount(activeDataset.length);
    setGlobalProgress(0);
    prevLagrangeRef.current = undefined;

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isAnimating, method, activeDataset, animDuration]); 

  const currentPoints = useMemo(
    () => activeDataset.slice(0, visiblePointsCount),
    [visiblePointsCount, activeDataset]
  );
  
  const targetLagrange = useMemo(
    () => calculateLagrange(currentPoints),
    [currentPoints]
  );
  
  const safeDegree = Math.min(degree, activeDataset.length - 1);
  const lsa = useMemo(() => calculateLSA(activeDataset, safeDegree), [safeDegree, activeDataset]);

  const animatedLsaFunc = useMemo(() => {
    const meanY = currentPoints.reduce((sum, p) => sum + p.y, 0) / currentPoints.length;
    return (x: number) => {
      const finalY = lsa.evaluate(x);
      return meanY + (finalY - meanY) * globalProgress;
    };
  }, [lsa.evaluate, globalProgress, currentPoints]);

  const animatedResiduals = useMemo(() => {
    return lsa.residuals.map((r) => r * globalProgress);
  }, [lsa.residuals, globalProgress]);

  const animatedLagrangeFunc = useMemo(() => {
    const prevFunc = prevLagrangeRef.current;
    if (!isAnimating || !prevFunc) return targetLagrange.evaluate;

    const totalSteps = activeDataset.length - 1;
    const stepDuration = 1 / totalSteps;
    const currentStepIndex = visiblePointsCount - 2; 
    const stepStartProgress = currentStepIndex * stepDuration;
    
    let microProgress = (globalProgress - stepStartProgress) / stepDuration;
    microProgress = Math.max(0, Math.min(microProgress, 1));
    
    return (x: number) => {
      const prevY = prevFunc(x);
      const targetY = targetLagrange.evaluate(x);
      return prevY + (targetY - prevY) * microProgress;
    };
  }, [targetLagrange.evaluate, globalProgress, isAnimating, visiblePointsCount, activeDataset.length]);

  const maxResidual = useMemo(() => {
    if (!lsa.residuals || lsa.residuals.length === 0) return 1;
    const max = Math.max(...lsa.residuals.map(Math.abs));
    return max < 1e-10 ? 0.1 : max * 1.4; 
  }, [lsa.residuals]);

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Лабораторна робота №4
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Моделювання апроксимації та інтерполяції (Варіант 4)
      </Typography>

      <Paper className={styles.controlsWrapper} elevation={0} variant="outlined">
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center" }}>
          
          <Box sx={{ flex: 1, minWidth: "120px" }}>
            <Typography variant="caption" sx={{ display: "block", mb: 1, fontWeight: "bold", color: "#666" }}>
              ТОЧОК
            </Typography>
            <ToggleButtonGroup
              value={datasetSize}
              exclusive
              onChange={(_, val) => val && setDatasetSize(val)}
              fullWidth
              size="small"
              color="secondary"
              disabled={isAnimating}
            >
              <ToggleButton value={5}>5</ToggleButton>
              <ToggleButton value={10}>10</ToggleButton>
              <ToggleButton value={20}>20</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ flex: 2, minWidth: "220px" }}>
            <Typography variant="caption" sx={{ display: "block", mb: 1, fontWeight: "bold", color: "#666" }}>
              ОБЕРІТЬ МЕТОД
            </Typography>
            <ToggleButtonGroup
              value={method}
              exclusive
              onChange={(_, val) => val && setMethod(val)}
              fullWidth
              size="small"
              color="primary"
              disabled={isAnimating}
            >
              <ToggleButton value="INTERPOLATION">Інтерполяція</ToggleButton>
              <ToggleButton value="LSA">МНК</ToggleButton>
              <ToggleButton value="ALL">Всі</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ flex: 1, minWidth: "100px" }}>
            <Typography variant="caption" sx={{ display: "block", mb: 1, fontWeight: "bold", color: "#666" }}>
              СТУПІНЬ (m)
            </Typography>
            <TextField
              variant="outlined"
              type="number"
              size="small"
              fullWidth
              value={degree}
              disabled={isAnimating}
              onChange={(e) => {
                let val = parseInt(e.target.value);
                if (!isNaN(val)) {
                  const maxLimit = activeDataset.length - 1;
                  if (val < 1) val = 1;
                  if (val > maxLimit) val = maxLimit;
                  setDegree(val);
                }
              }}
            />
          </Box>
          <Box sx={{ flex: 1.5, minWidth: "150px", px: 2 }}>
            <Typography variant="caption" sx={{ display: "block", mb: 0, fontWeight: "bold", color: "#666" }}>
              ТРИВАЛІСТЬ: {animDuration}с
            </Typography>
            <Slider
              value={animDuration}
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
              disabled={isAnimating}
              onChange={(_, val) => setAnimDuration(val as number)}
              sx={{ color: '#1976d2' }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: "150px" }}>
            <Typography variant="caption" sx={{ display: { xs: "none", md: "block" }, mb: 1, opacity: 0 }}>.</Typography>
            <Button
              variant="contained"
              fullWidth
              startIcon={<PlayArrowIcon />}
              onClick={() => setIsAnimating(true)}
              disabled={isAnimating}
              sx={{ height: "40px", borderRadius: "8px" }}
            >
              Анімація
            </Button>
          </Box>
        </Box>
      </Paper>

      <Paper className={styles.plotContainer} elevation={3}>
        <PlotVisualizer
          points={currentPoints}
          interpolationFunc={animatedLagrangeFunc}
          lsaFunc={animatedLsaFunc}      
          residuals={animatedResiduals}   
          viewMode={method}
          activePointIndex={
            isAnimating && (method === "INTERPOLATION" || method === "ALL")
              ? visiblePointsCount - 1
              : undefined
          }
          maxResidual={maxResidual}
        />
      </Paper>

     <Box className={styles.formulaSection}>
        <Typography variant="h6" sx={{ color: "#1565c0", mb: 2 }}>
          Аналітичний вигляд моделі:
        </Typography>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 1.5 }}>
              <strong>Інтерполяція (Лагранж):</strong> <InlineMath math="L_n(x) = \sum_{i=0}^{n} y_i \prod_{j \neq i} \frac{x - x_j}{x_i - x_j}" />
            </Typography>
            <Typography variant="body2">
              <strong>Інтерполяція (Ньютон):</strong> <InlineMath math="N_n(x) = y_0 + \sum_{k=1}^{n} f[x_0, \dots, x_k] \prod_{i=0}^{k-1} (x - x_i)" />
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2">
              <strong>МНК (Ступінь {safeDegree}):</strong> <InlineMath math={`f(x) = a_{${safeDegree}}x^{${safeDegree}} + \dots + a_1x + a_0`} />
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Lab4;