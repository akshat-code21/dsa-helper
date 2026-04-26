# Dynamic Programming — 1D Pattern

## What it is
A technique that solves complex problems by breaking them into overlapping subproblems, solving each subproblem once, and storing the result (memoization or tabulation) to avoid redundant computation. 1D DP means the state can be represented by a single variable (usually the index or a single value) and the DP table is a 1D array.

## When to use
- Problem has optimal substructure: optimal solution built from optimal solutions of subproblems
- Problem has overlapping subproblems: same subproblems computed multiple times in brute force
- Decision at each step that affects future decisions
- Keywords: "maximum", "minimum", "number of ways", "can you reach", "longest", "optimal"
- Brute force is exponential (recursive with branching) and memoizing it makes it polynomial

## Recognizing DP vs Greedy
Both make sequential decisions. Key difference:
- **Greedy**: local optimal choice always leads to global optimal (provable)
- **DP**: need to consider all choices at each step because local optimal might not be global optimal

If you can prove "always take the best available option" works → Greedy. If not → DP.

## State definition (the hardest part)
`dp[i]` usually means: "the answer to the problem considering the first i elements / ending at index i / with value i"

Getting this definition right is 80% of solving the problem. Write it in plain English before writing code.

## Hint progression
**Level 1 (Brute force / recursion):**
Write the recursive solution without memoization. Define what your recursive function computes, identify the base cases and recursive cases. It likely has exponential time due to overlapping subproblems.

**Level 2 (Identify overlapping subproblems):**
Draw the recursion tree. Notice that the same function calls appear multiple times with the same arguments. This is the signal for memoization. Add a cache — time drops to O(n).

**Level 3 (Top-down memoization):**
Add a dictionary or array to cache results. Before computing, check if result is already cached. After computing, store in cache. This is the natural extension of the recursive approach.

**Level 4 (Bottom-up tabulation):**
Instead of recursion, build the answer iteratively from base cases upward. `dp[0]` = base case, `dp[i]` = f(dp[i-1], dp[i-2], ...). Often O(1) space optimization is possible: if dp[i] only depends on dp[i-1] and dp[i-2], you only need two variables, not the full array.

## Common DP recurrences (1D)

**Fibonacci-style** (each state depends on previous 1-2 states):
`dp[i] = dp[i-1] + dp[i-2]`
Problems: Climbing Stairs, House Robber

**Kadane's style** (max subarray, reset to current if previous is negative):
`dp[i] = max(nums[i], dp[i-1] + nums[i])`
Problems: Maximum Subarray

**Decision at each element** (take or skip):
`dp[i] = max(skip: dp[i-1], take: dp[i-2] + nums[i])`
Problems: House Robber, Maximum Alternating Subsequence

**Unbounded choices** (can reuse elements):
`dp[i] = min/max over all valid choices j: dp[i - choice[j]] + cost`
Problems: Coin Change, Minimum Cost Climbing Stairs

## Common mistakes students make
- Wrong state definition — most DP bugs come from an imprecise definition of what dp[i] means
- Not handling base cases (dp[0] and sometimes dp[1]) before the loop
- Using dp[i-1] before checking i > 0 (index out of bounds)
- Forgetting that dp[i] might need to be initialized to infinity (for min problems) or 0 (for count problems) or -infinity (for max problems)
- Not recognizing that space can be optimized: computing dp[100] when you only need dp[i-1] and dp[i-2]
- Confusing top-down vs bottom-up — they compute the same thing, just in different order

## Space optimization
If `dp[i]` only depends on `dp[i-1]`:
→ Replace array with single variable `prev`

If `dp[i]` depends on `dp[i-1]` and `dp[i-2]`:
→ Replace array with two variables `prev1, prev2`

## Trigger problems (sorted by difficulty)
- Climbing Stairs (Easy) — Fibonacci, entry point to DP
- Min Cost Climbing Stairs (Easy) — two choices at each step
- House Robber (Medium) — take or skip decision
- Maximum Subarray (Medium) — Kadane's algorithm
- Coin Change (Medium) — unbounded knapsack flavor
- Longest Increasing Subsequence (Medium) — classic, O(n²) and O(n log n) variants
- Jump Game (Medium) — can you reach end (DP or Greedy)
- Decode Ways (Medium) — counting paths with constraints
- Word Break (Medium) — can string be segmented
- Partition Equal Subset Sum (Medium) — gateway to 2D DP

## Key questions to ask yourself
1. What decision am I making at each step?
2. What is the minimum information I need to define the state? (That becomes your dp array index)
3. What does dp[i] represent in plain English?
4. What are the base cases (smallest valid inputs)?
5. Can I express dp[i] in terms of previous dp values?
6. Does dp[i] only depend on the last 1-2 values? (Optimize space if so)