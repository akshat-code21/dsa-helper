# Binary Search Pattern

## What it is
A divide-and-conquer search algorithm that repeatedly halves the search space by comparing the target with the middle element. Works on sorted data or any data with a monotonic property (where a condition transitions cleanly from false to true or vice versa). Reduces O(n) linear search to O(log n).

## When to use
- Array is sorted (explicitly or implicitly)
- You need to find a specific value or boundary in a sorted structure
- Problem asks to minimize the maximum or maximize the minimum of something
- Brute force is O(n) or O(n²) and the search space is large
- You can define a condition that is monotonically true/false across the search space
- Keywords: "sorted", "rotated sorted", "find minimum", "search", "first/last position", "kth smallest"

## Variants

### Classic binary search
Find exact target in sorted array. Return index or -1.

### Find left/right boundary
Find the first or last position where a condition is true.
Template: always move one pointer past mid to find the exact boundary.

### Binary search on answer
The search space is not the array itself but a range of possible answers.
Condition: "is X a valid answer?" — check if X satisfies the problem constraint.
Used when: minimize the maximum, maximize the minimum, capacity problems.

### Search in rotated array
Array was sorted then rotated. One half is always sorted — use that to decide which half to search.

## Hint progression
**Level 1 (Brute force):**
Scan through the entire array linearly from left to right. O(n) time.

**Level 2 (Spot the property):**
The array is sorted (or has a monotonic property). Notice that when you look at the middle element, you can immediately eliminate half the array. If target > mid, it can't be in the left half.

**Level 3 (Basic binary search):**
Set left = 0, right = n-1. Compute mid = left + (right - left) / 2 (avoid overflow). Compare target to mid, eliminate one half each iteration. Continue until left > right.

**Level 4 (Boundary finding / search on answer):**
For "find first/last" problems: don't return immediately when found. Instead record the answer and keep searching in one direction. For "search on answer": define a helper function `canAchieve(x)` and binary search on the answer space [lo, hi].

## Common mistakes students make
- Integer overflow: use `mid = left + (right - left) / 2`, not `(left + right) / 2`
- Infinite loop: when moving pointers, ensure left and right always converge (left = mid + 1 or right = mid - 1, never just mid)
- Off-by-one in boundary: when finding left boundary use `right = mid`, when finding right boundary use `left = mid + 1` depending on template
- Wrong termination condition: `left < right` vs `left <= right` — depends on whether you want to process the last element inside or outside the loop
- For rotated array: not correctly identifying which half is sorted before deciding where to search

## Template for boundary finding
```
left, right = 0, n - 1
result = -1
while left <= right:
    mid = left + (right - left) // 2
    if condition(mid):
        result = mid          # record potential answer
        right = mid - 1       # search left for earlier occurrence
    else:
        left = mid + 1
return result
```

## Template for binary search on answer
```
left, right = min_possible_answer, max_possible_answer
while left < right:
    mid = left + (right - left) // 2
    if canAchieve(mid):
        right = mid           # mid works, try smaller
    else:
        left = mid + 1        # mid doesn't work, need larger
return left
```

## Trigger problems (sorted by difficulty)
- Binary Search (Easy) — pure classic, start here
- First Bad Version (Easy) — find left boundary
- Search Insert Position (Easy) — boundary variant
- Find Minimum in Rotated Sorted Array (Medium) — rotated variant
- Search in Rotated Sorted Array (Medium) — rotated with target
- Find First and Last Position of Element (Medium) — left and right boundary
- Koko Eating Bananas (Medium) — binary search on answer
- Split Array Largest Sum (Hard) — minimize the maximum, search on answer
- Median of Two Sorted Arrays (Hard) — advanced, partition-based

## Key questions to ask yourself
1. Is there a monotonic property — does the answer space have a clear true/false boundary?
2. What are my search space boundaries (lo, hi)?
3. What does finding `mid` tell me — can I definitively eliminate one half?
4. Am I looking for an exact value or a boundary (first/last true)?
5. For search on answer: can I write a function `canAchieve(x)` efficiently?