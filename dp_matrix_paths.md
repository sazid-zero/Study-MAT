---
layout: docs
title: Dynamic Programming - Matrix Paths
permalink: /dp-matrix-paths/
---

[⬅️ Back to Home]({{ '/' | relative_url }})

---
# Dynamic Programming — Matrix & Grid Path Problems

Most grid DP problems have the structure: `dp[i][j]` = optimal value (min cost, max value, count of paths, etc.) to reach or process cell `(i, j)`.

**Common movement rules:**
- Top-left to bottom-right: can move right or down
- Any direction: BFS/DFS + memo
- From any edge: expand from borders inward

---

## Table of Contents

1. [Unique Paths — Count all Paths](#1-unique-paths--count-all-paths)
2. [Unique Paths II — With Obstacles](#2-unique-paths-ii--with-obstacles)
3. [Minimum Path Sum](#3-minimum-path-sum)
4. [Triangle — Minimum Path from Top to Bottom](#4-triangle--minimum-path-from-top-to-bottom)
5. [Dungeon Game — Minimum Health](#5-dungeon-game--minimum-health)
6. [Maximal Square](#6-maximal-square)
7. [Maximal Rectangle](#7-maximal-rectangle)
8. [Longest Increasing Path in a Matrix](#8-longest-increasing-path-in-a-matrix)
9. [Cherry Pickup](#9-cherry-pickup)
10. [Cherry Pickup II — Two Robots](#10-cherry-pickup-ii--two-robots)
11. [Number of Islands (DFS/BFS)](#11-number-of-islands-dfsbfs)
12. [Surrounded Regions](#12-surrounded-regions)
13. [Gold Mine Problem](#13-gold-mine-problem)
14. [Path with Maximum Gold](#14-path-with-maximum-gold)
15. [Count Paths with Exactly k Steps](#15-count-paths-with-exactly-k-steps)
16. [Bomb Enemy](#16-bomb-enemy)

---

## 1. Unique Paths — Count all Paths

### Problem

A robot starts at top-left of an `m × n` grid and can only move **right or down**. How many distinct paths to bottom-right?

**Example:**
```
m=3, n=7  →  Output: 28
m=3, n=2  →  Output: 3
```

**Recurrence:** `dp[i][j] = dp[i-1][j] + dp[i][j-1]` (paths from above + paths from left)

**Formula:** Answer = C(m+n-2, m-1) — binomial coefficient.

```cpp
#include <iostream>
#include <vector>
using namespace std;

// DP approach: O(mn) time, O(mn) space → O(n) with rolling array
int uniquePaths(int m, int n) {
    vector<vector<int>> dp(m, vector<int>(n, 1));  // first row and col = 1

    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[i][j] = dp[i-1][j] + dp[i][j-1];

    return dp[m-1][n-1];
}

// Space-optimized O(n)
int uniquePathsOpt(int m, int n) {
    vector<int> dp(n, 1);
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[j] += dp[j-1];   // dp[j] was "from above", dp[j-1] is "from left"
    return dp[n-1];
}

// Math formula: C(m+n-2, m-1)
long long uniquePathsMath(int m, int n) {
    long long result = 1;
    for (int i = 0; i < m-1; i++) {
        result = result * (n + i) / (i + 1);
    }
    return result;
}

int main() {
    cout << uniquePaths(3, 7) << endl;     // Output: 28
    cout << uniquePathsOpt(3, 7) << endl;  // Output: 28
    cout << uniquePathsMath(3, 7) << endl; // Output: 28
}
```

---

## 2. Unique Paths II — With Obstacles

### Problem

Same grid path problem but some cells are blocked (`obstacleGrid[i][j] = 1`). Count paths that avoid obstacles.

**Example:**
```
grid = [[0,0,0],
        [0,1,0],
        [0,0,0]]
Output: 2   (obstacle blocks the center; two paths remain)
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int uniquePathsWithObstacles(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    if (grid[0][0] == 1 || grid[m-1][n-1] == 1) return 0;

    vector<vector<long long>> dp(m, vector<long long>(n, 0));
    dp[0][0] = 1;

    // First column
    for (int i = 1; i < m; i++)
        dp[i][0] = (grid[i][0] == 0) ? dp[i-1][0] : 0;

    // First row
    for (int j = 1; j < n; j++)
        dp[0][j] = (grid[0][j] == 0) ? dp[0][j-1] : 0;

    // Rest of grid
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[i][j] = (grid[i][j] == 1) ? 0 : dp[i-1][j] + dp[i][j-1];

    return dp[m-1][n-1];
}

int main() {
    vector<vector<int>> g = {{0,0,0},{0,1,0},{0,0,0}};
    cout << uniquePathsWithObstacles(g) << endl;  // Output: 2
}
```

---

## 3. Minimum Path Sum

### Problem

Given a grid of non-negative numbers, find the path from top-left to bottom-right that has the **minimum sum**. You can only move right or down.

**Example:**
```
grid = [[1,3,1],
        [1,5,1],
        [4,2,1]]
Output: 7   →  path 1→3→1→1→1
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int minPathSum(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<vector<int>> dp(m, vector<int>(n, 0));
    dp[0][0] = grid[0][0];

    // First row: can only come from left
    for (int j = 1; j < n; j++) dp[0][j] = dp[0][j-1] + grid[0][j];

    // First column: can only come from above
    for (int i = 1; i < m; i++) dp[i][0] = dp[i-1][0] + grid[i][0];

    // Rest
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]);

    return dp[m-1][n-1];
}

// Space-optimized (in-place or 1D rolling)
int minPathSumOpt(vector<vector<int>> grid) {
    int m = grid.size(), n = grid[0].size();
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++) {
            if (i == 0 && j == 0) continue;
            int fromAbove = (i > 0) ? grid[i-1][j] : INT_MAX;
            int fromLeft  = (j > 0) ? grid[i][j-1] : INT_MAX;
            grid[i][j] += min(fromAbove, fromLeft);
        }
    return grid[m-1][n-1];
}

int main() {
    vector<vector<int>> g = {{1,3,1},{1,5,1},{4,2,1}};
    cout << minPathSum(g)    << endl;  // Output: 7
    cout << minPathSumOpt(g) << endl;  // Output: 7
}
```

---

## 4. Triangle — Minimum Path from Top to Bottom

### Problem

Given a triangle (list of rows), find the **minimum path sum** from top to bottom. At each step you can move to adjacent numbers (directly below or one position to the right on the next row).

**Example:**
```
triangle = [[2],
            [3,4],
            [6,5,7],
            [4,1,8,3]]
Output: 11   →  2+3+5+1
```

**Bottom-up approach:** Start from the second-to-last row and reduce upward. No extra space needed (modify triangle in-place, or use 1D array).

```cpp
#include <iostream>
#include <vector>
using namespace std;

int minimumTotal(vector<vector<int>>& triangle) {
    int n = triangle.size();
    // Start from the bottom-up: copy last row
    vector<int> dp = triangle[n-1];

    for (int i = n-2; i >= 0; i--) {
        for (int j = 0; j <= i; j++) {
            dp[j] = triangle[i][j] + min(dp[j], dp[j+1]);
        }
    }
    return dp[0];
}

int main() {
    vector<vector<int>> t = {{2},{3,4},{6,5,7},{4,1,8,3}};
    cout << minimumTotal(t) << endl;  // Output: 11

    vector<vector<int>> t2 = {{-10}};
    cout << minimumTotal(t2) << endl; // Output: -10
}
```

---

## 5. Dungeon Game — Minimum Health

### Problem

A knight starts at top-left of a dungeon and must reach the princess at bottom-right. Each room has a value (negative = damage, positive = health). The knight needs at least 1 health at all times. Find the **minimum initial health** required.

**Key Insight:** Work **backwards** from the princess's room (bottom-right to top-left). `dp[i][j]` = minimum health needed to survive from `(i,j)` to the end.

```cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int calculateMinimumHP(vector<vector<int>>& dungeon) {
    int m = dungeon.size(), n = dungeon[0].size();
    // dp[i][j] = min health needed when entering cell (i,j)
    vector<vector<int>> dp(m+1, vector<int>(n+1, INT_MAX));
    dp[m][n-1] = dp[m-1][n] = 1;  // border sentinels

    for (int i = m-1; i >= 0; i--) {
        for (int j = n-1; j >= 0; j--) {
            int minNext = min(dp[i+1][j], dp[i][j+1]);
            dp[i][j] = max(1, minNext - dungeon[i][j]);
            // need at least 1; if room has health, we need less going in
        }
    }
    return dp[0][0];
}

int main() {
    vector<vector<int>> d = {{-2,-3,3},{-5,-10,1},{10,30,-5}};
    cout << calculateMinimumHP(d) << endl;  // Output: 7

    vector<vector<int>> d2 = {{0}};
    cout << calculateMinimumHP(d2) << endl;  // Output: 1
}
```

---

## 6. Maximal Square

### Problem

Find the area of the **largest square** containing only 1s in a binary matrix.

**Recurrence:**
```
dp[i][j] = side length of largest square with bottom-right corner at (i,j)

if matrix[i][j] == '1':
  dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
else:
  dp[i][j] = 0
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int maximalSquare(vector<vector<char>>& matrix) {
    int m = matrix.size(), n = matrix[0].size();
    vector<vector<int>> dp(m, vector<int>(n, 0));
    int maxSide = 0;

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (matrix[i][j] == '1') {
                if (i == 0 || j == 0)
                    dp[i][j] = 1;
                else
                    dp[i][j] = min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]}) + 1;

                maxSide = max(maxSide, dp[i][j]);
            }
        }
    }
    return maxSide * maxSide;  // area = side²
}

int main() {
    vector<vector<char>> m1 = {{'1','0','1','0','0'},
                                {'1','0','1','1','1'},
                                {'1','1','1','1','1'},
                                {'1','0','0','1','0'}};
    cout << maximalSquare(m1) << endl;  // Output: 4 (2×2 square)
}
```

---

## 7. Maximal Rectangle

### Problem

Find the **largest rectangle** containing only 1s in a binary matrix.

**Approach:** Apply "Largest Rectangle in Histogram" (using stack) to each row, treating each row as a histogram where `heights[j]` = consecutive 1s ending at current row in column `j`.

```cpp
#include <iostream>
#include <vector>
#include <stack>
using namespace std;

int largestRectangleHistogram(vector<int>& heights) {
    int n = heights.size();
    stack<int> st;
    int maxArea = 0;

    for (int i = 0; i <= n; i++) {
        int h = (i == n) ? 0 : heights[i];
        while (!st.empty() && h < heights[st.top()]) {
            int height = heights[st.top()]; st.pop();
            int width  = st.empty() ? i : i - st.top() - 1;
            maxArea = max(maxArea, height * width);
        }
        st.push(i);
    }
    return maxArea;
}

int maximalRectangle(vector<vector<char>>& matrix) {
    if (matrix.empty()) return 0;
    int m = matrix.size(), n = matrix[0].size();
    vector<int> heights(n, 0);
    int maxArea = 0;

    for (int i = 0; i < m; i++) {
        // Build histogram heights for current row
        for (int j = 0; j < n; j++)
            heights[j] = (matrix[i][j] == '1') ? heights[j] + 1 : 0;

        maxArea = max(maxArea, largestRectangleHistogram(heights));
    }
    return maxArea;
}

int main() {
    vector<vector<char>> m1 = {{'1','0','1','0','0'},
                                {'1','0','1','1','1'},
                                {'1','1','1','1','1'},
                                {'1','0','0','1','0'}};
    cout << maximalRectangle(m1) << endl;  // Output: 6
}
```

---

## 8. Longest Increasing Path in a Matrix

### Problem

Find the length of the **longest strictly increasing path** in a matrix. You can move in 4 directions (up, down, left, right).

**Approach:** DFS + memoization. `dp[i][j]` = longest path starting at `(i,j)`.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int dfs(vector<vector<int>>& matrix, vector<vector<int>>& memo, int i, int j) {
    if (memo[i][j] != 0) return memo[i][j];

    int dirs[4][2] = {{0,1},{0,-1},{1,0},{-1,0}};
    int maxPath = 1;
    int m = matrix.size(), n = matrix[0].size();

    for (auto& d : dirs) {
        int ni = i + d[0], nj = j + d[1];
        if (ni >= 0 && ni < m && nj >= 0 && nj < n && matrix[ni][nj] > matrix[i][j]) {
            maxPath = max(maxPath, 1 + dfs(matrix, memo, ni, nj));
        }
    }
    return memo[i][j] = maxPath;
}

int longestIncreasingPath(vector<vector<int>>& matrix) {
    int m = matrix.size(), n = matrix[0].size();
    vector<vector<int>> memo(m, vector<int>(n, 0));
    int result = 0;

    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            result = max(result, dfs(matrix, memo, i, j));

    return result;
}

int main() {
    vector<vector<int>> m1 = {{9,9,4},{6,6,8},{2,1,1}};
    cout << longestIncreasingPath(m1) << endl;  // Output: 4 (1→2→6→9)

    vector<vector<int>> m2 = {{3,4,5},{3,2,6},{2,2,1}};
    cout << longestIncreasingPath(m2) << endl;  // Output: 4 (3→4→5→6)
}
```

---

## 9. Cherry Pickup

### Problem

In an `n × n` grid (values 0=empty, 1=cherry, -1=thorn), pick the maximum cherries: go from top-left to bottom-right, then back (or equivalently, **two people simultaneously** going top-left → bottom-right).

**Key Insight:** Two simultaneous paths = two robots both starting at `(0,0)`. If both are at step `t`, they're at rows `r1`, `r2` where `c1=t-r1` and `c2=t-r2`. Just track `(r1, r2, t)`.

```cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int cherryPickup(vector<vector<int>>& grid) {
    int n = grid.size();
    // dp[r1][r2] at step t = max cherries; c1=t-r1, c2=t-r2
    vector<vector<int>> dp(n, vector<int>(n, INT_MIN));
    dp[0][0] = grid[0][0];

    for (int t = 1; t < 2*n - 1; t++) {
        vector<vector<int>> ndp(n, vector<int>(n, INT_MIN));
        for (int r1 = max(0, t-(n-1)); r1 <= min(t, n-1); r1++) {
            for (int r2 = r1; r2 <= min(t, n-1); r2++) {
                int c1 = t - r1, c2 = t - r2;
                if (c1 >= n || c2 >= n) continue;
                if (grid[r1][c1] == -1 || grid[r2][c2] == -1) continue;

                int cherries = grid[r1][c1] + (r1 != r2 ? grid[r2][c2] : 0);

                // Try all 4 combinations of previous steps
                int best = INT_MIN;
                for (int dr1 : {0, 1}) {
                    for (int dr2 : {0, 1}) {
                        int pr1 = r1 - dr1, pr2 = r2 - dr2;
                        if (pr1 >= 0 && pr2 >= 0 && dp[pr1][pr2] != INT_MIN)
                            best = max(best, dp[pr1][pr2]);
                    }
                }
                if (best != INT_MIN)
                    ndp[r1][r2] = max(ndp[r1][r2], best + cherries);
            }
        }
        dp = ndp;
    }
    return max(0, dp[n-1][n-1]);
}

int main() {
    vector<vector<int>> g = {{0,1,-1},{1,0,-1},{1,1,1}};
    cout << cherryPickup(g) << endl;  // Output: 5
}
```

---

## 10. Cherry Pickup II — Two Robots

### Problem

Same grid but two robots start at row 0, columns 0 and n-1. They can each move to the adjacent row (all 3 directions: left, straight, right). Count maximum cherries (if both pick from same cell, count once).

```cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int cherryPickup2(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    // dp[c1][c2] = max cherries when robot1 at col c1, robot2 at col c2, current row
    vector<vector<int>> dp(n, vector<int>(n, 0));

    // Initialize row 0
    for (int c1 = 0; c1 < n; c1++)
        for (int c2 = 0; c2 < n; c2++)
            dp[c1][c2] = grid[0][c1] + (c1 != c2 ? grid[0][c2] : 0);

    for (int r = 1; r < m; r++) {
        vector<vector<int>> ndp(n, vector<int>(n, INT_MIN));
        for (int c1 = 0; c1 < n; c1++) {
            for (int c2 = 0; c2 < n; c2++) {
                int cherries = grid[r][c1] + (c1 != c2 ? grid[r][c2] : 0);
                for (int dc1 = -1; dc1 <= 1; dc1++) {
                    for (int dc2 = -1; dc2 <= 1; dc2++) {
                        int pc1 = c1 + dc1, pc2 = c2 + dc2;
                        if (pc1 >= 0 && pc1 < n && pc2 >= 0 && pc2 < n && dp[pc1][pc2] != INT_MIN)
                            ndp[c1][c2] = max(ndp[c1][c2], dp[pc1][pc2] + cherries);
                    }
                }
            }
        }
        dp = ndp;
    }

    int result = 0;
    for (auto& row : dp)
        for (int x : row) result = max(result, x);
    return result;
}

int main() {
    vector<vector<int>> g = {{3,1,1},{2,5,1},{1,5,5},{2,1,1}};
    cout << cherryPickup2(g) << endl;  // Output: 24
}
```

---

## 11. Number of Islands (DFS/BFS)

### Problem

Given a 2D binary grid where `'1'`=land and `'0'`=water, count the **number of islands** (connected groups of land cells).

```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

// DFS approach
void dfs(vector<vector<char>>& grid, int i, int j) {
    if (i < 0 || i >= (int)grid.size() || j < 0 || j >= (int)grid[0].size()
        || grid[i][j] != '1') return;
    grid[i][j] = '0';  // mark visited
    dfs(grid, i+1, j); dfs(grid, i-1, j);
    dfs(grid, i, j+1); dfs(grid, i, j-1);
}

int numIslands(vector<vector<char>>& grid) {
    int count = 0;
    for (int i = 0; i < (int)grid.size(); i++)
        for (int j = 0; j < (int)grid[0].size(); j++)
            if (grid[i][j] == '1') { dfs(grid, i, j); count++; }
    return count;
}

int main() {
    vector<vector<char>> g = {
        {'1','1','0','0','0'},
        {'1','1','0','0','0'},
        {'0','0','1','0','0'},
        {'0','0','0','1','1'}
    };
    cout << numIslands(g) << endl;  // Output: 3
}
```

---

## 12. Surrounded Regions

### Problem

Given a board of 'X' and 'O', flip all 'O's that are completely **surrounded** by 'X's (not connected to the border).

**Approach:** Mark all 'O's connected to the border as safe (DFS/BFS). Then flip all remaining 'O's.

```cpp
#include <iostream>
#include <vector>
using namespace std;

void mark(vector<vector<char>>& board, int i, int j) {
    int m = board.size(), n = board[0].size();
    if (i < 0||i >= m||j < 0||j >= n||board[i][j] != 'O') return;
    board[i][j] = 'S';  // safe
    mark(board, i+1, j); mark(board, i-1, j);
    mark(board, i, j+1); mark(board, i, j-1);
}

void solve(vector<vector<char>>& board) {
    int m = board.size(), n = board[0].size();

    // Mark border-connected O's as safe
    for (int i = 0; i < m; i++) { mark(board, i, 0); mark(board, i, n-1); }
    for (int j = 0; j < n; j++) { mark(board, 0, j); mark(board, m-1, j); }

    // Flip: unsafe O→X, restore safe S→O
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            board[i][j] = (board[i][j] == 'S') ? 'O' : (board[i][j]=='O' ? 'X' : board[i][j]);
}

int main() {
    vector<vector<char>> b = {{'X','X','X','X'},
                               {'X','O','O','X'},
                               {'X','X','O','X'},
                               {'X','O','X','X'}};
    solve(b);
    for (auto& row : b) { for (char c : row) cout << c; cout << "\n"; }
    // Output: XXXX / XXXX / XXXX / XOXX
}
```

---

## 13. Gold Mine Problem

### Problem

In an `m × n` grid where each cell has some gold, a miner starts from any cell in the **first column** and moves to the next column via right, right-up, or right-down. Find the path collecting **maximum gold**.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int goldMine(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<vector<int>> dp = grid;  // copy

    for (int j = 1; j < n; j++) {
        for (int i = 0; i < m; i++) {
            int fromRight    = dp[i][j-1];
            int fromRightUp  = (i > 0) ? dp[i-1][j-1] : 0;
            int fromRightDown= (i < m-1) ? dp[i+1][j-1] : 0;
            dp[i][j] = grid[i][j] + max({fromRight, fromRightUp, fromRightDown});
        }
    }

    int maxGold = 0;
    for (int i = 0; i < m; i++) maxGold = max(maxGold, dp[i][n-1]);
    return maxGold;
}

int main() {
    vector<vector<int>> g = {{1,3,1,5},
                              {2,2,4,1},
                              {5,0,2,3},
                              {0,6,1,2}};
    cout << goldMine(g) << endl;  // Output: 16 (5+6+4+1 or check other paths)
}
```

---

## 14. Path with Maximum Gold

### Problem

In a grid where each cell has gold ≥ 0 (zeros are walls you can skip but not collect), collect the **maximum gold** starting from any non-zero cell, moving in 4 directions, visiting each cell at most once.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int dfsGold(vector<vector<int>>& grid, int i, int j) {
    int m = grid.size(), n = grid[0].size();
    if (i < 0||i >= m||j < 0||j >= n||grid[i][j] == 0) return 0;

    int gold = grid[i][j];
    grid[i][j] = 0;  // mark visited

    int best = max({dfsGold(grid, i+1, j), dfsGold(grid, i-1, j),
                    dfsGold(grid, i, j+1), dfsGold(grid, i, j-1)});

    grid[i][j] = gold;  // restore
    return gold + best;
}

int getMaximumGold(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size(), maxGold = 0;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (grid[i][j] != 0)
                maxGold = max(maxGold, dfsGold(grid, i, j));
    return maxGold;
}

int main() {
    vector<vector<int>> g = {{0,6,0},{5,8,7},{0,9,0}};
    cout << getMaximumGold(g) << endl;  // Output: 24 (9+8+7)
}
```

---

## 15. Count Paths with Exactly k Steps

### Problem

In an `m × n` grid, count paths from `(0,0)` to `(m-1,n-1)` using **exactly k steps** (moving right or down).

```cpp
#include <iostream>
#include <vector>
using namespace std;

int countPaths(int m, int n, int k) {
    // For right/down only: exactly k = (m-1)+(n-1) steps gives unique paths
    // If k < (m-1)+(n-1): impossible. If k == required: same as Unique Paths.
    // General: DP with state (i, j, steps_remaining)

    int needed = (m-1) + (n-1);
    if (k < needed || (k - needed) % 2 != 0) return 0;
    // Extra steps must go in pairs (right+left or down+up)

    // Simple DP for exactly (m-1)+(n-1) steps:
    if (k == needed) {
        vector<vector<int>> dp(m, vector<int>(n, 0));
        dp[0][0] = 1;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) {
                if (i==0&&j==0) continue;
                if (i > 0) dp[i][j] += dp[i-1][j];
                if (j > 0) dp[i][j] += dp[i][j-1];
            }
        return dp[m-1][n-1];
    }
    return -1; // general case requires 3D DP
}

// General: allow all 4 directions, count paths with exactly k steps  
int countPathsGeneral(vector<vector<int>>& grid, int k) {
    int m = grid.size(), n = grid[0].size();
    // dp[step][i][j] = ways to reach (i,j) in exactly 'step' steps
    vector<vector<vector<int>>> dp(k+1, vector<vector<int>>(m, vector<int>(n, 0)));
    dp[0][0][0] = 1;

    int dirs[4][2] = {{0,1},{0,-1},{1,0},{-1,0}};
    for (int s = 1; s <= k; s++) {
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                for (auto& d : dirs) {
                    int pi = i - d[0], pj = j - d[1];
                    if (pi >= 0 && pi < m && pj >= 0 && pj < n)
                        dp[s][i][j] += dp[s-1][pi][pj];
                }
            }
        }
    }
    return dp[k][m-1][n-1];
}

int main() {
    cout << countPaths(3, 3, 4) << endl;  // Output: 6

    vector<vector<int>> g(3, vector<int>(3, 1));
    cout << countPathsGeneral(g, 4) << endl;
}
```

---

## 16. Bomb Enemy

### Problem

In a grid of 'W' (wall), 'E' (enemy), '0' (empty), you can place a bomb in one empty cell. The bomb kills all enemies in the same row and column until stopped by a wall. Find the **maximum enemies** a single bomb can kill.

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int maxKilledEnemies(vector<string>& grid) {
    if (grid.empty()) return 0;
    int m = grid.size(), n = grid[0].size();
    int maxResult = 0;
    int rowHits = 0;
    vector<int> colHits(n, 0);

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            // Recount row hits if at start or after wall
            if (j == 0 || grid[i][j-1] == 'W') {
                rowHits = 0;
                for (int k = j; k < n && grid[i][k] != 'W'; k++)
                    if (grid[i][k] == 'E') rowHits++;
            }
            // Recount col hits if at top or after wall
            if (i == 0 || grid[i-1][j] == 'W') {
                colHits[j] = 0;
                for (int k = i; k < m && grid[k][j] != 'W'; k++)
                    if (grid[k][j] == 'E') colHits[j]++;
            }
            if (grid[i][j] == '0')
                maxResult = max(maxResult, rowHits + colHits[j]);
        }
    }
    return maxResult;
}

int main() {
    vector<string> g = {"0E00", "E0WE", "0E00"};
    cout << maxKilledEnemies(g) << endl;  // Output: 3
}
```

---

## Grid DP — Pattern Summary

| Pattern | Direction | State | Recurrence |
|---|---|---|---|
| Count paths | Top-left → Bottom-right | dp[i][j] = # paths | dp[i-1][j] + dp[i][j-1] |
| Min cost path | Top-left → Bottom-right | dp[i][j] = min cost | grid[i][j] + min(above, left) |
| Triangle min path | Top-down → bottom | dp[row] = min path sum | dp[j] = row[j] + min(dp[j], dp[j+1]) |
| Dungeon game | **Bottom-right → Top-left** | min health needed | max(1, min(right,down) - val) |
| Maximal square | Top-left scan | side length at corner | min(left, above, diagonal) + 1 |
| LIP in matrix | DFS + memo | longest path from (i,j) | max of 4 neighbors + 1 |
| Gold/Islands | DFS from each start | visited + backtrack | explore 4 directions |

## Complexity Quick Reference

| Problem | Time | Space |
|---|---|---|
| Unique Paths | O(mn) | O(n) |
| Unique Paths II | O(mn) | O(mn) |
| Minimum Path Sum | O(mn) | O(1) in-place |
| Triangle Min Path | O(n²) | O(n) |
| Dungeon Game | O(mn) | O(mn) |
| Maximal Square | O(mn) | O(mn) → O(n) |
| Maximal Rectangle | O(mn) | O(n) |
| Longest Increasing Path | O(mn) | O(mn) |
| Cherry Pickup | O(n³) | O(n²) |
| Cherry Pickup II | O(m × n²) | O(n²) |
| Number of Islands | O(mn) | O(mn) stack |
| Gold Mine | O(mn) | O(mn) |
| Path Maximum Gold | O(mn × 3^path) | O(mn) |
| Bomb Enemy | O(mn) | O(n) |
