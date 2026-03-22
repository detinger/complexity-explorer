import { ArrowRight, PlayCircle, Terminal, BookOpen, Network, FlaskConical, FileText } from 'lucide-react';

export function Theory({ setCurrentView }: { setCurrentView: (v: string) => void }) {
  return (
    <div className="max-w-5xl mx-auto pb-12">
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-2">Theory</h1>
            <p className="text-on-surface-variant font-medium max-w-2xl">
              Welcome to the computational modeling environment. Before diving into the labs, explore the theoretical foundations of Cellular Automata and Agent-Based Modeling.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-12 mb-12">
        {/* Cellular Automata Theory */}
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/15 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-primary-container text-on-primary-container rounded-2xl flex items-center justify-center shrink-0">
              <FlaskConical className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-headline text-3xl font-extrabold text-on-surface">Cellular Automata (CA)</h2>
              <p className="text-sm font-bold uppercase tracking-widest text-primary mt-1">Discrete Dynamical Systems</p>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none text-on-surface-variant">
            <p className="text-lg leading-relaxed mb-6 text-on-surface">
              A Cellular Automaton is a discrete model of computation studied in automata theory, mathematics, physics, complexity science, theoretical biology and microstructure modeling. It consists of a regular grid of cells, each in one of a finite number of states, such as "On" and "Off".
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold text-on-surface mb-3">Core Components</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                    <div><strong className="text-on-surface">Grid (Lattice):</strong> The spatial environment, which can be 1D, 2D, or higher dimensions.</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                    <div><strong className="text-on-surface">States:</strong> Each cell has a state from a finite set (e.g., 0 or 1, alive or dead).</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                    <div><strong className="text-on-surface">Neighborhood:</strong> The set of adjacent cells that influence a given cell (e.g., Moore or Von Neumann neighborhoods).</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></div>
                    <div><strong className="text-on-surface">Transition Rule:</strong> A function that determines the new state of a cell based on its current state and the states of its neighborhood.</div>
                  </li>
                </ul>
              </div>
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                <h3 className="text-lg font-bold text-on-surface mb-3">Historical Context</h3>
                <p className="text-sm mb-3">
                  Discovered in the 1940s by <strong>Stanislaw Ulam</strong> and <strong>John von Neumann</strong> while they were contemporaries at Los Alamos National Laboratory. Von Neumann designed the first CA to model self-replicating systems.
                </p>
                <p className="text-sm">
                  In the 1970s, <strong>John Conway</strong> introduced the "Game of Life", a 2D CA that became famous for its complex emergent behavior from simple rules. Later, <strong>Stephen Wolfram</strong> extensively studied 1D CAs, classifying them into four distinct classes of behavior.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-on-surface mb-4">Famous Models</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-5 bg-surface-container rounded-xl border border-outline-variant/5">
                <h4 className="font-bold text-on-surface mb-2">Conway's Game of Life</h4>
                <p className="text-xs">A zero-player game where cells live, die, or multiply based on underpopulation, overpopulation, or reproduction rules.</p>
              </div>
              <div className="p-5 bg-surface-container rounded-xl border border-outline-variant/5">
                <h4 className="font-bold text-on-surface mb-2">Rule 30</h4>
                <p className="text-xs">A 1D cellular automaton introduced by Stephen Wolfram. It exhibits chaotic behavior and is used as a random number generator.</p>
              </div>
              <div className="p-5 bg-surface-container rounded-xl border border-outline-variant/5">
                <h4 className="font-bold text-on-surface mb-2">Rule 110</h4>
                <p className="text-xs">Another 1D CA by Wolfram, proven to be Turing complete, meaning it can simulate any computer program given enough time and space.</p>
              </div>
            </div>

            <button onClick={() => setCurrentView('ca')} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors">
              Open CA Lab <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Agent-Based Modeling Theory */}
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/15 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-tertiary-container text-on-tertiary-container rounded-2xl flex items-center justify-center shrink-0">
              <Network className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-headline text-3xl font-extrabold text-on-surface">Agent-Based Modeling (ABM)</h2>
              <p className="text-sm font-bold uppercase tracking-widest text-tertiary mt-1">Bottom-Up Simulation</p>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none text-on-surface-variant">
            <p className="text-lg leading-relaxed mb-6 text-on-surface">
              Agent-based modeling is a computational method that enables a researcher to create, analyze, and experiment with models composed of agents that interact within an environment. Unlike CA, agents in ABM are often mobile, heterogeneous, and possess complex internal states and decision-making heuristics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold text-on-surface mb-3">Core Concepts</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2 shrink-0"></div>
                    <div><strong className="text-on-surface">Agents:</strong> Autonomous entities with attributes (e.g., age, wealth) and behaviors (rules for decision making).</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2 shrink-0"></div>
                    <div><strong className="text-on-surface">Environment:</strong> The space where agents operate. It can be a grid, a continuous 2D/3D space, or a network topology.</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2 shrink-0"></div>
                    <div><strong className="text-on-surface">Interactions:</strong> How agents communicate or affect each other and the environment.</div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-tertiary mt-2 shrink-0"></div>
                    <div><strong className="text-on-surface">Emergence:</strong> Complex macro-level patterns that arise from simple micro-level interactions (e.g., traffic jams, flocking).</div>
                  </li>
                </ul>
              </div>
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
                <h3 className="text-lg font-bold text-on-surface mb-3">Why use ABM?</h3>
                <p className="text-sm mb-3">
                  Traditional equation-based models (like differential equations) often assume homogeneous populations and perfect mixing. ABM relaxes these assumptions, allowing for:
                </p>
                <ul className="list-disc pl-4 text-sm space-y-1">
                  <li>Modeling heterogeneous populations.</li>
                  <li>Capturing complex spatial and network topologies.</li>
                  <li>Understanding the mechanisms that generate macroscopic phenomena from the bottom up.</li>
                  <li>Simulating bounded rationality and learning in agents.</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-bold text-on-surface mb-4">Famous Models</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-5 bg-surface-container rounded-xl border border-outline-variant/5">
                <h4 className="font-bold text-on-surface mb-2">Boids Flocking</h4>
                <p className="text-xs">Developed by Craig Reynolds, it simulates the flocking behavior of birds using three simple rules: separation, alignment, and cohesion.</p>
              </div>
              <div className="p-5 bg-surface-container rounded-xl border border-outline-variant/5">
                <h4 className="font-bold text-on-surface mb-2">Schelling's Segregation</h4>
                <p className="text-xs">Shows how a slight preference for similar neighbors can lead to high levels of macro-segregation in a population.</p>
              </div>
              <div className="p-5 bg-surface-container rounded-xl border border-outline-variant/5">
                <h4 className="font-bold text-on-surface mb-2">SIR Epidemic Model</h4>
                <p className="text-xs">Simulates the spread of disease through Susceptible, Infected, and Recovered states, often incorporating spatial networks.</p>
              </div>
            </div>

            <button onClick={() => setCurrentView('abm')} className="inline-flex items-center gap-2 px-6 py-3 bg-tertiary text-on-tertiary font-bold text-sm rounded-xl hover:bg-tertiary/90 transition-colors">
              Open ABM Lab <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CA vs ABM Comparison */}
      <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/15 shadow-sm mb-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-headline text-2xl font-extrabold text-on-surface">CA vs ABM: Key Differences</h2>
            <p className="text-sm text-on-surface-variant">Understanding when to use each modeling approach.</p>
          </div>
        </div>

        <p className="text-on-surface-variant leading-relaxed mb-8">
          Cellular Automata (CA) and Agent-Based Models (ABM) are both computational techniques for simulating complex systems, but CA relies on fixed grid cells with uniform, simultaneous rules, while ABM uses autonomous, mobile, and heterogeneous agents. CA is best for modeling simple, spatially explicit phenomena, whereas ABM excels at simulating complex social or biological behaviors.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10">
              <h4 className="font-bold text-on-surface mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Structure & Movement
              </h4>
              <p className="text-sm text-on-surface-variant">
                <strong>CA:</strong> Agents are cells in a fixed grid (lattice) and cannot move.<br />
                <strong>ABM:</strong> Agents are autonomous entities that can move, interact, and change positions in a continuous or discrete space.
              </p>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10">
              <h4 className="font-bold text-on-surface mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Agent Characteristics
              </h4>
              <p className="text-sm text-on-surface-variant">
                <strong>CA:</strong> Cells are typically homogeneous (all follow the same rules) and have simple states (e.g., on/off).<br />
                <strong>ABM:</strong> Agents are often heterogeneous (diverse behaviors) and can have complex memory, decision-making abilities, and learning capacity.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10">
              <h4 className="font-bold text-on-surface mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Update Mechanism
              </h4>
              <p className="text-sm text-on-surface-variant">
                <strong>CA:</strong> Typically uses synchronous updates (all cells update at the same time).<br />
                <strong>ABM:</strong> Often uses asynchronous updates (agents update at different times or sequentially).
              </p>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10">
              <h4 className="font-bold text-on-surface mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Scale & Application
              </h4>
              <p className="text-sm text-on-surface-variant">
                <strong>CA:</strong> Often used for top-down, spatially constrained processes (e.g., wildfire spread, crystal growth).<br />
                <strong>ABM:</strong> Often used for bottom-up modeling of individual entities (e.g., consumer behavior, disease spread).
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20">
                <th className="py-4 px-4 font-bold text-on-surface text-sm">Feature</th>
                <th className="py-4 px-4 font-bold text-on-surface text-sm">Cellular Automata (CA)</th>
                <th className="py-4 px-4 font-bold text-on-surface text-sm">Agent-Based Models (ABM)</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                <td className="py-3 px-4 font-medium text-on-surface">Grid</td>
                <td className="py-3 px-4 text-on-surface-variant">Mandatory (usually rigid lattice)</td>
                <td className="py-3 px-4 text-on-surface-variant">Optional (can be continuous space)</td>
              </tr>
              <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                <td className="py-3 px-4 font-medium text-on-surface">Movement</td>
                <td className="py-3 px-4 text-on-surface-variant">No (fixed position)</td>
                <td className="py-3 px-4 text-on-surface-variant">Yes (agents can move)</td>
              </tr>
              <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                <td className="py-3 px-4 font-medium text-on-surface">Agent Type</td>
                <td className="py-3 px-4 text-on-surface-variant">Homogeneous (uniform)</td>
                <td className="py-3 px-4 text-on-surface-variant">Heterogeneous (diverse)</td>
              </tr>
              <tr className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                <td className="py-3 px-4 font-medium text-on-surface">Update</td>
                <td className="py-3 px-4 text-on-surface-variant">Synchronous (simultaneous)</td>
                <td className="py-3 px-4 text-on-surface-variant">Asynchronous or Sequential</td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-3 px-4 font-medium text-on-surface">Key Example</td>
                <td className="py-3 px-4 text-on-surface-variant">Conway's Game of Life</td>
                <td className="py-3 px-4 text-on-surface-variant">NetLogo Model Library</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 p-4 bg-secondary-container/30 rounded-xl border border-secondary/20">
          <p className="text-sm text-on-surface-variant italic">
            While CA can be considered a specific subset of ABM, they are generally used for different purposes, with CA often focusing on spatial pattern formation and ABM focusing on complex individual-driven interactions.
          </p>
        </div>
      </div>
    </div>
  );
}
