import React from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';

const DrawingCanvas = () => {
  const [lines, setLines] = React.useState([]);
  const isDrawing = React.useRef(false);

  const handleMouseDown = (e) => {
    e.evt.preventDefault();

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool: 'pen', points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    e.evt.preventDefault();

    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  // TODO: Set height and width proportionately based on screen size
  return (
    <div>
      <Stage
        width={500}
        height={200}
        onTap={handleMouseDown}
        onTouchstart={handleMouseDown}
        onTouchmove={handleMouseMove}
        onTouchend={handleMouseUp}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          <Rect width={800} height={600} fill="#D3D3D3" />
        </Layer>
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default DrawingCanvas;