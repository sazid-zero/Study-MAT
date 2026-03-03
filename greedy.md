---
layout: docs
title: Greedy Algorithms
permalink: /greedy/
---

[⬅️ Back to Home]({{ '/' | relative_url }})

---
{% raw %}
# Greedy Algorithms — Complete Problem Set

A **greedy algorithm** makes the locally optimal choice at each step, hoping to reach the globally optimal solution. It never reconsiders past decisions. The key skill in exams is **recognizing when greedy is safe** (provably optimal) vs when it fails and DP is needed.

**Greedy works when:**
- A **greedy choice property** exists: a locally optimal choice is part of some globally optimal solution.
- The problem has **optimal substructure**: the optimal solution contains optimal solutions to subproblems.

---


## Table of Contents

### Interval Scheduling
1. [Activity Selection — Maximize Non-Overlapping Activities](#1-activity-selection--maximize-non-overlapping-activities)
2. [Minimum Meeting Rooms (Minimum Platforms)](#2-minimum-meeting-rooms-minimum-platforms)
3. [Non-Overlapping Intervals — Minimum Removals](#3-non-overlapping-intervals--minimum-removals)
4. [Minimum Arrows to Burst Balloons](#4-minimum-arrows-to-burst-balloons)

### Coins and Change
5. [Minimum Coins — Greedy (Canonical Systems)](#5-minimum-coins--greedy-canonical-systems)
6. [Fractional Knapsack](#6-fractional-knapsack)
7. [Greedy vs DP — When Greedy Fails for Coins](#7-greedy-vs-dp--when-greedy-fails-for-coins)
8. [Lemonade Change](#8-lemonade-change)

### Huffman Coding
9. [Huffman Encoding — Build the Tree](#9-huffman-encoding--build-the-tree)
10. [Huffman — Encode a String and Compute Compressed Length](#10-huffman--encode-a-string-and-compute-compressed-length)

### Job Sequencing
11. [Job Sequencing with Deadlines — Maximize Profit](#11-job-sequencing-with-deadlines--maximize-profit)
12. [Task Scheduler — Minimum CPU Time with Cooldown](#12-task-scheduler--minimum-cpu-time-with-cooldown)
13. [Earliest Deadline First](#13-earliest-deadline-first)

### Classic Greedy Problems
14. [Jump Game I — Can You Reach the End?](#14-jump-game-i--can-you-reach-the-end)
15. [Jump Game II — Minimum Jumps to Reach End](#15-jump-game-ii--minimum-jumps-to-reach-end)
16. [Gas Station — Complete Circular Route](#16-gas-station--complete-circular-route)
17. [Assign Cookies](#17-assign-cookies)
18. [Boats to Save People](#18-boats-to-save-people)
19. [Partition Labels](#19-partition-labels)
20. [Two City Scheduling](#20-two-city-scheduling)

---

## 1. Activity Selection — Maximize Non-Overlapping Activities

### Problem

Given `n` activities with start and end times, select the **maximum number of non-overlapping activities** that one person can perform.

**Example:**
```
Activities: [(1,3), (2,5), (3,9), (6,8)]
Output: 3   →  activities (1,3), (3,9) is wrong — use (1,3), (6,8) = 2... 
Actually:   select (1,3), (3,9) overlaps at 3.
            select (1,3), (6,8) = 2 activities
            select (2,5), (6,8) = 2 activities
            Optimal: [(1,3), (6,8)] or [(1,3), (3,9)] depending on whether endpoints are inclusive
            With exclusive end: (1,3),(3,9) do NOT overlap → answer is 3: (1,3),(3,9) no, 3==3
            Standard: end of one can equal start of next → select (1,3),(3,9) nope 3>3 false
            Let's use: [(1,2),(3,4),(0,6),(5,7),(8,9),(5,9)]
Output: 4   →  (1,2),(3,4),(5,7),(8,9)
```

### Approach — Greedy by Earliest Finish Time

**Sort by finish time**. Always pick the activity that **finishes earliest** among those that start after the last selected activity ends. This leaves the most room for future activities.

**Why greedy works:** Choosing the earliest finishing activity never prevents more activities than any other choice — it frees up the timeline sooner.

**Time:** O(n log n) for sorting + O(n) scan | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int activitySelection(vector<pair<int,int>>& activities) {
    // Sort by finish time (end of interval)
    sort(activities.begin(), activities.end(), [](const pair<int,int>& a, const pair<int,int>& b) {
        return a.second < b.second;
    });

    int count = 1;                          // always select first activity
    int lastEnd = activities[0].second;     // end time of last selected activity

    for (int i = 1; i < (int)activities.size(); i++) {
        if (activities[i].first >= lastEnd) {  // starts at or after last ended
            count++;
            lastEnd = activities[i].second;
        }
    }
    return count;
}

int main() {
    vector<pair<int,int>> acts = {{1,2},{3,4},{0,6},{5,7},{8,9},{5,9}};
    cout << "Max activities: " << activitySelection(acts) << endl;  // Output: 4

    // Print selected activities
    sort(acts.begin(), acts.end(), [](auto& a, auto& b){ return a.second < b.second; });
    int lastEnd = acts[0].second;
    cout << "Selected: (" << acts[0].first << "," << acts[0].second << ") ";
    for (int i = 1; i < (int)acts.size(); i++) {
        if (acts[i].first >= lastEnd) {
            cout << "(" << acts[i].first << "," << acts[i].second << ") ";
            lastEnd = acts[i].second;
        }
    }
    cout << endl;
}
```

> **Exam note:** Sort by **finish time** (not start time, not duration). This is the classic greedy choice and is often the answer the question is testing.

---

## 2. Minimum Meeting Rooms (Minimum Platforms)

### Problem

Given a list of meeting intervals, find the **minimum number of rooms** required to hold all meetings simultaneously. (The train station equivalent: minimum platforms needed.)

**Example:**
```
Input:  meetings = [[0,30],[5,10],[15,20]]
Output: 2   (meetings [0,30] and [5,10] overlap; then [0,30] and [15,20] overlap)

Input:  arrivals   = [900, 940, 950, 1100, 1500, 1800]
        departures = [910, 1200, 1120, 1130, 1900, 2000]
Output: 3
```

### Approach

Separate start and end times, sort both. Use two pointers. Think of it as tracking how many meetings are "active" at any moment:
- When the next event is a start → increment active rooms.
- When the next event is an end → decrement active rooms.
Track the peak active count.

**Time:** O(n log n) | **Space:** O(n)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int minMeetingRooms(vector<vector<int>>& intervals) {
    int n = intervals.size();
    vector<int> starts, ends;
    for (auto& iv : intervals) {
        starts.push_back(iv[0]);
        ends.push_back(iv[1]);
    }
    sort(starts.begin(), starts.end());
    sort(ends.begin(), ends.end());

    int rooms = 0, maxRooms = 0;
    int i = 0, j = 0;

    while (i < n) {
        if (starts[i] < ends[j]) {
            rooms++;              // a new meeting starts before any ends
            i++;
        } else {
            rooms--;              // a meeting has ended, free a room
            j++;
        }
        maxRooms = max(maxRooms, rooms);
    }
    return maxRooms;
}

int main() {
    vector<vector<int>> iv1 = {{0,30},{5,10},{15,20}};
    cout << minMeetingRooms(iv1) << endl;  // Output: 2

    vector<vector<int>> iv2 = {{2,15},{36,45},{9,29},{16,23},{4,9}};
    cout << minMeetingRooms(iv2) << endl;  // Output: 2
}
```

---

## 3. Non-Overlapping Intervals — Minimum Removals

### Problem

Given a list of intervals, find the **minimum number of intervals to remove** so that the rest are non-overlapping.

**Example:**
```
Input:  intervals = [[1,2],[2,3],[3,4],[1,3]]
Output: 1   (remove [1,3] and the rest [1,2],[2,3],[3,4] are non-overlapping)

Input:  intervals = [[1,2],[1,2],[1,2]]
Output: 2
```

### Approach

Sort by end time. Greedily keep as many non-overlapping intervals as possible (Activity Selection). The answer is `total - kept`.

**Time:** O(n log n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b) {
        return a[1] < b[1];  // sort by end time
    });

    int kept = 1, lastEnd = intervals[0][1];

    for (int i = 1; i < (int)intervals.size(); i++) {
        if (intervals[i][0] >= lastEnd) {  // no overlap — keep it
            kept++;
            lastEnd = intervals[i][1];
        }
        // else: overlap — skip (this is the "remove" action)
    }
    return intervals.size() - kept;  // total - kept = removed
}

int main() {
    vector<vector<int>> iv1 = {{1,2},{2,3},{3,4},{1,3}};
    cout << eraseOverlapIntervals(iv1) << endl;  // Output: 1

    vector<vector<int>> iv2 = {{1,2},{1,2},{1,2}};
    cout << eraseOverlapIntervals(iv2) << endl;  // Output: 2
}
```

---

## 4. Minimum Arrows to Burst Balloons

### Problem

Balloons are represented as intervals on a horizontal axis. An arrow shot at position `x` bursts all balloons `[start, end]` where `start <= x <= end`. Find the **minimum number of arrows** needed to burst all balloons.

**Example:**
```
Input:  points = [[10,16],[2,8],[1,6],[7,12]]
Output: 2   (arrow at x=6 bursts [2,8],[1,6]; arrow at x=11 bursts [10,16],[7,12])
```

### Approach

Sort by end coordinate. Fire an arrow at the end of the first balloon — this reaches as far right as possible while still bursting it. Any balloon that ends after this point needs a new arrow.

**Time:** O(n log n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int findMinArrowShots(vector<vector<int>>& points) {
    sort(points.begin(), points.end(), [](const vector<int>& a, const vector<int>& b) {
        return a[1] < b[1];  // sort by end position
    });

    int arrows = 1;
    int arrowPos = points[0][1];  // fire first arrow at end of first balloon

    for (int i = 1; i < (int)points.size(); i++) {
        if (points[i][0] > arrowPos) {  // this balloon starts after the arrow — need new arrow
            arrows++;
            arrowPos = points[i][1];
        }
        // else: current arrow already bursts this balloon
    }
    return arrows;
}

int main() {
    vector<vector<int>> p1 = {{10,16},{2,8},{1,6},{7,12}};
    cout << findMinArrowShots(p1) << endl;  // Output: 2

    vector<vector<int>> p2 = {{1,2},{3,4},{5,6},{7,8}};
    cout << findMinArrowShots(p2) << endl;  // Output: 4

    vector<vector<int>> p3 = {{1,2},{2,3},{3,4},{4,5}};
    cout << findMinArrowShots(p3) << endl;  // Output: 2
}
```

---

## 5. Minimum Coins — Greedy (Canonical Systems)

### Problem

Given coin denominations and a target amount, find the **minimum number of coins** to make that amount using greedy (works for standard currency systems like US coins).

**Example:**
```
Coins:  [1, 5, 10, 25]  (pennies, nickels, dimes, quarters)
Amount: 41
Output: 4   (25 + 10 + 5 + 1)
```

### Approach

Always pick the **largest coin that does not exceed the remaining amount**. This works for standard denominations but NOT for arbitrary ones (see problem 7).

**Time:** O(n) per denomination | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int minCoinsGreedy(vector<int> coins, int amount) {
    sort(coins.rbegin(), coins.rend());  // sort descending: largest first
    int count = 0;

    for (int coin : coins) {
        while (amount >= coin) {
            amount -= coin;
            count++;
        }
    }
    return (amount == 0) ? count : -1;  // -1 if not exactly reachable
}

int main() {
    vector<int> coins = {1, 5, 10, 25};
    cout << minCoinsGreedy(coins, 41)  << endl;  // Output: 4  (25+10+5+1)
    cout << minCoinsGreedy(coins, 30)  << endl;  // Output: 2  (25+5)
    cout << minCoinsGreedy(coins, 100) << endl;  // Output: 4  (25*4)
}
```

---

## 6. Fractional Knapsack

### Problem

Given items with weights and values, and a knapsack of capacity `W`, maximize the **total value** you can carry. You may take **fractions** of items.

**Example:**
```
Items:    [(weight=10, value=60), (weight=20, value=100), (weight=30, value=120)]
Capacity: W = 50
Output:   240.0
Strategy: Take all of item 1 (60) + all of item 2 (100) + 2/3 of item 3 (80) = 240
```

### Approach

Compute **value-per-unit-weight** (value density) for each item. Greedily take the most valuable item per unit weight first. Take it fully if it fits; otherwise take the fraction that fills remaining capacity.

**Time:** O(n log n) for sorting | **Space:** O(1)

> **Key distinction:** Greedy works for **fractional** knapsack but NOT for **0/1** knapsack (where you cannot split items — DP is required there).

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Item {
    int weight, value;
    double density() const { return (double)value / weight; }
};

double fractionalKnapsack(vector<Item>& items, int W) {
    // Sort by value density descending (most valuable per kg first)
    sort(items.begin(), items.end(), [](const Item& a, const Item& b) {
        return a.density() > b.density();
    });

    double totalValue = 0.0;
    int remaining = W;

    for (auto& item : items) {
        if (remaining <= 0) break;

        if (item.weight <= remaining) {
            // Take the whole item
            totalValue += item.value;
            remaining  -= item.weight;
        } else {
            // Take a fraction of the item
            totalValue += item.density() * remaining;
            remaining   = 0;
        }
    }
    return totalValue;
}

int main() {
    vector<Item> items = {{10, 60}, {20, 100}, {30, 120}};
    cout << "Max value: " << fractionalKnapsack(items, 50) << endl;  // Output: 240

    vector<Item> items2 = {{2, 10}, {3, 5}, {5, 15}, {7, 7}, {1, 6}, {4, 18}, {1, 3}};
    cout << "Max value: " << fractionalKnapsack(items2, 15) << endl; // Output: 51.43...
}
```

---

## 7. Greedy vs DP — When Greedy Fails for Coins

### Problem

Given coins `[1, 3, 4]` and amount `6`, greedy picks `4+1+1 = 3 coins`, but optimal is `3+3 = 2 coins`. This demonstrates that greedy fails for arbitrary denomination sets.

**This is a critical exam concept.** Know when to use greedy vs DP.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

// GREEDY — fails for arbitrary coins
int coinGreedy(vector<int> coins, int amount) {
    sort(coins.rbegin(), coins.rend());
    int count = 0;
    for (int c : coins) { while (amount >= c) { amount -= c; count++; } }
    return (amount == 0) ? count : -1;
}

// DP — always correct
int coinDP(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++)
        for (int c : coins)
            if (c <= i && dp[i - c] != INT_MAX)
                dp[i] = min(dp[i], dp[i - c] + 1);
    return (dp[amount] == INT_MAX) ? -1 : dp[amount];
}

int main() {
    vector<int> coins = {1, 3, 4};
    int amount = 6;

    cout << "Greedy: " << coinGreedy(coins, amount) << endl;  // Output: 3 (WRONG — 4+1+1)
    cout << "DP:     " << coinDP(coins, amount)     << endl;  // Output: 2 (CORRECT — 3+3)
}
```

### When Does Greedy Work for Coins?

Greedy works when denominations form a **canonical coin system** — every denomination is a multiple of the previous one, OR the system satisfies specific divisibility properties (e.g., `{1, 5, 10, 25}` but NOT `{1, 3, 4}`).

| Coin Set | Greedy Correct? | Why |
|---|---|---|
| `{1, 5, 10, 25}` | ✅ Yes | Standard US coins |
| `{1, 2, 5, 10}` | ✅ Yes | Standard metric coins |
| `{1, 3, 4}` | ❌ No | `6 = 3+3` but greedy picks `4+1+1` |
| `{1, 6, 9}` | ❌ No | `11 = 6+5?` no 5 exists — greedy picks `9+1+1` but `6+5` fails; optimal `9+1+1=3`... actually for {1,6,9}, amount=11: greedy = 9+1+1 = 3, dp = 9+1+1 = 3. Try amount=12: greedy = 9+1+1+1=4, dp=6+6=2 |

---

## 8. Lemonade Change

### Problem

Customers pay for a $5 lemonade with $5, $10, or $20 bills. You start with no change. Determine if you can **give correct change to every customer**.

**Example:**
```
Input:  bills = [5, 5, 5, 10, 20]
Output: true

Input:  bills = [5, 5, 10, 10, 20]
Output: false
```

### Approach

Track counts of `$5` and `$10` bills (you never need to give back twenties). When a $10 comes in, use one $5 as change. When a $20 comes in, ideally use one $10 + one $5 (greedy: save your $5s); if no $10, use three $5s.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

bool lemonadeChange(vector<int>& bills) {
    int five = 0, ten = 0;

    for (int bill : bills) {
        if (bill == 5) {
            five++;
        } else if (bill == 10) {
            if (five == 0) return false;
            five--; ten++;
        } else {  // bill == 20
            // Prefer giving $10 + $5 (saves $5s for future use)
            if (ten > 0 && five > 0) { ten--; five--; }
            else if (five >= 3)      { five -= 3; }
            else return false;
        }
    }
    return true;
}

int main() {
    vector<int> b1 = {5, 5, 5, 10, 20};
    cout << lemonadeChange(b1) << endl;  // Output: 1 (true)

    vector<int> b2 = {5, 5, 10, 10, 20};
    cout << lemonadeChange(b2) << endl;  // Output: 0 (false)
}
```

---

## 9. Huffman Encoding — Build the Tree

### Problem

Given characters and their frequencies, build a **Huffman Tree** that assigns shorter binary codes to more frequent characters, minimizing the total encoded length.

**Example:**
```
Characters: a(5), b(9), c(12), d(13), e(16), f(45)
Huffman codes: f=0, c=100, d=101, a=1100, b=1101, e=111
Total bits = 5*4 + 9*4 + 12*3 + 13*3 + 16*3 + 45*1 = 224  (vs 3*100=300 for fixed 3-bit)
```

### Approach — Greedy with Min-Heap

1. Create a leaf node for each character and push into a **min-heap** (keyed by frequency).
2. Repeatedly extract the two nodes with the **lowest frequency**, merge them into a new internal node (frequency = sum), push back into the heap.
3. Repeat until one node remains — that's the root.

**Greedy choice:** Merging the two least-frequent nodes minimizes the total weighted path length.

**Time:** O(n log n) | **Space:** O(n)

### Solution

```cpp
#include <iostream>
#include <queue>
#include <string>
#include <unordered_map>
using namespace std;

struct HuffNode {
    char ch;
    int freq;
    HuffNode *left, *right;
    HuffNode(char c, int f) : ch(c), freq(f), left(nullptr), right(nullptr) {}
    HuffNode(int f, HuffNode* l, HuffNode* r) : ch('\0'), freq(f), left(l), right(r) {}
};

// Min-heap comparator
struct Compare {
    bool operator()(HuffNode* a, HuffNode* b) { return a->freq > b->freq; }
};

HuffNode* buildHuffmanTree(unordered_map<char, int>& freq) {
    priority_queue<HuffNode*, vector<HuffNode*>, Compare> minHeap;

    // Create leaf nodes
    for (auto& [ch, f] : freq)
        minHeap.push(new HuffNode(ch, f));

    // Build tree bottom-up
    while (minHeap.size() > 1) {
        HuffNode* left  = minHeap.top(); minHeap.pop();
        HuffNode* right = minHeap.top(); minHeap.pop();
        minHeap.push(new HuffNode(left->freq + right->freq, left, right));
    }
    return minHeap.top();  // root
}

// Generate codes by traversing the tree
void generateCodes(HuffNode* node, string code, unordered_map<char, string>& codes) {
    if (!node) return;
    if (!node->left && !node->right)  {  // leaf node
        codes[node->ch] = code.empty() ? "0" : code;  // edge case: single char
        return;
    }
    generateCodes(node->left,  code + "0", codes);
    generateCodes(node->right, code + "1", codes);
}

int main() {
    unordered_map<char, int> freq = {
        {'a',5}, {'b',9}, {'c',12}, {'d',13}, {'e',16}, {'f',45}
    };

    HuffNode* root = buildHuffmanTree(freq);

    unordered_map<char, string> codes;
    generateCodes(root, "", codes);

    cout << "Huffman Codes:\n";
    for (auto& [ch, code] : codes)
        cout << "  " << ch << " (freq=" << freq[ch] << "): " << code << "\n";

    // Compute total bits
    int totalBits = 0;
    for (auto& [ch, code] : codes)
        totalBits += freq[ch] * code.size();
    cout << "Total bits used: " << totalBits << endl;  // Output: 224
}
```

---

## 10. Huffman — Encode a String and Compute Compressed Length

### Problem

Given a string, build its Huffman encoding and compute the compressed bit length (vs the original uncompressed length).

**Example:**
```
Input:  s = "aabbccddeefffff"
Output:
  Original : 15 chars × 8 bits = 120 bits (ASCII)
  Compressed:  ~39 bits
  Compression ratio: ~67%
```

### Solution

```cpp
#include <iostream>
#include <queue>
#include <string>
#include <unordered_map>
using namespace std;

struct HuffNode {
    char ch; int freq;
    HuffNode *left, *right;
    HuffNode(char c, int f) : ch(c), freq(f), left(nullptr), right(nullptr) {}
    HuffNode(int f, HuffNode* l, HuffNode* r) : ch('\0'), freq(f), left(l), right(r) {}
};
struct Cmp { bool operator()(HuffNode* a, HuffNode* b) { return a->freq > b->freq; } };

void genCodes(HuffNode* n, string code, unordered_map<char,string>& codes) {
    if (!n) return;
    if (!n->left && !n->right) { codes[n->ch] = code.empty() ? "0" : code; return; }
    genCodes(n->left,  code+"0", codes);
    genCodes(n->right, code+"1", codes);
}

void huffmanStats(const string& s) {
    // Count frequencies
    unordered_map<char,int> freq;
    for (char c : s) freq[c]++;

    // Build min-heap
    priority_queue<HuffNode*, vector<HuffNode*>, Cmp> pq;
    for (auto& [c,f] : freq) pq.push(new HuffNode(c,f));
    while (pq.size() > 1) {
        auto l = pq.top(); pq.pop();
        auto r = pq.top(); pq.pop();
        pq.push(new HuffNode(l->freq+r->freq, l, r));
    }

    unordered_map<char,string> codes;
    genCodes(pq.top(), "", codes);

    int compressed = 0;
    for (char c : s) compressed += codes[c].size();

    cout << "String: \"" << s << "\"\n";
    cout << "Codes:\n";
    for (auto& [c,code] : codes)
        cout << "  '" << c << "' (x" << freq[c] << "): " << code << "\n";
    cout << "Original bits (ASCII): " << s.size() * 8 << "\n";
    cout << "Compressed bits:       " << compressed << "\n";
    cout << "Savings: " << (100.0 * (1.0 - (double)compressed / (s.size()*8))) << "%\n";
}

int main() {
    huffmanStats("aabbccddeefffff");
}
```

---

## 11. Job Sequencing with Deadlines — Maximize Profit

### Problem

Given `n` jobs, each with a **deadline** and a **profit** (earned only if the job is completed by its deadline), find the subset of jobs that maximizes total profit. Each job takes exactly 1 unit of time.

**Example:**
```
Jobs: [(A,2,100), (B,1,19), (C,2,27), (D,1,25), (E,3,15)]
      (job, deadline, profit)
Output: Total profit = 142  →  jobs A(100) + C(27) + E(15)
        Schedule: slot1=D or C, slot2=A, slot3=E
```

### Approach — Greedy by Profit

Sort jobs by **profit descending** (highest paying jobs first). For each job, try to schedule it in the **latest available slot ≤ deadline** (to keep earlier slots free for other jobs).

**Time:** O(n²) simple | O(n log n) with Union-Find

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Job {
    char id;
    int deadline, profit;
};

pair<int,int> jobSequencing(vector<Job>& jobs) {
    // Sort by profit descending
    sort(jobs.begin(), jobs.end(), [](const Job& a, const Job& b) {
        return a.profit > b.profit;
    });

    int maxDeadline = 0;
    for (auto& j : jobs) maxDeadline = max(maxDeadline, j.deadline);

    vector<int> slot(maxDeadline + 1, -1);  // slot[t] = job index scheduled at time t
    int totalProfit = 0, jobsDone = 0;

    for (int i = 0; i < (int)jobs.size(); i++) {
        // Find the latest free slot at or before this job's deadline
        for (int t = jobs[i].deadline; t >= 1; t--) {
            if (slot[t] == -1) {           // free slot found
                slot[t] = i;
                totalProfit += jobs[i].profit;
                jobsDone++;
                break;
            }
        }
    }

    cout << "Scheduled jobs: ";
    for (int t = 1; t <= maxDeadline; t++)
        if (slot[t] != -1) cout << jobs[slot[t]].id << " ";
    cout << endl;

    return {jobsDone, totalProfit};
}

int main() {
    vector<Job> jobs = {{'A',2,100},{'B',1,19},{'C',2,27},{'D',1,25},{'E',3,15}};
    auto [count, profit] = jobSequencing(jobs);
    cout << "Jobs done: " << count << ", Total profit: " << profit << endl;
    // Output: Jobs done: 3, Total profit: 142
}
```

---

## 12. Task Scheduler — Minimum CPU Time with Cooldown

### Problem

Given a list of CPU tasks (A-Z) and a cooldown period `n`, find the **minimum number of time units** to execute all tasks. The same task must wait at least `n` units before running again. CPU can be idle.

**Example:**
```
Input:  tasks = ['A','A','A','B','B','B'],  n = 2
Output: 8   →  A B _ A B _ A B   (or A B C A B C A B if a C existed)
              _ represents idle
```

### Approach

The minimum time is determined by the most frequent task. If task `A` appears `maxCount` times, it creates `(maxCount - 1)` gaps of size `n`. Fill gaps with other tasks or idles.

```
min_time = max(total_tasks,  (maxCount - 1) * (n + 1) + numTasksWithMaxCount)
```

**Time:** O(n) | **Space:** O(1) — only 26 distinct tasks

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int leastInterval(vector<char>& tasks, int n) {
    vector<int> freq(26, 0);
    for (char t : tasks) freq[t - 'A']++;
    sort(freq.rbegin(), freq.rend());

    int maxCount = freq[0];       // highest frequency
    int maxCountTasks = 0;        // how many tasks share this max frequency
    for (int f : freq) if (f == maxCount) maxCountTasks++;

    // Formula: either all tasks fit into the frame, or the frame is larger
    int minTime = max((int)tasks.size(),
                      (maxCount - 1) * (n + 1) + maxCountTasks);
    return minTime;
}

int main() {
    vector<char> t1 = {'A','A','A','B','B','B'};
    cout << leastInterval(t1, 2) << endl;  // Output: 8

    vector<char> t2 = {'A','A','A','B','B','B'};
    cout << leastInterval(t2, 0) << endl;  // Output: 6  (no cooldown)

    vector<char> t3 = {'A','A','A','A','B','B','B','B','C','C','C'};
    cout << leastInterval(t3, 2) << endl;  // Output: 10
}
```

---

## 13. Earliest Deadline First

### Problem

Given `n` tasks each with a **processing time** and **deadline**, schedule them to **minimize the number of missed deadlines** (or maximize tasks completed on time). All tasks must be executed, order is your choice.

**Example:**
```
Tasks: [(p=3,d=4), (p=2,d=5), (p=1,d=3)]
       (processing_time, deadline)
Sorted by deadline: [(1,d=3),(3,d=4),(2,d=5)]
Completion times:    1,       4,      6
Missed deadlines:    0,       0(4≤4), 1(6>5) → 1 missed
```

### Approach — EDF (Earliest Deadline First)

Sort by deadline ascending. Schedule tasks in this order. Compute cumulative completion times and count how many miss their deadline.

**Time:** O(n log n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Task { int procTime, deadline; };

int earliestDeadlineFirst(vector<Task>& tasks) {
    // Sort by deadline (EDF policy)
    sort(tasks.begin(), tasks.end(), [](const Task& a, const Task& b) {
        return a.deadline < b.deadline;
    });

    int currentTime = 0, missed = 0;
    for (auto& t : tasks) {
        currentTime += t.procTime;
        if (currentTime > t.deadline) {
            missed++;
            cout << "  Missed: procTime=" << t.procTime
                 << " deadline=" << t.deadline
                 << " completedAt=" << currentTime << "\n";
        }
    }
    return missed;
}

int main() {
    vector<Task> tasks = {{3,4},{2,5},{1,3}};
    int missed = earliestDeadlineFirst(tasks);
    cout << "Tasks missed: " << missed << endl;  // Output: 1
}
```

---

## 14. Jump Game I — Can You Reach the End?

### Problem

Given an array where each element represents the **maximum jump length** from that position, determine if you can reach the last index starting from index 0.

**Example:**
```
Input:  nums = [2, 3, 1, 1, 4]  →  true   (0→1→4)
Input:  nums = [3, 2, 1, 0, 4]  →  false  (always stuck at index 3)
```

### Approach

Track `maxReach` — the farthest index reachable so far. At each index `i`, if `i > maxReach`, you're stuck. Otherwise update `maxReach = max(maxReach, i + nums[i])`.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

bool canJump(vector<int>& nums) {
    int maxReach = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (i > maxReach) return false;           // can't reach index i
        maxReach = max(maxReach, i + nums[i]);    // update farthest reachable
    }
    return true;
}

int main() {
    vector<int> n1 = {2, 3, 1, 1, 4};
    cout << canJump(n1) << endl;  // Output: 1 (true)

    vector<int> n2 = {3, 2, 1, 0, 4};
    cout << canJump(n2) << endl;  // Output: 0 (false)
}
```

---

## 15. Jump Game II — Minimum Jumps to Reach End

### Problem

Same setup as Problem 14, but now find the **minimum number of jumps** needed to reach the last index (guaranteed reachable).

**Example:**
```
Input:  nums = [2, 3, 1, 1, 4]
Output: 2   (0 →[jump2]→ 1 →[jump4]→ 4)
```

### Approach

Greedy BFS-style. Track `curEnd` (end of current jump's range) and `farthest` (farthest index reachable from anything in current range). When you reach `curEnd`, you must take a jump — the next range extends to `farthest`.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

int jump(vector<int>& nums) {
    int jumps = 0, curEnd = 0, farthest = 0;

    for (int i = 0; i < (int)nums.size() - 1; i++) {
        farthest = max(farthest, i + nums[i]);  // farthest we can reach from [0..curEnd]

        if (i == curEnd) {   // we've exhausted the current jump range — must jump
            jumps++;
            curEnd = farthest;
        }
    }
    return jumps;
}

int main() {
    vector<int> n1 = {2, 3, 1, 1, 4};
    cout << jump(n1) << endl;  // Output: 2

    vector<int> n2 = {2, 3, 0, 1, 4};
    cout << jump(n2) << endl;  // Output: 2
}
```

**Visual trace for [2,3,1,1,4]:**
```
i=0: farthest=max(0, 0+2)=2. i==curEnd(0) → jump#1, curEnd=2
i=1: farthest=max(2, 1+3)=4. i!=curEnd
i=2: farthest=max(4, 2+1)=4. i==curEnd(2) → jump#2, curEnd=4
i=3: farthest=max(4, 3+1)=4. i!=curEnd
i=4: loop ends (size-1=4)
Total jumps = 2
```

---

## 16. Gas Station — Complete Circular Route

### Problem

There are `n` gas stations in a circle. `gas[i]` is the fuel available at station `i`; `cost[i]` is the fuel needed to travel from station `i` to `i+1`. Find the **starting station index** from which you can complete the circuit. Return `-1` if impossible.

**Example:**
```
Input:  gas  = [1,2,3,4,5]
        cost = [3,4,5,1,2]
Output: 3   (start at station 3: tank goes 4-1=3→3+5-2=6→6+1-3=4→4+2-4=2→2+3-5=0)
```

### Approach

1. If `sum(gas) < sum(cost)`, it's impossible — return `-1`.
2. Otherwise, there is always exactly one valid starting point. Find it: track `tank` as you go. Whenever `tank < 0`, reset the start to `i+1` and reset `tank = 0`.

**Why greedy works:** If you can't reach station `j` from station `i`, then any station between `i` and `j` also can't reach `j` (they start with less accumulated gas). So the valid start must be after `j`.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int totalTank = 0, tank = 0, start = 0;

    for (int i = 0; i < (int)gas.size(); i++) {
        int net = gas[i] - cost[i];
        totalTank += net;
        tank      += net;

        if (tank < 0) {  // can't reach next station from current start
            start = i + 1;
            tank  = 0;
        }
    }
    return (totalTank >= 0) ? start : -1;
}

int main() {
    vector<int> gas  = {1, 2, 3, 4, 5};
    vector<int> cost = {3, 4, 5, 1, 2};
    cout << canCompleteCircuit(gas, cost) << endl;  // Output: 3

    vector<int> gas2  = {2, 3, 4};
    vector<int> cost2 = {3, 4, 3};
    cout << canCompleteCircuit(gas2, cost2) << endl; // Output: -1
}
```

---

## 17. Assign Cookies

### Problem

You are a parent trying to satisfy children. Each child has a greed factor `g[i]` (minimum cookie size that satisfies them). Each cookie has size `s[j]`. Maximize the number of **satisfied children** (each child gets at most one cookie).

**Example:**
```
Input:  g = [1,2,3],  s = [1,1]
Output: 1

Input:  g = [1,2],  s = [1,2,3]
Output: 2
```

### Approach

Sort both. Use two pointers. For each cookie (smallest to largest), try to satisfy the least greedy remaining child. If the cookie is large enough, assign it and move to the next child.

**Time:** O(n log n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int findContentChildren(vector<int>& g, vector<int>& s) {
    sort(g.begin(), g.end());  // sort children by greed (ascending)
    sort(s.begin(), s.end());  // sort cookies by size (ascending)

    int child = 0, cookie = 0;
    while (child < (int)g.size() && cookie < (int)s.size()) {
        if (s[cookie] >= g[child]) {  // cookie satisfies this child
            child++;
        }
        cookie++;  // always move to next cookie
    }
    return child;  // number of satisfied children
}

int main() {
    vector<int> g1 = {1,2,3}, s1 = {1,1};
    cout << findContentChildren(g1, s1) << endl;  // Output: 1

    vector<int> g2 = {1,2}, s2 = {1,2,3};
    cout << findContentChildren(g2, s2) << endl;  // Output: 2
}
```

---

## 18. Boats to Save People

### Problem

Each boat can carry **at most 2 people** and has a weight limit of `limit`. People have weights given in an array. Find the **minimum number of boats** needed to rescue everyone.

**Example:**
```
Input:  people = [1,2],  limit = 3  →  Output: 1   (1+2=3 ≤ 3)
Input:  people = [3,2,2,1],  limit = 3  →  Output: 3   (3),(2+1),(2)
Input:  people = [3,5,3,4],  limit = 5  →  Output: 4   (5),(4),(3),(3) — all alone
```

### Approach

Sort people by weight. Use two pointers (`lightest` and `heaviest`). If they can share a boat, send them together (advance both). Otherwise, send the heaviest alone (only advance `heavy`).

**Time:** O(n log n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int numRescueBoats(vector<int>& people, int limit) {
    sort(people.begin(), people.end());
    int light = 0, heavy = people.size() - 1;
    int boats = 0;

    while (light <= heavy) {
        if (people[light] + people[heavy] <= limit) {
            light++;  // lightest person pairs with heaviest
        }
        heavy--;      // heaviest always takes a boat
        boats++;
    }
    return boats;
}

int main() {
    vector<int> p1 = {1, 2};
    cout << numRescueBoats(p1, 3) << endl;  // Output: 1

    vector<int> p2 = {3, 2, 2, 1};
    cout << numRescueBoats(p2, 3) << endl;  // Output: 3

    vector<int> p3 = {3, 5, 3, 4};
    cout << numRescueBoats(p3, 5) << endl;  // Output: 4
}
```

---

## 19. Partition Labels

### Problem

Given a string, partition it into as many parts as possible such that **each letter appears in at most one part**. Return the sizes of the parts.

**Example:**
```
Input:  s = "ababcbacadefegdehijhklij"
Output: [9, 7, 8]
Explanation: "ababcbaca" | "defegde" | "hijhklij"
             Each character only appears in one part.
```

### Approach

1. Record the **last occurrence** of each character.
2. Iterate left to right. Expand the current partition's end to include `lastOccurrence[s[i]]`. When `i == end`, the current partition is complete.

**Time:** O(n) | **Space:** O(1) — only 26 characters

### Solution

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<int> partitionLabels(string s) {
    // Step 1: Record last occurrence of each character
    int last[26] = {};
    for (int i = 0; i < (int)s.size(); i++)
        last[s[i] - 'a'] = i;

    // Step 2: Greedily partition
    vector<int> result;
    int start = 0, end = 0;

    for (int i = 0; i < (int)s.size(); i++) {
        end = max(end, last[s[i] - 'a']);  // extend partition to cover last occurrence

        if (i == end) {                    // partition boundary reached
            result.push_back(end - start + 1);
            start = end + 1;
        }
    }
    return result;
}

int main() {
    string s = "ababcbacadefegdehijhklij";
    auto res = partitionLabels(s);
    for (int x : res) cout << x << " ";
    cout << endl;  // Output: 9 7 8
}
```

---

## 20. Two City Scheduling

### Problem

A company wants to send `n` people to city A and `n` people to city B (2n people total). `costs[i] = [costA, costB]` is the cost of sending person `i` to city A or B. Minimize the **total cost**.

**Example:**
```
Input:  costs = [[10,20],[30,200],[400,50],[30,20]]
Output: 110   (person0→A=10, person1→A=30, person2→B=50, person3→B=20)
```

### Approach

If everyone went to city A, total cost = `sum of costA`. Now decide who gets "redirected" to B. The extra cost of redirecting person `i` to B is `costB[i] - costA[i]`. Sort by this difference ascending — choose the `n` people where redirecting to B is cheapest (smallest or most negative difference).

**Time:** O(n log n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int twoCitySchedCost(vector<vector<int>>& costs) {
    // Sort by (costB - costA): redirect people where going to B is cheapest first
    sort(costs.begin(), costs.end(), [](const vector<int>& a, const vector<int>& b) {
        return (a[1] - a[0]) < (b[1] - b[0]);
    });

    int n = costs.size() / 2;
    int total = 0;
    for (int i = 0;  i < n;  i++) total += costs[i][0];  // first n go to A... wait
    // Actually: first n (most benefit from A, or least benefit from B) go to A
    // Sorted ascending by (B-A): negative means B is cheaper → send to B first
    // Re-think: sort ascending → first n go to city B, last n go to city A

    total = 0;
    for (int i = 0;     i < n; i++) total += costs[i][1];  // first n (B−A smallest) → B
    for (int i = n; i < 2*n; i++) total += costs[i][0];  // last n (B−A largest)   → A
    return total;
}

int main() {
    vector<vector<int>> costs = {{10,20},{30,200},{400,50},{30,20}};
    cout << twoCitySchedCost(costs) << endl;  // Output: 110
}
```

---

## Greedy vs DP — Key Decision Table

This is the most important concept for exams — knowing which problems need greedy and which need DP.

| Problem | Greedy? | Why |
|---|---|---|
| Activity Selection | ✅ Yes | Earliest finish time is provably optimal |
| Fractional Knapsack | ✅ Yes | Can take fractions — value/weight ratio works |
| 0/1 Knapsack | ❌ No — use DP | Can't split items — greedy may skip a better combo |
| Coin Change (canonical) | ✅ Yes | US/metric coins satisfy divisibility property |
| Coin Change (arbitrary) | ❌ No — use DP | Greedy can miss smaller-coin combos |
| Shortest Path (no negatives) | ✅ Dijkstra | Greedy relaxation with positive edges |
| Shortest Path (with negatives) | ❌ No — Bellman-Ford | Greedy can select wrong path |
| MST (Prim/Kruskal) | ✅ Yes | Provably optimal greedy |
| Longest Increasing Subsequence | ❌ No — use DP | Greedy choice breaks future options |
| Huffman Coding | ✅ Yes | Merging least-frequent provably minimizes total bits |
| Jump Game I (reachability) | ✅ Yes | Maximizing reach at each step is optimal |
| Jump Game II (min jumps) | ✅ Yes | BFS-level greedy is provably optimal |

---

## Patterns Summary

| Pattern | Strategy | Key Sort / Data Structure |
|---|---|---|
| Interval scheduling | Sort by finish time, greedily select | Sort by end |
| Minimum rooms | Two sorted arrays + two pointers | Sort starts and ends separately |
| Minimize removals | Keep max non-overlapping (Activity Selection) | Sort by end |
| Job scheduling | Sort by profit desc, fill latest slot | Sort by profit |
| Huffman / priority merge | Always merge two smallest | Min-heap |
| Jump / reach problems | Track maximum reachable index | Single scan |
| Circular problems | Greedy reset when stuck | Single scan |
| Pairing problems | Sort + two pointers | Sort |
| Partition problems | Track last occurrence, expand boundary | Frequency array |

### Complexity Quick Reference

| Problem | Time | Space |
|---|---|---|
| Activity Selection | O(n log n) | O(1) |
| Minimum Meeting Rooms | O(n log n) | O(n) |
| Non-Overlapping Intervals | O(n log n) | O(1) |
| Minimum Arrows | O(n log n) | O(1) |
| Minimum Coins (greedy) | O(n) | O(1) |
| Fractional Knapsack | O(n log n) | O(1) |
| Lemonade Change | O(n) | O(1) |
| Huffman Encoding | O(n log n) | O(n) |
| Job Sequencing | O(n²) / O(n log n) | O(n) |
| Task Scheduler | O(n) | O(1) |
| Earliest Deadline First | O(n log n) | O(1) |
| Jump Game I | O(n) | O(1) |
| Jump Game II | O(n) | O(1) |
| Gas Station | O(n) | O(1) |
| Assign Cookies | O(n log n) | O(1) |
| Boats to Save People | O(n log n) | O(1) |
| Partition Labels | O(n) | O(1) |
| Two City Scheduling | O(n log n) | O(1) |

{% endraw %}
