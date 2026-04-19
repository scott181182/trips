import { select, zoom } from "d3";
import { type RefCallback, useCallback, useMemo, useState } from "react";

export interface SvgPanZoomOptions {
  scaleExtent?: [number, number];
  translateExtent?: [[number, number], [number, number]];
}
export function useSvgPanZoom(options?: Readonly<SvgPanZoomOptions>) {
  const [zoomTransform, setZoomTransform] = useState<string | undefined>(undefined);
  const zoomFn = useMemo(() => {
    let fn = zoom().on("zoom", (e) => {
      setZoomTransform(e.transform);
    });

    if (options?.scaleExtent) {
      fn = fn.scaleExtent(options.scaleExtent);
    }
    if (options?.translateExtent) {
      fn = fn.translateExtent(options.translateExtent);
    }

    return fn;
  }, [options]);

  const refFn = useCallback<RefCallback<SVGSVGElement>>(
    (node) => {
      if (node) {
        select(node).call(zoomFn as unknown as () => d3.Selection<SVGSVGElement, unknown, null, undefined>);
      }
    },
    [zoomFn],
  );

  return useMemo(
    () => ({
      zoomTransform,
      ref: refFn,
    }),
    [refFn, zoomTransform],
  );
}
