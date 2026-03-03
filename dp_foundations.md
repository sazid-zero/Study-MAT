---
layout: docs
title: Dynamic Programming - Foundations
permalink: /dp-foundations/
---

[⬅️ Back to Home]({{ '/' | relative_url }})

---
{% raw %}
# Dynamic Programming — Foundations & Classic Problems

**Dynamic Programming (DP)** solves problems by breaking them into overlapping subproblems, storing results to avoid recomputation. Two required properties:
1. **Optimal Substructure** — optimal solution built from optimal solutions to subproblems.
2. **Overlapping Subproblems** — same subproblems solved repeatedly (memoize them).

## Two Approaches

| Approach | Direction | Storage | When to use |
|---|---|---|---|
| **Top-Down (Memoization)** | Recursive, lazy | `memo` table / `map` | When not all states needed |
| **Bottom-Up (Tabulation)** | Iterative, all states | `dp[]` table | When all states needed; faster in practice |

**Space optimization:** Many DP tables can be reduced from O(n²) → O(n) → O(1) by keeping only the previous row/values.

---


## Table of Contents

1. [Fibonacci Number — 5 Approaches](#1-fibonacci-number--5-approaches)
2. [Climbing Stairs](#2-climbing-stairs)
3. [Climbing Stairs with Variable Steps](#3-climbing-stairs-with-variable-steps)
4. [Min Cost Climbing Stairs](#4-min-cost-climbing-stairs)
5. [House Robber I](#5-house-robber-i)
6. [House Robber II — Circular](#6-house-robber-ii--circular)
7. [House Robber III — Binary Tree](#7-house-robber-iii--binary-tree)
8. [Decode Ways](#8-decode-ways)
9. [Coin Change — Minimum Coins](#9-coin-change--minimum-coins)
10. [Coin Change II — Number of Ways](#10-coin-change-ii--number-of-ways)
11. [Perfect Squares](#11-perfect-squares)
12. [Word Break](#12-word-break)
13. [Unique Binary Search Trees (Catalan Numbers)](#13-unique-binary-search-trees-catalan-numbers)
14. [Tiling Problems](#14-tiling-problems)

---

## 1. Fibonacci Number — 5 Approaches

### Problem

Compute the n-th Fibonacci number: F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).

### All 5 Approaches (Exam Must-Know)

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

// ─── Approach 1: Naive Recursion — O(2^n) time, O(n) space ───────────────────
int fibRecursive(int n) {
    if (n <= 1) return n;
    return fibRecursive(n-1) + fibRecursive(n-2);
}

// ─── Approach 2: Top-Down (Memoization) — O(n) time, O(n) space ──────────────
unordered_map<int,int> memo;
int fibMemo(int n) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];
    return memo[n] = fibMemo(n-1) + fibMemo(n-2);
}

// ─── Approach 3: Bottom-Up (Tabulation) — O(n) time, O(n) space ──────────────
int fibDP(int n) {
    if (n <= 1) return n;
    vector<int> dp(n+1);
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}

// ─── Approach 4: Space Optimized — O(n) time, O(1) space ─────────────────────
int fibOptimized(int n) {
    if (n <= 1) return n;
    int prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int cur = prev1 + prev2;
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}

// ─── Approach 5: Matrix Exponentiation — O(log n) time, O(1) space ───────────
typedef vector<vector<long long>> Mat;
Mat matMul(const Mat& A, const Mat& B) {
    return {{A[0][0]*B[0][0]+A[0][1]*B[1][0],  A[0][0]*B[0][1]+A[0][1]*B[1][1]},
            {A[1][0]*B[0][0]+A[1][1]*B[1][0],  A[1][0]*B[0][1]+A[1][1]*B[1][1]}};
}
Mat matPow(Mat M, int k) {
    Mat R = {{1,0},{0,1}};  // identity
    while (k > 0) {
        if (k & 1) R = matMul(R, M);
        M = matMul(M, M);
        k >>= 1;
    }
    return R;
}
long long fibMatrix(int n) {
    if (n <= 1) return n;
    Mat M = {{1,1},{1,0}};
    return matPow(M, n)[0][1];
}

int main() {
    int n = 10;
    cout << "Recursive:   " << fibRecursive(n)  << endl;  // 55
    cout << "Memoized:    " << fibMemo(n)        << endl;  // 55
    cout << "Tabulation:  " << fibDP(n)          << endl;  // 55
    cout << "Optimized:   " << fibOptimized(n)   << endl;  // 55
    cout << "Matrix:      " << fibMatrix(n)      << endl;  // 55
}
```

**Complexity Summary:**

| Approach | Time | Space |
|---|---|---|
| Naive Recursion | O(2ⁿ) | O(n) stack |
| Memoization | O(n) | O(n) |
| Tabulation | O(n) | O(n) |
| Space-Optimized | O(n) | O(1) |
| Matrix Exponentiation | O(log n) | O(1) |

---

## 2. Climbing Stairs

### Problem

You can climb 1 or 2 steps at a time. How many distinct ways to reach step `n`?

**Example:**
```
n=3  →  3 ways: (1,1,1), (1,2), (2,1)
n=4  →  5 ways
```

**Recurrence:** `dp[i] = dp[i-1] + dp[i-2]` — this IS Fibonacci!

```cpp
#include <iostream>
#include <vector>
using namespace std;

int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2;
    for (int i = 3; i <= n; i++) {
        int cur = prev1 + prev2;
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}

int main() {
    for (int n = 1; n <= 7; n++)
        cout << "n=" << n << ": " << climbStairs(n) << " ways\n";
    // 1,2,3,5,8,13,21
}
```

---

## 3. Climbing Stairs with Variable Steps

### Problem

You can climb any number of steps from a given set `steps[]` (e.g., `{1,2,3}`). How many distinct ways to reach step `n`?

**Example:**
```
steps=[1,2,3], n=4  →  7 ways
```

**Recurrence:** `dp[i] = sum of dp[i - s]` for each step `s` in `steps` where `i >= s`

```cpp
#include <iostream>
#include <vector>
using namespace std;

int climbStairsVariableSteps(int n, vector<int>& steps) {
    vector<int> dp(n+1, 0);
    dp[0] = 1;  // one way to be at ground (do nothing)

    for (int i = 1; i <= n; i++)
        for (int s : steps)
            if (i >= s) dp[i] += dp[i - s];

    return dp[n];
}

int main() {
    vector<int> steps = {1, 2, 3};
    cout << climbStairsVariableSteps(4, steps) << endl;  // Output: 7

    vector<int> steps2 = {1, 2};
    cout << climbStairsVariableSteps(5, steps2) << endl; // Output: 8 (Fibonacci)
}
```

---

## 4. Min Cost Climbing Stairs

### Problem

Each step has a cost `cost[i]`. You can start from step 0 or 1 and climb 1 or 2 steps at a time. Find the **minimum cost** to reach the top (index `n`).

**Example:**
```
cost = [10, 15, 20]  →  Output: 15   (start at step 1, climb 2 steps: cost 15)
cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]  →  Output: 6
```

**Recurrence:** `dp[i] = cost[i] + min(dp[i-1], dp[i-2])`

```cpp
#include <iostream>
#include <vector>
using namespace std;

int minCostClimbingStairs(vector<int>& cost) {
    int n = cost.size();
    vector<int> dp(n);
    dp[0] = cost[0];
    dp[1] = cost[1];
    for (int i = 2; i < n; i++)
        dp[i] = cost[i] + min(dp[i-1], dp[i-2]);
    // You can reach the top from step n-1 or n-2
    return min(dp[n-1], dp[n-2]);
}

int main() {
    vector<int> c1 = {10, 15, 20};
    cout << minCostClimbingStairs(c1) << endl;  // Output: 15

    vector<int> c2 = {1,100,1,1,1,100,1,1,100,1};
    cout << minCostClimbingStairs(c2) << endl;  // Output: 6
}
```

---

## 5. House Robber I

### Problem

Houses are in a line. You cannot rob two adjacent houses. Maximize the total amount robbed.

**Example:**
```
nums = [2, 7, 9, 3, 1]  →  Output: 12   (rob houses 1,3,5: 2+9+1=12)
nums = [1, 2, 3, 1]     →  Output: 4    (rob 1,3: 1+3=4)
```

**Recurrence:** `dp[i] = max(dp[i-1],  dp[i-2] + nums[i])`
- Skip this house: keep `dp[i-1]`
- Rob this house: `dp[i-2] + nums[i]`

```cpp
#include <iostream>
#include <vector>
using namespace std;

int rob(vector<int>& nums) {
    int n = nums.size();
    if (n == 1) return nums[0];
    int prev2 = nums[0], prev1 = max(nums[0], nums[1]);
    for (int i = 2; i < n; i++) {
        int cur = max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}

int main() {
    vector<int> n1 = {2, 7, 9, 3, 1};
    cout << rob(n1) << endl;  // Output: 12

    vector<int> n2 = {1, 2, 3, 1};
    cout << rob(n2) << endl;  // Output: 4
}
```

---

## 6. House Robber II — Circular

### Problem

Same as House Robber I, but the houses are in a **circle** (first and last are adjacent). Cannot rob both.

**Key Insight:** Run House Robber I twice:
- Once on `nums[0..n-2]` (exclude last house)
- Once on `nums[1..n-1]` (exclude first house)
- Answer = max of both

```cpp
#include <iostream>
#include <vector>
using namespace std;

int robRange(vector<int>& nums, int lo, int hi) {
    int prev2 = 0, prev1 = 0;
    for (int i = lo; i <= hi; i++) {
        int cur = max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}

int robCircular(vector<int>& nums) {
    int n = nums.size();
    if (n == 1) return nums[0];
    // Case 1: don't rob last house; Case 2: don't rob first house
    return max(robRange(nums, 0, n-2), robRange(nums, 1, n-1));
}

int main() {
    vector<int> n1 = {2, 3, 2};
    cout << robCircular(n1) << endl;  // Output: 3

    vector<int> n2 = {1, 2, 3, 1};
    cout << robCircular(n2) << endl;  // Output: 4
}
```

---

## 7. House Robber III — Binary Tree

### Problem

Houses are arranged in a **binary tree**. Adjacent means parent-child. Maximize the amount robbed.

**State:** For each node, return `{robThis, skipThis}` — max if we rob vs skip this node.

```cpp
#include <iostream>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

pair<int,int> robTree(TreeNode* node) {
    if (!node) return {0, 0};

    auto [leftRob, leftSkip]   = robTree(node->left);
    auto [rightRob, rightSkip] = robTree(node->right);

    // Rob this node: children must be skipped
    int robThis  = node->val + leftSkip + rightSkip;
    // Skip this node: children can be robbed or skipped (take max)
    int skipThis = max(leftRob, leftSkip) + max(rightRob, rightSkip);

    return {robThis, skipThis};
}

int rob(TreeNode* root) {
    auto [r, s] = robTree(root);
    return max(r, s);
}

int main() {
    //       3
    //      / \
    //     2   3
    //      \    \
    //       3    1
    TreeNode* root = new TreeNode(3);
    root->left  = new TreeNode(2);
    root->right = new TreeNode(3);
    root->left->right  = new TreeNode(3);
    root->right->right = new TreeNode(1);
    cout << rob(root) << endl;  // Output: 7 (rob 3+3+1)
}
```

---

## 8. Decode Ways

### Problem

A message is encoded where `A=1, B=2, ..., Z=26`. Given a string of digits, count the number of ways to decode it.

**Example:**
```
"12"   →  2 ways: "AB"(1,2) or "L"(12)
"226"  →  3 ways: "BBF"(2,2,6), "BZ"(2,26), "VF"(22,6)
"06"   →  0 ways (leading zero)
```

**Recurrence:**
- `dp[i] += dp[i-1]` if `s[i-1]` is not '0' (single digit decode)
- `dp[i] += dp[i-2]` if `s[i-2..i-1]` is between 10 and 26 (two digit decode)

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int numDecodings(string s) {
    int n = s.size();
    if (n == 0 || s[0] == '0') return 0;

    // dp[i] = ways to decode s[0..i-1]
    vector<int> dp(n+1, 0);
    dp[0] = 1;      // empty string: 1 way (base case)
    dp[1] = 1;      // single non-zero char: 1 way

    for (int i = 2; i <= n; i++) {
        int oneDigit = s[i-1] - '0';           // last single digit
        int twoDigit = stoi(s.substr(i-2, 2)); // last two digits

        if (oneDigit >= 1)
            dp[i] += dp[i-1];          // valid single-digit decode
        if (twoDigit >= 10 && twoDigit <= 26)
            dp[i] += dp[i-2];          // valid two-digit decode
    }
    return dp[n];
}

int main() {
    cout << numDecodings("12")   << endl;  // Output: 2
    cout << numDecodings("226")  << endl;  // Output: 3
    cout << numDecodings("06")   << endl;  // Output: 0
    cout << numDecodings("2101") << endl;  // Output: 1
}
```

---

## 9. Coin Change — Minimum Coins

### Problem

Given coin denominations and an amount, find the **minimum number of coins** to make up that amount. Return -1 if impossible.

**Example:**
```
coins=[1,5,6,9], amount=11  →  Output: 2  (5+6)
coins=[2],        amount=3  →  Output: -1
```

**Recurrence:** `dp[i] = min(dp[i], dp[i - coin] + 1)` for each coin

```cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;  // 0 coins needed for amount 0

    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i && dp[i - coin] != INT_MAX)
                dp[i] = min(dp[i], dp[i - coin] + 1);
        }
    }
    return (dp[amount] == INT_MAX) ? -1 : dp[amount];
}

int main() {
    vector<int> c1 = {1, 5, 6, 9};
    cout << coinChange(c1, 11) << endl;  // Output: 2 (5+6)

    vector<int> c2 = {1, 2, 5};
    cout << coinChange(c2, 11) << endl;  // Output: 3 (5+5+1)

    vector<int> c3 = {2};
    cout << coinChange(c3, 3)  << endl;  // Output: -1
}
```

---

## 10. Coin Change II — Number of Ways

### Problem

Given coin denominations and an amount, find the **total number of combinations** (not permutations!) to make up that amount.

**Example:**
```
coins=[1,2,5], amount=5  →  Output: 4
  (5), (2+2+1), (2+1+1+1), (1+1+1+1+1)
```

> **Key difference from Coin Change I:** Order doesn't matter here (combinations). Use an outer loop over coins and inner loop over amounts to avoid counting permutations.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int change(int amount, vector<int>& coins) {
    vector<int> dp(amount + 1, 0);
    dp[0] = 1;  // one way to make amount 0: use no coins

    // Outer loop over coins ensures combinations (not permutations)
    for (int coin : coins)
        for (int i = coin; i <= amount; i++)
            dp[i] += dp[i - coin];

    return dp[amount];
}

// If counting PERMUTATIONS (order matters):
int changePermutations(int amount, vector<int>& coins) {
    vector<int> dp(amount + 1, 0);
    dp[0] = 1;
    // Outer loop over amounts, inner over coins → counts permutations
    for (int i = 1; i <= amount; i++)
        for (int coin : coins)
            if (i >= coin) dp[i] += dp[i - coin];
    return dp[amount];
}

int main() {
    vector<int> coins = {1, 2, 5};
    cout << change(5, coins) << endl;             // Output: 4 (combinations)
    cout << changePermutations(5, coins) << endl; // Output: 13 (permutations)
}
```

---

## 11. Perfect Squares

### Problem

Given `n`, find the **minimum number of perfect squares** (1, 4, 9, 16, ...) that sum to `n`.

**Example:**
```
n=12  →  Output: 3  (4+4+4)
n=13  →  Output: 2  (4+9)
```

Same structure as Coin Change, but coins are all perfect squares ≤ n.

```cpp
#include <iostream>
#include <vector>
#include <climits>
#include <cmath>
using namespace std;

int numSquares(int n) {
    vector<int> dp(n + 1, INT_MAX);
    dp[0] = 0;

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j * j <= i; j++) {
            if (dp[i - j*j] != INT_MAX)
                dp[i] = min(dp[i], dp[i - j*j] + 1);
        }
    }
    return dp[n];
}

int main() {
    cout << numSquares(12) << endl;  // Output: 3 (4+4+4)
    cout << numSquares(13) << endl;  // Output: 2 (4+9)
    cout << numSquares(1)  << endl;  // Output: 1
}
```

---

## 12. Word Break

### Problem

Given a string `s` and a dictionary, determine if `s` can be segmented into space-separated dictionary words.

**Example:**
```
s="leetcode", wordDict=["leet","code"]      →  true
s="applepenapple", wordDict=["apple","pen"] →  true
s="catsandog", wordDict=["cats","dog","sand","and","cat"]  →  false
```

**State:** `dp[i]` = true if `s[0..i-1]` can be segmented.
**Recurrence:** `dp[i] = OR over all j<i of (dp[j] AND s[j..i-1] is in dict)`

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <unordered_set>
using namespace std;

bool wordBreak(string s, vector<string>& wordDict) {
    unordered_set<string> dict(wordDict.begin(), wordDict.end());
    int n = s.size();
    vector<bool> dp(n + 1, false);
    dp[0] = true;  // empty string is always valid

    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && dict.count(s.substr(j, i - j))) {
                dp[i] = true;
                break;  // found one valid split
            }
        }
    }
    return dp[n];
}

int main() {
    vector<string> d1 = {"leet", "code"};
    cout << wordBreak("leetcode", d1) << endl;  // Output: 1 (true)

    vector<string> d2 = {"apple", "pen"};
    cout << wordBreak("applepenapple", d2) << endl;  // Output: 1 (true)

    vector<string> d3 = {"cats", "dog", "sand", "and", "cat"};
    cout << wordBreak("catsandog", d3) << endl;  // Output: 0 (false)
}
```

---

## 13. Unique Binary Search Trees (Catalan Numbers)

### Problem

Given `n`, how many structurally unique BSTs can be formed with keys `1..n`?

**Example:**
```
n=3  →  5
n=4  →  14
```

**Recurrence:** For each root `r` from 1 to n:
`G(n) = sum of G(r-1) * G(n-r)` for r=1 to n

This is the **n-th Catalan number**: `C(n) = C(2n, n) / (n+1)`

```cpp
#include <iostream>
#include <vector>
using namespace std;

int numTrees(int n) {
    // dp[i] = number of unique BSTs with i nodes
    vector<long long> dp(n + 1, 0);
    dp[0] = 1;  // empty tree: 1 way
    dp[1] = 1;

    for (int i = 2; i <= n; i++)
        for (int r = 1; r <= i; r++)
            dp[i] += dp[r-1] * dp[i-r];  // r as root: left has r-1, right has i-r

    return dp[n];
}

int main() {
    for (int n = 0; n <= 7; n++)
        cout << "n=" << n << ": " << numTrees(n) << "\n";
    // 1, 1, 2, 5, 14, 42, 132, 429
}
```

---

## 14. Tiling Problems

### Problem A — 1×n board with 1×1 and 1×2 tiles

How many ways to tile a 1×n board using 1×1 and 1×2 tiles?

**This is Fibonacci!** `dp[n] = dp[n-1] + dp[n-2]`

### Problem B — 2×n board with 1×2 dominoes

How many ways to tile a 2×n board using 1×2 dominoes?

**Recurrence:** `dp[n] = dp[n-1] + dp[n-2]` (same Fibonacci!)
- Place vertical domino: leaves 2×(n-1) board
- Place two horizontal dominoes: leaves 2×(n-2) board

### Problem C — 2×n board with L-shaped trominoes (1×2 + 1×1)

More complex state machine — uses `dp[i][0..3]` for which cells of column `i` are filled.

```cpp
#include <iostream>
#include <vector>
using namespace std;
const int MOD = 1e9 + 7;

// ─── Problem A: 1×n with 1×1 and 1×2 tiles ───────────────────────────────────
int tile1D(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) { int c = (a + b) % MOD; a = b; b = c; }
    return b;
}

// ─── Problem B: 2×n with dominoes ────────────────────────────────────────────
long long tile2D(int n) {
    if (n == 0) return 1;
    if (n == 1) return 1;
    long long a = 1, b = 1;
    for (int i = 2; i <= n; i++) { long long c = (a + b) % MOD; a = b; b = c; }
    return b;
}

// ─── Problem C: 2×n with L-trominoes + 1×2 dominoes (LeetCode 790 variant) ──
// dp[i][0] = ways where col i is fully covered
// dp[i][1] = ways where top of col i is filled but not bottom
// dp[i][2] = ways where bottom of col i is filled but not top
long long tileWithLTrominoes(int n) {
    vector<array<long long,3>> dp(n+1, {0,0,0});
    dp[0][0] = 1;

    for (int i = 1; i <= n; i++) {
        dp[i][0] = (dp[i-1][0] + dp[i-1][1] + dp[i-1][2]) % MOD;
        dp[i][1] = (dp[i-1][0] + dp[i-1][2]) % MOD;
        dp[i][2] = (dp[i-1][0] + dp[i-1][1]) % MOD;
    }
    return dp[n][0];
}

int main() {
    cout << "1D tiling n=5: " << tile1D(5)  << endl;  // Output: 8
    cout << "2D tiling n=4: " << tile2D(4)  << endl;  // Output: 5
    cout << "2D tiling n=3: " << tile2D(3)  << endl;  // Output: 3
    // L-tromino (LeetCode 790): ways to tile 2×n with dominoes + L-trominoes
    for (int i = 1; i <= 5; i++)
        cout << "L-tromino n=" << i << ": " << tileWithLTrominoes(i) << "\n";
}
```

---

## DP Decision Guide

```
Does the problem ask for:
  - Count/Exist/Optimal over a linear sequence?
    → 1D DP: dp[i] based on dp[i-1], dp[i-2], dp[i-k]

  - Does current decision affect what's available at a future step?
    → Think carefully about what the STATE needs to capture

  - Two sequences to compare?
    → 2D DP: dp[i][j] where i indexes seq1, j indexes seq2  (→ see dp_subsequences.md)

  - Grid / matrix traversal?
    → 2D DP: dp[i][j] = optimal up to cell (i,j)  (→ see dp_matrix_paths.md)

  - Items with weights/values and a capacity?
    → Knapsack DP   (→ see dp_knapsack.md)

  - On strings (edit, palindrome)?
    → String DP   (→ see dp_strings.md)
```

## Complexity Quick Reference

| Problem | Time | Space | Optimized Space |
|---|---|---|---|
| Fibonacci | O(n) | O(n) | O(1) — two vars |
| Climbing Stairs | O(n) | O(n) | O(1) |
| Min Cost Stairs | O(n) | O(n) | O(1) |
| House Robber I | O(n) | O(n) | O(1) |
| House Robber II | O(n) | O(1) | — |
| House Robber III | O(n) | O(n) stack | — |
| Decode Ways | O(n) | O(n) | O(1) |
| Coin Change (min) | O(n×k) | O(n) | — |
| Coin Change (ways) | O(n×k) | O(n) | — |
| Perfect Squares | O(n√n) | O(n) | — |
| Word Break | O(n²) | O(n) | — |
| Unique BSTs | O(n²) | O(n) | — |

{% endraw %}
