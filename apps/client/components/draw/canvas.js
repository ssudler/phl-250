import React from 'react';
import { Stage, Layer, Line } from 'react-konva';

const Canvas = ({ isSubmitting, container, stageRef }) => {
  const [stageWidth, setStageWidth] = React.useState(null);
  const [lines, setLines] = React.useState([]);
  const isDrawing = React.useRef(false);

  const handleMouseDown = (e) => {
    try {
      e.evt.preventDefault();

      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      setLines([...lines, { tool: 'pen', points: [pos.x, pos.y] }]);
    } catch (e) {
      console.log(e);
    }
  };

  const handleMouseMove = (e) => {
    try {
      e.evt.preventDefault();

      if (!isDrawing.current) return;

      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      let lastLine = lines[lines.length - 1];

      lastLine.points = lastLine.points.concat([point.x, point.y]);

      lines.splice(lines.length - 1, 1, lastLine);

      setLines(lines.concat());
    } catch (e) {
      console.log(e);
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  React.useEffect(() => {
    setStageWidth(container.current.offsetWidth);
  }, []);

  React.useEffect(() => {
    if (isSubmitting) setLines([]);
  }, [isSubmitting]);

  if (!stageWidth) return <></>;

  return (
    <div className="border border-gray-400">
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
              stroke="black"
              strokeWidth={7}
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

export default Canvas;