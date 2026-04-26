# Two Pointers Pattern

## What it is
A technique where two indices (pointers) move through a data structure — usually an array or string — to solve a problem more efficiently than using nested loops. The pointers can move toward each other (opposite ends), in the same direction (fast/slow), or one chasing the other.

## When to use
- Array or string is sorted (or can be sorted without affecting the answer)
- Finding a pair, triplet, or subarray that satisfies a condition
- Removing duplicates in-place
- Detecting cycles in a linked list
- Checking if a string is a palindrome
- Keywords in problem: "pair", "two elements", "sorted array", "in-place", "without extra space"

## Variants

### Opposite ends (converging pointers)
Both pointers start at opposite ends and move toward each other.
Used when: sorted array, finding pairs with a target sum, checking palindrome.

### Same direction (fast/slow pointers)
One pointer moves faster than the other.
Used when: detecting cycle, finding middle of linked list, removing nth node from end.

### Sliding (one anchored, one exploring)
One pointer expands a window, the other contracts it.
Used when: longest substring, minimum window — overlaps with sliding window pattern.

## Hint progression
**Level 1 (Brute force):**
Try every possible pair using nested loops. Check if the pair satisfies the condition. Time: O(n²), Space: O(1).

**Level 2 (Spot the inefficiency):**
Notice that when the array is sorted, you have information you are not using. If your current sum is too large, you don't need to try all smaller right elements — you can eliminate them instantly.

**Level 3 (Apply the insight):**
Place one pointer at the start, one at the end. If their sum equals target, you found it. If sum is too small, move left pointer right (need larger value). If sum is too large, move right pointer left (need smaller value).

**Level 4 (Optimal):**
Single pass O(n). Each pointer moves at most n times total. The key insight is that a sorted array lets each comparison eliminate an entire half of remaining possibilities.

## Common mistakes students make
- Forgetting the array needs to be sorted first (or checking if it already is)
- Off-by-one errors when pointers cross — use `left < right` not `left <= right` for pairs
- In fast/slow pointer problems, not handling the case where the list has 0 or 1 nodes
- Moving both pointers when only one should move
- For triplet problems (3Sum), forgetting to skip duplicate values after finding a valid triplet

## Recognizing it vs sliding window
Two pointers (converging): you know the constraint and search for elements that meet it
Sliding window: you maintain a window and expand/shrink based on a running condition

## Trigger problems (sorted by difficulty)
- Valid Palindrome (Easy) — same direction variant
- Two Sum II - Input Array is Sorted (Medium) — classic opposite ends
- 3Sum (Medium) — two pointers inside a loop
- Container With Most Water (Medium) — opposite ends, maximize area
- Trapping Rain Water (Hard) — two pointers with running max tracking
- Linked List Cycle (Easy) — fast/slow pointer variant
- Find the Duplicate Number (Medium) — fast/slow on array treated as linked list

## Key questions to ask yourself
1. Is the array sorted? If yes, two pointers is likely applicable.
2. Am I looking for a pair/triplet with a specific sum or condition?
3. Can I eliminate a large chunk of possibilities with each step?
4. Do I need O(1) extra space (rules out hash map approach)?