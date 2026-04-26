# HashMap / Frequency Counter Pattern

## What it is
A technique that uses a hash map (dictionary) to store and look up information in O(1) average time, eliminating the need for nested loops. The hash map trades space for time — by remembering what you've seen, you avoid searching through the array again. One of the most universally applicable patterns.

## When to use
- Need to count occurrences of elements
- Need to check if you've seen something before in O(1)
- Need to find pairs/groups that satisfy a condition (complement lookup)
- Need to group elements by a key
- Brute force uses nested loops to search for matches
- Keywords: "two sum", "duplicates", "frequency", "anagram", "group", "count", "occurrence", "complement"

## Variants

### Complement lookup (Two Sum style)
For each element x, check if the complement (target - x) is already in the map.
Store elements as you process them — don't pre-populate.

### Frequency counting
Count occurrences of each element. Then process the frequency map.
Used when: finding majority element, valid anagram, top k frequent.

### Grouping by key
Map a computed key to a list of elements that share that property.
Used when: group anagrams (key = sorted string), isomorphic strings, pattern matching.

### Prefix sum + hash map
Store prefix sums as keys mapped to their earliest index.
Used when: subarray sum equals k, longest subarray with sum k.

## Hint progression
**Level 1 (Brute force):**
Use nested loops. For each element, scan the rest of the array looking for a match. O(n²) time.

**Level 2 (Spot the redundant search):**
Notice you're searching through the array for a specific value. Searching is O(n) but it could be O(1) if you had the right data structure. What if you stored elements somewhere that lets you check "have I seen X?" instantly?

**Level 3 (Hash map for O(1) lookup):**
Use a hash map. For each element, compute what you're looking for (complement, pair, match). Check the map — if found, you have your answer. If not found, store the current element in the map. Single pass, O(n) time, O(n) space.

**Level 4 (What to store as key vs value):**
The key insight is *what* to put in the map. Common choices:
- Value → index (Two Sum: find index of complement)
- Value → count (frequency: how many times seen)
- Canonical form → list of originals (anagram grouping: sorted word → words)
- Prefix sum → earliest index (subarray sum: find where to start)

## Common use cases and their map structures

| Problem Type | Key | Value |
|---|---|---|
| Two Sum | element value | its index |
| Count frequencies | element | count |
| Group anagrams | sorted string | list of anagrams |
| Subarray sum = k | prefix sum | earliest index with that sum |
| Find duplicate | element | boolean seen |
| Majority element | element | count |
| Valid anagram | character | count difference |

## Common mistakes students make
- For Two Sum: checking if the element itself is in the map before inserting (handles the case where you'd use the same element twice)
- Updating the map before or after the check in the wrong order — for complement lookup, check first then insert
- For prefix sum approach: forgetting to initialize map with {0: -1} or {0: 0} for the empty prefix
- Using a list instead of a set for O(1) "seen" lookups (list membership is O(n))
- Not handling collisions in custom key generation (e.g., for grouping, "11,2" and "1,12" could collide if you join with comma poorly)

## Prefix sum + hash map pattern (important)
For "subarray with sum = k":
```
prefix_sum = 0
map = {0: 1}   # empty subarray has sum 0, seen once (or index -1 for earliest)
for each num:
    prefix_sum += num
    if (prefix_sum - k) in map:
        answer += map[prefix_sum - k]   # or: found answer
    map[prefix_sum] = map.get(prefix_sum, 0) + 1
```
Key insight: if prefix[j] - prefix[i] = k, then subarray [i+1..j] has sum k. So look for prefix[j] - k in the map.

## Trigger problems (sorted by difficulty)
- Two Sum (Easy) — complement lookup, the classic intro
- Valid Anagram (Easy) — frequency counting
- Contains Duplicate (Easy) — seen lookup
- Ransom Note (Easy) — frequency comparison
- Group Anagrams (Medium) — grouping by canonical key
- Top K Frequent Elements (Medium) — frequency + heap or bucket sort
- Subarray Sum Equals K (Medium) — prefix sum + hash map
- Longest Consecutive Sequence (Medium) — set membership lookup
- 4Sum II (Medium) — two-pass complement lookup on pairs
- Minimum Window Substring (Hard) — sliding window + frequency map

## Key questions to ask yourself
1. Am I searching through an array inside a loop? (Signal for hash map)
2. What am I looking for at each step — a complement, a match, a count?
3. What should be the key and what should be the value in my map?
4. Should I insert first or check first? (Depends on whether using same element is allowed)
5. Can I use a fixed-size array instead of a hash map? (If keys are bounded, e.g., 26 letters or 256 ASCII chars — array is faster)