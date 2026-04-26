# Sliding Window Pattern

## What it is
A technique that maintains a contiguous subset (window) of a sequence and slides it across the data structure to avoid redundant computation. Instead of recomputing from scratch for each subarray, you add one element as the window grows and remove one element as it shrinks — turning an O(n²) or O(n³) approach into O(n).

## When to use
- Problem involves a contiguous subarray or substring
- You need the maximum, minimum, longest, or shortest subarray/substring satisfying some condition
- Keywords: "contiguous", "subarray", "substring", "window", "consecutive", "at most k", "exactly k distinct"
- Brute force requires nested loops over subarrays

## Variants

### Fixed-size window
Window size k is given. Slide across array, add new element, remove old element.
Used when: max sum of subarray of size k, average of all subarrays of size k.

### Variable-size window (expand/shrink)
Window grows until condition is violated, then shrinks from the left.
Used when: longest substring without repeating characters, minimum window substring.

### At-most-k trick
For "exactly k" problems: answer = atMost(k) - atMost(k-1).
Used when: subarrays with exactly k distinct integers.

## Hint progression
**Level 1 (Brute force):**
Try every possible subarray with nested loops — outer loop for start, inner loop for end. Compute the required value for each. Time: O(n²) or O(n³) if inner computation is O(n).

**Level 2 (Spot the inefficiency):**
Notice you are recomputing the same elements for overlapping subarrays. When you slide one step to the right, most of the window is identical to the previous step. Can you maintain a running value and just update the edges?

**Level 3 (Fixed window insight):**
For fixed size k: maintain a running sum. When window reaches size k, record result. Then subtract the leftmost element and add the new right element as you slide. O(n) total.

**Level 4 (Variable window insight):**
For variable size: expand the right pointer freely. When the window violates the condition, move the left pointer right until the condition is restored. Track the best valid window seen so far. Each element is added and removed at most once — O(n).

## Common mistakes students make
- Forgetting to shrink the window when the condition is violated (left pointer never moves)
- Shrinking the window too aggressively (moving left pointer past where it should stop)
- Off-by-one in window length: length = right - left + 1, not right - left
- Not updating the answer at the right moment (before or after shrinking)
- For substring problems, not properly handling the character frequency map when shrinking
- Confusing "at most k" with "exactly k" — they need different approaches

## Data structures inside the window
- **Running sum**: for numeric subarray problems
- **Hash map / frequency counter**: for character/element frequency constraints
- **Deque (monotonic)**: for sliding window maximum/minimum
- **Set**: for uniqueness constraints (though hash map is usually more flexible)

## Trigger problems (sorted by difficulty)
- Maximum Average Subarray I (Easy) — fixed window, classic intro
- Best Time to Buy and Sell Stock (Easy) — sliding window on prices
- Longest Substring Without Repeating Characters (Medium) — variable window with set
- Longest Repeating Character Replacement (Medium) — variable window with frequency map
- Minimum Window Substring (Hard) — variable window, track two frequency maps
- Sliding Window Maximum (Hard) — fixed window with monotonic deque
- Subarrays with K Different Integers (Hard) — at-most-k trick

## Key questions to ask yourself
1. Does the problem involve a contiguous sequence?
2. Is there a brute force with nested loops over subarrays?
3. Is the window size fixed or do I need to find the optimal size?
4. What is my "condition" — what makes a window valid or invalid?
5. What information do I need to maintain inside the window efficiently?