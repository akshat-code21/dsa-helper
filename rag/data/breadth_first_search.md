# Breadth First Search (BFS) Pattern

## What it is
A graph/tree traversal algorithm that explores all neighbors at the current depth before moving to the next depth level. Uses a queue (FIFO) to process nodes level by level. BFS guarantees the shortest path in an unweighted graph because it always explores closer nodes first.

## When to use
- Finding the shortest path in an unweighted graph or grid
- Level-order traversal of a tree
- Finding all nodes within k distance from a source
- Multi-source BFS (start from multiple nodes simultaneously)
- Problems asking for minimum number of steps, moves, or transformations
- When DFS risks deep recursion (stack overflow on large inputs)
- Keywords: "shortest path", "minimum steps", "level by level", "nearest", "minimum moves", "word ladder"

## Variants

### Standard BFS (single source)
Start from one node, find shortest distance to all others.

### Multi-source BFS
Start from multiple nodes simultaneously. Treat all sources as level 0.
Used when: rotting oranges (multiple starting rotten cells), walls and gates (multiple gates), 01 matrix (nearest zero from every cell).

### Bidirectional BFS
Search from both source and destination, stop when frontiers meet.
Reduces search space from O(b^d) to O(b^(d/2)) where b is branching factor and d is distance.

### BFS on implicit graph
Graph is not explicitly given — nodes are states, edges are transitions.
Used when: word ladder (words are nodes, single character changes are edges), sliding puzzle.

## Hint progression
**Level 1 (Brute force):**
Try all possible paths using DFS and track minimum length. Time: exponential — explores redundant paths.

**Level 2 (Recognize shortest path structure):**
Notice that the problem asks for minimum steps/distance. DFS explores deeply before broadly — it might find a long path first. Is there an approach that finds shorter paths first by nature?

**Level 3 (BFS skeleton):**
Use a queue. Enqueue source node with distance 0. Mark it visited. While queue is not empty: dequeue front node, if it's the destination return current distance, enqueue all unvisited neighbors with distance + 1, mark them visited.

**Level 4 (Level tracking):**
For "level-aware" problems, process the entire current level before moving to the next. Use a for loop over `len(queue)` at the start of each level iteration. This lets you track exactly which level (depth/distance) you're currently processing.

## Common mistakes students make
- Using DFS when problem asks for minimum steps (DFS doesn't guarantee shortest path)
- Marking nodes visited when dequeuing instead of when enqueuing — this allows the same node to be enqueued multiple times, causing O(n²) or worse
- Forgetting to mark the source as visited before starting
- For grid BFS: not checking boundary conditions before enqueuing neighbors
- For level-order: not separating levels correctly (not using snapshot of queue size)
- For multi-source BFS: starting sources one at a time instead of all at level 0 — this finds distance from the last source, not minimum distance from any source

## When BFS vs DFS
- Need shortest path → **BFS** (DFS cannot guarantee this)
- Need to explore all possibilities (backtracking) → **DFS**
- Tree level-order → **BFS**
- Topological sort → **DFS**
- Detect cycle → **DFS** (though BFS can too)
- Memory constrained, deep graph → **DFS** (BFS stores entire frontier)
- Very wide graph (high branching factor) → **DFS** (BFS queue grows huge)

## BFS template
```
from collections import deque

def bfs(graph, source, target):
    queue = deque([(source, 0)])  # (node, distance)
    visited = {source}
    
    while queue:
        node, dist = queue.popleft()
        if node == target:
            return dist
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)   # mark when enqueuing, not dequeuing
                queue.append((neighbor, dist + 1))
    return -1
```

## Level-order BFS template
```
queue = deque([root])
while queue:
    level_size = len(queue)          # snapshot current level
    for _ in range(level_size):      # process only current level
        node = queue.popleft()
        # process node
        for child in node.children:
            queue.append(child)
```

## Trigger problems (sorted by difficulty)
- Binary Tree Level Order Traversal (Medium) — BFS intro with trees
- Rotting Oranges (Medium) — multi-source BFS
- 01 Matrix (Medium) — multi-source BFS, nearest zero
- Number of Islands (Medium) — can use BFS or DFS
- Word Ladder (Hard) — BFS on implicit graph
- Walls and Gates (Medium) — multi-source BFS
- Minimum Knight Moves (Medium) — BFS on 2D grid with offsets
- Jump Game III (Medium) — BFS/DFS, reachability
- Shortest Path in Binary Matrix (Medium) — BFS with diagonal moves

## Key questions to ask yourself
1. Am I looking for the shortest path or minimum number of steps?
2. Is the graph weighted or unweighted? (BFS only gives shortest path on unweighted)
3. Are there multiple valid starting points? (Multi-source BFS)
4. Do I need level-by-level information, or just minimum distance?
5. What counts as a "neighbor" in this problem — adjacent cells, connected nodes, valid next states?