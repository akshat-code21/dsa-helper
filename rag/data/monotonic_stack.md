# Monotonic Stack Pattern

## What it is
A stack that maintains elements in either strictly increasing or strictly decreasing order. When a new element violates the order, elements are popped from the stack until the order is restored. This lets you find the nearest greater or smaller element for every position in a single O(n) pass — something that would take O(n²) with brute force nested loops.

## When to use
- Finding the next greater/smaller element for each element in an array
- Finding the previous greater/smaller element
- Problems involving "what is the first X to the left/right"
- Computing spans, areas, or ranges based on surrounding elements
- Keywords: "next greater", "previous smaller", "largest rectangle", "daily temperatures", "stock span", "visible people"

## Variants

### Monotonic decreasing stack
Stack holds elements in decreasing order (top is smallest).
When current element is greater than top: pop (current element is the "next greater" for the popped element).
Used for: next greater element, daily temperatures.

### Monotonic increasing stack
Stack holds elements in increasing order (top is largest).
When current element is smaller than top: pop (current element is the "next smaller" for the popped element).
Used for: next smaller element, largest rectangle in histogram (where we pop when we find a shorter bar).

### Stack of indices vs values
Store indices in the stack, not values. This lets you compute spans/distances and access original values via array lookup.

## Core insight
A monotonic stack processes each element exactly twice — once when pushed, once when popped. This is why it's O(n) despite looking like it could be O(n²). Each element is the "answer" for all elements that get popped because of it.

## Hint progression
**Level 1 (Brute force):**
For each element, scan left or right through the array to find the first element that satisfies your condition. O(n²) time.

**Level 2 (Spot what you're repeatedly doing):**
Notice that for each element you scan in one direction looking for the first greater/smaller. You're doing linear scans inside a loop. Can you process this in a single left-to-right pass somehow?

**Level 3 (Monotonic stack insight):**
Process left to right. Maintain a stack of elements (or indices) that haven't found their "answer" yet. When you see a new element that satisfies the condition for elements in the stack, pop them and record their answer. Elements that stay in the stack at the end have no answer (use -1 or 0).

**Level 4 (Direction and type of stack):**
Decide: are you looking for next greater or next smaller? From the left or right?
- Next greater element → decreasing stack, process left to right
- Next smaller element → increasing stack, process left to right
- Previous greater element → decreasing stack, process right to left (or use left-to-right with indices)
For "largest rectangle" style: pop when current is smaller, compute area with popped as the limiting height.

## Monotonic stack template (next greater element)
```
stack = []   # stores indices
result = [-1] * len(nums)

for i in range(len(nums)):
    while stack and nums[i] > nums[stack[-1]]:
        idx = stack.pop()
        result[idx] = nums[i]   # nums[i] is the next greater for nums[idx]
    stack.append(i)

# elements remaining in stack have no next greater → result[idx] stays -1
```

## Largest rectangle in histogram approach
```
stack = []   # indices, increasing order of heights
max_area = 0

for i in range(len(heights) + 1):
    curr_height = heights[i] if i < len(heights) else 0
    while stack and curr_height < heights[stack[-1]]:
        h = heights[stack.pop()]
        w = i if not stack else i - stack[-1] - 1
        max_area = max(max_area, h * w)
    stack.append(i)
```

## Common mistakes students make
- Choosing the wrong type of stack (decreasing vs increasing) — think carefully about what "violates the order" triggers
- Storing values instead of indices — you lose the ability to compute spans and distances
- Forgetting to process remaining elements in the stack after the main loop (they have no next greater → assign default value)
- Off-by-one in width calculation for histogram problems: width = right_index - left_index - 1
- Not appending a sentinel value (0 or -infinity) at the end to force-pop all remaining stack elements in histogram-style problems
- Confusing "next greater or equal" vs "strictly next greater" — the `>` vs `>=` in the while condition matters

## Trigger problems (sorted by difficulty)
- Daily Temperatures (Medium) — next greater index, classic intro
- Next Greater Element I (Easy) — next greater value
- Next Greater Element II (Medium) — circular array variant
- Online Stock Span (Medium) — previous greater, count span
- Largest Rectangle in Histogram (Hard) — area computation with stack
- Maximal Rectangle (Hard) — histogram problem on 2D matrix
- Trapping Rain Water (Hard) — can use two-pointer or monotonic stack
- Remove K Digits (Medium) — monotonic stack for lexicographic minimum
- 132 Pattern (Medium) — monotonic stack with creative state tracking

## Key questions to ask yourself
1. Am I looking for the first greater or smaller element to the left or right?
2. Should my stack be increasing or decreasing? (Think: what condition causes a pop?)
3. Should I store values or indices? (If you need position/distance → indices)
4. What is the "answer" for an element when it gets popped?
5. What happens to elements still in the stack at the end of the array?