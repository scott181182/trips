import type { ScaleOrdinal, ScaleTime } from "d3";

import cls from "./LegBox.module.css";
import type { RouteLeg } from "./utils";

const BOX_MARGIN = 5;
const TEXT_MARGIN = 10;

export interface LegBoxProps {
  leg: RouteLeg;
  timeScale: ScaleTime<number, number>;
  locationColor: ScaleOrdinal<string, string, never>;
}

export function LegBox({ leg, timeScale, locationColor }: Readonly<LegBoxProps>) {
  const x = timeScale(leg.start);
  const width = timeScale(leg.end) - timeScale(leg.start);
  const y = 5;
  const height = BOX_MARGIN * 2 + TEXT_MARGIN + 10 * leg.characters.length;
  const color = locationColor(leg.location);

  return (
    <g className={cls.legBox}>
      <rect x={x} width={width} y={y} height={height} fill={color} stroke={color} rx="5" ry="5" />
      {/*<text x={x + BOX_MARGIN} y={y + BOX_MARGIN} dominantBaseline="hanging">
        {leg.location}
      </text>*/}
    </g>
  );
}
