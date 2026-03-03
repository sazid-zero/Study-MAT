---
layout: docs
title: Backtracking
permalink: /backtracking/
---

[⬅️ Back to Home]({{ '/' | relative_url }})

---
# Backtracking

## Core Concept

Backtracking = exhaustive DFS over decision tree with pruning. Each call makes a choice, recurses, then undoes the choice.

```
void backtrack(state) {
    if (goal reached) { record solution; return; }
    for (choice : possible choices) {
        make choice;
        backtrack(new state);
        undo choice;        // ← THE KEY: restore so next iteration is clean
    }
}
```

---

## Table of Contents

1. [Subsets / Power Set](#1-subsets--power-set)
2. [Subsets with Duplicates](#2-subsets-with-duplicates)
3. [Permutations (distinct elements)](#3-permutations-distinct-elements)
4. [Permutations with Duplicates](#4-permutations-with-duplicates)
5. [Combinations (k of n)](#5-combinations-k-of-n)
6. [Combination Sum I (unlimited use)](#6-combination-sum-i-unlimited-use)
7. [Combination Sum II (each element once)](#7-combination-sum-ii-each-element-once)
8. [Combination Sum III (k numbers summing to n)](#8-combination-sum-iii-k-numbers-summing-to-n)
9. [Letter Combinations — Phone Number](#9-letter-combinations--phone-number)
10. [Palindrome Partitioning](#10-palindrome-partitioning)
11. [Word Search in Grid](#11-word-search-in-grid)
12. [N-Queens (all solutions)](#12-n-queens-all-solutions)
13. [N-Queens II (count solutions)](#13-n-queens-ii-count-solutions)
14. [Sudoku Solver](#14-sudoku-solver)
15. [Rat in a Maze](#15-rat-in-a-maze)
16. [Knight's Tour](#16-knights-tour)
17. [Graph Coloring (m-coloring)](#17-graph-coloring-m-coloring)
18. [Generate Parentheses](#18-generate-parentheses)
19. [Expression Add Operators](#19-expression-add-operators)
20. [Restore IP Addresses](#20-restore-ip-addresses)

---

## 1. Subsets / Power Set

**Problem:** Given `n` distinct integers, return all 2^n subsets.

**Approach:** At each index, decide: include or skip.

```cpp
#include <iostream>
#include <vector>
using namespace std;

void backtrack(vector<int>& nums, int start, vector<int>& curr, vector<vector<int>>& res) {
    res.push_back(curr);  // every partial state is a valid subset
    for (int i = start; i < (int)nums.size(); i++) {
        curr.push_back(nums[i]);       // include
        backtrack(nums, i+1, curr, res);
        curr.pop_back();               // undo (skip)
    }
}

vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> res;
    vector<int> curr;
    backtrack(nums, 0, curr, res);
    return res;
}

// Bitmask approach — iterative
vector<vector<int>> subsetsBitmask(vector<int>& nums) {
    int n = nums.size();
    vector<vector<int>> res;
    for (int mask = 0; mask < (1 << n); mask++) {
        vector<int> sub;
        for (int i = 0; i < n; i++)
            if ((mask >> i) & 1) sub.push_back(nums[i]);
        res.push_back(sub);
    }
    return res;
}

int main() {
    vector<int> nums = {1, 2, 3};
    auto res = subsets(nums);
    for (auto& s : res) {
        cout << "["; for (int i = 0; i < (int)s.size(); i++) cout << (i?",":"") << s[i]; cout << "]\n";
    }
    // [], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]  → 8 subsets
}
```

---

## 2. Subsets with Duplicates

**Problem:** Input may contain duplicates. Return all unique subsets.

**Key:** Sort first + skip duplicate siblings at same recursion depth.

```cpp
#include <algorithm>
#include <vector>
using namespace std;

void backtrack(vector<int>& nums, int start, vector<int>& curr, vector<vector<int>>& res) {
    res.push_back(curr);
    for (int i = start; i < (int)nums.size(); i++) {
        // Skip duplicate choices at the SAME level (not deeper)
        if (i > start && nums[i] == nums[i-1]) continue;
        curr.push_back(nums[i]);
        backtrack(nums, i+1, curr, res);
        curr.pop_back();
    }
}

vector<vector<int>> subsetsWithDup(vector<int>& nums) {
    sort(nums.begin(), nums.end());  // MUST sort for duplicate skip to work
    vector<vector<int>> res;
    vector<int> curr;
    backtrack(nums, 0, curr, res);
    return res;
}
```

---

## 3. Permutations (distinct elements)

**Problem:** Generate all n! permutations of n distinct integers.

```cpp
#include <vector>
using namespace std;

void backtrack(vector<int>& nums, vector<bool>& used, vector<int>& curr, vector<vector<int>>& res) {
    if ((int)curr.size() == (int)nums.size()) { res.push_back(curr); return; }
    for (int i = 0; i < (int)nums.size(); i++) {
        if (used[i]) continue;
        used[i] = true;
        curr.push_back(nums[i]);
        backtrack(nums, used, curr, res);
        curr.pop_back();
        used[i] = false;
    }
}

vector<vector<int>> permute(vector<int>& nums) {
    int n = nums.size();
    vector<vector<int>> res;
    vector<bool> used(n, false);
    vector<int> curr;
    backtrack(nums, used, curr, res);
    return res;
}

// Swap-based approach (in-place, no extra used array)
void permuteSwap(vector<int>& nums, int start, vector<vector<int>>& res) {
    if (start == (int)nums.size()) { res.push_back(nums); return; }
    for (int i = start; i < (int)nums.size(); i++) {
        swap(nums[start], nums[i]);
        permuteSwap(nums, start+1, res);
        swap(nums[start], nums[i]);  // restore
    }
}
```

---

## 4. Permutations with Duplicates

**Problem:** Input contains duplicates. Return only unique permutations.

```cpp
#include <vector>
#include <algorithm>
using namespace std;

void backtrack(vector<int>& nums, vector<bool>& used, vector<int>& curr, vector<vector<int>>& res) {
    if ((int)curr.size() == (int)nums.size()) { res.push_back(curr); return; }
    for (int i = 0; i < (int)nums.size(); i++) {
        if (used[i]) continue;
        // Skip if same value and prev sibling not yet used (avoids duplicates)
        if (i > 0 && nums[i] == nums[i-1] && !used[i-1]) continue;
        used[i] = true;
        curr.push_back(nums[i]);
        backtrack(nums, used, curr, res);
        curr.pop_back();
        used[i] = false;
    }
}

vector<vector<int>> permuteUnique(vector<int>& nums) {
    sort(nums.begin(), nums.end());  // sort for duplicate detection
    int n = nums.size();
    vector<vector<int>> res;
    vector<bool> used(n, false);
    vector<int> curr;
    backtrack(nums, used, curr, res);
    return res;
}
```

---

## 5. Combinations (k of n)

**Problem:** Choose k elements from {1, ..., n}. Return all C(n,k) combinations.

```cpp
#include <vector>
using namespace std;

void backtrack(int n, int k, int start, vector<int>& curr, vector<vector<int>>& res) {
    if ((int)curr.size() == k) { res.push_back(curr); return; }
    // Pruning: need k-curr.size() more elements, last valid start = n-(k-curr.size())+1
    for (int i = start; i <= n - (k - (int)curr.size()) + 1; i++) {
        curr.push_back(i);
        backtrack(n, k, i+1, curr, res);
        curr.pop_back();
    }
}

vector<vector<int>> combine(int n, int k) {
    vector<vector<int>> res;
    vector<int> curr;
    backtrack(n, k, 1, curr, res);
    return res;
}
```

---

## 6. Combination Sum I (unlimited use)

**Problem:** Given candidates (no duplicates), find all combinations summing to target. Each number can be used unlimited times.

```cpp
#include <vector>
using namespace std;

void backtrack(vector<int>& cands, int start, int remain, vector<int>& curr, vector<vector<int>>& res) {
    if (remain == 0) { res.push_back(curr); return; }
    for (int i = start; i < (int)cands.size(); i++) {
        if (cands[i] > remain) break;  // sorted: no point going further
        curr.push_back(cands[i]);
        backtrack(cands, i, remain - cands[i], curr, res);  // i (not i+1): allow reuse
        curr.pop_back();
    }
}

vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
    sort(candidates.begin(), candidates.end());
    vector<vector<int>> res;
    vector<int> curr;
    backtrack(candidates, 0, target, curr, res);
    return res;
}
```

---

## 7. Combination Sum II (each element once)

**Problem:** Like Combination Sum I but each number used at most once, input may have duplicates.

```cpp
#include <vector>
#include <algorithm>
using namespace std;

void backtrack(vector<int>& cands, int start, int remain, vector<int>& curr, vector<vector<int>>& res) {
    if (remain == 0) { res.push_back(curr); return; }
    for (int i = start; i < (int)cands.size(); i++) {
        if (cands[i] > remain) break;
        if (i > start && cands[i] == cands[i-1]) continue;  // skip same sibling
        curr.push_back(cands[i]);
        backtrack(cands, i+1, remain - cands[i], curr, res);  // i+1: each used once
        curr.pop_back();
    }
}

vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
    sort(candidates.begin(), candidates.end());
    vector<vector<int>> res;
    vector<int> curr;
    backtrack(candidates, 0, target, curr, res);
    return res;
}
```

---

## 8. Combination Sum III (k numbers summing to n)

**Problem:** Find all combinations of exactly k numbers from 1–9 that sum to n. Each number used at most once.

```cpp
#include <vector>
using namespace std;

void backtrack(int k, int n, int start, vector<int>& curr, vector<vector<int>>& res) {
    if (k == 0 && n == 0) { res.push_back(curr); return; }
    if (k == 0 || n <= 0) return;
    for (int i = start; i <= 9 && i <= n; i++) {
        curr.push_back(i);
        backtrack(k-1, n-i, i+1, curr, res);
        curr.pop_back();
    }
}

vector<vector<int>> combinationSum3(int k, int n) {
    vector<vector<int>> res;
    vector<int> curr;
    backtrack(k, n, 1, curr, res);
    return res;
}
```

---

## 9. Letter Combinations — Phone Number

**Problem:** Given digits 2–9, return all possible letter combinations from phone keypad.

```cpp
#include <string>
#include <vector>
using namespace std;

void backtrack(const string& digits, int idx, const vector<string>& phone,
               string& curr, vector<string>& res) {
    if (idx == (int)digits.size()) { res.push_back(curr); return; }
    for (char c : phone[digits[idx] - '2']) {
        curr.push_back(c);
        backtrack(digits, idx+1, phone, curr, res);
        curr.pop_back();
    }
}

vector<string> letterCombinations(string digits) {
    if (digits.empty()) return {};
    vector<string> phone = {"abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};
    vector<string> res;
    string curr;
    backtrack(digits, 0, phone, curr, res);
    return res;
}
```

---

## 10. Palindrome Partitioning

**Problem:** Partition string s such that every substring is a palindrome. Return all such partitions.

```cpp
#include <string>
#include <vector>
#include <functional>
using namespace std;

bool isPalin(const string& s, int l, int r) {
    while (l < r) if (s[l++] != s[r--]) return false;
    return true;
}

vector<vector<string>> partition(string s) {
    int n = s.size();
    vector<vector<string>> res;
    vector<string> curr;

    function<void(int)> backtrack = [&](int start) {
        if (start == n) { res.push_back(curr); return; }
        for (int end = start; end < n; end++) {
            if (isPalin(s, start, end)) {
                curr.push_back(s.substr(start, end - start + 1));
                backtrack(end + 1);
                curr.pop_back();
            }
        }
    };
    backtrack(0);
    return res;
}

// Optimization: precompute palindrome table
vector<vector<string>> partitionOpt(string s) {
    int n = s.size();
    vector<vector<bool>> isPal(n, vector<bool>(n, false));
    for (int len = 1; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            isPal[i][j] = (s[i] == s[j]) && (len <= 2 || isPal[i+1][j-1]);
        }

    vector<vector<string>> res;
    vector<string> curr;

    function<void(int)> bt = [&](int start) {
        if (start == n) { res.push_back(curr); return; }
        for (int end = start; end < n; end++) {
            if (isPal[start][end]) {
                curr.push_back(s.substr(start, end - start + 1));
                bt(end + 1);
                curr.pop_back();
            }
        }
    };
    bt(0);
    return res;
}
```

---

## 11. Word Search in Grid

**Problem:** Given an m×n board, find if word exists as a connected horizontal/vertical path.

```cpp
#include <vector>
#include <string>
using namespace std;

int dirs[4][2] = {{0,1},{0,-1},{1,0},{-1,0}};

bool dfs(vector<vector<char>>& board, const string& word, int r, int c, int idx) {
    if (idx == (int)word.size()) return true;
    int m = board.size(), n = board[0].size();
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] != word[idx]) return false;

    char temp = board[r][c];
    board[r][c] = '#';  // mark visited

    for (auto& d : dirs)
        if (dfs(board, word, r+d[0], c+d[1], idx+1)) {
            board[r][c] = temp;  // restore before returning (optional optimization: don't restore if no other path)
            return true;
        }

    board[r][c] = temp;  // restore
    return false;
}

bool exist(vector<vector<char>>& board, string word) {
    int m = board.size(), n = board[0].size();
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (dfs(board, word, i, j, 0)) return true;
    return false;
}
```

---

## 12. N-Queens (all solutions)

**Problem:** Place n queens on an n×n board so none attack each other. Return all valid configurations.

```cpp
#include <vector>
#include <string>
using namespace std;

vector<vector<string>> solveNQueens(int n) {
    vector<vector<string>> res;
    vector<string> board(n, string(n, '.'));

    // Track occupied columns and both diagonals
    vector<bool> col(n, false), diag1(2*n, false), diag2(2*n, false);

    function<void(int)> backtrack = [&](int row) {
        if (row == n) { res.push_back(board); return; }
        for (int c = 0; c < n; c++) {
            // diag1: row-col, diag2: row+col (add n to shift negative index)
            if (col[c] || diag1[row-c+n] || diag2[row+c]) continue;
            col[c] = diag1[row-c+n] = diag2[row+c] = true;
            board[row][c] = 'Q';
            backtrack(row+1);
            board[row][c] = '.';
            col[c] = diag1[row-c+n] = diag2[row+c] = false;
        }
    };
    backtrack(0);
    return res;
}

int main() {
    auto res = solveNQueens(4);
    cout << res.size() << " solutions\n";  // 2
    for (auto& board : res) {
        for (auto& row : board) cout << row << "\n";
        cout << "\n";
    }
}
```

---

## 13. N-Queens II (count solutions)

```cpp
int totalNQueens(int n) {
    int count = 0;
    vector<bool> col(n, false), d1(2*n, false), d2(2*n, false);
    function<void(int)> bt = [&](int row) {
        if (row == n) { count++; return; }
        for (int c = 0; c < n; c++) {
            if (col[c] || d1[row-c+n] || d2[row+c]) continue;
            col[c] = d1[row-c+n] = d2[row+c] = true;
            bt(row+1);
            col[c] = d1[row-c+n] = d2[row+c] = false;
        }
    };
    bt(0);
    return count;
}

// Bitmasking N-Queens (fastest)
int totalNQueensBS(int n) {
    int count = 0;
    int full = (1 << n) - 1;  // all n columns filled
    function<void(int,int,int)> bt = [&](int cols, int d1, int d2) {
        if (cols == full) { count++; return; }
        int avail = full & ~(cols | d1 | d2);
        while (avail) {
            int bit = avail & (-avail);  // lowest set bit = rightmost free column
            avail &= avail - 1;
            bt(cols | bit, (d1 | bit) << 1, (d2 | bit) >> 1);
        }
    };
    bt(0, 0, 0);
    return count;
}
```

---

## 14. Sudoku Solver

**Problem:** Fill a 9×9 sudoku board with digits so each row, col, and 3×3 box contains 1–9 exactly once. Exactly one solution guaranteed.

```cpp
#include <vector>
using namespace std;

bool isValid(vector<vector<char>>& board, int row, int col, char num) {
    int boxRow = (row / 3) * 3, boxCol = (col / 3) * 3;
    for (int i = 0; i < 9; i++) {
        if (board[row][i] == num) return false;  // same row
        if (board[i][col] == num) return false;  // same col
        if (board[boxRow + i/3][boxCol + i%3] == num) return false;  // same box
    }
    return true;
}

bool solve(vector<vector<char>>& board) {
    for (int r = 0; r < 9; r++) {
        for (int c = 0; c < 9; c++) {
            if (board[r][c] != '.') continue;
            for (char num = '1'; num <= '9'; num++) {
                if (!isValid(board, r, c, num)) continue;
                board[r][c] = num;
                if (solve(board)) return true;
                board[r][c] = '.';  // backtrack
            }
            return false;  // no valid number → backtrack
        }
    }
    return true;  // all cells filled
}

void solveSudoku(vector<vector<char>>& board) { solve(board); }
```

---

## 15. Rat in a Maze

**Problem:** Rat starts at (0,0) in an n×n binary grid and must reach (n-1,n-1). Find all paths. Can move in 4 directions.

```cpp
#include <vector>
#include <string>
#include <functional>
using namespace std;

vector<string> findPaths(vector<vector<int>>& maze) {
    int n = maze.size();
    vector<string> res;
    vector<vector<bool>> visited(n, vector<bool>(n, false));
    string path;

    auto valid = [&](int r, int c) {
        return r >= 0 && r < n && c >= 0 && c < n && !visited[r][c] && maze[r][c] == 1;
    };

    // D=Down, L=Left, R=Right, U=Up (sorted alphabetically for lexicographic order)
    int dr[] = {1, 0, 0, -1};
    int dc[] = {0, -1, 1, 0};
    char dir[] = {'D', 'L', 'R', 'U'};

    function<void(int,int)> bt = [&](int r, int c) {
        if (r == n-1 && c == n-1) { res.push_back(path); return; }
        visited[r][c] = true;
        for (int d = 0; d < 4; d++) {
            int nr = r + dr[d], nc = c + dc[d];
            if (valid(nr, nc)) {
                path.push_back(dir[d]);
                bt(nr, nc);
                path.pop_back();
            }
        }
        visited[r][c] = false;
    };

    if (maze[0][0] && maze[n-1][n-1]) bt(0, 0);
    return res;
}
```

---

## 16. Knight's Tour

**Problem:** Move a knight on an n×n chessboard visiting every cell exactly once.

```cpp
#include <vector>
#include <iostream>
using namespace std;

int dx[] = {2, 1, -1, -2, -2, -1, 1, 2};
int dy[] = {1, 2, 2, 1, -1, -2, -2, -1};

// Warnsdorff's heuristic: choose move with fewest onward moves (greedy backtracking)
int onwardMoves(vector<vector<int>>& board, int x, int y, int n) {
    int count = 0;
    for (int k = 0; k < 8; k++) {
        int nx = x + dx[k], ny = y + dy[k];
        if (nx >= 0 && nx < n && ny >= 0 && ny < n && board[nx][ny] == -1) count++;
    }
    return count;
}

bool knightsTour(vector<vector<int>>& board, int x, int y, int move, int n) {
    if (move == n*n) return true;

    // Try moves sorted by Warnsdorff's count (fewest options first)
    vector<pair<int,int>> nextMoves;
    for (int k = 0; k < 8; k++) {
        int nx = x + dx[k], ny = y + dy[k];
        if (nx >= 0 && nx < n && ny >= 0 && ny < n && board[nx][ny] == -1) {
            int w = onwardMoves(board, nx, ny, n);
            nextMoves.push_back({w, k});
        }
    }
    sort(nextMoves.begin(), nextMoves.end());  // Warnsdorff: prefer fewer onward moves

    for (auto [w, k] : nextMoves) {
        int nx = x + dx[k], ny = y + dy[k];
        board[nx][ny] = move;
        if (knightsTour(board, nx, ny, move+1, n)) return true;
        board[nx][ny] = -1;
    }
    return false;
}

void solveKnightsTour(int n) {
    vector<vector<int>> board(n, vector<int>(n, -1));
    board[0][0] = 0;
    if (knightsTour(board, 0, 0, 1, n)) {
        for (auto& row : board) { for (int v : row) cout << v << "\t"; cout << "\n"; }
    } else {
        cout << "No solution\n";
    }
}
```

---

## 17. Graph Coloring (m-coloring)

**Problem:** Given an undirected graph and m colors, determine if all vertices can be colored such that no two adjacent vertices share a color.

```cpp
#include <vector>
#include <iostream>
using namespace std;

bool isSafe(vector<vector<int>>& adj, vector<int>& color, int v, int c, int n) {
    for (int u = 0; u < n; u++)
        if (adj[v][u] && color[u] == c) return false;
    return true;
}

bool graphColor(vector<vector<int>>& adj, int m, vector<int>& color, int v, int n) {
    if (v == n) return true;  // all vertices colored
    for (int c = 1; c <= m; c++) {
        if (isSafe(adj, color, v, c, n)) {
            color[v] = c;
            if (graphColor(adj, m, color, v+1, n)) return true;
            color[v] = 0;  // backtrack
        }
    }
    return false;
}

bool mColoring(vector<vector<int>>& adj, int m) {
    int n = adj.size();
    vector<int> color(n, 0);
    return graphColor(adj, m, color, 0, n);
}
```

---

## 18. Generate Parentheses

**Problem:** Generate all combinations of n pairs of well-formed parentheses.

```cpp
#include <vector>
#include <string>
#include <functional>
using namespace std;

vector<string> generateParenthesis(int n) {
    vector<string> res;
    function<void(string, int, int)> bt = [&](string cur, int open, int close) {
        if ((int)cur.size() == 2*n) { res.push_back(cur); return; }
        if (open < n)     bt(cur + '(', open+1, close);
        if (close < open) bt(cur + ')', open, close+1);
    };
    bt("", 0, 0);
    return res;
}
```

---

## 19. Expression Add Operators

**Problem:** Given a string of digits and a target, add +, -, * between digits to reach target. Return all valid expressions.

```cpp
#include <string>
#include <vector>
#include <functional>
using namespace std;

vector<string> addOperators(string num, int target) {
    vector<string> res;
    int n = num.size();

    // val = current eval, prev = last operand (for handling * precedence)
    function<void(int, string, long long, long long)> bt =
        [&](int pos, string expr, long long val, long long prev) {
        if (pos == n) {
            if (val == target) res.push_back(expr);
            return;
        }
        for (int len = 1; pos + len <= n; len++) {
            string s = num.substr(pos, len);
            if (len > 1 && s[0] == '0') break;  // no leading zeros
            long long cur = stoll(s);
            if (pos == 0) {
                bt(len, s, cur, cur);
            } else {
                bt(pos+len, expr+"+"+s, val+cur,      cur);
                bt(pos+len, expr+"-"+s, val-cur,     -cur);
                // For *, undo last addition/subtraction and apply multiply
                bt(pos+len, expr+"*"+s, val-prev+prev*cur, prev*cur);
            }
        }
    };
    bt(0, "", 0, 0);
    return res;
}
```

---

## 20. Restore IP Addresses

**Problem:** Given a string of digits, return all valid IPv4 addresses.

```cpp
#include <string>
#include <vector>
#include <functional>
using namespace std;

vector<string> restoreIpAddresses(string s) {
    vector<string> res;
    vector<string> parts;

    function<void(int)> bt = [&](int start) {
        if ((int)parts.size() == 4) {
            if (start == (int)s.size()) {
                res.push_back(parts[0]+"."+parts[1]+"."+parts[2]+"."+parts[3]);
            }
            return;
        }
        for (int len = 1; len <= 3; len++) {
            if (start + len > (int)s.size()) break;
            string seg = s.substr(start, len);
            // No leading zeros (except "0" itself), value ≤ 255
            if ((len > 1 && seg[0] == '0') || stoi(seg) > 255) break;
            parts.push_back(seg);
            bt(start + len);
            parts.pop_back();
        }
    };
    bt(0);
    return res;
}
```

---

## Pattern Summary

| Problem Type | Key Decision | Duplicate Handling | Reuse Elements |
|---|---|---|---|
| Subsets | include/skip | sort + `if(i>start && nums[i]==nums[i-1]) skip` | No |
| Permutations | any unused element | sort + `if(i>0 && nums[i]==nums[i-1] && !used[i-1]) skip` | No |
| Comb Sum I | pick element | N/A (no dups) | Yes (`i` not `i+1`) |
| Comb Sum II | pick element | same as Subsets with Dups | No (`i+1`) |
| N-Queens | column placement | 3 bool arrays for col/d1/d2 | N/A |
| Word Search | 4-direction DFS | mark/unmark visited in-place | No |

## Complexity Quick Reference

| Problem | Time | Space |
|---|---|---|
| Subsets (n) | O(2^n) | O(n) stack |
| Permutations (n) | O(n!) | O(n) |
| Combination Sum | O(n^(T/min)) | O(T/min) |
| N-Queens (n) | O(n!) | O(n) |
| Sudoku | O(9^81) worst | O(1) extra |
| N-Queens (bitmask) | O(n!) but ~3× faster | O(n) |
