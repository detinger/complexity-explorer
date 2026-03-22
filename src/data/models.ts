export const codeSnippets: Record<string, Record<string, Record<'python' | 'r', string>>> = {
  ca: {
    gol: {
      python: `import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

def update(frameNum, img, grid, N):
    newGrid = grid.copy()
    for i in range(N):
        for j in range(N):
            total = int((grid[i, (j-1)%N] + grid[i, (j+1)%N] +
                         grid[(i-1)%N, j] + grid[(i+1)%N, j] +
                         grid[(i-1)%N, (j-1)%N] + grid[(i-1)%N, (j+1)%N] +
                         grid[(i+1)%N, (j-1)%N] + grid[(i+1)%N, (j+1)%N]))
            if grid[i, j] == 1:
                if (total < 2) or (total > 3):
                    newGrid[i, j] = 0
            else:
                if total == 3:
                    newGrid[i, j] = 1
    img.set_data(newGrid)
    grid[:] = newGrid[:]
    return img,

N = 50
grid = np.random.choice([0, 1], N*N, p=[0.8, 0.2]).reshape(N, N)
fig, ax = plt.subplots()
img = ax.imshow(grid, interpolation='nearest', cmap='plasma')
ani = animation.FuncAnimation(fig, update, fargs=(img, grid, N), frames=10, interval=50, save_count=50)
plt.show()`,
      r: `library(plotrix)

N <- 50
grid <- matrix(sample(c(0,1), N*N, replace=TRUE, prob=c(0.8, 0.2)), nrow=N)

update_grid <- function(g) {
  new_g <- g
  for(i in 1:N) {
    for(j in 1:N) {
      neighbors <- sum(g[c(i-1, i, i+1) %% N + 1, c(j-1, j, j+1) %% N + 1]) - g[i,j]
      if(g[i,j] == 1 && (neighbors < 2 || neighbors > 3)) new_g[i,j] <- 0
      if(g[i,j] == 0 && neighbors == 3) new_g[i,j] <- 1
    }
  }
  return(new_g)
}

for(step in 1:100) {
  image(grid, col=c("white", "black"), axes=FALSE)
  grid <- update_grid(grid)
  Sys.sleep(0.1)
}`
    },
    rule30: {
      python: `import numpy as np
import matplotlib.pyplot as plt

STEPS = 100
grid = np.zeros((STEPS, STEPS*2+1), dtype=int)
grid[0, STEPS] = 1

for i in range(STEPS-1):
    for j in range(1, STEPS*2):
        left, center, right = grid[i, j-1], grid[i, j], grid[i, j+1]
        state = (left << 2) | (center << 1) | right
        grid[i+1, j] = [0, 1, 1, 1, 1, 0, 0, 0][state]

plt.imshow(grid, cmap='binary')
plt.title("Rule 30")
plt.show()`,
      r: `# Rule 30 in R
STEPS <- 100
grid <- matrix(0, nrow=STEPS, ncol=STEPS*2+1)
grid[1, STEPS+1] <- 1

for(i in 1:(STEPS-1)) {
  for(j in 2:(STEPS*2)) {
    state <- grid[i, j-1]*4 + grid[i, j]*2 + grid[i, j+1]
    grid[i+1, j] <- c(0,1,1,1,1,0,0,0)[state + 1]
  }
}
image(t(grid), col=c("white", "black"), main="Rule 30")`
    },
    rule110: {
      python: `import numpy as np
import matplotlib.pyplot as plt

STEPS = 100
grid = np.zeros((STEPS, STEPS*2+1), dtype=int)
grid[0, STEPS] = 1

for i in range(STEPS-1):
    for j in range(1, STEPS*2):
        left, center, right = grid[i, j-1], grid[i, j], grid[i, j+1]
        state = (left << 2) | (center << 1) | right
        grid[i+1, j] = [0, 1, 1, 1, 0, 1, 1, 0][state]

plt.imshow(grid, cmap='binary')
plt.title("Rule 110")
plt.show()`,
      r: `# Rule 110 in R
STEPS <- 100
grid <- matrix(0, nrow=STEPS, ncol=STEPS*2+1)
grid[1, STEPS+1] <- 1

for(i in 1:(STEPS-1)) {
  for(j in 2:(STEPS*2)) {
    state <- grid[i, j-1]*4 + grid[i, j]*2 + grid[i, j+1]
    grid[i+1, j] <- c(0,1,1,1,0,1,1,0)[state + 1]
  }
}
image(t(grid), col=c("white", "black"), main="Rule 110")`
    },
    langtons_ant: {
      python: `import numpy as np
import matplotlib.pyplot as plt

N = 100
grid = np.zeros((N, N), dtype=int)
x, y, d = N//2, N//2, 0
dirs = [(0,-1), (1,0), (0,1), (-1,0)]

for _ in range(11000):
    if grid[y, x] == 0:
        d = (d + 1) % 4
        grid[y, x] = 1
    else:
        d = (d - 1) % 4
        grid[y, x] = 0
    x = (x + dirs[d][0]) % N
    y = (y + dirs[d][1]) % N

plt.imshow(grid, cmap='binary')
plt.title("Langton's Ant (11,000 steps)")
plt.show()`,
      r: `# Langton's Ant in R
N <- 100
grid <- matrix(0, nrow=N, ncol=N)
x <- N/2; y <- N/2; d <- 0
dirs_x <- c(0, 1, 0, -1)
dirs_y <- c(-1, 0, 1, 0)

for(i in 1:11000) {
  if(grid[y, x] == 0) {
    d <- (d + 1) %% 4
    grid[y, x] <- 1
  } else {
    d <- (d - 1) %% 4
    grid[y, x] <- 0
  }
  x <- (x + dirs_x[d+1] - 1) %% N + 1
  y <- (y + dirs_y[d+1] - 1) %% N + 1
}
image(grid, col=c("white", "black"), main="Langton's Ant")`
    },
    wireworld: {
      python: `import numpy as np
import matplotlib.pyplot as plt

# 0: empty, 1: head, 2: tail, 3: copper
# A simple circuit simulation
print("WireWorld simulation code template")`,
      r: `# WireWorld in R
print("WireWorld simulation code template")`
    },
    brians_brain: {
      python: `import numpy as np
import matplotlib.pyplot as plt

# 0: off, 1: on, 2: dying
# Brian's Brain simulation code template
print("Brian's Brain simulation code template")`,
      r: `# Brian's Brain in R
print("Brian's Brain simulation code template")`
    }
  },
  abm: {
    boids: {
      python: `import numpy as np
import matplotlib.pyplot as plt

N_BOIDS = 50
WIDTH, HEIGHT = 100, 100

positions = np.random.rand(N_BOIDS, 2) * [WIDTH, HEIGHT]
velocities = (np.random.rand(N_BOIDS, 2) - 0.5) * 2

cohesion = 0.01
separation = 0.05
alignment = 0.05
max_speed = 2.0

def update_boids(positions, velocities):
    new_velocities = np.copy(velocities)
    for i in range(N_BOIDS):
        cx, cy, sx, sy, ax, ay = 0, 0, 0, 0, 0, 0
        neighbor_count = 0
        
        for j in range(N_BOIDS):
            if i == j: continue
            dx = positions[j, 0] - positions[i, 0]
            dy = positions[j, 1] - positions[i, 1]
            dist = np.sqrt(dx**2 + dy**2)
            
            if dist < 15:
                cx += positions[j, 0]
                cy += positions[j, 1]
                ax += velocities[j, 0]
                ay += velocities[j, 1]
                neighbor_count += 1
                
                if dist < 5:
                    sx -= dx
                    sy -= dy
                    
        if neighbor_count > 0:
            cx /= neighbor_count
            cy /= neighbor_count
            ax /= neighbor_count
            ay /= neighbor_count
            
            new_velocities[i, 0] += (cx - positions[i, 0]) * cohesion + sx * separation + ax * alignment
            new_velocities[i, 1] += (cy - positions[i, 1]) * cohesion + sy * separation + ay * alignment
            
        v_mag = np.sqrt(new_velocities[i, 0]**2 + new_velocities[i, 1]**2)
        if v_mag > max_speed:
            new_velocities[i] = (new_velocities[i] / v_mag) * max_speed
            
    positions += new_velocities
    positions %= [WIDTH, HEIGHT]
    return positions, new_velocities

for _ in range(100):
    positions, velocities = update_boids(positions, velocities)

plt.scatter(positions[:, 0], positions[:, 1], c='blue', marker='^')
plt.title("Boids Flocking Model")
plt.show()`,
      r: `# Boids Flocking Model in R
N_BOIDS <- 50
WIDTH <- 100; HEIGHT <- 100

pos_x <- runif(N_BOIDS, 0, WIDTH)
pos_y <- runif(N_BOIDS, 0, HEIGHT)
vel_x <- runif(N_BOIDS, -1, 1)
vel_y <- runif(N_BOIDS, -1, 1)

cohesion <- 0.01
separation <- 0.05
alignment <- 0.05
max_speed <- 2.0

for(step in 1:100) {
  new_vel_x <- vel_x
  new_vel_y <- vel_y
  
  for(i in 1:N_BOIDS) {
    cx <- 0; cy <- 0; sx <- 0; sy <- 0; ax <- 0; ay <- 0
    neighbor_count <- 0
    
    for(j in 1:N_BOIDS) {
      if(i == j) next
      dx <- pos_x[j] - pos_x[i]
      dy <- pos_y[j] - pos_y[i]
      dist <- sqrt(dx^2 + dy^2)
      
      if(dist < 15) {
        cx <- cx + pos_x[j]
        cy <- cy + pos_y[j]
        ax <- ax + vel_x[j]
        ay <- ay + vel_y[j]
        neighbor_count <- neighbor_count + 1
        
        if(dist < 5) {
          sx <- sx - dx
          sy <- sy - dy
        }
      }
    }
    
    if(neighbor_count > 0) {
      cx <- cx / neighbor_count
      cy <- cy / neighbor_count
      ax <- ax / neighbor_count
      ay <- ay / neighbor_count
      
      new_vel_x[i] <- new_vel_x[i] + (cx - pos_x[i]) * cohesion + sx * separation + ax * alignment
      new_vel_y[i] <- new_vel_y[i] + (cy - pos_y[i]) * cohesion + sy * separation + ay * alignment
    }
    
    v_mag <- sqrt(new_vel_x[i]^2 + new_vel_y[i]^2)
    if(v_mag > max_speed) {
      new_vel_x[i] <- (new_vel_x[i] / v_mag) * max_speed
      new_vel_y[i] <- (new_vel_y[i] / v_mag) * max_speed
    }
  }
  
  vel_x <- new_vel_x
  vel_y <- new_vel_y
  pos_x <- (pos_x + vel_x) %% WIDTH
  pos_y <- (pos_y + vel_y) %% HEIGHT
}

plot(pos_x, pos_y, col="blue", pch=17, main="Boids Flocking Model")`
    },
    schelling: {
      python: `import numpy as np
import matplotlib.pyplot as plt

N = 50
EMPTY, RED, BLUE = 0, 1, 2
grid = np.random.choice([EMPTY, RED, BLUE], size=(N, N), p=[0.1, 0.45, 0.45])
similarity_threshold = 0.4

def step(grid):
    new_grid = grid.copy()
    for i in range(N):
        for j in range(N):
            if grid[i, j] == EMPTY: continue
            
            # Count neighbors
            same = 0
            total = 0
            for di in [-1, 0, 1]:
                for dj in [-1, 0, 1]:
                    if di == 0 and dj == 0: continue
                    ni, nj = (i+di)%N, (j+dj)%N
                    if grid[ni, nj] != EMPTY:
                        total += 1
                        if grid[ni, nj] == grid[i, j]:
                            same += 1
            
            if total > 0 and (same / total) < similarity_threshold:
                # Move to random empty spot
                empty_spots = np.argwhere(new_grid == EMPTY)
                if len(empty_spots) > 0:
                    idx = np.random.randint(len(empty_spots))
                    new_i, new_j = empty_spots[idx]
                    new_grid[new_i, new_j] = grid[i, j]
                    new_grid[i, j] = EMPTY
    return new_grid

for _ in range(10):
    grid = step(grid)

plt.imshow(grid, cmap='coolwarm')
plt.title("Schelling's Segregation Model")
plt.show()`,
      r: `# Schelling's Segregation Model in R
N <- 50
grid <- matrix(sample(0:2, N*N, replace=TRUE, prob=c(0.1, 0.45, 0.45)), nrow=N)
similarity_threshold <- 0.4

step <- function(g) {
  new_g <- g
  empty_spots <- which(new_g == 0, arr.ind = TRUE)
  
  for(i in 1:N) {
    for(j in 1:N) {
      if(g[i,j] == 0) next
      
      # Simplified neighborhood check
      neighbors <- g[c(i-1, i, i+1) %% N + 1, c(j-1, j, j+1) %% N + 1]
      total <- sum(neighbors != 0) - 1
      same <- sum(neighbors == g[i,j]) - 1
      
      if(total > 0 && (same / total) < similarity_threshold) {
        if(nrow(empty_spots) > 0) {
          idx <- sample(1:nrow(empty_spots), 1)
          new_i <- empty_spots[idx, 1]
          new_j <- empty_spots[idx, 2]
          new_g[new_i, new_j] <- g[i,j]
          new_g[i,j] <- 0
          empty_spots[idx,] <- c(i, j)
        }
      }
    }
  }
  return(new_g)
}

for(i in 1:10) grid <- step(grid)
image(grid, col=c("white", "red", "blue"), main="Schelling Segregation")`
    },
    sugarscape: {
      python: `import numpy as np
import matplotlib.pyplot as plt

N_AGENTS = 100
WIDTH, HEIGHT = 100, 100

positions = np.random.rand(N_AGENTS, 2) * [WIDTH, HEIGHT]
velocities = (np.random.rand(N_AGENTS, 2) - 0.5) * 2
speed = 2.0

def update(positions, velocities):
    for i in range(N_AGENTS):
        dx = (WIDTH/2) - positions[i, 0]
        dy = (HEIGHT/2) - positions[i, 1]
        dist = np.sqrt(dx**2 + dy**2)
        
        if dist > 0:
            velocities[i, 0] += (dx/dist) * 0.2 + (np.random.rand() - 0.5) * 0.5
            velocities[i, 1] += (dy/dist) * 0.2 + (np.random.rand() - 0.5) * 0.5
            
        v_mag = np.sqrt(velocities[i, 0]**2 + velocities[i, 1]**2)
        if v_mag > speed:
            velocities[i] = (velocities[i] / v_mag) * speed
            
        positions[i] += velocities[i]
        positions[i] %= [WIDTH, HEIGHT]

for _ in range(100):
    update(positions, velocities)

plt.scatter(positions[:, 0], positions[:, 1], c='blue', s=10)
plt.plot(WIDTH/2, HEIGHT/2, 'rX', markersize=15) # Sugar mountain
plt.title("Sugarscape (Simplified)")
plt.show()`,
      r: `# Sugarscape in R
N_AGENTS <- 100
WIDTH <- 100; HEIGHT <- 100

pos_x <- runif(N_AGENTS, 0, WIDTH)
pos_y <- runif(N_AGENTS, 0, HEIGHT)
vel_x <- runif(N_AGENTS, -1, 1)
vel_y <- runif(N_AGENTS, -1, 1)
speed <- 2.0

for(step in 1:100) {
  for(i in 1:N_AGENTS) {
    dx <- (WIDTH/2) - pos_x[i]
    dy <- (HEIGHT/2) - pos_y[i]
    dist <- sqrt(dx^2 + dy^2)
    
    if(dist > 0) {
      vel_x[i] <- vel_x[i] + (dx/dist)*0.2 + runif(1, -0.25, 0.25)
      vel_y[i] <- vel_y[i] + (dy/dist)*0.2 + runif(1, -0.25, 0.25)
    }
    
    v_mag <- sqrt(vel_x[i]^2 + vel_y[i]^2)
    if(v_mag > speed) {
      vel_x[i] <- (vel_x[i] / v_mag) * speed
      vel_y[i] <- (vel_y[i] / v_mag) * speed
    }
    
    pos_x[i] <- (pos_x[i] + vel_x[i]) %% WIDTH
    pos_y[i] <- (pos_y[i] + vel_y[i]) %% HEIGHT
  }
}

plot(pos_x, pos_y, col="blue", pch=16, main="Sugarscape")
points(WIDTH/2, HEIGHT/2, col="red", pch=4, cex=2)`
    },
    gol: {
      python: `import numpy as np
import matplotlib.pyplot as plt

N_AGENTS = 200
WIDTH, HEIGHT = 100, 100

positions = np.random.rand(N_AGENTS, 2) * [WIDTH, HEIGHT]
velocities = (np.random.rand(N_AGENTS, 2) - 0.5) * 2
states = np.random.choice([0, 1], N_AGENTS) # 0: Dead, 1: Alive

def update(positions, velocities, states):
    new_states = states.copy()
    for i in range(N_AGENTS):
        # Count neighbors within radius
        dist = np.sqrt(np.sum((positions - positions[i])**2, axis=1))
        neighbors = np.sum(dist < 10) - 1 # exclude self
        
        if states[i] == 1:
            if neighbors < 1 or neighbors > 4:
                new_states[i] = 0
        else:
            if 2 <= neighbors <= 3:
                new_states[i] = 1
                
        positions[i] += velocities[i] * 0.5
        positions[i] %= [WIDTH, HEIGHT]
    return new_states

for _ in range(50):
    states = update(positions, velocities, states)

colors = ['gray' if s == 0 else 'green' for s in states]
plt.scatter(positions[:, 0], positions[:, 1], c=colors, s=15)
plt.title("Continuous Game of Life")
plt.show()`,
      r: `# Conway's Game of Life (Continuous) in R
N_AGENTS <- 200
WIDTH <- 100; HEIGHT <- 100

pos_x <- runif(N_AGENTS, 0, WIDTH)
pos_y <- runif(N_AGENTS, 0, HEIGHT)
vel_x <- runif(N_AGENTS, -1, 1)
vel_y <- runif(N_AGENTS, -1, 1)
states <- sample(c(0, 1), N_AGENTS, replace=TRUE)

for(step in 1:50) {
  new_states <- states
  for(i in 1:N_AGENTS) {
    dist <- sqrt((pos_x - pos_x[i])^2 + (pos_y - pos_y[i])^2)
    neighbors <- sum(dist < 10) - 1
    
    if(states[i] == 1) {
      if(neighbors < 1 || neighbors > 4) new_states[i] <- 0
    } else {
      if(neighbors >= 2 && neighbors <= 3) new_states[i] <- 1
    }
    
    pos_x[i] <- (pos_x[i] + vel_x[i] * 0.5) %% WIDTH
    pos_y[i] <- (pos_y[i] + vel_y[i] * 0.5) %% HEIGHT
  }
  states <- new_states
}

cols <- ifelse(states == 1, "green", "gray")
plot(pos_x, pos_y, col=cols, pch=16, main="Continuous Game of Life")`
    },
    axelrod: {
      python: `import numpy as np
import matplotlib.pyplot as plt

N_AGENTS = 200
WIDTH, HEIGHT = 100, 100

positions = np.random.rand(N_AGENTS, 2) * [WIDTH, HEIGHT]
velocities = (np.random.rand(N_AGENTS, 2) - 0.5) * 2
cultures = np.random.randint(0, 5, N_AGENTS)

def update(positions, velocities, cultures):
    new_cultures = cultures.copy()
    for i in range(N_AGENTS):
        # Find neighbors
        dist = np.sqrt(np.sum((positions - positions[i])**2, axis=1))
        neighbors = np.where((dist < 15) & (dist > 0))[0]
        
        if len(neighbors) > 0 and np.random.rand() < 0.05:
            # Adopt culture of a random neighbor
            neighbor_idx = np.random.choice(neighbors)
            new_cultures[i] = cultures[neighbor_idx]
            
        positions[i] += velocities[i]
        positions[i] %= [WIDTH, HEIGHT]
    return new_cultures

for _ in range(100):
    cultures = update(positions, velocities, cultures)

plt.scatter(positions[:, 0], positions[:, 1], c=cultures, cmap='Set1', s=20)
plt.title("Axelrod's Culture Model")
plt.show()`,
      r: `# Axelrod's Culture Model in R
N_AGENTS <- 200
WIDTH <- 100; HEIGHT <- 100

pos_x <- runif(N_AGENTS, 0, WIDTH)
pos_y <- runif(N_AGENTS, 0, HEIGHT)
vel_x <- runif(N_AGENTS, -1, 1)
vel_y <- runif(N_AGENTS, -1, 1)
cultures <- sample(1:5, N_AGENTS, replace=TRUE)

for(step in 1:100) {
  new_cultures <- cultures
  for(i in 1:N_AGENTS) {
    dist <- sqrt((pos_x - pos_x[i])^2 + (pos_y - pos_y[i])^2)
    neighbors <- which(dist < 15 & dist > 0)
    
    if(length(neighbors) > 0 && runif(1) < 0.05) {
      neighbor_idx <- sample(neighbors, 1)
      new_cultures[i] <- cultures[neighbor_idx]
    }
    
    pos_x[i] <- (pos_x[i] + vel_x[i]) %% WIDTH
    pos_y[i] <- (pos_y[i] + vel_y[i]) %% HEIGHT
  }
  cultures <- new_cultures
}

plot(pos_x, pos_y, col=cultures, pch=16, main="Axelrod's Culture Model")`
    },
    stock_market: {
      python: `import numpy as np
import matplotlib.pyplot as plt

N_AGENTS = 200
WIDTH, HEIGHT = 100, 100

positions = np.random.rand(N_AGENTS, 2) * [WIDTH, HEIGHT]
velocities = (np.random.rand(N_AGENTS, 2) - 0.5) * 2
types = np.random.choice([0, 1], N_AGENTS) # 0: Bull, 1: Bear

def update(positions, velocities, types):
    new_types = types.copy()
    for i in range(N_AGENTS):
        dist = np.sqrt(np.sum((positions - positions[i])**2, axis=1))
        neighbors = np.where((dist < 20) & (dist > 0))[0]
        
        if len(neighbors) > 0:
            bull_ratio = np.sum(types[neighbors] == 0) / len(neighbors)
            if bull_ratio > 0.5 and np.random.rand() < 0.1:
                new_types[i] = 0
            elif bull_ratio < 0.5 and np.random.rand() < 0.1:
                new_types[i] = 1
                
        positions[i] += velocities[i]
        positions[i] %= [WIDTH, HEIGHT]
    return new_types

for _ in range(100):
    types = update(positions, velocities, types)

colors = ['green' if t == 0 else 'red' for t in types]
plt.scatter(positions[:, 0], positions[:, 1], c=colors, s=20)
plt.title("Artificial Stock Market (Herd Behavior)")
plt.show()`,
      r: `# Artificial Stock Market in R
N_AGENTS <- 200
WIDTH <- 100; HEIGHT <- 100

pos_x <- runif(N_AGENTS, 0, WIDTH)
pos_y <- runif(N_AGENTS, 0, HEIGHT)
vel_x <- runif(N_AGENTS, -1, 1)
vel_y <- runif(N_AGENTS, -1, 1)
types <- sample(c(0, 1), N_AGENTS, replace=TRUE) # 0: Bull, 1: Bear

for(step in 1:100) {
  new_types <- types
  for(i in 1:N_AGENTS) {
    dist <- sqrt((pos_x - pos_x[i])^2 + (pos_y - pos_y[i])^2)
    neighbors <- which(dist < 20 & dist > 0)
    
    if(length(neighbors) > 0) {
      bull_ratio <- sum(types[neighbors] == 0) / length(neighbors)
      if(bull_ratio > 0.5 && runif(1) < 0.1) new_types[i] <- 0
      else if(bull_ratio < 0.5 && runif(1) < 0.1) new_types[i] <- 1
    }
    
    pos_x[i] <- (pos_x[i] + vel_x[i]) %% WIDTH
    pos_y[i] <- (pos_y[i] + vel_y[i]) %% HEIGHT
  }
  types <- new_types
}

cols <- ifelse(types == 0, "green", "red")
plot(pos_x, pos_y, col=cols, pch=16, main="Artificial Stock Market")`
    },
    sir: {
      python: `import numpy as np
import matplotlib.pyplot as plt

N_AGENTS = 200
WIDTH, HEIGHT = 100, 100

positions = np.random.rand(N_AGENTS, 2) * [WIDTH, HEIGHT]
velocities = (np.random.rand(N_AGENTS, 2) - 0.5) * 2
# 0: Susceptible, 1: Infected, 2: Recovered
states = np.random.choice([0, 1], N_AGENTS, p=[0.95, 0.05])
timers = np.zeros(N_AGENTS)

def update(positions, velocities, states, timers):
    new_states = states.copy()
    for i in range(N_AGENTS):
        if states[i] == 1:
            timers[i] += 1
            if timers[i] > 50: # Recovery time
                new_states[i] = 2
        elif states[i] == 0:
            # Check for infection
            dist = np.sqrt(np.sum((positions - positions[i])**2, axis=1))
            infected_neighbors = np.sum((dist < 10) & (states == 1))
            if infected_neighbors > 0 and np.random.rand() < 0.1:
                new_states[i] = 1
                
        # Random walk
        velocities[i] += (np.random.rand(2) - 0.5) * 0.5
        v_mag = np.linalg.norm(velocities[i])
        if v_mag > 2.0:
            velocities[i] = (velocities[i] / v_mag) * 2.0
            
        positions[i] += velocities[i]
        positions[i] %= [WIDTH, HEIGHT]
    return new_states

for _ in range(100):
    states = update(positions, velocities, states, timers)

colors = ['blue' if s == 0 else 'red' if s == 1 else 'green' for s in states]
plt.scatter(positions[:, 0], positions[:, 1], c=colors, s=20)
plt.title("Epidemiological SIR Model")
plt.show()`,
      r: `# Epidemiological/SIR Model in R
N_AGENTS <- 200
WIDTH <- 100; HEIGHT <- 100

pos_x <- runif(N_AGENTS, 0, WIDTH)
pos_y <- runif(N_AGENTS, 0, HEIGHT)
vel_x <- runif(N_AGENTS, -1, 1)
vel_y <- runif(N_AGENTS, -1, 1)
states <- sample(c(0, 1), N_AGENTS, replace=TRUE, prob=c(0.95, 0.05))
timers <- rep(0, N_AGENTS)

for(step in 1:100) {
  new_states <- states
  for(i in 1:N_AGENTS) {
    if(states[i] == 1) {
      timers[i] <- timers[i] + 1
      if(timers[i] > 50) new_states[i] <- 2
    } else if(states[i] == 0) {
      dist <- sqrt((pos_x - pos_x[i])^2 + (pos_y - pos_y[i])^2)
      infected_neighbors <- sum(dist < 10 & states == 1)
      if(infected_neighbors > 0 && runif(1) < 0.1) new_states[i] <- 1
    }
    
    vel_x[i] <- vel_x[i] + runif(1, -0.25, 0.25)
    vel_y[i] <- vel_y[i] + runif(1, -0.25, 0.25)
    v_mag <- sqrt(vel_x[i]^2 + vel_y[i]^2)
    if(v_mag > 2.0) {
      vel_x[i] <- (vel_x[i] / v_mag) * 2.0
      vel_y[i] <- (vel_y[i] / v_mag) * 2.0
    }
    
    pos_x[i] <- (pos_x[i] + vel_x[i]) %% WIDTH
    pos_y[i] <- (pos_y[i] + vel_y[i]) %% HEIGHT
  }
  states <- new_states
}

cols <- c("blue", "red", "green")[states + 1]
plot(pos_x, pos_y, col=cols, pch=16, main="SIR Model")`
    }
  }
};
