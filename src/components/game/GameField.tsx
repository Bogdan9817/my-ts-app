import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  saveScore,
  setupName,
  switchStatus,
} from "../../store/slices/gameSlice";
import withPopup from "../../hocs/withPopup";
import Wall, { Coord } from "./parts/Wall";
import Drone from "./parts/Drone";
import Gauges from "./parts/Gauges";

import "./styles/styles.scss";

const WSS_BASE_URL = "wss://cave-drone-server.shtoa.xyz/cave";

function GameField() {
  const dispatch = useAppDispatch();
  const { token, id, complexity } = useAppSelector((state) => state.game);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>(
    null
  );
  const [walls, setWalls] = useState<Wall[]>([]);
  const [drone, setDrone] = useState<Drone | null>();
  const [gauges, setGauges] = useState<Gauges>();
  const [load, setLoad] = useState<boolean>(true);

  useEffect(() => {
    if (canvasRef.current && id && token) {
      const context = canvasRef.current.getContext("2d");
      const canvasMidX = canvasRef.current.width / 2;
      const canvasHeight = canvasRef.current.height;
      if (context) {
        const initMessage = `player:${id}-${token}`;
        const leftWallCoords: number[] = [];
        const rightWallCoords: number[] = [];
        const ws = new WebSocket(WSS_BASE_URL);
        ws.onopen = () => {
          ws.send(initMessage);
          setLoad(true);
        };
        ws.onmessage = (event) => {
          if (event.data === "finished") {
            const mid = (rightWallCoords[0] + leftWallCoords[0]) / 2;
            const droneInstance = new Drone(canvasMidX + mid, context);
            const leftWall = new Wall(
              leftWallCoords,
              context,
              canvasMidX,
              complexity
            );
            const rightWall = new Wall(
              rightWallCoords,
              context,
              canvasMidX,
              complexity
            );
            const gauges = new Gauges(context, canvasHeight, complexity);
            setGauges(gauges);
            setDrone(droneInstance);
            setWalls([leftWall, rightWall]);
            setCanvasCtx(context);
            setLoad(false);
          } else {
            const [left, right] = event.data.split(",");
            leftWallCoords.push(Number(left));
            rightWallCoords.push(Number(right));
          }
        };
      }
    }
  }, []);

  let loop: number;

  function animate() {
    if (drone?.crashed) {
      cancelAnimationFrame(loop);
      dispatch(setupName(null));
      setWalls([]);
      canvasCtx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
      dispatch(switchStatus("lost"));
    } else {
      if (walls[0]?.isLevelPassed) {
        cancelAnimationFrame(loop);
        dispatch(
          saveScore(gauges?.scoreValue && Math.round(gauges.scoreValue))
        );
        setWalls([]);
        canvasCtx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
        dispatch(switchStatus("win"));
        return;
      }
      if (canvasCtx) {
        canvasCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        loop = requestAnimationFrame(animate);
        let coords: Coord[] = [];
        for (let wall of walls) {
          wall.update();
          coords.push(wall.potentialCollide);
        }
        if (walls.length > 0) {
          drone?.update(coords);
        }
        gauges?.update(walls[0]?.velocity || 0, drone?.velocity || 0);
      }
    }
  }

  useEffect(() => {
    if (drone) {
      animate();
    }
    const handleKeyDown = (e: { key: string }) => {
      if (!drone?.crashed) {
        if (e.key === "ArrowLeft") return drone?.moveLeft();
        if (e.key === "ArrowRight") return drone?.moveRight();
        if (e.key === "ArrowUp")
          return walls.forEach((wall) => wall.decrementVelocity());
        if (e.key === "ArrowDown")
          return walls.forEach((wall) => wall.incrementVelocity());
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [drone]);

  return (
    <div className='gamefield'>
      {load && <div>Preparing game...</div>}
      <canvas
        className={`gamefield__window ${load ? "hide" : ""}`}
        height={250}
        width={500}
        ref={canvasRef}
      ></canvas>
    </div>
  );
}

export default withPopup(GameField);
