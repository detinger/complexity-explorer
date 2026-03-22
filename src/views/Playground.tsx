import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Code2,
} from "lucide-react";

export function Playground() {
  const [mode, setMode] = useState<"ca" | "abm">("ca");
  const [isRunning, setIsRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  // CA State
  const [caCode, setCaCode] = useState(`// CA Rule Definition
// Variables available:
// - state: current cell state (0 or 1)
// - neighbors: sum of 8 surrounding cells
// Return: new state (0 or 1)

if (state === 1) {
  return (neighbors === 2 || neighbors === 3) ? 1 : 0;
} else {
  return (neighbors === 3) ? 1 : 0;
}`);
  const gridSize = 50;
  const gridRef = useRef<number[][]>([]);

  // ABM State
  const [abmCode, setAbmCode] = useState(`// ABM Rule Definition
// Variables available:
// - agent: { x, y, vx, vy }
// - width, height: canvas dimensions
// Return: { vx, vy } (new velocity)

let newVx = agent.vx + (Math.random() - 0.5) * 0.5;
let newVy = agent.vy + (Math.random() - 0.5) * 0.5;

// Limit speed
const speed = Math.sqrt(newVx * newVx + newVy * newVy);
if (speed > 2) {
  newVx = (newVx / speed) * 2;
  newVy = (newVy / speed) * 2;
}

return { vx: newVx, vy: newVy };`);
  const numAgents = 100;
  const agentsRef = useRef<any[]>([]);

  const animationRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (mode === "ca") {
      const g = Array(gridSize)
        .fill(0)
        .map(() => Array(gridSize).fill(0));
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          g[i][j] = Math.random() > 0.8 ? 1 : 0;
        }
      }
      gridRef.current = g;
    } else {
      const agents = [];
      for (let i = 0; i < numAgents; i++) {
        agents.push({
          x: Math.random() * 800,
          y: Math.random() * 600,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
        });
      }
      agentsRef.current = agents;
    }
    draw();
  }, [mode]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#191c1d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (mode === "ca") {
      const cellW = canvas.width / gridSize;
      const cellH = canvas.height / gridSize;
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (gridRef.current[i][j]) {
            ctx.fillRect(j * cellW, i * cellH, cellW - 1, cellH - 1);
          }
        }
      }
    } else {
      ctx.fillStyle = "#ffffff";
      agentsRef.current.forEach((agent) => {
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  };

  const update = () => {
    setError(null);
    if (mode === "ca") {
      try {
        // eslint-disable-next-line no-new-func
        const userFunc = new Function("state", "neighbors", caCode);
        const g = gridRef.current;
        const newG = g.map((arr) => [...arr]);

        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
            let neighbors = 0;
            for (let di = -1; di <= 1; di++) {
              for (let dj = -1; dj <= 1; dj++) {
                if (di === 0 && dj === 0) continue;
                const ni = (i + di + gridSize) % gridSize;
                const nj = (j + dj + gridSize) % gridSize;
                neighbors += g[ni][nj];
              }
            }
            const newState = userFunc(g[i][j], neighbors);
            newG[i][j] = newState ? 1 : 0;
          }
        }
        gridRef.current = newG;
      } catch (e: any) {
        console.error("CA Rule Error:", e);
        setError(e.message || "An error occurred in your CA code.");
        setIsRunning(false);
      }
    } else {
      try {
        // eslint-disable-next-line no-new-func
        const userFunc = new Function("agent", "width", "height", abmCode);
        agentsRef.current = agentsRef.current.map((agent) => {
          const result = userFunc(agent, 800, 600);
          let newX = agent.x + (result?.vx || 0);
          let newY = agent.y + (result?.vy || 0);

          if (newX < 0) newX += 800;
          if (newX > 800) newX -= 800;
          if (newY < 0) newY += 600;
          if (newY > 600) newY -= 600;

          return {
            ...agent,
            x: newX,
            y: newY,
            vx: result?.vx || 0,
            vy: result?.vy || 0,
          };
        });
      } catch (e: any) {
        console.error("ABM Rule Error:", e);
        setError(e.message || "An error occurred in your ABM code.");
        setIsRunning(false);
      }
    }
    draw();
  };

  useEffect(() => {
    const loop = (time: number) => {
      if (isRunning) {
        if (time - lastUpdateRef.current > 50) {
          update();
          lastUpdateRef.current = time;
        }
      }
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [isRunning, mode, caCode, abmCode]);

  const handleReset = () => {
    if (mode === "ca") {
      const g = Array(gridSize)
        .fill(0)
        .map(() => Array(gridSize).fill(0));
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          g[i][j] = Math.random() > 0.8 ? 1 : 0;
        }
      }
      gridRef.current = g;
    } else {
      const agents = [];
      for (let i = 0; i < numAgents; i++) {
        agents.push({
          x: Math.random() * 800,
          y: Math.random() * 600,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
        });
      }
      agentsRef.current = agents;
    }
    draw();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-8rem)]">
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-3xl font-extrabold text-on-surface">
              Model Playground
            </h2>
            <p className="text-sm text-on-surface-variant">
              Design and test custom rules
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${isRunning ? "bg-error-container text-on-error-container" : "bg-primary text-white"}`}
            >
              {isRunning ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isRunning ? "Halt" : "Run"}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-surface-container-highest text-on-surface rounded-lg hover:bg-outline-variant/30 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-[#191c1d] rounded-2xl overflow-hidden relative shadow-inner border border-outline-variant/10">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <aside className="w-full lg:w-[400px] flex flex-col gap-6">
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/15 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <Code2 className="text-primary w-5 h-5" />
            <h3 className="font-bold text-on-surface uppercase tracking-widest text-sm">
              Rule Editor
            </h3>
          </div>

          <div className="flex p-1 bg-surface-container-highest rounded-xl mb-6">
            <button
              onClick={() => {
                setMode("ca");
                setIsRunning(false);
              }}
              className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg ${mode === "ca" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant"}`}
            >
              Cellular Automata
            </button>
            <button
              onClick={() => {
                setMode("abm");
                setIsRunning(false);
              }}
              className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg ${mode === "abm" ? "bg-white shadow-sm text-primary" : "text-on-surface-variant"}`}
            >
              Agent-Based
            </button>
          </div>

          <div className="flex-1 flex flex-col min-h-0 relative">
            <textarea
              value={mode === "ca" ? caCode : abmCode}
              onChange={(e) =>
                mode === "ca"
                  ? setCaCode(e.target.value)
                  : setAbmCode(e.target.value)
              }
              className="flex-1 w-full bg-[#1e1e1e] text-slate-300 font-mono text-sm p-4 rounded-xl border border-outline-variant/20 focus:ring-2 focus:ring-primary/50 outline-none resize-none"
              spellCheck={false}
            />
            {error && (
              <div className="absolute bottom-4 left-4 right-4 bg-error-container text-on-error-container p-3 rounded-lg text-xs font-mono border border-error/20">
                <span className="font-bold uppercase tracking-widest block mb-1">
                  Error
                </span>
                {error}
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
