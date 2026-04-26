# Depth First Search (DFS) Pattern

## What it is
A graph/tree traversal algorithm that explores as far as possible along each branch before backtracking. Uses a stack (explicit or via recursion call stack) to track the path. DFS prioritizes depth — it goes all the way down one path before exploring siblings.

## When to use
- Traversing or searching trees or graphs
- Finding all paths from source to destination
- Detecting cycles in a graph
- Topological sorting (DFS-based)
- Connected components in undirected graph
- Solving maze or island problems on a 2D grid
- Backtracking problems (generate all combinations, permutations, subsets)
- Keywords: "all paths", "exists a path", "connected", "islands", "cycle", "neighbors"

## Variants

### Tree DFS (preorder, inorder, postorder)
No visited set needed — trees have no cycles. Recursion is natural.

### Graph DFS with visited set
Track visited nodes to avoid infinite loops in cyclic graphs.

### Grid DFS (flood fill / island problems)
Treat each cell as a node. Neighbors are up/down/left/right (sometimes diagonal). Mark cells visited by modifying the grid in-place or using a visited set.

### Backtracking DFS
Explore all possibilities. At each step make a choice, recurse, then undo the choice (backtrack). Used for combinations, permutations, subsets, N-Queens.

## Hint progression
**Level 1 (Brute force / recognize traversal):**
Think about visiting every node and checking the condition. For tree problems, think about what information each node needs from its children. For grid problems, think about how to visit all connected cells.

**Level 2 (Recursive structure):**
Notice that subproblems have the same structure as the original problem. A subtree rooted at any node looks like a smaller version of the whole problem. Define what your recursive function returns and what base case terminates it.

**Level 3 (DFS skeleton):**
Write the recursive function: handle the base case (null node, out of bounds, visited), process current node, recurse on neighbors/children, combine results. For graphs, pass a visited set. For grids, mark cell visited before recursing.

**Level 4 (Backtracking insight):**
For "find all" problems: make a choice, add to current path, recurse, then remove from current path (backtrack). The undo step is critical — without it you'll carry choices from one branch into another.

## Common mistakes students make
- Forgetting base cases (null check, boundary check for grids)
- Not marking nodes as visited before recursing (causes infinite recursion in cyclic graphs)
- Marking visited after recursing instead of before (allows the same node to be added multiple times via different paths)
- In backtracking: forgetting to undo the choice after recursion returns
- For grid problems: modifying the grid in-place but forgetting to restore it if the grid must remain unchanged
- Confusing when to use DFS vs BFS — DFS finds A path, BFS finds the SHORTEST path

## DFS vs BFS decision guide
| Goal | Use |
|---|---|
| Does a path exist? | Either (DFS simpler) |
| Shortest path (unweighted) | BFS |
| All paths | DFS |
| Connected components | Either |
| Topological sort | DFS |
| Level-order traversal | BFS |
| Cycle detection | DFS |

## Grid DFS template
```
def dfs(grid, row, col, visited):
    if row < 0 or row >= len(grid): return
    if col < 0 or col >= len(grid[0]): return
    if grid[row][col] == '0' or (row, col) in visited: return
    
    visited.add((row, col))
    dfs(grid, row+1, col, visited)
    dfs(grid, row-1, col, visited)
    dfs(grid, row, col+1, visited)
    dfs(grid, row, col-1, visited)
```

## Backtracking template
```
def backtrack(start, current_path, result):
    if is_complete(current_path):
        result.append(list(current_path))
        return
    for choice in get_choices(start):
        current_path.append(choice)      # make choice
        backtrack(next_start, current_path, result)
        current_path.pop()               # undo choice (backtrack)
```

## Trigger problems (sorted by difficulty)
- Maximum Depth of Binary Tree (Easy) — tree DFS intro
- Same Tree (Easy) — compare two trees with DFS
- Number of Islands (Medium) — grid DFS classic
- Clone Graph (Medium) — graph DFS with visited map
- Path Sum II (Medium) — all paths in tree, backtracking
- Course Schedule (Medium) — cycle detection in directed graph
- Word Search (Medium) — grid backtracking
- Combination Sum (Medium) — classic backtracking
- N-Queens (Hard) — backtracking with constraint checking

## Key questions to ask yourself
1. Can I break this into the same problem on a smaller input (recursive substructure)?
2. What is my base case that stops the recursion?
3. What information do I need to pass down (parameters) and what do I return up?
4. Do I need to track visited nodes? (Always yes for graphs, no for trees)
5. Do I need to find all solutions (backtracking) or just one (early return)?