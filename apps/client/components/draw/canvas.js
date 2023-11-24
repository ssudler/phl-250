import React from 'react';
import { Stage, Layer, Line } from 'react-konva';

const DrawingCanvas = ({ isSubmitting, image, setImage, container }) => {
  const [stageWidth, setStageWidth] = React.useState(null);
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

  React.useEffect(() => {
    setStageWidth(container.current.offsetWidth);
  }, []);

  React.useEffect(() => {
    if (!image) setLines([]);
  }, [image]);

  if (!stageWidth) return <></>;

  return (
    <div className="border border-gray-200">
      <Stage
        ref={stageRef}
        width={stageWidth}
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
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="white"
              strokeWidth={10}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation="source-over"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default DrawingCanvas;