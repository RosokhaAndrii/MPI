import React, { useMemo } from "react";
import Plot from "react-plotly.js";
import type { Point } from "../../Types/lab4types";

interface PlotVisualizerProps {
  points: Point[];
  interpolationFunc?: (x: number) => number;
  lsaFunc?: (x: number) => number;
  residuals: number[];
  viewMode: "INTERPOLATION" | "LSA" | "ALL";
  activePointIndex?: number;
  maxResidual?: number;
}

const PlotVisualizer: React.FC<PlotVisualizerProps> = ({
  points,
  interpolationFunc,
  lsaFunc,
  residuals,
  viewMode,
  activePointIndex,
  maxResidual,
}) => {
  const curveX = useMemo(() => {
    if (points.length === 0) return [];
    const minX = Math.min(...points.map(p => p.x)) - 0.5;
    const maxX = Math.max(...points.map(p => p.x)) + 0.5;
    const res = [];
    for (let x = minX; x <= maxX; x += 0.05) res.push(x);
    return res;
  }, [points]);

  const traces = useMemo(() => {
    const data: any[] = [];
    data.push({
      x: points.map((p) => p.x),
      y: points.map((p) => p.y),
      mode: "markers",
      type: "scatter",
      name: "Експериментальні дані",
      customdata: points.map((_, i) =>
        viewMode === "INTERPOLATION" ? 0 : residuals[i] || 0
      ),
      hovertemplate:
        "<b>X:</b> %{x}<br><b>Y:</b> %{y}<br><b>Похибка:</b> %{customdata:.4f}<extra>Вузол</extra>",
      marker: {
        color: points.map((_, i) =>
          i === activePointIndex ? "orange" : "rgb(219, 64, 82)"
        ),
        size: points.map((_, i) => (i === activePointIndex ? 15 : 10)),
        line: { width: 1, color: "white" },
      },
    });

    if ((viewMode === "INTERPOLATION" || viewMode === "ALL") && interpolationFunc) {
      data.push({
        x: curveX,
        y: curveX.map((x) => interpolationFunc(x)),
        mode: "lines",
        name: "Інтерполяція",
        line: { color: "rgb(55, 128, 191)", width: 2, shape: "spline" },
        hovertemplate: "<b>X:</b> %{x:.2f}<br><b>Y:</b> %{y:.3f}<extra>Інтерполяція</extra>",
      });
    }

    if ((viewMode === "LSA" || viewMode === "ALL") && lsaFunc) {
      data.push({
        x: curveX,
        y: curveX.map((x) => lsaFunc(x)),
        mode: "lines",
        name: "МНК Апроксимація",
        line: { color: "rgb(50, 171, 96)", width: 3 },
        hovertemplate: "<b>X:</b> %{x:.2f}<br><b>Y:</b> %{y:.3f}<extra>МНК</extra>",
      });
      const cleanResiduals = residuals.map((r) =>
        Math.abs(r) < 1e-10 ? 0 : r
      );

      data.push({
        x: points.map((p) => p.x),
        y: cleanResiduals,
        type: "bar",
        name: "Залишки (r_i)",
        yaxis: "y2",
        hovertemplate: "<b>X:</b> %{x}<br><b>Похибка:</b> %{y:.4f}<extra>Залишок</extra>",
        marker: {
          color: cleanResiduals.map((r) =>
            r >= 0 ? "rgba(50, 171, 96, 0.75)" : "rgba(219, 64, 82, 0.75)"
          ),
          line: { width: 1, color: "black" },
        },
        text: cleanResiduals.map((r) => (r === 0 ? "0" : r.toFixed(3))),
        textposition: "outside",
        textfont: { size: 11, color: "#333" },
      });
    }

    return data;
  }, [
    points,
    interpolationFunc,
    lsaFunc,
    residuals,
    viewMode,
    curveX,
    activePointIndex,
  ]);

  return (
    <Plot
      data={traces}
      layout={{
        autosize: true,
        height: 650,
        margin: { t: 40, b: 60, l: 85, r: 40 },
        hovermode: "closest",
        xaxis: { title: { text: "X" }, zeroline: true, gridcolor: "#f0f0f0" },
        yaxis: { title: { text: "Y" }, domain: [0.38, 1], gridcolor: "#f0f0f0" },
        yaxis2: {
          title: { text: "r_i (Залишки)", standoff: 15 },
          domain: [0, 0.25],
          zeroline: true,
          zerolinecolor: "black",
          zerolinewidth: 2,
          gridcolor: "#f0f0f0",
          range: maxResidual ? [-maxResidual, maxResidual] : undefined,
        },
        legend: { orientation: "h", x: 0.5, xanchor: "center", y: -0.15 },
        paper_bgcolor: "white",
        plot_bgcolor: "white",
      }}
      config={{ responsive: true, displaylogo: false }}
      style={{ width: "100%" }}
    />
  );
};

export default PlotVisualizer;