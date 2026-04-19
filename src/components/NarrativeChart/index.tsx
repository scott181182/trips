import * as d3 from "d3";
import { type RefObject, useMemo, useRef } from "react";
import { useResizeObserver } from "usehooks-ts";

import { useSvgPanZoom } from "@/utils/svg";
import { calculateRoutes } from "./utils";

export interface NarrativeStay {
  id: string;
  location: string;
  start: Date;
  end: Date;
}
export interface NarrativeCharacter {
  id: string;
  name: string;
  stays: NarrativeStay[];
  startLocation?: string;
  endLocation?: string;
}
export interface NarrativeLocation {
  id: string;
  name: string;
  color?: string;
}

const CHART_TOP_MARGIN = 30;
const CHART_BOTTOM_MARGIN = 30;
const CHART_LEFT_MARGIN = 150;
const CHART_RIGHT_MARGIN = 30;

export interface NarrativeChartOptions {
  characters: NarrativeCharacter[];
  locations: NarrativeLocation[];
  className?: string;
}
export function NarrativeChart({ characters, locations, className }: Readonly<NarrativeChartOptions>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useResizeObserver({ ref: containerRef as RefObject<HTMLDivElement> });

  if (characters.length > 10) {
    console.warn("Characters above 10 will result in reused colors.");
  }

  const { routeCharacters, legs } = useMemo(() => calculateRoutes(characters, locations), [characters, locations]);
  const charactersNames = routeCharacters.map((c) => c.name);
  const legNames = legs.map((l) => l.location);
  const characterColor = d3.scaleOrdinal(charactersNames, d3.schemeCategory10);
  const locationColor = d3.scaleOrdinal(legNames, d3.schemeAccent);

  const personStartScale = d3.scaleBand(charactersNames, [CHART_TOP_MARGIN, (height ?? 0) - CHART_BOTTOM_MARGIN]);

  const allStays = characters.flatMap((c) => c.stays);
  const { startTime, endTime } = allStays.reduce(
    (acc, val) => ({
      startTime: val.start < acc.startTime ? val.start : acc.startTime,
      endTime: val.end > acc.endTime ? val.end : acc.endTime,
    }),
    { startTime: allStays[0]?.start, endTime: allStays[0]?.end },
  );

  const timeScale = d3.scaleTime(
    [
      new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), -12),
      new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate(), 12),
    ],
    [CHART_LEFT_MARGIN, (width ?? 0) - CHART_RIGHT_MARGIN],
  );
  const timeAxis = d3.axisTop(timeScale).ticks(d3.timeDay.every(1));

  const { ref: svgRef, zoomTransform } = useSvgPanZoom({
    scaleExtent: [1, 5],
    translateExtent: [
      [0, 0],
      [width ?? 0, height ?? 0],
    ],
  });

  return (
    <div ref={containerRef} className={className}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} ref={svgRef}>
        <title>Narrative Chart</title>
        <g transform={zoomTransform}>
          {allStays.length > 0 && (
            <g
              transform={`translate(0,${CHART_TOP_MARGIN})`}
              ref={(node) => {
                if (node) {
                  d3.select(node).call(timeAxis);
                }
              }}
            ></g>
          )}
          <g transform={`translate(${CHART_LEFT_MARGIN},0)`}>
            {characters.map((c) => {
              const y = (personStartScale(c.name) ?? 0) + personStartScale.bandwidth() / 2;

              return (
                <g key={c.name}>
                  <circle cx="0" cy={y} r="5" stroke="black" fill="none" />
                  <text x="-15" y={y} dominantBaseline="central" textAnchor="end">
                    {c.name}
                  </text>
                </g>
              );
            })}
          </g>
          <g transform={`translate(0,${CHART_TOP_MARGIN})`}>
            {legs.map((l) => (
              <g key={l.id}>
                <rect
                  x={timeScale(l.start)}
                  width={timeScale(l.end) - timeScale(l.start)}
                  y="5"
                  height={20 + 10 * l.characters.length}
                  fill={locationColor(l.location)}
                  fillOpacity="0.3"
                  stroke={locationColor(l.location)}
                  rx="5"
                  ry="5"
                ></rect>
              </g>
            ))}
          </g>
          <g>
            {routeCharacters.map((c) => {
              const startY = (personStartScale(c.name) ?? 0) + personStartScale.bandwidth() / 2;

              const legPoints = c.route.flatMap((r) => {
                const locationY = CHART_TOP_MARGIN + 5;
                return [
                  { x: timeScale(r.start) ?? 0, y: locationY + 10 + 10 * r.index },
                  { x: timeScale(r.end) ?? 0, y: locationY + 10 + 10 * r.index },
                ];
              });

              const path = d3.path();
              let prevX = CHART_LEFT_MARGIN;
              let prevY = startY;
              path.moveTo(prevX, prevY);
              legPoints.forEach((p) => {
                path.bezierCurveTo(prevX + 10, prevY, p.x - 10, p.y, p.x, p.y);
                prevX = p.x;
                prevY = p.y;
              });

              return (
                <path key={c.id} stroke={characterColor(c.name)} strokeWidth="4" d={path.toString()} fill="none"></path>
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
}
