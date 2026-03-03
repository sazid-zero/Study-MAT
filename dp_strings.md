---
layout: docs
title: Dynamic Programming - String Problems
permalink: /dp-strings/
---

[⬅️ Back to Home]({{ '/' | relative_url }})

---
{% raw %}
# Dynamic Programming — String Problems

String DP problems typically use a 2D table `dp[i][j]` representing some optimal value over substrings `s1[0..i-1]` and `s2[0..j-1]`, or over a single string `s[i..j]`.

**Pattern guide:**
- Two strings: `dp[i][j]` over prefixes → Edit Distance, Wildcard, Interleaving
- Single string interval `[i..j]`: → Palindrome Partitioning, Burst Balloons
- Count/exist/min/max: adjust recurrence focus

---


## Table of Contents

1. [Edit Distance (Levenshtein)](#1-edit-distance-levenshtein)
2. [Edit Distance — Print Operations](#2-edit-distance--print-operations)
3. [Edit Distance — Weighted Operations](#3-edit-distance--weighted-operations)
4. [Palindrome Partitioning — All Partitions](#4-palindrome-partitioning--all-partitions)
5. [Palindrome Partitioning II — Minimum Cuts](#5-palindrome-partitioning-ii--minimum-cuts)
6. [Wildcard Matching](#6-wildcard-matching)
7. [Regular Expression Matching](#7-regular-expression-matching)
8. [Interleaving String](#8-interleaving-string)
9. [Scramble String](#9-scramble-string)
10. [Shortest Common Supersequence (print)](#10-shortest-common-supersequence-print)
11. [Decode Ways II — With Wildcard Digit](#11-decode-ways-ii--with-wildcard-digit)
12. [Count Distinct Palindromic Subsequences](#12-count-distinct-palindromic-subsequences)
13. [Palindromic Substrings — Count All](#13-palindromic-substrings--count-all)
14. [Longest Palindromic Substring](#14-longest-palindromic-substring)
15. [Minimum Window Subsequence](#15-minimum-window-subsequence)
16. [Word Break II — All Sentences](#16-word-break-ii--all-sentences)
17. [Distinct Subsequences (Count)](#17-distinct-subsequences-count)
18. [Minimum ASCII Delete Sum](#18-minimum-ascii-delete-sum)

---

## 1. Edit Distance (Levenshtein)

### Problem

Given two strings `word1` and `word2`, find the **minimum number of operations** to convert `word1` to `word2`. Operations: **insert**, **delete**, **replace** (each costs 1).

**Example:**
```
"horse" → "ros"
h→r (replace), e→(delete), (delete r)  =  3 operations
```

**Recurrence:**
```
if s1[i-1] == s2[j-1]:  dp[i][j] = dp[i-1][j-1]          (no op needed)
else:                    dp[i][j] = 1 + min(
                             dp[i-1][j],    // delete from s1
                             dp[i][j-1],    // insert into s1
                             dp[i-1][j-1])  // replace in s1
```

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int editDistance(const string& s1, const string& s2) {
    int m = s1.size(), n = s2.size();
    // dp[i][j] = edit distance between s1[0..i-1] and s2[0..j-1]
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));

    // Base cases: transform prefix to empty string
    for (int i = 0; i <= m; i++) dp[i][0] = i;  // delete i chars
    for (int j = 0; j <= n; j++) dp[0][j] = j;  // insert j chars

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i-1] == s2[j-1])
                dp[i][j] = dp[i-1][j-1];
            else
                dp[i][j] = 1 + min({dp[i-1][j],    // delete
                                    dp[i][j-1],    // insert
                                    dp[i-1][j-1]}); // replace
        }
    }
    return dp[m][n];
}

// Space-optimized O(n)
int editDistanceOpt(const string& s1, const string& s2) {
    int m = s1.size(), n = s2.size();
    vector<int> prev(n+1), curr(n+1);
    for (int j = 0; j <= n; j++) prev[j] = j;

    for (int i = 1; i <= m; i++) {
        curr[0] = i;
        for (int j = 1; j <= n; j++) {
            if (s1[i-1] == s2[j-1])
                curr[j] = prev[j-1];
            else
                curr[j] = 1 + min({prev[j], curr[j-1], prev[j-1]});
        }
        swap(prev, curr);
    }
    return prev[n];
}

int main() {
    cout << editDistance("horse", "ros")    << endl;  // Output: 3
    cout << editDistance("intention", "execution") << endl;  // Output: 5
    cout << editDistanceOpt("horse", "ros") << endl;  // Output: 3
}
```

---

## 2. Edit Distance — Print Operations

### Problem

Same as above, but print the actual sequence of edit operations.

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

void printEditOps(const string& s1, const string& s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;

    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = (s1[i-1]==s2[j-1]) ? dp[i-1][j-1] :
                        1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});

    // Traceback
    int i = m, j = n;
    vector<string> ops;
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && s1[i-1] == s2[j-1]) {
            ops.push_back("Keep " + string(1, s1[i-1]));
            i--; j--;
        } else if (j > 0 && (i==0 || dp[i][j] == dp[i][j-1]+1)) {
            ops.push_back("Insert " + string(1, s2[j-1]));
            j--;
        } else if (i > 0 && (j==0 || dp[i][j] == dp[i-1][j]+1)) {
            ops.push_back("Delete " + string(1, s1[i-1]));
            i--;
        } else {
            ops.push_back("Replace " + string(1, s1[i-1]) + "->" + string(1, s2[j-1]));
            i--; j--;
        }
    }
    reverse(ops.begin(), ops.end());
    for (auto& op : ops) cout << op << "\n";
}

int main() {
    printEditOps("horse", "ros");
    // Replace h->r, Keep o, Replace r->s, Delete s, Delete e
}
```

---

## 3. Edit Distance — Weighted Operations

### Problem

Same edit distance but each operation has a different cost: `costInsert`, `costDelete`, `costReplace`.

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int editDistanceWeighted(const string& s1, const string& s2,
                         int ci, int cd, int cr) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    for (int i = 0; i <= m; i++) dp[i][0] = i * cd;
    for (int j = 0; j <= n; j++) dp[0][j] = j * ci;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i-1] == s2[j-1])
                dp[i][j] = dp[i-1][j-1];
            else
                dp[i][j] = min({dp[i-1][j] + cd,      // delete from s1
                                dp[i][j-1] + ci,       // insert into s1
                                dp[i-1][j-1] + cr});   // replace
        }
    }
    return dp[m][n];
}

int main() {
    // standard edit distance (all costs = 1)
    cout << editDistanceWeighted("horse", "ros", 1, 1, 1) << endl;  // Output: 3
    // insert costs 2, delete costs 1, replace costs 3
    cout << editDistanceWeighted("abc", "yabd", 2, 1, 3) << endl;
}
```

---

## 4. Palindrome Partitioning — All Partitions

### Problem

Given a string, return **all possible partitions** where every substring is a palindrome.

**Approach:** Precompute palindrome table `isPalin[i][j]`, then DFS with backtracking.

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

void dfs(const string& s, int start,
         vector<vector<bool>>& isPalin,
         vector<string>& current,
         vector<vector<string>>& result) {
    if (start == (int)s.size()) { result.push_back(current); return; }

    for (int end = start; end < (int)s.size(); end++) {
        if (isPalin[start][end]) {
            current.push_back(s.substr(start, end - start + 1));
            dfs(s, end+1, isPalin, current, result);
            current.pop_back();
        }
    }
}

vector<vector<string>> partition(const string& s) {
    int n = s.size();
    vector<vector<bool>> isPalin(n, vector<bool>(n, false));

    // Precompute palindrome table
    for (int len = 1; len <= n; len++) {
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            if (len == 1) isPalin[i][j] = true;
            else if (len == 2) isPalin[i][j] = (s[i] == s[j]);
            else isPalin[i][j] = (s[i] == s[j]) && isPalin[i+1][j-1];
        }
    }

    vector<vector<string>> result;
    vector<string> current;
    dfs(s, 0, isPalin, current, result);
    return result;
}

int main() {
    auto parts = partition("aab");
    for (auto& p : parts) {
        for (auto& s : p) cout << s << " ";
        cout << "\n";
    }
    // Output:
    // a a b
    // aa b
}
```

---

## 5. Palindrome Partitioning II — Minimum Cuts

### Problem

Find the **minimum number of cuts** to partition a string so every part is a palindrome.

**Recurrence:**
```
minCut[i] = min cuts for s[0..i]
           = 0 if s[0..i] is palindrome
           = min over j in [0..i-1] of (minCut[j-1] + 1) where s[j..i] is palindrome
```

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <climits>
using namespace std;

int minCut(const string& s) {
    int n = s.size();
    // Precompute palindrome table
    vector<vector<bool>> isPalin(n, vector<bool>(n, false));
    for (int len = 1; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            if (len == 1) isPalin[i][j] = true;
            else if (len == 2) isPalin[i][j] = (s[i] == s[j]);
            else isPalin[i][j] = (s[i] == s[j]) && isPalin[i+1][j-1];
        }

    // cuts[i] = min cuts for s[0..i]
    vector<int> cuts(n, INT_MAX);
    for (int i = 0; i < n; i++) {
        if (isPalin[0][i]) { cuts[i] = 0; continue; }
        for (int j = 1; j <= i; j++) {
            if (isPalin[j][i] && cuts[j-1] != INT_MAX)
                cuts[i] = min(cuts[i], cuts[j-1] + 1);
        }
    }
    return cuts[n-1];
}

// Manacher-style O(n) palindrome expand — O(n²) total
int minCutOpt(const string& s) {
    int n = s.size();
    vector<int> cuts(n+1);
    for (int i = 0; i <= n; i++) cuts[i] = i-1;  // cuts[i] = min cuts for s[0..i-1]

    for (int center = 0; center < n; center++) {
        // Odd length palindromes
        for (int r = 0; center-r >= 0 && center+r < n && s[center-r]==s[center+r]; r++)
            cuts[center+r+1] = min(cuts[center+r+1], cuts[center-r] + 1);
        // Even length palindromes
        for (int r = 1; center-r+1 >= 0 && center+r < n && s[center-r+1]==s[center+r]; r++)
            cuts[center+r+1] = min(cuts[center+r+1], cuts[center-r+1] + 1);
    }
    return cuts[n];
}

int main() {
    cout << minCut("aab")    << endl;  // Output: 1  ("aa"|"b")
    cout << minCut("a")      << endl;  // Output: 0
    cout << minCut("ab")     << endl;  // Output: 1
    cout << minCutOpt("aab") << endl;  // Output: 1
}
```

---

## 6. Wildcard Matching

### Problem

Given string `s` and pattern `p` with `?` (matches any single char) and `*` (matches any sequence including empty), return whether they match.

**Recurrence:**
```
dp[i][j] = does s[0..i-1] match p[0..j-1]?

if p[j-1] == '*':
    dp[i][j] = dp[i-1][j]   // '*' matches one more char in s
             | dp[i][j-1]   // '*' matches empty (ignore '*')
if p[j-1] == '?' or p[j-1] == s[i-1]:
    dp[i][j] = dp[i-1][j-1]
```

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

bool isMatch(const string& s, const string& p) {
    int m = s.size(), n = p.size();
    vector<vector<bool>> dp(m+1, vector<bool>(n+1, false));
    dp[0][0] = true;  // empty matches empty

    // Handle leading '*': "***" matches empty
    for (int j = 1; j <= n; j++)
        dp[0][j] = dp[0][j-1] && p[j-1] == '*';

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (p[j-1] == '*') {
                dp[i][j] = dp[i-1][j]    // '*' matches s[i-1]
                         | dp[i][j-1];   // '*' matches empty
            } else if (p[j-1] == '?' || p[j-1] == s[i-1]) {
                dp[i][j] = dp[i-1][j-1];
            }
        }
    }
    return dp[m][n];
}

int main() {
    cout << isMatch("aa", "a")    << endl;  // false
    cout << isMatch("aa", "*")    << endl;  // true
    cout << isMatch("cb", "?a")   << endl;  // false
    cout << isMatch("adceb","*a*b") << endl; // true
    cout << isMatch("acdcb","a*c?b") << endl; // false
}
```

---

## 7. Regular Expression Matching

### Problem

Given string `s` and pattern `p` with `.` (matches any single char) and `*` (matches zero or more of preceding char), return whether they match.

**Key difference from wildcard:** `*` in regex doesn't stand alone — it modifies the **preceding element**: `a*` = zero or more `a`s.

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

bool isMatchRegex(const string& s, const string& p) {
    int m = s.size(), n = p.size();
    vector<vector<bool>> dp(m+1, vector<bool>(n+1, false));
    dp[0][0] = true;

    // Handle patterns like "a*b*c*" that can match empty string
    for (int j = 2; j <= n; j += 2)
        if (p[j-1] == '*') dp[0][j] = dp[0][j-2];

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (p[j-1] == '*') {
                // Option 1: use '*' as zero occurrences → ignore "x*"
                dp[i][j] = dp[i][j-2];

                // Option 2: use one more match of p[j-2]
                if (p[j-2] == '.' || p[j-2] == s[i-1])
                    dp[i][j] = dp[i][j] || dp[i-1][j];  // match one more s[i-1]

            } else if (p[j-1] == '.' || p[j-1] == s[i-1]) {
                dp[i][j] = dp[i-1][j-1];
            }
        }
    }
    return dp[m][n];
}

int main() {
    cout << isMatchRegex("aa", "a")    << endl;  // false
    cout << isMatchRegex("aa", "a*")   << endl;  // true
    cout << isMatchRegex("ab", ".*")   << endl;  // true
    cout << isMatchRegex("aab","c*a*b") << endl; // true  (c*=empty, a*=aa, b=b)
    cout << isMatchRegex("mississippi","mis*is*p*.") << endl; // false
}
```

---

## 8. Interleaving String

### Problem

Given `s1`, `s2`, `s3`, check if `s3` is formed by **interleaving** `s1` and `s2` (maintaining relative order from each).

**Recurrence:**
```
dp[i][j] = can s3[0..i+j-1] be formed by interleaving s1[0..i-1] and s2[0..j-1]?

dp[i][j] = (dp[i-1][j] && s1[i-1]==s3[i+j-1])   // took char from s1
          | (dp[i][j-1] && s2[j-1]==s3[i+j-1])   // took char from s2
```

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

bool isInterleave(const string& s1, const string& s2, const string& s3) {
    int m = s1.size(), n = s2.size();
    if (m + n != (int)s3.size()) return false;

    vector<vector<bool>> dp(m+1, vector<bool>(n+1, false));
    dp[0][0] = true;

    for (int i = 1; i <= m; i++) dp[i][0] = dp[i-1][0] && (s1[i-1] == s3[i-1]);
    for (int j = 1; j <= n; j++) dp[0][j] = dp[0][j-1] && (s2[j-1] == s3[j-1]);

    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = (dp[i-1][j] && s1[i-1] == s3[i+j-1])
                     | (dp[i][j-1] && s2[j-1] == s3[i+j-1]);

    return dp[m][n];
}

int main() {
    cout << isInterleave("aabcc", "dbbca", "aadbbcbcac") << endl;  // true
    cout << isInterleave("aabcc", "dbbca", "aadbbbaccc") << endl;  // false
    cout << isInterleave("", "", "") << endl;  // true
}
```

---

## 9. Scramble String

### Problem

A string can be "scrambled" by recursively splitting it into two non-empty parts and optionally swapping them. Given `s1` and `s2`, determine if `s2` is a scrambled version of `s1`.

**Recurrence:** For each split point `k` in `[1, n-1]`:
- No swap: `isScramble(s1[0..k], s2[0..k])` AND `isScramble(s1[k..n], s2[k..n])`
- Swap: `isScramble(s1[0..k], s2[n-k..n])` AND `isScramble(s1[k..n], s2[0..n-k])`

```cpp
#include <iostream>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

unordered_map<string, bool> memo;

bool isScramble(const string& s1, const string& s2) {
    if (s1 == s2) return true;
    if (s1.size() != s2.size()) return false;

    string key = s1 + "#" + s2;
    if (memo.count(key)) return memo[key];

    // Quick prune: same character frequency
    string sorted1 = s1, sorted2 = s2;
    sort(sorted1.begin(), sorted1.end());
    sort(sorted2.begin(), sorted2.end());
    if (sorted1 != sorted2) return memo[key] = false;

    int n = s1.size();
    for (int k = 1; k < n; k++) {
        // No swap
        if (isScramble(s1.substr(0, k), s2.substr(0, k)) &&
            isScramble(s1.substr(k),    s2.substr(k)))
            return memo[key] = true;
        // Swap
        if (isScramble(s1.substr(0, k), s2.substr(n-k)) &&
            isScramble(s1.substr(k),    s2.substr(0, n-k)))
            return memo[key] = true;
    }
    return memo[key] = false;
}

int main() {
    cout << isScramble("great", "rgeat") << endl;  // true
    cout << isScramble("abcde", "caebd") << endl;  // false
    cout << isScramble("a",     "a")     << endl;  // true
}
```

---

## 10. Shortest Common Supersequence (print)

### Problem

Find the **shortest string** that has both `s1` and `s2` as subsequences, and print it.

**Formula:** Length = `|s1| + |s2| - LCS(s1, s2)`. To print: traceback the LCS table.

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

string shortestCommonSupersequence(const string& s1, const string& s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));

    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = (s1[i-1]==s2[j-1]) ? dp[i-1][j-1]+1 : max(dp[i-1][j], dp[i][j-1]);

    // Reconstruct SCS by traceback
    string result;
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (s1[i-1] == s2[j-1]) {
            result += s1[i-1];  // in both — include once
            i--; j--;
        } else if (dp[i-1][j] > dp[i][j-1]) {
            result += s1[i-1];  // take from s1
            i--;
        } else {
            result += s2[j-1];  // take from s2
            j--;
        }
    }
    while (i > 0) { result += s1[i-1]; i--; }
    while (j > 0) { result += s2[j-1]; j--; }

    reverse(result.begin(), result.end());
    return result;
}

int main() {
    cout << shortestCommonSupersequence("abac", "cab") << endl;  // "cabac"
    cout << shortestCommonSupersequence("geek",  "eke") << endl; // "geeke"
}
```

---

## 11. Decode Ways II — With Wildcard Digit

### Problem

An encoded message contains digits `'1'-'9'`, `'*'` (represents any digit `'1'-'9'`). Count valid decodings (mod 1e9+7).

**Extension of Decode Ways I** (just digits). Handle `*` carefully in single-char and two-char windows.

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int numDecodings(const string& s) {
    int n = s.size();
    const int MOD = 1e9 + 7;
    // dp[i] = ways to decode s[0..i-1]
    vector<long long> dp(n+1, 0);
    dp[0] = 1;
    dp[1] = (s[0] == '*') ? 9 : (s[0] != '0' ? 1 : 0);

    for (int i = 2; i <= n; i++) {
        char cur  = s[i-1];
        char prev = s[i-2];

        // Single char decode
        if (cur == '*')
            dp[i] = (dp[i-1] * 9) % MOD;
        else if (cur != '0')
            dp[i] = dp[i-1];

        // Two char decode: prev+cur form a number 10-26
        if (prev == '*' && cur == '*') {
            dp[i] = (dp[i] + dp[i-2] * 15) % MOD;  // 11-19 (9) + 21-26 (6)
        } else if (prev == '*') {
            int c = cur - '0';
            dp[i] = (dp[i] + dp[i-2] * (c <= 6 ? 2 : 1)) % MOD;
            // 1c valid, 2c valid if c<=6
        } else if (cur == '*') {
            if (prev == '1')
                dp[i] = (dp[i] + dp[i-2] * 9) % MOD;  // 11-19
            else if (prev == '2')
                dp[i] = (dp[i] + dp[i-2] * 6) % MOD;  // 21-26
        } else {
            int two = (prev - '0') * 10 + (cur - '0');
            if (two >= 10 && two <= 26)
                dp[i] = (dp[i] + dp[i-2]) % MOD;
        }
    }
    return dp[n];
}

int main() {
    cout << numDecodings("*")    << endl;  // 9
    cout << numDecodings("1*")   << endl;  // 18  (11-19)
    cout << numDecodings("2*")   << endl;  // 15  (20 invalid but *=1..9 so 21-26 + single 2*)
}
```

---

## 12. Count Distinct Palindromic Subsequences

### Problem

Given string `s`, count distinct non-empty palindromic subsequences (mod 1e9+7).

**State:** `dp[i][j]` = count of distinct palindromic subsequences in `s[i..j]`.

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

int countPalindromicSubsequences(const string& s) {
    int n = s.size();
    const int MOD = 1e9 + 7;
    vector<vector<long long>> dp(n, vector<long long>(n, 0));

    // Every single char is a palindrome
    for (int i = 0; i < n; i++) dp[i][i] = 1;

    for (int len = 2; len <= n; len++) {
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            if (s[i] == s[j]) {
                // Find next occurrence of s[i] from the left
                int lo = i+1, hi = j-1;
                while (lo <= hi && s[lo] != s[i]) lo++;
                while (hi >= lo && s[hi] != s[i]) hi--;

                if (lo > hi) {
                    // No same chars inside: e.g. "aba"
                    dp[i][j] = dp[i+1][j-1] * 2 + 2;
                } else if (lo == hi) {
                    // One same char inside: e.g. "aabaa"
                    dp[i][j] = dp[i+1][j-1] * 2 + 1;
                } else {
                    // Two or more same chars inside: e.g. "aabaa" with extra a
                    dp[i][j] = dp[i+1][j-1] * 2 - dp[lo+1][hi-1];
                }
            } else {
                dp[i][j] = dp[i+1][j] + dp[i][j-1] - dp[i+1][j-1];
            }
            dp[i][j] = (dp[i][j] % MOD + MOD) % MOD;
        }
    }
    return dp[0][n-1];
}

int main() {
    cout << countPalindromicSubsequences("bccb") << endl;  // 6
    cout << countPalindromicSubsequences("abcdabcdabcdabcd") << endl;  // 104
}
```

---

## 13. Palindromic Substrings — Count All

### Problem

Count the number of **substrings** (contiguous) that are palindromes.

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

// DP approach O(n²) time and space
int countSubstringsDP(const string& s) {
    int n = s.size(), count = 0;
    vector<vector<bool>> dp(n, vector<bool>(n, false));

    for (int len = 1; len <= n; len++) {
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            if (len == 1) dp[i][j] = true;
            else if (len == 2) dp[i][j] = (s[i] == s[j]);
            else dp[i][j] = (s[i] == s[j]) && dp[i+1][j-1];

            if (dp[i][j]) count++;
        }
    }
    return count;
}

// Expand around center O(n²) time O(1) space
int countSubstringsCenter(const string& s) {
    int n = s.size(), count = 0;
    for (int c = 0; c < n; c++) {
        // Odd
        for (int r = 0; c-r >= 0 && c+r < n && s[c-r]==s[c+r]; r++) count++;
        // Even
        for (int r = 1; c-r+1 >= 0 && c+r < n && s[c-r+1]==s[c+r]; r++) count++;
    }
    return count;
}

int main() {
    cout << countSubstringsDP("abc")    << endl;  // 3  (a, b, c)
    cout << countSubstringsDP("aaa")    << endl;  // 6  (a,a,a,aa,aa,aaa)
    cout << countSubstringsCenter("aaa") << endl; // 6
}
```

---

## 14. Longest Palindromic Substring

### Problem

Find the longest contiguous substring that is a palindrome.

```cpp
#include <iostream>
#include <string>
using namespace std;

// Expand around center O(n²)
string longestPalindrome(const string& s) {
    int n = s.size(), start = 0, maxLen = 1;

    auto expand = [&](int lo, int hi) {
        while (lo >= 0 && hi < n && s[lo] == s[hi]) { lo--; hi++; }
        if (hi - lo - 1 > maxLen) { maxLen = hi - lo - 1; start = lo + 1; }
    };

    for (int c = 0; c < n; c++) {
        expand(c, c);    // odd length
        expand(c, c+1);  // even length
    }
    return s.substr(start, maxLen);
}

// Manacher's Algorithm O(n)
string longestPalindromeManacher(const string& s) {
    // Transform: "abc" → "#a#b#c#"
    string t = "#";
    for (char c : s) { t += c; t += '#'; }
    int n = t.size();
    vector<int> p(n, 0);
    int center = 0, right = 0;

    for (int i = 0; i < n; i++) {
        if (i < right) p[i] = min(right - i, p[2 * center - i]);
        while (i - p[i] - 1 >= 0 && i + p[i] + 1 < n && t[i-p[i]-1] == t[i+p[i]+1])
            p[i]++;
        if (i + p[i] > right) { center = i; right = i + p[i]; }
    }

    int bestCenter = max_element(p.begin(), p.end()) - p.begin();
    int bestLen = p[bestCenter];
    return s.substr((bestCenter - bestLen) / 2, bestLen);
}

int main() {
    cout << longestPalindrome("babad")         << endl;  // "bab" or "aba"
    cout << longestPalindrome("cbbd")          << endl;  // "bb"
    cout << longestPalindromeManacher("babad") << endl;  // "bab"
}
```

---

## 15. Minimum Window Subsequence

### Problem

Given strings `S` and `T`, find the **minimum length contiguous substring** of `S` that contains `T` as a subsequence.

```cpp
#include <iostream>
#include <string>
#include <climits>
using namespace std;

string minWindow(const string& S, const string& T) {
    int sLen = S.size(), tLen = T.size();
    int bestLen = INT_MAX, bestStart = -1;

    for (int i = 0; i < sLen; i++) {
        if (S[i] != T[0]) continue;

        // Forward pass: find end of window starting at i
        int j = i, k = 0;
        while (j < sLen && k < tLen) {
            if (S[j] == T[k]) k++;
            j++;
        }
        if (k < tLen) break;  // T not fully matched before end of S

        // Backward pass: shrink window from the end
        int end = j - 1;
        k = tLen - 1;
        while (k >= 0) {
            if (S[end] == T[k]) k--;
            end--;
        }
        end++;  // start of minimum window

        if (j - end < bestLen) {
            bestLen = j - end;
            bestStart = end;
        }
    }
    return bestStart == -1 ? "" : S.substr(bestStart, bestLen);
}

int main() {
    cout << minWindow("abcdebdde", "bde") << endl;  // "bcde" → length 4
    cout << minWindow("jmeqksof", "ks")   << endl;  // "ksof" → "ks"
}
```

---

## 16. Word Break II — All Sentences

### Problem

Given string `s` and dictionary `wordDict`, return all **possible sentences** by inserting spaces to form valid words.

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <unordered_set>
#include <unordered_map>
using namespace std;

unordered_map<int, vector<string>> cache;

vector<string> helper(const string& s, const unordered_set<string>& dict, int start) {
    if (cache.count(start)) return cache[start];
    if (start == (int)s.size()) return {""};

    vector<string> result;
    for (int end = start+1; end <= (int)s.size(); end++) {
        string word = s.substr(start, end - start);
        if (dict.count(word)) {
            auto rest = helper(s, dict, end);
            for (auto& r : rest) {
                result.push_back(word + (r.empty() ? "" : " " + r));
            }
        }
    }
    return cache[start] = result;
}

vector<string> wordBreak(const string& s, const vector<string>& wordDict) {
    cache.clear();
    unordered_set<string> dict(wordDict.begin(), wordDict.end());
    return helper(s, dict, 0);
}

int main() {
    auto r = wordBreak("catsanddog", {"cat","cats","and","sand","dog"});
    for (auto& s : r) cout << s << "\n";
    // Output:
    // cats and dog
    // cat sand dog
}
```

---

## 17. Distinct Subsequences (Count)

### Problem

Count how many distinct subsequences of string `s` equal string `t`.

**Recurrence:**
```
dp[i][j] = count of ways s[0..i-1] contains t[0..j-1] as a subsequence

if s[i-1] == t[j-1]:  dp[i][j] = dp[i-1][j-1] + dp[i-1][j]
                                 // use s[i-1] to match t[j-1]  +  don't use s[i-1]
else:                  dp[i][j] = dp[i-1][j]
```

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int numDistinct(const string& s, const string& t) {
    int m = s.size(), n = t.size();
    // dp[i][j] = #distinct subseqs of s[0..i-1] equal to t[0..j-1]
    vector<vector<long long>> dp(m+1, vector<long long>(n+1, 0));

    for (int i = 0; i <= m; i++) dp[i][0] = 1;  // empty t matched by any prefix of s

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            dp[i][j] = dp[i-1][j];  // don't use s[i-1]
            if (s[i-1] == t[j-1])
                dp[i][j] += dp[i-1][j-1];  // use s[i-1] to match t[j-1]
        }
    }
    return dp[m][n];
}

int main() {
    cout << numDistinct("rabbbit", "rabbit") << endl;  // 3
    cout << numDistinct("babgbag", "bag")    << endl;  // 5
}
```

---

## 18. Minimum ASCII Delete Sum

### Problem

Given two strings, find the **minimum ASCII sum of deleted characters** to make them equal (similar to LCS but weighted by ASCII value).

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int minimumDeleteSum(const string& s1, const string& s2) {
    int m = s1.size(), n = s2.size();
    // dp[i][j] = min delete cost to make s1[0..i-1] == s2[0..j-1]
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));

    // Base case: delete all chars from prefix to match empty
    for (int i = 1; i <= m; i++) dp[i][0] = dp[i-1][0] + s1[i-1];
    for (int j = 1; j <= n; j++) dp[0][j] = dp[0][j-1] + s2[j-1];

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i-1] == s2[j-1])
                dp[i][j] = dp[i-1][j-1];  // no delete needed
            else
                dp[i][j] = min(dp[i-1][j] + s1[i-1],   // delete s1[i-1]
                               dp[i][j-1] + s2[j-1]);   // delete s2[j-1]
        }
    }
    return dp[m][n];
}

int main() {
    cout << minimumDeleteSum("sea", "eat") << endl;  // 231 ('s'=115 + 't'=116 = 231)
    cout << minimumDeleteSum("delete", "leet") << endl;  // 403
}
```

---

## String DP — Pattern Summary

| Operation | Key Formula | Direction | Notes |
|---|---|---|---|
| Match/mismatch | `s1[i-1]==s2[j-1]` → diagonal | Top-left → bottom-right | Foundation of all string DP |
| Edit Distance | delete/insert/replace | Forward | 3-way min |
| Wildcard `*` | `dp[i][j-1]` or `dp[i-1][j]` | Forward | `*` = empty or extend |
| Regex `x*` | `dp[i][j-2]` (zero) or `dp[i-1][j]` (more) | Forward | `*` always modifies prev char |
| Interleaving | from s1 cell or s2 cell | Forward | boolean OR |
| Palindrome [i..j] | `dp[i+1][j-1]` + ends match | Interval, len ascending | Base: len=1 true, len=2 check |
| Palindrome cuts | `cuts[j] + 1` for each palindrome ending here | Forward | Precompute isPalin table |
| Distinct subseq | `dp[i-1][j] + dp[i-1][j-1]` if match | Forward | Count without and with match |

## Complexity Quick Reference

| Problem | Time | Space |
|---|---|---|
| Edit Distance | O(mn) | O(mn) → O(n) |
| Print Edit Ops | O(mn) | O(mn) |
| Palindrome Partitioning | O(2ⁿ) with O(n²) precompute | O(n²) |
| Min Palindrome Cuts | O(n²) | O(n²) |
| Wildcard Matching | O(mn) | O(mn) → O(n) |
| Regex Matching | O(mn) | O(mn) |
| Interleaving String | O(mn) | O(mn) → O(n) |
| Scramble String | O(n⁴) memo | O(n³) states |
| SCS (print) | O(mn) | O(mn) |
| Decode Ways II | O(n) | O(n) |
| Distinct Palindromic Subseq | O(n²) | O(n²) |
| Count Palindromic Substrings | O(n²) | O(1) |
| Longest Palindromic Substring | O(n) Manacher | O(n) |
| Min Window Subsequence | O(mn) | O(1) |
| Word Break II | O(n × 2ⁿ) worst | O(n) memo |
| Distinct Subsequences | O(mn) | O(mn) → O(n) |
| Min ASCII Delete Sum | O(mn) | O(mn) |

{% endraw %}
