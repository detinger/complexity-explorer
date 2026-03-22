import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Settings2, Lightbulb } from 'lucide-react';
import { CodeExportSection } from '../components/CodeExportSection';

type Preset = 'schelling' | 'sugarscape' | 'boids' | 'gol' | 'axelrod' | 'stock_market' | 'sir';

interface Agent {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: number;
  state: number;
  timer: number;
}

export function ABMLab({ setCurrentView }: { setCurrentView: (v: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [preset, setPreset] = useState<Preset>('boids');
  const [isRunning, setIsRunning] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [numAgents, setNumAgents] = useState(200);
  const [speed, setSpeed] = useState(2);
  const [cohesion, setCohesion] = useState(0.01);
  const [separation, setSeparation] = useState(0.05);
  const [alignment, setAlignment] = useState(0.05);
  const [similarityThreshold, setSimilarityThreshold] = useState(0.4);
  const [infectionRadius, setInfectionRadius] = useState(20);
  const [infectionProb, setInfectionProb] = useState(0.05);
  const [recoveryTime, setRecoveryTime] = useState(200);
  
  const animationRef = useRef<number>();
  const width = 800;
  const height = 600;

  const initAgents = () => {
    const newAgents: Agent[] = [];
    for (let i = 0; i < numAgents; i++) {
      let state = 0;
      let type = Math.random() > 0.5 ? 0 : 1;
      
      if (preset === 'sir') {
        state = Math.random() > 0.95 ? 1 : 0; // 5% initially infected
      } else if (preset === 'axelrod') {
        type = Math.floor(Math.random() * 5);
      } else if (preset === 'gol') {
        state = Math.random() > 0.5 ? 1 : 0;
      }

      newAgents.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        type,
        state,
        timer: 0
      });
    }
    setAgents(newAgents);
  };

  useEffect(() => {
    initAgents();
  }, [numAgents, preset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.fillStyle = '#191c1d';
      ctx.fillRect(0, 0, width, height);

      agents.forEach(agent => {
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, 4, 0, Math.PI * 2);
        
        if (preset === 'sir') {
          if (agent.state === 0) ctx.fillStyle = '#3b82f6'; // Susceptible
          else if (agent.state === 1) ctx.fillStyle = '#ef4444'; // Infected
          else ctx.fillStyle = '#10b981'; // Recovered
        } else if (preset === 'axelrod') {
          const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
          ctx.fillStyle = colors[agent.type % colors.length];
        } else if (preset === 'gol') {
          ctx.fillStyle = agent.state === 1 ? '#10b981' : '#3f3f46';
        } else if (preset === 'stock_market') {
          ctx.fillStyle = agent.type === 0 ? '#10b981' : '#ef4444';
        } else {
          ctx.fillStyle = agent.type === 0 ? '#3b82f6' : '#ef4444';
        }
        
        ctx.fill();
        
        if (preset === 'boids' || preset === 'sugarscape' || preset === 'sir') {
          // Draw velocity vector
          ctx.beginPath();
          ctx.moveTo(agent.x, agent.y);
          ctx.lineTo(agent.x + agent.vx * 5, agent.y + agent.vy * 5);
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.stroke();
        }
      });
    };
    draw();
  }, [agents]);

  useEffect(() => {
    if (!isRunning) return;

    const update = () => {
      setAgents(prevAgents => {
        if (preset === 'boids') {
          return prevAgents.map(agent => {
            let cx = 0, cy = 0, sx = 0, sy = 0, ax = 0, ay = 0;
            let neighborCount = 0;

            prevAgents.forEach(other => {
              if (agent.id === other.id) return;
              const dx = other.x - agent.x;
              const dy = other.y - agent.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < 50) {
                cx += other.x;
                cy += other.y;
                ax += other.vx;
                ay += other.vy;
                neighborCount++;

                if (dist < 20) {
                  sx -= dx;
                  sy -= dy;
                }
              }
            });

            let newVx = agent.vx;
            let newVy = agent.vy;

            if (neighborCount > 0) {
              cx /= neighborCount;
              cy /= neighborCount;
              ax /= neighborCount;
              ay /= neighborCount;

              newVx += (cx - agent.x) * cohesion + sx * separation + ax * alignment;
              newVy += (cy - agent.y) * cohesion + sy * separation + ay * alignment;
            }

            const currentSpeed = Math.sqrt(newVx * newVx + newVy * newVy);
            if (currentSpeed > speed) {
              newVx = (newVx / currentSpeed) * speed;
              newVy = (newVy / currentSpeed) * speed;
            }

            let newX = agent.x + newVx;
            let newY = agent.y + newVy;

            if (newX < 0) newX += width;
            if (newX > width) newX -= width;
            if (newY < 0) newY += height;
            if (newY > height) newY -= height;

            return { ...agent, x: newX, y: newY, vx: newVx, vy: newVy };
          });
        } else if (preset === 'schelling') {
          return prevAgents.map(agent => {
            let sameType = 0;
            let totalNeighbors = 0;
            prevAgents.forEach(other => {
              if (agent.id === other.id) return;
              const dx = other.x - agent.x;
              const dy = other.y - agent.y;
              if (dx*dx + dy*dy < 2500) {
                totalNeighbors++;
                if (other.type === agent.type) sameType++;
              }
            });
            
            if (totalNeighbors > 0 && (sameType / totalNeighbors) < similarityThreshold) {
              return { ...agent, x: Math.random() * width, y: Math.random() * height };
            }
            return agent;
          });
        } else if (preset === 'sir') {
          return prevAgents.map(agent => {
            let newState = agent.state;
            let newTimer = agent.timer;
            
            if (agent.state === 1) {
              newTimer++;
              if (newTimer > recoveryTime) newState = 2;
            } else if (agent.state === 0) {
              let infected = false;
              prevAgents.forEach(other => {
                if (other.state === 1) {
                  const dx = other.x - agent.x;
                  const dy = other.y - agent.y;
                  if (dx*dx + dy*dy < infectionRadius * infectionRadius) {
                    if (Math.random() < infectionProb) infected = true;
                  }
                }
              });
              if (infected) newState = 1;
            }
            
            let newVx = agent.vx + (Math.random() - 0.5) * 0.5;
            let newVy = agent.vy + (Math.random() - 0.5) * 0.5;
            const currentSpeed = Math.sqrt(newVx * newVx + newVy * newVy);
            if (currentSpeed > speed) {
              newVx = (newVx / currentSpeed) * speed;
              newVy = (newVy / currentSpeed) * speed;
            }

            let newX = agent.x + newVx;
            let newY = agent.y + newVy;
            if (newX < 0) newX += width;
            if (newX > width) newX -= width;
            if (newY < 0) newY += height;
            if (newY > height) newY -= height;
            
            return { ...agent, x: newX, y: newY, vx: newVx, vy: newVy, state: newState, timer: newTimer };
          });
        } else if (preset === 'sugarscape') {
          return prevAgents.map(agent => {
            const dx = (width/2) - agent.x;
            const dy = (height/2) - agent.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            let newVx = agent.vx + (dx/dist) * 0.2 + (Math.random() - 0.5) * 0.5;
            let newVy = agent.vy + (dy/dist) * 0.2 + (Math.random() - 0.5) * 0.5;
            
            const currentSpeed = Math.sqrt(newVx * newVx + newVy * newVy);
            if (currentSpeed > speed) {
              newVx = (newVx / currentSpeed) * speed;
              newVy = (newVy / currentSpeed) * speed;
            }
            
            let newX = agent.x + newVx;
            let newY = agent.y + newVy;
            if (newX < 0) newX += width;
            if (newX > width) newX -= width;
            if (newY < 0) newY += height;
            if (newY > height) newY -= height;
            return { ...agent, x: newX, y: newY, vx: newVx, vy: newVy };
          });
        } else if (preset === 'axelrod') {
          return prevAgents.map(agent => {
            let newType = agent.type;
            prevAgents.forEach(other => {
              if (agent.id === other.id) return;
              const dx = other.x - agent.x;
              const dy = other.y - agent.y;
              if (dx*dx + dy*dy < 400) {
                if (Math.random() < 0.05) newType = other.type;
              }
            });
            
            let newX = agent.x + agent.vx;
            let newY = agent.y + agent.vy;
            if (newX < 0) newX += width;
            if (newX > width) newX -= width;
            if (newY < 0) newY += height;
            if (newY > height) newY -= height;
            return { ...agent, x: newX, y: newY, type: newType };
          });
        } else if (preset === 'stock_market') {
          return prevAgents.map(agent => {
            let newType = agent.type;
            let neighbors = 0;
            let bullNeighbors = 0;
            prevAgents.forEach(other => {
              if (agent.id === other.id) return;
              const dx = other.x - agent.x;
              const dy = other.y - agent.y;
              if (dx*dx + dy*dy < 2500) {
                neighbors++;
                if (other.type === 0) bullNeighbors++;
              }
            });
            
            if (neighbors > 0) {
              if (bullNeighbors / neighbors > 0.5 && Math.random() < 0.1) newType = 0;
              else if (bullNeighbors / neighbors < 0.5 && Math.random() < 0.1) newType = 1;
            }
            
            let newX = agent.x + agent.vx;
            let newY = agent.y + agent.vy;
            if (newX < 0) newX += width;
            if (newX > width) newX -= width;
            if (newY < 0) newY += height;
            if (newY > height) newY -= height;
            return { ...agent, x: newX, y: newY, type: newType };
          });
        } else if (preset === 'gol') {
          return prevAgents.map(agent => {
            let neighbors = 0;
            prevAgents.forEach(other => {
              if (agent.id === other.id) return;
              const dx = other.x - agent.x;
              const dy = other.y - agent.y;
              if (dx*dx + dy*dy < 900) {
                neighbors++;
              }
            });
            
            let newState = agent.state;
            if (agent.state === 1) {
              if (neighbors < 1 || neighbors > 4) newState = 0;
            } else {
              if (neighbors >= 2 && neighbors <= 3) newState = 1;
            }
            
            let newX = agent.x + agent.vx * 0.5;
            let newY = agent.y + agent.vy * 0.5;
            if (newX < 0) newX += width;
            if (newX > width) newX -= width;
            if (newY < 0) newY += height;
            if (newY > height) newY -= height;
            return { ...agent, x: newX, y: newY, state: newState };
          });
        }
        return prevAgents;
      });
      animationRef.current = requestAnimationFrame(update);
    };

    animationRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [isRunning, speed, cohesion, separation, alignment]);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* ABM Theory Section */}
      <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/15 shadow-sm mt-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-headline text-2xl font-extrabold text-on-surface">Key Classic Agent-Based Model Examples</h3>
            <p className="text-sm text-on-surface-variant">Foundational models in complex systems research.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ul className="space-y-4">
            <li 
              onClick={() => setPreset('schelling')}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${preset === 'schelling' ? 'bg-primary/10 border-primary/30' : 'bg-surface-container-low border-outline-variant/10 hover:bg-surface-container-highest'}`}
            >
              <strong className="text-on-surface block mb-1">Schelling's Segregation Model (1971)</strong>
              <span className="text-sm text-on-surface-variant leading-relaxed">Thomas Schelling demonstrated that even a mild preference for having neighbors of a similar type leads to almost total residential segregation.</span>
            </li>
            <li 
              onClick={() => setPreset('sugarscape')}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${preset === 'sugarscape' ? 'bg-primary/10 border-primary/30' : 'bg-surface-container-low border-outline-variant/10 hover:bg-surface-container-highest'}`}
            >
              <strong className="text-on-surface block mb-1">Sugarscape (1990s)</strong>
              <span className="text-sm text-on-surface-variant leading-relaxed">Developed by Epstein and Axtell, this model simulates agents moving, consuming sugar, and reproducing on a landscape. It shows how wealth distribution, trade networks, and disease transmission emerge from simple interactions.</span>
            </li>
            <li 
              onClick={() => setPreset('boids')}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${preset === 'boids' ? 'bg-primary/10 border-primary/30' : 'bg-surface-container-low border-outline-variant/10 hover:bg-surface-container-highest'}`}
            >
              <strong className="text-on-surface block mb-1">Boids (1987)</strong>
              <span className="text-sm text-on-surface-variant leading-relaxed">Craig Reynolds’ model simulates flocking behavior (birds, fish) using three simple steering rules: separation, alignment, and cohesion.</span>
            </li>
            <li 
              onClick={() => setPreset('gol')}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${preset === 'gol' ? 'bg-primary/10 border-primary/30' : 'bg-surface-container-low border-outline-variant/10 hover:bg-surface-container-highest'}`}
            >
              <strong className="text-on-surface block mb-1">Conway's Game of Life (1970)</strong>
              <span className="text-sm text-on-surface-variant leading-relaxed">While often considered cellular automata, it is a key precursor to ABMs where cells "live" or "die" based on neighbor density.</span>
            </li>
          </ul>
          <ul className="space-y-4">
            <li 
              onClick={() => setPreset('axelrod')}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${preset === 'axelrod' ? 'bg-primary/10 border-primary/30' : 'bg-surface-container-low border-outline-variant/10 hover:bg-surface-container-highest'}`}
            >
              <strong className="text-on-surface block mb-1">Axelrod's Model of Culture Dissemination (1997)</strong>
              <span className="text-sm text-on-surface-variant leading-relaxed">Robert Axelrod developed a model demonstrating that agents tend to become similar to their neighbors, creating stable cultural zones.</span>
            </li>
            <li 
              onClick={() => setPreset('stock_market')}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${preset === 'stock_market' ? 'bg-primary/10 border-primary/30' : 'bg-surface-container-low border-outline-variant/10 hover:bg-surface-container-highest'}`}
            >
              <strong className="text-on-surface block mb-1">Artificial Stock Market (1990s)</strong>
              <span className="text-sm text-on-surface-variant leading-relaxed">The Santa Fe Institute modeled financial markets to show how herd behavior and price volatility emerge from agent trading rules.</span>
            </li>
            <li 
              onClick={() => setPreset('sir')}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${preset === 'sir' ? 'bg-primary/10 border-primary/30' : 'bg-surface-container-low border-outline-variant/10 hover:bg-surface-container-highest'}`}
            >
              <strong className="text-on-surface block mb-1">Epidemiological/SIR Models</strong>
              <span className="text-sm text-on-surface-variant leading-relaxed">These model disease propagation, where individual agents (people) interact, get infected, and recover based on health status and social networks.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-12rem)] min-h-[600px]">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-3xl font-extrabold text-on-surface">
                {preset === 'schelling' ? "Schelling's Segregation Model" :
                 preset === 'sugarscape' ? "Sugarscape" :
                 preset === 'boids' ? "Boids Flocking Model" :
                 preset === 'gol' ? "Conway's Game of Life" :
                 preset === 'axelrod' ? "Axelrod's Culture Model" :
                 preset === 'stock_market' ? "Artificial Stock Market" :
                 preset === 'sir' ? "Epidemiological/SIR Model" : "Agent-Based Model"}
              </h2>
              <p className="text-sm text-on-surface-variant">Agent-Based Modelling Lab</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsRunning(!isRunning)} className={`px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${isRunning ? 'bg-error-container text-on-error-container' : 'bg-primary text-white'}`}>
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isRunning ? 'Halt Simulation' : 'Initialize'}
              </button>
              <button onClick={initAgents} className="px-4 py-2.5 bg-surface-container-highest text-on-surface rounded-lg hover:bg-outline-variant/30 transition-colors">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 bg-[#191c1d] rounded-2xl overflow-hidden relative shadow-inner border border-outline-variant/10">
            <canvas 
              ref={canvasRef} 
              width={width} 
              height={height} 
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 pointer-events-auto">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Live Metrics</p>
                <div className="flex gap-8">
                  <div>
                    <p className="text-2xl font-mono font-bold text-white">{agents.length}</p>
                    <p className="text-[10px] text-white/50 uppercase">Active Agents</p>
                  </div>
                  <div>
                    <p className="text-2xl font-mono font-bold text-tertiary-fixed">{speed.toFixed(1)}x</p>
                    <p className="text-[10px] text-white/50 uppercase">Velocity Cap</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="w-full lg:w-80 bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/15 flex flex-col overflow-y-auto">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-outline-variant/30">
            <Settings2 className="text-primary w-5 h-5" />
            <h3 className="font-bold text-on-surface uppercase tracking-widest text-sm">Parameters</h3>
          </div>

          <div className="space-y-8 flex-1">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Population</label>
                <span className="font-mono text-xs bg-surface-container-highest px-2 py-1 rounded text-on-surface">{numAgents}</span>
              </div>
              <input 
                type="range" min="10" max="500" step="10"
                value={numAgents} onChange={(e) => setNumAgents(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            {preset === 'boids' && (
              <>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Cohesion</label>
                    <span className="font-mono text-xs bg-surface-container-highest px-2 py-1 rounded text-on-surface">{cohesion.toFixed(3)}</span>
                  </div>
                  <input 
                    type="range" min="0" max="0.1" step="0.001"
                    value={cohesion} onChange={(e) => setCohesion(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <p className="text-[10px] text-slate-500 leading-tight">Tendency to move towards the center of mass of local flockmates.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Separation</label>
                    <span className="font-mono text-xs bg-surface-container-highest px-2 py-1 rounded text-on-surface">{separation.toFixed(3)}</span>
                  </div>
                  <input 
                    type="range" min="0" max="0.2" step="0.01"
                    value={separation} onChange={(e) => setSeparation(Number(e.target.value))}
                    className="w-full accent-tertiary"
                  />
                  <p className="text-[10px] text-slate-500 leading-tight">Tendency to avoid crowding local flockmates.</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Alignment</label>
                    <span className="font-mono text-xs bg-surface-container-highest px-2 py-1 rounded text-on-surface">{alignment.toFixed(3)}</span>
                  </div>
                  <input 
                    type="range" min="0" max="0.2" step="0.01"
                    value={alignment} onChange={(e) => setAlignment(Number(e.target.value))}
                    className="w-full accent-secondary"
                  />
                  <p className="text-[10px] text-slate-500 leading-tight">Tendency to steer towards the average heading of local flockmates.</p>
                </div>
              </>
            )}

            {preset === 'schelling' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Similarity Threshold</label>
                  <span className="font-mono text-xs bg-surface-container-highest px-2 py-1 rounded text-on-surface">{(similarityThreshold * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.05"
                  value={similarityThreshold} onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <p className="text-[10px] text-slate-500 leading-tight">Minimum percentage of same-type neighbors required to stay in current location.</p>
              </div>
            )}

            {preset === 'sir' && (
              <>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Infection Radius</label>
                    <span className="font-mono text-xs bg-surface-container-highest px-2 py-1 rounded text-on-surface">{infectionRadius}</span>
                  </div>
                  <input 
                    type="range" min="5" max="100" step="1"
                    value={infectionRadius} onChange={(e) => setInfectionRadius(Number(e.target.value))}
                    className="w-full accent-error"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Infection Prob.</label>
                    <span className="font-mono text-xs bg-surface-container-highest px-2 py-1 rounded text-on-surface">{(infectionProb * 100).toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.01"
                    value={infectionProb} onChange={(e) => setInfectionProb(Number(e.target.value))}
                    className="w-full accent-error"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Recovery Time</label>
                    <span className="font-mono text-xs bg-surface-container-highest px-2 py-1 rounded text-on-surface">{recoveryTime}</span>
                  </div>
                  <input 
                    type="range" min="50" max="500" step="10"
                    value={recoveryTime} onChange={(e) => setRecoveryTime(Number(e.target.value))}
                    className="w-full accent-tertiary"
                  />
                </div>
              </>
            )}

            {preset === 'sugarscape' && (
              <p className="text-[10px] text-slate-500 leading-tight">Agents move towards the center (sugar mountain).</p>
            )}
            {preset === 'axelrod' && (
              <p className="text-[10px] text-slate-500 leading-tight">Agents adopt the culture (color) of their neighbors over time.</p>
            )}
            {preset === 'stock_market' && (
              <p className="text-[10px] text-slate-500 leading-tight">Agents change between Bull (Green) and Bear (Red) based on local majority.</p>
            )}
            {preset === 'gol' && (
              <p className="text-[10px] text-slate-500 leading-tight">Continuous space approximation. Agents die if over/under-populated, spawn if optimal.</p>
            )}
          </div>
        </aside>
      </div>
      <CodeExportSection modelType="abm" preset={preset} />
    </div>
  );
}
