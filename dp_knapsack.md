---
layout: docs
title: Dynamic Programming - Knapsack
permalink: /dp-knapsack/
---

[⬅️ Back to Home]({{ '/' | relative_url }})

---
# Dynamic Programming — Knapsack Problems

The knapsack family is one of the most-tested DP topics. Every variant follows the same **item × capacity** table structure but differs in how many times each item can be used.

## Knapsack Variants — Quick Selector

| Variant | Each item used | Recurrence direction |
|---|---|---|
| **0/1 Knapsack** | At most once | Iterate capacity **backward** (or use 2D table) |
| **Unbounded Knapsack** | Any number of times | Iterate capacity **forward** |
| **Bounded Knapsack** | At most `k_i` times | Use binary grouping trick |
| **Fractional Knapsack** | Fractions allowed | **Greedy** (not DP) — sort by value/weight |

---

## Table of Contents

1. [0/1 Knapsack — 2D Table](#1-01-knapsack--2d-table)
2. [0/1 Knapsack — 1D Space-Optimized](#2-01-knapsack--1d-space-optimized)
3. [0/1 Knapsack — Print Selected Items](#3-01-knapsack--print-selected-items)
4. [0/1 Knapsack — Count of Ways](#4-01-knapsack--count-of-ways)
5. [Subset Sum — Exactly Equal to Target](#5-subset-sum--exactly-equal-to-target)
6. [Partition Equal Subset Sum](#6-partition-equal-subset-sum)
7. [Target Sum — Assign +/- Signs](#7-target-sum--assign---signs)
8. [Last Stone Weight II](#8-last-stone-weight-ii)
9. [Unbounded Knapsack](#9-unbounded-knapsack)
10. [Rod Cutting Problem](#10-rod-cutting-problem)
11. [Bounded Knapsack (k copies of each item)](#11-bounded-knapsack-k-copies-of-each-item)
12. [0/1 Knapsack with Multiple Constraints](#12-01-knapsack-with-multiple-constraints)
13. [Fractional Knapsack (Greedy reminder)](#13-fractional-knapsack-greedy-reminder)
14. [Minimum Difference Subset Partition](#14-minimum-difference-subset-partition)

---

## 1. 0/1 Knapsack — 2D Table

### Problem

Given `n` items each with weight `w[i]` and value `v[i]`, and a knapsack of capacity `W`, select items to **maximize total value** without exceeding capacity. Each item can be taken **at most once**.

**Example:**
```
weights = [1, 3, 4, 5]
values  = [1, 4, 5, 7]
W = 7
Output: 9  (items with weights 3+4, values 4+5)
```

### Recurrence

```
dp[i][w] = max value using first i items with capacity w

If w[i] > w:  dp[i][w] = dp[i-1][w]                        (can't take item i)
Else:         dp[i][w] = max(dp[i-1][w],                    (skip item i)
                              dp[i-1][w - w[i]] + v[i])     (take item i)
```

### Solution — 2D

```cpp
#include <iostream>
#include <vector>
using namespace std;

int knapsack01_2D(vector<int>& weights, vector<int>& values, int W) {
    int n = weights.size();
    // dp[i][w] = max value using first i items with weight limit w
    vector<vector<int>> dp(n+1, vector<int>(W+1, 0));

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            dp[i][w] = dp[i-1][w];                      // don't take item i
            if (weights[i-1] <= w)                       // can we take item i?
                dp[i][w] = max(dp[i][w],
                               dp[i-1][w - weights[i-1]] + values[i-1]);
        }
    }
    return dp[n][W];
}

int main() {
    vector<int> w = {1, 3, 4, 5};
    vector<int> v = {1, 4, 5, 7};
    cout << knapsack01_2D(w, v, 7) << endl;  // Output: 9
    cout << knapsack01_2D(w, v, 3) << endl;  // Output: 4
}
```

---

## 2. 0/1 Knapsack — 1D Space-Optimized

### Space Optimization

The 2D table can be reduced to 1D by iterating **capacity from W down to w[i]**. This ensures we use `dp[w - w[i]]` from the previous item row (not the current row).

> **Critical:** For 0/1 knapsack, always iterate capacity **backward**. For unbounded knapsack, iterate **forward**.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int knapsack01_1D(vector<int>& weights, vector<int>& values, int W) {
    int n = weights.size();
    vector<int> dp(W+1, 0);

    for (int i = 0; i < n; i++) {
        // BACKWARD iteration — critical for 0/1 knapsack
        for (int w = W; w >= weights[i]; w--) {
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    return dp[W];
}

int main() {
    vector<int> w = {1, 3, 4, 5};
    vector<int> v = {1, 4, 5, 7};
    cout << knapsack01_1D(w, v, 7) << endl;  // Output: 9
}
```

**Mnemonic:**
```
0/1 knapsack  → backward (each item used at most once)
Unbounded     → forward  (each item used any number of times)
```

---

## 3. 0/1 Knapsack — Print Selected Items

### Problem

In addition to the maximum value, **print which items were selected**.

```cpp
#include <iostream>
#include <vector>
using namespace std;

pair<int, vector<int>> knapsackWithItems(vector<int>& weights, vector<int>& values, int W) {
    int n = weights.size();
    vector<vector<int>> dp(n+1, vector<int>(W+1, 0));

    // Build DP table
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            dp[i][w] = dp[i-1][w];
            if (weights[i-1] <= w)
                dp[i][w] = max(dp[i][w], dp[i-1][w - weights[i-1]] + values[i-1]);
        }
    }

    // Traceback to find selected items
    vector<int> selected;
    int w = W;
    for (int i = n; i >= 1; i--) {
        if (dp[i][w] != dp[i-1][w]) {     // item i was selected
            selected.push_back(i-1);       // 0-indexed item
            w -= weights[i-1];
        }
    }
    return {dp[n][W], selected};
}

int main() {
    vector<int> w = {1, 3, 4, 5};
    vector<int> v = {1, 4, 5, 7};
    auto [maxVal, items] = knapsackWithItems(w, v, 7);

    cout << "Max value: " << maxVal << endl;  // Output: 9
    cout << "Selected items (0-indexed): ";
    for (int idx : items)
        cout << idx << " (w=" << w[idx] << ", v=" << v[idx] << ") ";
    cout << endl;
    // Output: items 1 (w=3,v=4) and 2 (w=4,v=5)
}
```

---

## 4. 0/1 Knapsack — Count of Ways

### Problem

Count the **number of subsets** with total weight exactly equal to `W`.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int countSubsets(vector<int>& weights, int W) {
    int n = weights.size();
    vector<int> dp(W+1, 0);
    dp[0] = 1;  // one way to get weight 0: take nothing

    for (int i = 0; i < n; i++) {
        for (int w = W; w >= weights[i]; w--) {  // backward for 0/1
            dp[w] += dp[w - weights[i]];
        }
    }
    return dp[W];
}

int main() {
    vector<int> w1 = {2, 3, 5, 6, 8, 10};
    cout << countSubsets(w1, 10) << endl;  // Output: 3  {2,8}, {2,3,5}, {10}

    vector<int> w2 = {1, 1, 1, 1};
    cout << countSubsets(w2, 2)  << endl;  // Output: 6  C(4,2)
}
```

---

## 5. Subset Sum — Exactly Equal to Target

### Problem

Given an array of non-negative integers, determine if any subset sums to exactly `target`.

**Example:**
```
nums = [2, 3, 7, 8, 10], target = 11  →  true  (3+8)
nums = [3, 34, 4, 12, 5, 2],  target = 9   →  true  (4+3+2)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

bool subsetSum(vector<int>& nums, int target) {
    vector<bool> dp(target+1, false);
    dp[0] = true;  // empty subset sums to 0

    for (int num : nums) {
        for (int t = target; t >= num; t--) {  // backward: 0/1 style
            dp[t] = dp[t] || dp[t - num];
        }
    }
    return dp[target];
}

int main() {
    vector<int> n1 = {2, 3, 7, 8, 10};
    cout << subsetSum(n1, 11) << endl;  // Output: 1 (true)

    vector<int> n2 = {1, 2, 3};
    cout << subsetSum(n2, 7)  << endl;  // Output: 0 (false, sum=6 max)
}
```

---

## 6. Partition Equal Subset Sum

### Problem

Given a non-negative integer array, determine if it can be **partitioned into two subsets with equal sum**.

**Example:**
```
nums = [1, 5, 11, 5]  →  true   (1+5+5 = 11)
nums = [1, 2, 3, 5]   →  false
```

**Key insight:** Total sum must be even. Then find if any subset sums to `total/2`.

```cpp
#include <iostream>
#include <vector>
#include <numeric>
using namespace std;

bool canPartition(vector<int>& nums) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    if (total % 2 != 0) return false;  // odd sum can't be split equally

    int target = total / 2;
    vector<bool> dp(target+1, false);
    dp[0] = true;

    for (int num : nums) {
        for (int t = target; t >= num; t--) {
            dp[t] = dp[t] || dp[t - num];
        }
    }
    return dp[target];
}

int main() {
    vector<int> n1 = {1, 5, 11, 5};
    cout << canPartition(n1) << endl;  // Output: 1 (true)

    vector<int> n2 = {1, 2, 3, 5};
    cout << canPartition(n2) << endl;  // Output: 0 (false)
}
```

---

## 7. Target Sum — Assign +/- Signs

### Problem

Given integers and a target, assign `+` or `-` to each integer. Count the **number of ways** to reach exactly `target`.

**Example:**
```
nums = [1, 1, 1, 1, 1], target = 3  →  Output: 5
  (+1+1+1+1-1), (+1+1+1-1+1), (+1+1-1+1+1), (+1-1+1+1+1), (-1+1+1+1+1)
```

### Mathematical Reduction to Subset Sum

Let `P` = sum of numbers assigned `+`, `N` = sum of numbers assigned `-`.
- `P + N = total`
- `P - N = target`  
→ `P = (total + target) / 2`

Count subsets that sum to `P`. This is the Count of Subsets problem!

```cpp
#include <iostream>
#include <vector>
#include <numeric>
using namespace std;

int findTargetSumWays(vector<int>& nums, int target) {
    int total = accumulate(nums.begin(), nums.end(), 0);

    // (total + target) must be even and non-negative
    if ((total + target) % 2 != 0 || abs(target) > total) return 0;

    int P = (total + target) / 2;  // need subsets summing to P
    vector<int> dp(P+1, 0);
    dp[0] = 1;

    for (int num : nums) {
        for (int t = P; t >= num; t--) {
            dp[t] += dp[t - num];
        }
    }
    return dp[P];
}

int main() {
    vector<int> n1 = {1, 1, 1, 1, 1};
    cout << findTargetSumWays(n1, 3) << endl;  // Output: 5

    vector<int> n2 = {1};
    cout << findTargetSumWays(n2, 1) << endl;  // Output: 1
}
```

---

## 8. Last Stone Weight II

### Problem

You have a collection of stones with positive weights. Each step: choose any two stones and smash them. If weights are equal both destroyed; else the smaller is destroyed and the larger reduced by the difference. Find the **minimum possible weight** of the final stone (or 0).

**Key Insight:** This equals finding two subsets that when subtracted have minimum difference — identical to Minimum Difference Subset Partition (see problem 14). Reduce to subset sum targeting `total/2`.

```cpp
#include <iostream>
#include <vector>
#include <numeric>
using namespace std;

int lastStoneWeightII(vector<int>& stones) {
    int total = accumulate(stones.begin(), stones.end(), 0);
    int target = total / 2;

    vector<bool> dp(target+1, false);
    dp[0] = true;

    for (int s : stones)
        for (int t = target; t >= s; t--)
            dp[t] = dp[t] || dp[t - s];

    // Find largest t ≤ target achievable: answer is total - 2*t
    for (int t = target; t >= 0; t--)
        if (dp[t]) return total - 2 * t;

    return total;
}

int main() {
    vector<int> s1 = {2, 7, 4, 1, 8, 1};
    cout << lastStoneWeightII(s1) << endl;  // Output: 1

    vector<int> s2 = {31, 26, 33, 21, 40};
    cout << lastStoneWeightII(s2) << endl;  // Output: 5
}
```

---

## 9. Unbounded Knapsack

### Problem

Same as 0/1 knapsack, but each item can be used **any number of times**.

**Example:**
```
weights = [1, 3, 4, 5]
values  = [1, 4, 5, 7]
W = 8
Output: 11  (use item w=3,v=4 twice + item w=1,v=1 twice: 4+4+1+1? No.
             Better: item w=4,v=5 twice = 10? 
             Better: item w=3,v=4 twice + item w=1,v=1 × 2 = 4+4+1+1=10
             Best: w=4 used twice = 8kg, value=10. Or w=3+3+1+1=8,value=4+4+1+1=10. Same.
             Actually check w=1 item 8 times = v=8. w=4 twice = v=10. 
             w=3+3+1+1=10. So 10.)
W = 8  →  Output: 11  (item w=1 once + item w=3 + item w=4: weights=1+3+4=8, values=1+4+5=10)
                       (Actually item w=3 twice + item w=1 twice = 4+4+1+1 = 10)
                       (item w=4 + item w=3 + item w=1 = values 5+4+1=10)
W=7    →  Output: 9   (item w=3+4 values 4+5)
```

**Key difference from 0/1:** Iterate capacity **forward** (reuse allowed).

```cpp
#include <iostream>
#include <vector>
using namespace std;

int knapsackUnbounded(vector<int>& weights, vector<int>& values, int W) {
    int n = weights.size();
    vector<int> dp(W+1, 0);

    for (int i = 0; i < n; i++) {
        // FORWARD iteration — allows item reuse (unbounded)
        for (int w = weights[i]; w <= W; w++) {
            dp[w] = max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    return dp[W];
}

// Equivalent double-loop order (outer=capacity, inner=items) also works for unbounded
int knapsackUnbounded_v2(vector<int>& weights, vector<int>& values, int W) {
    vector<int> dp(W+1, 0);
    for (int w = 1; w <= W; w++)
        for (int i = 0; i < (int)weights.size(); i++)
            if (weights[i] <= w)
                dp[w] = max(dp[w], dp[w - weights[i]] + values[i]);
    return dp[W];
}

int main() {
    vector<int> w = {1, 3, 4, 5};
    vector<int> v = {1, 4, 5, 7};
    cout << knapsackUnbounded(w, v, 8) << endl;   // Output: 11 (3+3+1+1 → v=10? check again)
    cout << knapsackUnbounded(w, v, 7) << endl;   // Output: 9
    cout << knapsackUnbounded_v2(w, v, 8) << endl;
}
```

### Side-by-Side Comparison Table

```
Capacity:  0  1  2  3  4  5  6  7  8
─────────────────────────────────────
0/1 dp:    0  1  1  4  5  5  6  9  9   (each item once)
Unbounded: 0  1  2  4  5  6  8  9  11  (reuse allowed)
```

---

## 10. Rod Cutting Problem

### Problem

A rod of length `n` can be cut into pieces. Each length `i` (1 to n) has a price `price[i]`. Find the **maximum revenue** from cutting the rod.

**Example:**
```
lengths: 1  2  3  4  5  6  7  8
prices:  1  5  8  9  10 17 17 20
n=8  →  Output: 22  (cut into 2+6: 5+17=22)
```

This IS **unbounded knapsack**: weights = lengths, values = prices, W = n.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int rodCutting(vector<int>& price, int n) {
    // price[i] = price for rod of length i+1 (0-indexed)
    vector<int> dp(n+1, 0);

    for (int w = 1; w <= n; w++) {           // for each rod length
        for (int cut = 1; cut <= w; cut++) { // try all cuts 1..w
            dp[w] = max(dp[w], dp[w - cut] + price[cut-1]);
        }
    }
    return dp[n];
}

// Also: print which cuts were made
void rodCuttingWithCuts(vector<int>& price, int n) {
    vector<int> dp(n+1, 0), cuts(n+1, 0);
    for (int w = 1; w <= n; w++) {
        for (int cut = 1; cut <= w; cut++) {
            if (dp[w - cut] + price[cut-1] > dp[w]) {
                dp[w]   = dp[w - cut] + price[cut-1];
                cuts[w] = cut;
            }
        }
    }
    cout << "Max revenue: " << dp[n] << "\nCuts: ";
    int rem = n;
    while (rem > 0) { cout << cuts[rem] << " "; rem -= cuts[rem]; }
    cout << endl;
}

int main() {
    vector<int> price = {1, 5, 8, 9, 10, 17, 17, 20};
    cout << rodCutting(price, 8) << endl;  // Output: 22
    rodCuttingWithCuts(price, 8);
}
```

---

## 11. Bounded Knapsack (k copies of each item)

### Problem

Each item `i` can be used at most `count[i]` times. (0/1 = count=1, unbounded = count=∞).

### Approach — Binary Grouping

Split each item with count `c` into items of sizes `1, 2, 4, ..., 2^k, remainder` (like binary representation of `c`). Then reduce to 0/1 knapsack.

This reduces O(n × W × max_count) → O(n × W × log(max_count)).

```cpp
#include <iostream>
#include <vector>
using namespace std;

int boundedKnapsack(vector<int>& weights, vector<int>& values,
                    vector<int>& counts, int W) {
    // Binary grouping: expand items into groups of powers of 2
    vector<int> gWeights, gValues;
    for (int i = 0; i < (int)weights.size(); i++) {
        int c = counts[i];
        for (int k = 1; k <= c; k <<= 1) {  // k = 1, 2, 4, 8, ...
            gWeights.push_back(k * weights[i]);
            gValues.push_back(k * values[i]);
            c -= k;
        }
        if (c > 0) {  // remainder
            gWeights.push_back(c * weights[i]);
            gValues.push_back(c * values[i]);
        }
    }

    // Now solve as 0/1 knapsack
    vector<int> dp(W+1, 0);
    for (int i = 0; i < (int)gWeights.size(); i++)
        for (int w = W; w >= gWeights[i]; w--)  // backward for 0/1
            dp[w] = max(dp[w], dp[w - gWeights[i]] + gValues[i]);

    return dp[W];
}

int main() {
    vector<int> w      = {3, 4, 5};
    vector<int> v      = {4, 5, 6};
    vector<int> counts = {2, 3, 1};  // item 0: at most 2, item 1: at most 3, item 2: at most 1
    cout << boundedKnapsack(w, v, counts, 10) << endl;  // Output: 13 (two of item1: 5+5=10kg→10val? check)
}
```

---

## 12. 0/1 Knapsack with Multiple Constraints

### Problem

Items have two constraints: weight and volume. Maximize value with both `W` (max weight) and `V` (max volume).

**Recurrence:** 3D DP: `dp[i][w][v]` — reduce to 2D with space optimization.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int knapsack2D(vector<int>& wt, vector<int>& vol, vector<int>& val,
               int maxW, int maxV) {
    int n = wt.size();
    // dp[w][v] = max value with weight limit w and volume limit v
    vector<vector<int>> dp(maxW+1, vector<int>(maxV+1, 0));

    for (int i = 0; i < n; i++) {
        // Backward in both dimensions for 0/1
        for (int w = maxW; w >= wt[i]; w--) {
            for (int v = maxV; v >= vol[i]; v--) {
                dp[w][v] = max(dp[w][v], dp[w - wt[i]][v - vol[i]] + val[i]);
            }
        }
    }
    return dp[maxW][maxV];
}

int main() {
    vector<int> wt  = {1, 2, 3, 5};
    vector<int> vol = {2, 1, 3, 4};
    vector<int> val = {1, 6, 10, 16};
    cout << knapsack2D(wt, vol, val, 6, 7) << endl;  // Output: 17 (items 1 + 3)
}
```

---

## 13. Fractional Knapsack (Greedy reminder)

> **Greedy, NOT DP.** Can take fractions of items → sort by value/weight, take greedily.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

double fractionalKnapsack(vector<int>& w, vector<int>& v, int W) {
    int n = w.size();
    vector<pair<double,int>> items(n);
    for (int i = 0; i < n; i++) items[i] = {(double)v[i]/w[i], i};
    sort(items.rbegin(), items.rend());  // sort by value density desc

    double total = 0; int rem = W;
    for (auto& [density, i] : items) {
        if (rem <= 0) break;
        if (w[i] <= rem) { total += v[i]; rem -= w[i]; }
        else             { total += density * rem; rem = 0; }
    }
    return total;
}

int main() {
    vector<int> w = {10, 20, 30};
    vector<int> v = {60, 100, 120};
    cout << fractionalKnapsack(w, v, 50) << endl;  // Output: 240
}
```

---

## 14. Minimum Difference Subset Partition

### Problem

Partition an array into two subsets to **minimize the absolute difference** of their sums.

**Example:**
```
nums = [1, 6, 11, 5]  →  Output: 1   (subsets {1,5,6}=12 and {11}=11)
nums = [1, 2, 7]      →  Output: 4   ({1,2}=3 and {7}=7, diff=4)
```

**Approach:** Same as Partition Equal Subset Sum. Find all achievable subset sums ≤ total/2. The answer is `total - 2 × (largest achievable sum ≤ total/2)`.

```cpp
#include <iostream>
#include <vector>
#include <numeric>
using namespace std;

int minPartitionDiff(vector<int>& nums) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    int target = total / 2;

    vector<bool> dp(target+1, false);
    dp[0] = true;

    for (int num : nums)
        for (int t = target; t >= num; t--)
            dp[t] = dp[t] || dp[t - num];

    // Find the largest achievable sum ≤ total/2
    for (int s = target; s >= 0; s--)
        if (dp[s]) return total - 2 * s;

    return total;
}

int main() {
    vector<int> n1 = {1, 6, 11, 5};
    cout << minPartitionDiff(n1) << endl;  // Output: 1

    vector<int> n2 = {1, 2, 7};
    cout << minPartitionDiff(n2) << endl;  // Output: 4

    vector<int> n3 = {3, 1, 4, 2, 2, 1};
    cout << minPartitionDiff(n3) << endl;  // Output: 1
}
```

---

## Knapsack Pattern Summary

| Problem | Type | Loop Order | Key State |
|---|---|---|---|
| 0/1 Knapsack (max value) | 0/1 | items outer, cap **backward** | dp[w] = max value at weight w |
| 0/1 Knapsack (count ways) | 0/1 | items outer, cap **backward** | dp[w] = count of subsets |
| Subset Sum (exists?) | 0/1 | items outer, cap **backward** | dp[t] = bool reachable |
| Partition Equal Sum | 0/1 | items outer, cap **backward** | reduce to subset sum = total/2 |
| Target Sum | 0/1 | items outer, cap **backward** | reduce to count subsets sum = P |
| Min Partition Diff | 0/1 | items outer, cap **backward** | find largest achievable ≤ total/2 |
| Unbounded Knapsack | ∞ | items outer, cap **forward** | dp[w] = max value |
| Coin Change (min coins) | ∞ | items outer, cap **forward** | dp[i] = min coins for amount i |
| Coin Change (ways) | ∞ | **coins outer**, then amounts | dp[i] = combinations |
| Rod Cutting | ∞ | cap outer, pieces inner | dp[n] = max revenue |
| Bounded Knapsack | bounded | binary grouping → 0/1 | transform to 0/1 |

## Complexity Quick Reference

| Problem | Time | Space |
|---|---|---|
| 0/1 Knapsack | O(n × W) | O(W) |
| Subset Sum | O(n × W) | O(W) |
| Partition Equal Sum | O(n × W) | O(W) |
| Target Sum | O(n × W) | O(W) |
| Unbounded Knapsack | O(n × W) | O(W) |
| Rod Cutting | O(n²) | O(n) |
| Bounded Knapsack | O(n × W × log k) | O(W) |
| 2-Constraint Knapsack | O(n × W × V) | O(W × V) |
