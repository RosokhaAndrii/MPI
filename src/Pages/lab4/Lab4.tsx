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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import PlotVisualizer from "../../Components/PlotVizualiser/PlotVizualiser";
import { calculateLagrange } from "./calcs/calculateLagrange";
import { calculateLSA } from "./calcs/calculateLSA";
import { calculateNewton } from "./calcs/calculateNewton";
import type { Point } from "../../Types/lab4types";
import styles from "./Lab4.module.css";

const DATASETS = {
  5: [
    { x: -2, y: 4.1 },
    { x: -1, y: 1.2 },
    { x: 0, y: 0.1 },
    { x: 1, y: 0.9 },
    { x: 2, y: 3.8 },
  ],
  10: [
    { x: -4, y: 16.1 },
    { x: -3, y: 9.1 },
    { x: -2, y: 4.2 },
    { x: -1, y: 1.1 },
    { x: 0, y: 0.1 },
    { x: 1, y: 1.2 },
    { x: 2, y: 4.3 },
    { x: 3, y: 9.2 },
    { x: 4, y: 16.1 },
    { x: 5, y: 25.2 },
  ],
  20: [
    { x: -4.5, y: 20.3 },
    { x: -4, y: 16.1 },
    { x: -3.5, y: 12.3 },
    { x: -3, y: 9.1 },
    { x: -2.5, y: 6.3 },
    { x: -2, y: 4.1 },
    { x: -1.5, y: 2.3 },
    { x: -1, y: 1.1 },
    { x: -0.5, y: 0.3 },
    { x: 0, y: 0.1 },
    { x: 0.5, y: 0.3 },
    { x: 1, y: 0.9 },
    { x: 1.5, y: 2.4 },
    { x: 2, y: 3.8 },
    { x: 2.5, y: 6.4 },
    { x: 3, y: 9.1 },
    { x: 3.5, y: 12.2 },
    { x: 4, y: 16.1 },
    { x: 4.5, y: 20.4 },
    { x: 5, y: 25.1 },
  ],
};

const formatPolynomialToLatex = (coeffs: number[]): string => {
  if (!coeffs || coeffs.length === 0) return "0";
  const terms = [];
  for (let i = coeffs.length - 1; i >= 0; i--) {
    const c = coeffs[i];
    if (Math.abs(c) < 1e-4 && i !== 0) continue;
    const sign = c < 0 ? "-" : "+";
    const val = Math.abs(c).toFixed(3);
    const valStr = val === "1.000" && i !== 0 ? "" : val;
    if (i === 0) terms.push(`${sign} ${val}`);
    else if (i === 1) terms.push(`${sign} ${valStr}x`);
    else terms.push(`${sign} ${valStr}x^{${i}}`);
  }
  let result = terms.join(" ").trim();
  if (result.startsWith("+ ")) result = result.substring(2);
  return `f(x) = ${result === "" || result === "-" ? "0" : result}`;
};

const generateLagrangeLatex = (points: Point[]): string => {
  if (points.length === 0) return "L(x) = 0";
  if (points.length === 1) return `L_0(x) = ${points[0].y}`;
  const terms = points.map((p, i) => {
    let numerator = "";
    let den = 1;
    points.forEach((pj, j) => {
      if (i !== j) {
        const termX =
          pj.x < 0 ? `+${Math.abs(pj.x)}` : pj.x > 0 ? `-${pj.x}` : "";
        numerator += `(x${termX})`;
        den *= p.x - pj.x;
      }
    });
    const yStr = Math.abs(p.y).toFixed(1).replace(/\.0$/, "");
    const sign = p.y < 0 ? "-" : "+";
    const prefix = i === 0 ? (p.y < 0 ? "-" : "") : sign;
    const denStr = Number.isInteger(den) ? den.toString() : den.toFixed(2);
    return `${prefix} ${yStr} \\frac{${numerator}}{${denStr}}`;
  });
  if (terms.length > 4)
    return `L_{${points.length - 1}}(x) = ${terms.slice(0, 2).join(" ")} + \\dots ${terms[terms.length - 1]}`;
  return `L_{${points.length - 1}}(x) = ${terms.join(" ")}`;
};

const generateNewtonLatex = (points: Point[], diffs: number[][]): string => {
  if (points.length === 0 || !diffs || diffs.length === 0) return "N(x) = 0";
  const result = `N_{${points.length - 1}}(x) = ${points[0].y.toFixed(1).replace(/\.0$/, "")}`;
  let product = "";
  const terms = [];
  for (let i = 1; i < points.length; i++) {
    const prevX = points[i - 1].x;
    const termX =
      prevX < 0 ? `+${Math.abs(prevX)}` : prevX > 0 ? `-${prevX}` : "";
    product += `(x${termX})`;
    const coef = diffs[0][i];
    if (Math.abs(coef) < 1e-8) continue;
    const sign = coef < 0 ? "-" : "+";
    const val = Math.abs(coef).toFixed(3);
    terms.push(`${sign} ${val}${product}`);
  }
  if (terms.length > 4)
    return (
      result +
      " " +
      terms.slice(0, 2).join(" ") +
      " + \\dots " +
      terms[terms.length - 1]
    );
  return result + " " + terms.join(" ");
};

const Lab4 = () => {
  const [method, setMethod] = useState<"INTERPOLATION" | "LSA" | "ALL">("ALL");
  const [interpType, setInterpType] = useState<"LAGRANGE" | "NEWTON">(
    "LAGRANGE",
  );
  const [degreeStr, setDegreeStr] = useState<string>("2");
  const [isAnimating, setIsAnimating] = useState(false);
  const [animDuration, setAnimDuration] = useState<number>(4);
  const [datasetSize, setDatasetSize] = useState<"5" | "10" | "20" | "CUSTOM">(
    "5",
  );
  const [customPoints, setCustomPoints] = useState<Point[]>(DATASETS[5]);

  const [manualX, setManualX] = useState<string>("");
  const [manualY, setManualY] = useState<string>("");

  const activeDataset =
    datasetSize === "CUSTOM"
      ? [...customPoints].sort((a, b) => a.x - b.x)
      : DATASETS[datasetSize as unknown as keyof typeof DATASETS];

  const [globalProgress, setGlobalProgress] = useState(1);
  const [visiblePointsCount, setVisiblePointsCount] = useState(
    activeDataset.length,
  );
  const prevInterpolationRef = useRef<((x: number) => number) | undefined>(
    undefined,
  );

  useEffect(() => {
    setIsAnimating(false);
    setVisiblePointsCount(activeDataset.length);
    setGlobalProgress(1);
  }, [datasetSize, activeDataset.length, interpType]);

  useEffect(() => {
    if (!isAnimating) return;
    const DURATION = animDuration * 1000;
    let startTime: number | null = null;
    let animationFrameId: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      setGlobalProgress(progress);
      if (method === "INTERPOLATION" || method === "ALL") {
        const totalSteps =
          activeDataset.length > 0 ? activeDataset.length - 1 : 0;
        const currentStep = Math.floor(progress * totalSteps);
        const pointsToShow = Math.min(2 + currentStep, activeDataset.length);
        setVisiblePointsCount((prev) => {
          if (
            prev !== pointsToShow &&
            activeDataset.slice(0, prev).length > 0
          ) {
            const pts = activeDataset.slice(0, prev);
            prevInterpolationRef.current =
              interpType === "NEWTON"
                ? calculateNewton(pts).evaluate
                : calculateLagrange(pts).evaluate;
          }
          return pointsToShow;
        });
      }
      if (progress < 1) animationFrameId = requestAnimationFrame(animate);
      else setIsAnimating(false);
    };
    if (method === "INTERPOLATION" || method === "ALL")
      setVisiblePointsCount(Math.min(2, activeDataset.length));
    if (method === "LSA") setVisiblePointsCount(activeDataset.length);
    setGlobalProgress(0);
    prevInterpolationRef.current = undefined;
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAnimating, method, activeDataset, animDuration, interpType]);

  const hasEnoughData = activeDataset.length >= 2;
  const currentPoints = useMemo(
    () => activeDataset.slice(0, visiblePointsCount),
    [visiblePointsCount, activeDataset],
  );

  const newtonData = useMemo(() => {
    if (!hasEnoughData) return { evaluate: () => 0, dividedDifferences: [] };
    try {
      return calculateNewton(currentPoints);
    } catch {
      return { evaluate: () => 0, dividedDifferences: [] };
    }
  }, [currentPoints, hasEnoughData]);

  const targetInterpolation = useMemo(() => {
    if (!hasEnoughData) return { evaluate: () => 0 };
    return interpType === "NEWTON"
      ? newtonData
      : calculateLagrange(currentPoints);
  }, [currentPoints, hasEnoughData, interpType, newtonData]);

  const parsedDegree = parseInt(degreeStr);
  const safeDegree = isNaN(parsedDegree)
    ? 1
    : Math.max(1, Math.min(parsedDegree, activeDataset.length - 1));
  const lsa = useMemo(
    () =>
      hasEnoughData
        ? calculateLSA(activeDataset, safeDegree)
        : { evaluate: () => 0, coefficients: [], residuals: [] },
    [safeDegree, activeDataset, hasEnoughData],
  );

  const animatedLsaFunc = useMemo(() => {
    if (!hasEnoughData) return () => 0;
    const meanY =
      currentPoints.reduce((sum, p) => sum + p.y, 0) /
      (currentPoints.length || 1);
    return (x: number) => {
      const finalY = lsa.evaluate(x);
      return meanY + (finalY - meanY) * globalProgress;
    };
  }, [lsa.evaluate, globalProgress, currentPoints, hasEnoughData]);

  const animatedResiduals = useMemo(
    () => lsa.residuals.map((r) => r * globalProgress),
    [lsa.residuals, globalProgress],
  );

  const animatedInterpolationFunc = useMemo(() => {
    const prevFunc = prevInterpolationRef.current;
    if (!isAnimating || !prevFunc || !hasEnoughData)
      return targetInterpolation.evaluate;
    const totalSteps = activeDataset.length - 1;
    const stepDuration = 1 / totalSteps;
    const currentStepIndex = Math.max(0, visiblePointsCount - 2);
    const stepStartProgress = currentStepIndex * stepDuration;
    const microProgress = Math.max(
      0,
      Math.min((globalProgress - stepStartProgress) / stepDuration, 1),
    );
    return (x: number) =>
      prevFunc(x) +
      (targetInterpolation.evaluate(x) - prevFunc(x)) * microProgress;
  }, [
    targetInterpolation.evaluate,
    globalProgress,
    isAnimating,
    visiblePointsCount,
    activeDataset.length,
    hasEnoughData,
  ]);

  const maxResidual = useMemo(() => {
    if (!lsa.residuals || lsa.residuals.length === 0) return 1;
    const max = Math.max(...lsa.residuals.map(Math.abs));
    return max < 1e-10 ? 0.1 : max * 1.4;
  }, [lsa.residuals]);

  const handleChartClick = (x: number, y: number) => {
    if (datasetSize === "CUSTOM" && !isAnimating) {
      if (!customPoints.some((p) => Math.abs(p.x - x) < 0.01)) {
        setCustomPoints((prev) => [...prev, { x, y }]);
      }
    }
  };

  const handleAddManualPoint = () => {
    const x = parseFloat(manualX);
    const y = parseFloat(manualY);
    if (!isNaN(x) && !isNaN(y)) {
      if (customPoints.some((p) => Math.abs(p.x - x) < 0.01)) {
        alert("Точка з таким X вже існує!");
        return;
      }
      setCustomPoints((prev) => [...prev, { x, y }]);
      setManualX("");
      setManualY("");
    }
  };

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Paper
        className={styles.controlsWrapper}
        elevation={0}
        variant="outlined"
        sx={{ mb: datasetSize === "CUSTOM" ? 0 : 3 }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Box sx={{ flex: 1, minWidth: "160px" }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.85rem",
                display: "block",
                mb: 1,
                fontWeight: "bold",
                color: "#666",
              }}
            >
              НАБІР ТОЧОК
            </Typography>
            <ToggleButtonGroup
              value={datasetSize}
              exclusive
              onChange={(_, val) =>
                val && setDatasetSize(val as "5" | "10" | "20" | "CUSTOM")
              }
              fullWidth
              size="small"
              color="secondary"
              disabled={isAnimating}
            >
              <ToggleButton value="5">5</ToggleButton>
              <ToggleButton value="10">10</ToggleButton>
              <ToggleButton value="20">20</ToggleButton>
              <ToggleButton value="CUSTOM" sx={{ px: 1 }}>
                Власний
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box sx={{ flex: 1.5, minWidth: "200px" }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.85rem",
                display: "block",
                mb: 1,
                fontWeight: "bold",
                color: "#666",
              }}
            >
              ТИП ІНТЕРПОЛЯЦІЇ
            </Typography>
            <ToggleButtonGroup
              value={interpType}
              exclusive
              onChange={(_, val) =>
                val && setInterpType(val as "LAGRANGE" | "NEWTON")
              }
              fullWidth
              size="small"
              color="info"
              disabled={isAnimating || method === "LSA"}
            >
              <ToggleButton value="LAGRANGE">Лагранж</ToggleButton>
              <ToggleButton value="NEWTON">Ньютон</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box sx={{ flex: 1.5, minWidth: "220px" }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.85rem",
                display: "block",
                mb: 1,
                fontWeight: "bold",
                color: "#666",
              }}
            >
              ВІДОБРАЖЕННЯ
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
          <Box sx={{ flex: 1, minWidth: "90px" }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.85rem",
                display: "block",
                mb: 1,
                fontWeight: "bold",
                color: "#666",
              }}
            >
              СТУПІНЬ (m)
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={degreeStr}
              disabled={isAnimating || method === "INTERPOLATION"}
              onChange={(e) =>
                /^\d*$/.test(e.target.value) && setDegreeStr(e.target.value)
              }
              onBlur={() => {
                let val = parseInt(degreeStr);
                if (isNaN(val) || val < 1) val = 1;
                const maxLimit = Math.max(1, activeDataset.length - 1);
                if (val > maxLimit) val = maxLimit;
                setDegreeStr(val.toString());
              }}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: "120px", px: 1 }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.85rem",
                display: "block",
                mb: 0,
                fontWeight: "bold",
                color: "#666",
              }}
            >
              ЧАС: {animDuration}с
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
              sx={{ color: "#1976d2" }}
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: "120px" }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.85rem",
                display: { xs: "none", md: "block" },
                mb: 1,
                opacity: 0,
              }}
            >
              .
            </Typography>
            <Button
              variant="contained"
              fullWidth
              startIcon={<PlayArrowIcon />}
              onClick={() => setIsAnimating(true)}
              disabled={isAnimating || !hasEnoughData}
              sx={{ height: "40px", borderRadius: "8px" }}
            >
              Анімація
            </Button>
          </Box>
        </Box>
      </Paper>

      {datasetSize === "CUSTOM" && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "#fff3e0",
            borderRadius: "0 0 8px 8px",
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Box sx={{ flex: 2, minWidth: "300px" }}>
            <Typography
              variant="body1"
              sx={{ color: "#e65100", fontWeight: 500, mb: 1 }}
            >
              Режим власного набору: Натисність по графіку або введіть
              координати вручну:
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                label="X"
                size="small"
                value={manualX}
                onChange={(e) => setManualX(e.target.value)}
                sx={{ width: "80px", bgcolor: "white" }}
              />
              <TextField
                label="Y"
                size="small"
                value={manualY}
                onChange={(e) => setManualY(e.target.value)}
                sx={{ width: "80px", bgcolor: "white" }}
              />
              <Button
                variant="contained"
                color="warning"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddManualPoint}
                disabled={isAnimating}
              >
                Додати
              </Button>
            </Box>
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", sm: "block" } }}
          />
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "#666" }}>
              Точок: <strong>{customPoints.length}</strong>
            </Typography>
            <Button
              size="small"
              color="error"
              variant="outlined"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => setCustomPoints([])}
              disabled={isAnimating}
            >
              Очистити
            </Button>
          </Box>
        </Box>
      )}

      <Paper className={styles.plotContainer} elevation={3}>
        <PlotVisualizer
          points={currentPoints}
          interpolationFunc={animatedInterpolationFunc}
          lsaFunc={animatedLsaFunc}
          residuals={animatedResiduals}
          viewMode={method}
          activePointIndex={
            isAnimating && (method === "INTERPOLATION" || method === "ALL")
              ? visiblePointsCount - 1
              : undefined
          }
          maxResidual={maxResidual}
          onChartClick={handleChartClick}
        />
      </Paper>

      <Box className={styles.formulaSection} sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ color: "#1565c0", mb: 2 }}>
          Аналітичний вигляд моделі:
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ mb: 1.5, opacity: interpType === "LAGRANGE" ? 1 : 0.5 }}>
              <Typography variant="body1">
                <strong>Інтерполяція (Лагранж):</strong>
              </Typography>
              <Box
                sx={{
                  mt: 1,
                  p: 1.5,
                  bgcolor: "#f5f5f5",
                  borderRadius: 1,
                  overflowX: "auto",
                  borderLeft:
                    interpType === "LAGRANGE" ? "4px solid #1976d2" : "none",
                }}
              >
                <InlineMath math={generateLagrangeLatex(currentPoints)} />
              </Box>
            </Box>
            <Box sx={{ opacity: interpType === "NEWTON" ? 1 : 0.5 }}>
              <Typography variant="body1">
                <strong>Інтерполяція (Ньютон):</strong>
              </Typography>
              <Box
                sx={{
                  mt: 1,
                  p: 1.5,
                  bgcolor: "#f5f5f5",
                  borderRadius: 1,
                  overflowX: "auto",
                  borderLeft:
                    interpType === "NEWTON" ? "4px solid #0288d1" : "none",
                }}
              >
                <InlineMath
                  math={generateNewtonLatex(
                    currentPoints,
                    newtonData.dividedDifferences,
                  )}
                />
              </Box>
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ typography: "body1" }}>
              <strong>Знайдена функція МНК (m={safeDegree}):</strong>
              <Box
                sx={{
                  mt: 1,
                  p: 1.5,
                  bgcolor: "#f5f5f5",
                  borderRadius: 1,
                  borderLeft: "4px solid #32ab60",
                  overflowX: "auto",
                }}
              >
                <InlineMath math={formatPolynomialToLatex(lsa.coefficients)} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {interpType === "NEWTON" &&
        (method === "INTERPOLATION" || method === "ALL") &&
        hasEnoughData &&
        newtonData.dividedDifferences && (
          <Box
            className={styles.formulaSection}
            sx={{ mt: 3, pt: 0, borderTop: "none" }}
          >
            <Typography variant="h6" sx={{ color: "#1565c0", mb: 2 }}>
              Таблиця поділених різниць (Алгоритм Ньютона):
            </Typography>
            <TableContainer
              component={Paper}
              elevation={1}
              sx={{ overflowX: "auto" }}
            >
              <Table
                size="small"
                sx={{ "& .MuiTableCell-root": { fontSize: "1rem" } }}
              >
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f0f4f8" }}>
                    <TableCell>
                      <strong>i</strong>
                    </TableCell>
                    <TableCell>
                      <strong>X_i</strong>
                    </TableCell>
                    <TableCell>
                      <strong>f(X_i)</strong>
                    </TableCell>
                    {Array.from({ length: currentPoints.length - 1 }).map(
                      (_, j) => (
                        <TableCell key={j}>
                          <strong>Порядок {j + 1}</strong>
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentPoints.map((p, i) => (
                    <TableRow
                      key={i}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{i}</TableCell>
                      <TableCell>{p.x}</TableCell>
                      {newtonData.dividedDifferences[i]?.map((val, j) => {
                        if (i + j < currentPoints.length) {
                          const displayVal = Math.abs(val) < 1e-10 ? 0 : val;
                          return (
                            <TableCell key={j}>
                              {displayVal === 0 ? "0" : displayVal.toFixed(4)}
                            </TableCell>
                          );
                        }
                        return <TableCell key={j}></TableCell>;
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
    </Container>
  );
};

export default Lab4;
