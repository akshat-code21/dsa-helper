# Heap / Priority Queue Pattern

## What it is
A heap is a complete binary tree that maintains the heap property: the parent is always smaller (min-heap) or larger (max-heap) than its children. It supports O(log n) insertion and O(log n) deletion of the top element, while giving O(1) access to the minimum (min-heap) or maximum (max-heap). A priority queue is the abstract data structure backed by a heap.

## When to use
- Need to repeatedly find and remove the minimum or maximum element
- Need to maintain a sorted order as new elements arrive dynamically
- Finding the kth largest or smallest element
- Merging k sorted lists
- Task scheduling with priorities
- Problems where you process elements in order of some priority, not their input order
- Keywords: "kth largest", "kth smallest", "top k", "median", "merge k sorted", "task scheduler"

## Variants

### Min-heap
Top element is always the minimum. In Python: `heapq` (default). In Java: `PriorityQueue` (default).
Used for: Dijkstra's algorithm, merge k sorted lists, find kth largest (keep k elements, top is kth largest).

### Max-heap
Top element is always the maximum. In Python: negate values (`-x`) to simulate with `heapq`. In Java: `PriorityQueue(Collections.reverseOrder())`.
Used for: find kth smallest (keep k elements, top is kth smallest), greedy problems maximizing priority.

### Fixed-size heap (size k)
Maintain a heap of exactly k elements. When a new element arrives, push it and then pop if size exceeds k. Efficient for "top k" problems — O(n log k) instead of O(n log n) sort.

### Two heaps (median finding)
Maintain a max-heap for the lower half and a min-heap for the upper half. Balance sizes to keep median accessible in O(1).

## Hint progression
**Level 1 (Brute force):**
Sort the entire array and pick the kth element. For streaming data, re-sort every time. O(n log n) per query.

**Level 2 (Spot repeated sorting):**
Notice you're sorting or scanning the entire array to find the extreme element. You don't need the full sorted order — you only need the top k elements or the current minimum/maximum. Is there a data structure that gives you the min/max cheaply without full sorting?

**Level 3 (Fixed-size heap for top k):**
To find kth largest: maintain a min-heap of size k. For each element: push to heap, if heap size > k, pop the minimum. After processing all elements, the heap contains the k largest elements and the top (minimum of heap) is the kth largest. O(n log k).

**Level 4 (Two heaps for median, heap for scheduling):**
For median of data stream: keep lower half in max-heap, upper half in min-heap. After each insertion, rebalance so sizes differ by at most 1. Median is either the top of the larger heap or the average of both tops.
For scheduling: use a max-heap keyed on frequency or priority. Greedily pick the highest priority task at each step.

## Heap vs sorting
| Need | Use |
|---|---|
| kth element (static data) | Sort: O(n log n), simpler |
| kth element (streaming data) | Heap: O(n log k) |
| Top k elements | Heap: O(n log k) vs Sort: O(n log n) |
| Repeated min/max queries | Heap: O(log n) per operation |
| One-time min/max | Linear scan: O(n) |

## Common patterns

**Kth largest element:**
```python
import heapq
heap = []
for num in nums:
    heapq.heappush(heap, num)
    if len(heap) > k:
        heapq.heappop(heap)
return heap[0]   # smallest of the k largest = kth largest
```

**Merge k sorted lists:**
```python
heap = [(lists[i].val, i, lists[i]) for i in range(k) if lists[i]]
heapq.heapify(heap)
while heap:
    val, i, node = heapq.heappop(heap)
    # add val to result
    if node.next:
        heapq.heappush(heap, (node.next.val, i, node.next))
```

**Two heaps for median:**
```python
small = []   # max-heap (negate values)
large = []   # min-heap
# invariant: len(small) >= len(large), both balanced

def add(num):
    heapq.heappush(small, -num)
    if small and large and (-small[0] > large[0]):
        heapq.heappush(large, -heapq.heappop(small))
    if len(small) > len(large) + 1:
        heapq.heappush(large, -heapq.heappop(small))
    if len(large) > len(small):
        heapq.heappush(small, -heapq.heappop(large))
```

## Common mistakes students make
- Using Python's `heapq` as a max-heap without negating — `heapq` is always a min-heap
- Pushing tuples to handle tie-breaking: if elements are equal, heap compares second element of tuple — ensure it's comparable
- For kth largest: confusing min-heap of size k (gives kth largest) vs max-heap of size k (gives kth smallest)
- Not realizing that `heapq.heappop` is O(log n) and scanning the heap array is O(n) — don't use `heap[0]` as "peeking" when you meant to pop
- For "find k closest points": forgetting to use a key in the heap tuple (distance, point) to sort by distance
- In two-heap median: not maintaining the size invariant after each insertion

## Trigger problems (sorted by difficulty)
- Kth Largest Element in a Stream (Easy) — fixed-size heap intro
- Last Stone Weight (Easy) — max-heap simulation
- Kth Largest Element in an Array (Medium) — quickselect or heap
- Top K Frequent Elements (Medium) — frequency heap
- K Closest Points to Origin (Medium) — distance heap
- Find Median from Data Stream (Hard) — two heaps
- Merge K Sorted Lists (Hard) — heap for merging
- Task Scheduler (Medium) — max-heap greedy
- Reorganize String (Medium) — max-heap greedy
- Sliding Window Median (Hard) — two heaps + lazy deletion

## Key questions to ask yourself
1. Do I need repeated access to the minimum or maximum as data changes?
2. Am I looking for the kth element or top k elements?
3. Should I use a min-heap or max-heap? (Kth largest → min-heap of size k)
4. Is the data static (sort works) or streaming (heap needed)?
5. Do I need both the median (two heaps) or just the extreme?