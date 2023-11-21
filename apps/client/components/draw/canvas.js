import React from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';

const DrawingCanvas = ({ isSubmitting, setImage }) => {
  const [lines, setLines] = React.useState([]);
  const stageRef = React.useRef(null);
  const isDrawing = React.useRef(false);

  const handleMouseDown = (e) => {
    e.evt.preventDefault();

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool: 'pen', points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    e.evt.preventDefault();

    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];

    lastLine.points = lastLine.points.concat([point.x, point.y]);

    lines.splice(lines.length - 1, 1, lastLine);

    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleExportToPNG = () => {
    const uri = stageRef.current.toDataURL();

    setImage(uri);
  };

  React.useEffect(() => {
    if (isSubmitting) handleExportToPNG();
  }, [isSubmitting]);

  // TODO: Set height and width proportionately based on screen size
  return (
    <div>
      <button onClick={handleExportToPNG} id="test">test png function</button>
      <Stage
        ref={stageRef}
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
          <Rect width={800} height={600} fill="white" />
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