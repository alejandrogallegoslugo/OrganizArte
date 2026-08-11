import React from 'react';

interface QRCodeSVGProps {
  value: string;
  size?: number;
  color?: string;
  bgColor?: string;
}

export const QRCodeSVG: React.FC<QRCodeSVGProps> = ({
  value,
  size = 140,
  color = '#0033a0',
  bgColor = '#ffffff',
}) => {
  const gridCount = 25;
  const cellSize = size / gridCount;

  const modules: boolean[][] = Array.from({ length: gridCount }, () => Array(gridCount).fill(false));

  // Draw 7x7 Finder Patterns at 3 corners
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        modules[startY + r][startX + c] = isBorder || isCenter;
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(gridCount - 7, 0);
  drawFinder(0, gridCount - 7);

  // Timing patterns
  for (let i = 8; i < gridCount - 8; i++) {
    modules[6][i] = i % 2 === 0;
    modules[i][6] = i % 2 === 0;
  }

  // Data modules encoding
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  let bitIdx = 0;
  for (let r = 0; r < gridCount; r++) {
    for (let c = 0; c < gridCount; c++) {
      const isTopLeft = r < 8 && c < 8;
      const isTopRight = r < 8 && c >= gridCount - 8;
      const isBottomLeft = r >= gridCount - 8 && c < 8;
      const isTiming = r === 6 || c === 6;

      if (!isTopLeft && !isTopRight && !isBottomLeft && !isTiming) {
        const charCode = value.charCodeAt(bitIdx % value.length);
        const seed = (hash ^ (charCode * (r * gridCount + c))) & 0xffff;
        modules[r][c] = seed % 3 === 0 || seed % 5 === 0;
        bitIdx++;
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: bgColor, borderRadius: '8px', display: 'block' }}>
      <rect width={size} height={size} fill={bgColor} />
      {modules.map((row, r) =>
        row.map((cell, c) => {
          if (!cell) return null;
          return (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.3}
              height={cellSize + 0.3}
              fill={color}
              rx={0.5}
            />
          );
        })
      )}
    </svg>
  );
};
