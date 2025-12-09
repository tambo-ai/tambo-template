import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { z } from 'zod';

export const graphSchema = z.object({
  type: z.enum(['bar', 'line']).optional().default('bar'),
  labels: z.array(z.string()),
  datasets: z.array(
    z.object({
      label: z.string().optional(),
      data: z.array(z.number()),
      color: z.string().optional(),
    })
  ),
});

export type GraphProps = z.infer<typeof graphSchema>;

export function Graph({ type = 'bar', labels, datasets }: GraphProps) {
  const width = 320;
  const height = 200;
  const padding = 24;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const max = Math.max(1, ...datasets.flatMap((d) => d.data));

  const barW = innerW / Math.max(1, labels.length);

  return (
    <View className="items-center">
      <Svg width={width} height={height}>
        {/* axes */}
        <Line x1={padding} y1={padding} x2={padding} y2={padding + innerH} stroke="#e5e7eb" strokeWidth={1} />
        <Line x1={padding} y1={padding + innerH} x2={padding + innerW} y2={padding + innerH} stroke="#e5e7eb" strokeWidth={1} />

        {type === 'bar' && (
          datasets.map((ds, di) => (
            labels.map((_, i) => {
              const v = ds.data[i] ?? 0;
              const h = (v / max) * innerH;
              const x = padding + i * barW + (di * barW) / Math.max(1, datasets.length);
              const w = barW / Math.max(1, datasets.length) - 4;
              const y = padding + innerH - h;
              return <Rect key={`${di}-${i}`} x={x} y={y} width={w} height={h} fill={ds.color ?? '#22c55e'} rx={2} />;
            })
          ))
        )}

        {type === 'line' && (
          datasets.map((ds, di) => {
            const points = ds.data.map((v, i) => {
              const x = padding + (i / Math.max(1, labels.length - 1)) * innerW;
              const y = padding + innerH - (v / max) * innerH;
              return { x, y };
            });
            return points.slice(1).map((p, i) => (
              <Line key={`${di}-l-${i}`} x1={points[i].x} y1={points[i].y} x2={p.x} y2={p.y} stroke={ds.color ?? '#3b82f6'} strokeWidth={2} />
            ));
          })
        )}

        {labels.map((l, i) => (
          <SvgText key={i} x={padding + i * barW + barW / 2} y={padding + innerH + 14} fontSize={10} fill="#6b7280" textAnchor="middle">
            {l}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}

