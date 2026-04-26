# Dynamic Programming — 2D Pattern

## What it is
An extension of DP where the state requires two variables to describe it — typically two indices, two values, or one index plus one constraint. The DP table becomes a 2D grid where `dp[i][j]` represents the answer to a subproblem defined by both i and j. More complex than 1D DP but follows the same principles.

## When to use
- Problem involves two sequences and you need to compare or combine them (strings, arrays)
- Problem has two changing constraints (index + remaining capacity, two pointers moving independently)
- Grid traversal problems where you move from one corner to another
- Keywords: "two strings", "edit distance", "longest common", "grid path", "matrix", "knapsack"
- State needs two parameters to fully describe it

## Common 2D DP problem categories

### Two-sequence problems
Compare two strings/arrays. `dp[i][j]` = answer considering first i chars of s1 and first j chars of s2.
Problems: Longest Common Subsequence, Edit Distance, Interleaving String.

### Knapsack problems
Items with weight and value, bag with capacity. `dp[i][j]` = max value using first i items with capacity j.
Problems: 0/1 Knapsack, Partition Equal Subset Sum, Target Sum.

### Grid path problems
Move through a matrix from top-left to bottom-right. `dp[i][j]` = answer at cell (i,j).
Problems: Unique Paths, Minimum Path Sum, Triangle.

### Interval DP
`dp[i][j]` = answer for the subarray/substring from index i to j.
Problems: Burst Balloons, Palindromic Substrings, Matrix Chain Multiplication.

## Hint progression
**Level 1 (Brute force):**
Recursive solution exploring all possibilities. For two strings, try all alignments. For grid, try all paths. Exponential time.

**Level 2 (Identify 2D state):**
Notice the recursive function takes two parameters — both change with each call. Drawing the recursion tree shows the same (i, j) pairs computed many times. This calls for a 2D memoization table.

**Level 3 (Define dp[i][j] precisely):**
Write in plain English what dp[i][j] means. Example for LCS: "the length of the longest common subsequence of s1[0..i-1] and s2[0..j-1]". Define the recurrence:
- If current elements match → dp[i][j] = dp[i-1][j-1] + 1
- If they don't match → dp[i][j] = max(dp[i-1][j], dp[i][j-1])

**Level 4 (Tabulation and space optimization):**
Fill the table bottom-up row by row. Identify dependencies — if dp[i][j] only depends on the previous row, you can use two 1D arrays instead of the full 2D table. If it only depends on the previous row and current row up to j-1, you can use one 1D array with careful update order.

## Common recurrences

**Two sequences, characters match/don't match:**
```
if s1[i] == s2[j]:
    dp[i][j] = dp[i-1][j-1] + 1   (extend common subsequence)
else:
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])   (skip one char from either)
```

**Edit distance (insert, delete, replace):**
```
if s1[i] == s2[j]:
    dp[i][j] = dp[i-1][j-1]
else:
    dp[i][j] = 1 + min(
        dp[i-1][j],     # delete from s1
        dp[i][j-1],     # insert into s1
        dp[i-1][j-1]    # replace in s1
    )
```

**Grid path (can only move right or down):**
```
dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
```

**0/1 Knapsack (take or skip item):**
```
dp[i][j] = max(
    dp[i-1][j],                          # skip item i
    dp[i-1][j - weight[i]] + value[i]    # take item i (if j >= weight[i])
)
```

## Common mistakes students make
- Wrong state definition — dp[i][j] meaning is ambiguous (off-by-one between "including index i" vs "first i elements")
- Not initializing base cases (first row and first column) before the main loop
- Accessing dp[i-1][j] when i=0 or dp[i][j-1] when j=0 without boundary checks
- For knapsack: taking an item when its weight exceeds current capacity (not checking weight[i] <= j)
- For string problems: confusing 0-indexed string access with 1-indexed DP table (use dp[i+1][j+1] = s[i], s[j])
- Forgetting that interval DP requires iterating by length of interval, not by start index

## Space optimization technique
For problems where dp[i][j] only depends on the previous row dp[i-1]:
- Keep only two rows: `prev` and `curr`
- After each row, set `prev = curr`
- Further optimize to one row if values are updated in the right order

## Trigger problems (sorted by difficulty)
- Unique Paths (Medium) — grid DP, intro to 2D
- Minimum Path Sum (Medium) — grid DP with cost
- Longest Common Subsequence (Medium) — two-sequence classic
- Coin Change II (Medium) — unbounded knapsack, count ways
- Edit Distance (Hard) — three operations, two strings
- Interleaving String (Medium) — two sequences form third
- Partition Equal Subset Sum (Medium) — 0/1 knapsack flavor
- Burst Balloons (Hard) — interval DP
- Regular Expression Matching (Hard) — two strings with wildcards

## Key questions to ask yourself
1. Does my state need two variables to fully describe it?
2. What does dp[i][j] mean in plain English — write it out precisely
3. What are all the transitions (cases) from dp[i][j] to smaller subproblems?
4. What are the base cases (dp[0][j] and dp[i][0])?
5. In what order should I fill the table so that when I compute dp[i][j], all dependencies are already filled?
6. Can I reduce the space by only keeping the previous row?