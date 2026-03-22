import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Shuffle, Lightbulb } from 'lucide-react';
import { CodeExportSection } from '../components/CodeExportSection';

type Preset = 'gol' | 'rule30' | 'rule110' | 'langtons_ant' | 'wireworld' | 'brians_brain';

export function CALab({ setCurrentView }: { setCurrentView: (v: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState(50);
  const [gridSize, setGridSize] = useState(50);
  const [preset, setPreset] = useState<Preset>('gol');

  const gridRef = useRef<number[][]>([]);
  const animationRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const antRef = useRef({ x: 0, y: 0, dir: 0 });
  const currentRowRef = useRef(0);

  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cellW = width / gridSize;
    const cellH = height / gridSize;

    ctx.fillStyle = '#191c1d'; // surface-on
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const val = gridRef.current[i][j];
        if (val === 0) continue;
        
        if (preset === 'wireworld') {
          if (val === 1) ctx.fillStyle = '#3b82f6'; // blue head
          else if (val === 2) ctx.fillStyle = '#ef4444'; // red tail
          else if (val === 3) ctx.fillStyle = '#eab308'; // yellow copper
        } else if (preset === 'brians_brain') {
          if (val === 1) ctx.fillStyle = '#ffffff'; // on
          else if (val === 2) ctx.fillStyle = '#3b82f6'; // dying
        } else {
          ctx.fillStyle = '#ffffff'; // white
        }
        ctx.fillRect(j * cellW, i * cellH, cellW - 1, cellH - 1);
      }
    }

    if (preset === 'langtons_ant') {
      ctx.fillStyle = '#ef4444'; // red ant
      ctx.fillRect(antRef.current.x * cellW, antRef.current.y * cellH, cellW - 1, cellH - 1);
    }
  };

  const initGrid = () => {
    const g = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
    if (preset === 'gol' || preset === 'brians_brain') {
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          g[i][j] = Math.random() > 0.8 ? 1 : 0;
        }
      }
    } else if (preset === 'rule30' || preset === 'rule110') {
      g[0][Math.floor(gridSize / 2)] = 1;
      currentRowRef.current = 0;
    } else if (preset === 'langtons_ant') {
      antRef.current = { x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2), dir: 0 };
    } else if (preset === 'wireworld') {
      const cx = Math.floor(gridSize / 2);
      const cy = Math.floor(gridSize / 2);
      for(let i=-5; i<=5; i++) {
        if (cy-5 >= 0 && cx+i >= 0 && cx+i < gridSize) g[cy-5][cx+i] = 3;
        if (cy+5 < gridSize && cx+i >= 0 && cx+i < gridSize) g[cy+5][cx+i] = 3;
        if (cy+i >= 0 && cy+i < gridSize && cx-5 >= 0) g[cy+i][cx-5] = 3;
        if (cy+i >= 0 && cy+i < gridSize && cx+5 < gridSize) g[cy+i][cx+5] = 3;
      }
      if (cy-5 >= 0 && cx >= 0 && cx < gridSize) g[cy-5][cx] = 1;
      if (cy-5 >= 0 && cx-1 >= 0 && cx-1 < gridSize) g[cy-5][cx-1] = 2;
    }
    gridRef.current = g;
    setGeneration(0);
    drawGrid();
  };

  useEffect(() => {
    initGrid();
  }, [gridSize, preset]);

  const updateGrid = () => {
    const g = gridRef.current;
    const newG = g.map(arr => [...arr]);

    if (preset === 'gol') {
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
          if (g[i][j] === 1 && (neighbors < 2 || neighbors > 3)) newG[i][j] = 0;
          else if (g[i][j] === 0 && neighbors === 3) newG[i][j] = 1;
        }
      }
    } else if (preset === 'brians_brain') {
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (g[i][j] === 1) newG[i][j] = 2;
          else if (g[i][j] === 2) newG[i][j] = 0;
          else {
            let neighbors = 0;
            for (let di = -1; di <= 1; di++) {
              for (let dj = -1; dj <= 1; dj++) {
                if (di === 0 && dj === 0) continue;
                const ni = (i + di + gridSize) % gridSize;
                const nj = (j + dj + gridSize) % gridSize;
                if (g[ni][nj] === 1) neighbors++;
              }
            }
            if (neighbors === 2) newG[i][j] = 1;
          }
        }
      }
    } else if (preset === 'wireworld') {
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (g[i][j] === 1) newG[i][j] = 2;
          else if (g[i][j] === 2) newG[i][j] = 3;
          else if (g[i][j] === 3) {
            let neighbors = 0;
            for (let di = -1; di <= 1; di++) {
              for (let dj = -1; dj <= 1; dj++) {
                if (di === 0 && dj === 0) continue;
                const ni = (i + di + gridSize) % gridSize;
                const nj = (j + dj + gridSize) % gridSize;
                if (g[ni][nj] === 1) neighbors++;
              }
            }
            if (neighbors === 1 || neighbors === 2) newG[i][j] = 1;
          }
        }
      }
    } else if (preset === 'rule30' || preset === 'rule110') {
      let row = currentRowRef.current;
      if (row < gridSize - 1) {
        for (let j = 0; j < gridSize; j++) {
          const left = g[row][(j - 1 + gridSize) % gridSize];
          const center = g[row][j];
          const right = g[row][(j + 1) % gridSize];
          const state = (left << 2) | (center << 1) | right;
          if (preset === 'rule30') newG[row + 1][j] = [0, 1, 1, 1, 1, 0, 0, 0][state];
          else newG[row + 1][j] = [0, 1, 1, 1, 0, 1, 1, 0][state];
        }
        currentRowRef.current++;
      } else {
        for (let i = 0; i < gridSize - 1; i++) newG[i] = [...newG[i + 1]];
        for (let j = 0; j < gridSize; j++) {
          const left = newG[gridSize - 2][(j - 1 + gridSize) % gridSize];
          const center = newG[gridSize - 2][j];
          const right = newG[gridSize - 2][(j + 1) % gridSize];
          const state = (left << 2) | (center << 1) | right;
          if (preset === 'rule30') newG[gridSize - 1][j] = [0, 1, 1, 1, 1, 0, 0, 0][state];
          else newG[gridSize - 1][j] = [0, 1, 1, 1, 0, 1, 1, 0][state];
        }
      }
    } else if (preset === 'langtons_ant') {
      const ant = antRef.current;
      const cell = g[ant.y][ant.x];
      if (cell === 0) {
        ant.dir = (ant.dir + 1) % 4;
        newG[ant.y][ant.x] = 1;
      } else {
        ant.dir = (ant.dir + 3) % 4;
        newG[ant.y][ant.x] = 0;
      }
      if (ant.dir === 0) ant.y = (ant.y - 1 + gridSize) % gridSize;
      else if (ant.dir === 1) ant.x = (ant.x + 1) % gridSize;
      else if (ant.dir === 2) ant.y = (ant.y + 1) % gridSize;
      else if (ant.dir === 3) ant.x = (ant.x - 1 + gridSize) % gridSize;
    }

    gridRef.current = newG;
    setGeneration(g => g + 1);
    drawGrid();
  };

  useEffect(() => {
    const loop = (time: number) => {
      if (isRunning) {
        if (time - lastUpdateRef.current > (100 - speed)) {
          updateGrid();
          lastUpdateRef.current = time;
        }
      }
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [isRunning, speed, gridSize, preset]);

  const randomizeGrid = () => {
    const g = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        g[i][j] = Math.random() > 0.8 ? 1 : 0;
      }
    }
    gridRef.current = g;
    setGeneration(0);
    if (preset === 'rule30' || preset === 'rule110') currentRowRef.current = 0;
    if (preset === 'langtons_ant') antRef.current = { x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2), dir: 0 };
    drawGrid();
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* CA Theory Section */}
      <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/15 shadow-sm mt-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-headline text-2xl font-extrabold text-on-surface">CA Models & Classification</h3>
            <p className="text-sm text-on-surface-variant">Notable examples and Wolfram's classification system.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Notable Examples */}
          <div>
            <h4 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Notable Examples
            </h4>
            <ul className="space-y-4">
              <li 
                onClick={() => setPreset('gol')}
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${preset === 'gol' ? 'bg-primary/10 border-primary/30' : 'bg-surface-container-low border-outline-variant/10 hover:bg-surface-container-highest'}`}
              >
                <strong className="text-on-surface block mb-1">Conway's Game of Life (2D)</strong>
                <span className="text-sm text-on-surface-variant leading-relaxed">A two-state, 2D automaton with a Moore neighborhood, known for universal computation and complex patterns like "gliders" and "spaceship".</span>
              </li>
              <li 
                onClick={() => setPreset('rule30')}
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${preset === 'rule30' ? 'bg-primary/10 border-primary/30' : 'bg-surface-container-low border-outline-variant/10 hover:bg-surface-container-highest'}`}
              >
                <strong className="text-on-surface block mb-1">Rule 30</strong>
                <span className="text-sm text-on-surface-variant leading-relaxed">Produces chaotic behavior from simple initial conditions, used for random number generation.</span>
              </li>
              <li 
                onClick={() => setPreset('rule110')}
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${preset === 'rule110' ? 'bg-primary/10 border-primary/30' : 'bg-surface-container-low border-outline-variant/10 hover:bg-surface-container-highest'}`}
              >
                <strong className="text-on-surface block mb-1">Rule 110</strong>
                <span className="text-sm text-on-surface-variant leading-relaxed">Proven to be Turing complete (capable of universal computation).</span>
              </li>
              <li 
                onClick={() => setPreset('langtons_ant')}
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${preset === 'langtons_ant' ? 'bg-primary/10 border-primary/30' : 'bg-surface-container-low border-outline-variant/10 hover:bg-surface-container-highest'}`}
              >
                <strong className="text-on-surface block mb-1">Langton's Ant (2D)</strong>
                <span className="text-sm text-on-surface-variant leading-relaxed">A "turmite" (Turing machine/automaton hybrid) that creates chaotic, unpredictable paths before settling into a repetitive pattern.</span>
              </li>
              <li 
                onClick={() => setPreset('wireworld')}
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${preset === 'wireworld' ? 'bg-primary/10 border-primary/30' : 'bg-surface-container-low border-outline-variant/10 hover:bg-surface-container-highest'}`}
              >
                <strong className="text-on-surface block mb-1">WireWorld (2D)</strong>
                <span className="text-sm text-on-surface-variant leading-relaxed">Commonly used for simulating electronic logic gates and circuits.</span>
              </li>
              <li 
                onClick={() => setPreset('brians_brain')}
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${preset === 'brians_brain' ? 'bg-primary/10 border-primary/30' : 'bg-surface-container-low border-outline-variant/10 hover:bg-surface-container-highest'}`}
              >
                <strong className="text-on-surface block mb-1">Brian's Brain (2D)</strong>
                <span className="text-sm text-on-surface-variant leading-relaxed">A three-state automaton (on, off, dying) that mimics neuronal activation patterns.</span>
              </li>
            </ul>
          </div>

          {/* Wolfram's Classification */}
          <div>
            <h4 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span>
              Classification of Automata (Wolfram)
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-400"></div>
                <strong className="text-on-surface block mb-1">Class 1</strong>
                <span className="text-sm text-on-surface-variant leading-relaxed">Evolution leads to a uniform, stable state.</span>
              </div>
              <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                <strong className="text-on-surface block mb-1">Class 2</strong>
                <span className="text-sm text-on-surface-variant leading-relaxed">Evolution leads to simple, separated, periodic structures.</span>
              </div>
              <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>
                <strong className="text-on-surface block mb-1">Class 3</strong>
                <span className="text-sm text-on-surface-variant leading-relaxed">Evolution leads to chaotic, random patterns.</span>
              </div>
              <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary"></div>
                <strong className="text-on-surface block mb-1">Class 4</strong>
                <span className="text-sm text-on-surface-variant leading-relaxed">Evolution leads to complex, localized structures, often indicating universal computation.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8 h-[calc(100vh-12rem)] min-h-[600px]">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex-1 bg-surface-container-lowest rounded-xl p-1 shadow-sm flex flex-col overflow-hidden">
            <div className="bg-[#191c1d] rounded-lg relative overflow-hidden flex items-center justify-center flex-1">
              <canvas 
                ref={canvasRef} 
                width={800} 
                height={600} 
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white border border-white/10 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-tertiary-fixed-dim animate-pulse' : 'bg-slate-500'}`}></span>
                  {isRunning ? 'ACTIVE SIMULATION' : 'PAUSED'}
                </div>
                <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white border border-white/10">
                  GEN: <span className="font-mono text-tertiary-fixed">{String(generation).padStart(6, '0')}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-surface-container-low flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsRunning(!isRunning)}
                  className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
                >
                  {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
              </div>
              <div className="h-8 w-[1px] bg-outline-variant mx-4"></div>
              <div className="flex-1 max-w-xs flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                  <span>Propagation Speed</span>
                  <span>{speed} FPS</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="100" 
                  value={speed} 
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" 
                />
              </div>
              <div className="h-8 w-[1px] bg-outline-variant mx-6"></div>
              <div className="flex flex-col gap-1 min-w-[150px]">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Grid Scale</span>
                <div className="flex p-1 bg-surface-container-highest rounded-lg">
                  {['Small', 'Medium', 'Large'].map((s) => (
                    <button 
                      key={s} 
                      onClick={() => setGridSize(s === 'Small' ? 30 : s === 'Medium' ? 50 : 100)}
                      className={`flex-1 py-1 px-2 text-[10px] font-bold uppercase rounded-md transition-colors ${(gridSize === 30 && s === 'Small') || (gridSize === 50 && s === 'Medium') || (gridSize === 100 && s === 'Large') ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-8 w-[1px] bg-outline-variant mx-6"></div>
              <div className="flex gap-3">
                <button onClick={initGrid} className="px-5 py-2 rounded-lg text-xs font-semibold text-error hover:bg-error-container transition-colors flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
                <button onClick={randomizeGrid} className="px-5 py-2 rounded-lg text-xs font-semibold text-on-surface-variant bg-surface-container-highest hover:bg-outline-variant/30 transition-colors flex items-center gap-2">
                  <Shuffle className="w-4 h-4" /> Randomize
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CodeExportSection modelType="ca" preset={preset} />
    </div>
  );
}
