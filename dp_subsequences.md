---
layout: docs
title: Dynamic Programming - Subsequences
permalink: /dp-subsequences/
---

[⬅️ Back to Home]({{ '/' | relative_url }})

---
{% raw %}
# Dynamic Programming — Subsequences (LCS, LIS & Variants)

A **subsequence** maintains relative order but may skip elements. A **substring/subarray** must be contiguous. Know this distinction — it changes the recurrence completely.

| Term | Contiguous? | Example from "abcde" |
|---|---|---|
| Subsequence | No | "ace", "bd" |
| Substring | Yes | "bcd", "abc" |
| Subarray (nums) | Yes | `[2,3,4]` from `[1,2,3,4,5]` |

---


## Table of Contents

### Longest Common Subsequence (LCS) Family
1. [LCS — Classic 2D DP](#1-lcs--classic-2d-dp)
2. [LCS — Print the Actual Subsequence](#2-lcs--print-the-actual-subsequence)
3. [Shortest Common Supersequence (SCS)](#3-shortest-common-supersequence-scs)
4. [Minimum Insertions & Deletions to Convert String](#4-minimum-insertions--deletions-to-convert-string)
5. [Longest Common Substring](#5-longest-common-substring)
6. [Longest Repeating Subsequence](#6-longest-repeating-subsequence)
7. [Subsequence Pattern Matching (Count)](#7-subsequence-pattern-matching-count)

### Longest Increasing Subsequence (LIS) Family
8. [LIS — O(n²) DP](#8-lis--on-dp)
9. [LIS — O(n log n) Patience Sorting](#9-lis--on-log-n-patience-sorting)
10. [LIS — Print Actual Subsequence](#10-lis--print-actual-subsequence)
11. [Longest Bitonic Subsequence](#11-longest-bitonic-subsequence)
12. [Maximum Sum Increasing Subsequence](#12-maximum-sum-increasing-subsequence)
13. [Number of LIS](#13-number-of-lis)
14. [Russian Doll Envelopes](#14-russian-doll-envelopes)

### Other Subsequence Problems
15. [Distinct Subsequences](#15-distinct-subsequences)
16. [Is Subsequence](#16-is-subsequence)
17. [Longest Palindromic Subsequence](#17-longest-palindromic-subsequence)
18. [Minimum Deletions to Make Palindrome](#18-minimum-deletions-to-make-palindrome)
19. [Longest Alternating Subsequence](#19-longest-alternating-subsequence)
20. [Maximum Length of Repeated Subarray (Subarray = Substring)](#20-maximum-length-of-repeated-subarray)

---

## 1. LCS — Classic 2D DP

### Problem

Find the length of the **Longest Common Subsequence** of two strings.

**Example:**
```
s1 = "abcde",   s2 = "ace"   →  LCS = 3  ("ace")
s1 = "abc",     s2 = "abc"   →  LCS = 3  ("abc")
s1 = "abc",     s2 = "def"   →  LCS = 0
```

### Recurrence

```
dp[i][j] = LCS length of s1[0..i-1] and s2[0..j-1]

if s1[i-1] == s2[j-1]: dp[i][j] = dp[i-1][j-1] + 1
else:                   dp[i][j] = max(dp[i-1][j], dp[i][j-1])
```

### Solution

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int lcs(string& s1, string& s2) {
    int m = s1.size(), n = s2.size();
    // dp[i][j] = LCS of s1[0..i-1] and s2[0..j-1]
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i-1] == s2[j-1])
                dp[i][j] = dp[i-1][j-1] + 1;         // characters match
            else
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]); // take best without one char
        }
    }
    return dp[m][n];
}

// Space-optimized: O(min(m,n)) space using two rolling rows
int lcsSpaceOptimized(string& s1, string& s2) {
    if (s1.size() > s2.size()) swap(s1, s2);  // s1 is shorter
    int m = s1.size(), n = s2.size();
    vector<int> prev(m+1, 0), curr(m+1, 0);

    for (int j = 1; j <= n; j++) {
        for (int i = 1; i <= m; i++) {
            if (s1[i-1] == s2[j-1]) curr[i] = prev[i-1] + 1;
            else                     curr[i] = max(prev[i], curr[i-1]);
        }
        swap(prev, curr);
        fill(curr.begin(), curr.end(), 0);
    }
    return prev[m];
}

int main() {
    string s1 = "abcde", s2 = "ace";
    cout << lcs(s1, s2) << endl;               // Output: 3
    cout << lcsSpaceOptimized(s1, s2) << endl; // Output: 3

    string s3 = "AGGTAB", s4 = "GXTXAYB";
    cout << lcs(s3, s4) << endl;               // Output: 4 ("GTAB")
}
```

---

## 2. LCS — Print the Actual Subsequence

### Problem

Return the **actual LCS string**, not just its length.

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

string lcsString(string& s1, string& s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));

    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (s1[i-1] == s2[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
            else                      dp[i][j] = max(dp[i-1][j], dp[i][j-1]);

    // Traceback: start from dp[m][n], walk back
    string result = "";
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (s1[i-1] == s2[j-1]) {
            result = s1[i-1] + result;  // prepend matched character
            i--; j--;
        } else if (dp[i-1][j] > dp[i][j-1]) {
            i--;  // came from above
        } else {
            j--;  // came from left
        }
    }
    return result;
}

int main() {
    string s1 = "AGGTAB", s2 = "GXTXAYB";
    cout << lcsString(s1, s2) << endl;  // Output: "GTAB"

    string s3 = "abcde", s4 = "ace";
    cout << lcsString(s3, s4) << endl;  // Output: "ace"
}
```

---

## 3. Shortest Common Supersequence (SCS)

### Problem

Find the **shortest string** that has both `s1` and `s2` as subsequences.

**Example:**
```
s1="abac", s2="cab"  →  SCS="cabac" (length 5)
```

**Formula:** `|SCS| = |s1| + |s2| - LCS(s1, s2)`

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

string shortestCommonSupersequence(string s1, string s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));

    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (s1[i-1] == s2[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
            else                      dp[i][j] = max(dp[i-1][j], dp[i][j-1]);

    // Reconstruct SCS from traceback
    string result = "";
    int i = m, j = n;
    while (i > 0 && j > 0) {
        if (s1[i-1] == s2[j-1]) {
            result = s1[i-1] + result;  // both use this char
            i--; j--;
        } else if (dp[i-1][j] > dp[i][j-1]) {
            result = s1[i-1] + result;  // use s1's char
            i--;
        } else {
            result = s2[j-1] + result;  // use s2's char
            j--;
        }
    }
    while (i > 0) { result = s1[i-1] + result; i--; }
    while (j > 0) { result = s2[j-1] + result; j--; }
    return result;
}

int lcsLen(string& s1, string& s2) {
    int m=s1.size(), n=s2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1,0));
    for (int i=1;i<=m;i++) for (int j=1;j<=n;j++)
        if (s1[i-1]==s2[j-1]) dp[i][j]=dp[i-1][j-1]+1;
        else dp[i][j]=max(dp[i-1][j],dp[i][j-1]);
    return dp[m][n];
}

int main() {
    string s1 = "abac", s2 = "cab";
    cout << shortestCommonSupersequence(s1, s2) << endl; // Output: "cabac"
    cout << "Length: " << s1.size()+s2.size()-lcsLen(s1,s2) << endl; // Output: 5
}
```

---

## 4. Minimum Insertions & Deletions to Convert String

### Problem

Find minimum number of **insertions** and **deletions** to convert string `s1` into string `s2`.

**Formula:**
```
deletions  = |s1| - LCS(s1, s2)   (chars in s1 not in LCS must be deleted)
insertions = |s2| - LCS(s1, s2)   (chars in s2 not in LCS must be inserted)
```

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

pair<int,int> minInsertDelete(string& s1, string& s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (s1[i-1] == s2[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
            else                      dp[i][j] = max(dp[i-1][j], dp[i][j-1]);

    int lcs = dp[m][n];
    int deletions  = m - lcs;
    int insertions = n - lcs;
    return {deletions, insertions};
}

int main() {
    string s1 = "heap", s2 = "pea";
    auto [del, ins] = minInsertDelete(s1, s2);
    cout << "Deletions: " << del << ", Insertions: " << ins << endl;
    // Output: Deletions: 2, Insertions: 1
    // Delete 'h','p' from "heap" → "ea"; insert 'p' → "pea"
}
```

---

## 5. Longest Common Substring

### Problem

Unlike LCS (subsequence — can skip), find the **Longest Common Substring** (must be contiguous).

**Example:**
```
s1 = "GeeksforGeeks",  s2 = "GeeksQuiz"
→  Output: 5   ("Geeks")
```

**Key Difference from LCS:** When characters don't match, reset to 0 (no inheritance from diagonal).

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int longestCommonSubstring(string& s1, string& s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    int maxLen = 0;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i-1] == s2[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;   // extend substring
                maxLen = max(maxLen, dp[i][j]);
            }
            // else: dp[i][j] = 0 (no inheritance — this is what makes it substring not subseq)
        }
    }
    return maxLen;
}

int main() {
    string s1 = "GeeksforGeeks", s2 = "GeeksQuiz";
    cout << longestCommonSubstring(s1, s2) << endl;  // Output: 5

    string s3 = "abcde", s4 = "abfce";
    cout << longestCommonSubstring(s3, s4) << endl;  // Output: 2 ("ab")
}
```

**LCS vs Longest Common Substring:**
| | LCS | Longest Common Substring |
|---|---|---|
| Contiguous? | No | Yes |
| Mismatch resets dp to | `max(dp[i-1][j], dp[i][j-1])` | `0` |
| Example "abcde","ace" | 3 ("ace") | 1 ("a","c", or "e") |

---

## 6. Longest Repeating Subsequence

### Problem

Find the longest subsequence of a string that appears **at least twice** (at different positions).

**Trick:** `LRS(s) = LCS(s, s)` where same-position characters are NOT allowed to match (`i != j` constraint).

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int longestRepeatingSubsequence(string& s) {
    int n = s.size();
    vector<vector<int>> dp(n+1, vector<int>(n+1, 0));

    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            if (s[i-1] == s[j-1] && i != j)       // match but NOT same index
                dp[i][j] = dp[i-1][j-1] + 1;
            else
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
        }
    }
    return dp[n][n];
}

int main() {
    string s1 = "aabb";
    cout << longestRepeatingSubsequence(s1) << endl;  // Output: 2 ("ab")

    string s2 = "aab";
    cout << longestRepeatingSubsequence(s2) << endl;  // Output: 1 ("a")
}
```

---

## 7. Subsequence Pattern Matching (Count)

### Problem

Given string `s` and pattern `p`, count the **number of distinct subsequences** of `s` that equal `p`.

**Example:**
```
s = "rabbbit",  p = "rabbit"  →  Output: 3
```

**Recurrence:**
```
dp[i][j] = # ways to form p[0..j-1] using s[0..i-1]
if s[i-1] == p[j-1]:  dp[i][j] = dp[i-1][j-1] + dp[i-1][j]
                                   (use s[i-1])   (skip s[i-1])
else:                  dp[i][j] = dp[i-1][j]     (must skip s[i-1])
```

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

int numDistinct(string s, string p) {
    int m = s.size(), n = p.size();
    vector<vector<long long>> dp(m+1, vector<long long>(n+1, 0));

    // Empty pattern matches exactly once in any prefix of s
    for (int i = 0; i <= m; i++) dp[i][0] = 1;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            dp[i][j] = dp[i-1][j];               // always: skip s[i-1]
            if (s[i-1] == p[j-1])
                dp[i][j] += dp[i-1][j-1];        // use s[i-1] to match p[j-1]
        }
    }
    return dp[m][n];
}

int main() {
    cout << numDistinct("rabbbit", "rabbit") << endl;  // Output: 3
    cout << numDistinct("babgbag", "bag")    << endl;  // Output: 5
}
```

---

## 8. LIS — O(n²) DP

### Problem

Find the length of the **Longest Increasing Subsequence**.

**Example:**
```
nums = [10, 9, 2, 5, 3, 7, 101, 18]
Output: 4   →  [2, 3, 7, 101]
```

**Recurrence:**
```
dp[i] = length of LIS ending at index i
dp[i] = max(dp[j] + 1) for all j < i where nums[j] < nums[i]
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int lisDP(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(n, 1);  // every element is an LIS of length 1

    for (int i = 1; i < n; i++)
        for (int j = 0; j < i; j++)
            if (nums[j] < nums[i])
                dp[i] = max(dp[i], dp[j] + 1);

    return *max_element(dp.begin(), dp.end());
}

int main() {
    vector<int> n1 = {10, 9, 2, 5, 3, 7, 101, 18};
    cout << lisDP(n1) << endl;  // Output: 4

    vector<int> n2 = {0, 1, 0, 3, 2, 3};
    cout << lisDP(n2) << endl;  // Output: 4
}
```

---

## 9. LIS — O(n log n) Patience Sorting

### Problem

Same LIS, but solved optimally in **O(n log n)** using binary search.

### Approach

Maintain a `tails` array where `tails[i]` is the smallest tail element of all increasing subsequences of length `i+1`. Use binary search to find where each element fits.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int lisOptimal(vector<int>& nums) {
    vector<int> tails;  // tails[i] = smallest tail of LIS with length i+1

    for (int num : nums) {
        // Find first tail >= num  (lower_bound for strict increase)
        auto it = lower_bound(tails.begin(), tails.end(), num);

        if (it == tails.end())
            tails.push_back(num);   // num extends all known LIS
        else
            *it = num;              // replace: smaller tail = more room to extend
    }
    return tails.size();
}

// For NON-STRICTLY increasing (allow equal): use upper_bound instead
int lisNonStrict(vector<int>& nums) {
    vector<int> tails;
    for (int num : nums) {
        auto it = upper_bound(tails.begin(), tails.end(), num);  // upper for <=
        if (it == tails.end()) tails.push_back(num);
        else                   *it = num;
    }
    return tails.size();
}

int main() {
    vector<int> n1 = {10, 9, 2, 5, 3, 7, 101, 18};
    cout << lisOptimal(n1) << endl;  // Output: 4

    vector<int> n2 = {3, 5, 6, 2, 5, 4, 19, 5, 6, 7, 12};
    cout << lisOptimal(n2) << endl;  // Output: 6
}
```

**Why `lower_bound` for strict increase?** `lower_bound` finds the first position ≥ num. Replacing it maintains the invariant that each tail is as small as possible. Using `upper_bound` would allow equal elements.

---

## 10. LIS — Print Actual Subsequence

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> lisPrint(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(n, 1), parent(n, -1);

    int maxLen = 1, lastIdx = 0;
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
                dp[i] = dp[j] + 1;
                parent[i] = j;
            }
        }
        if (dp[i] > maxLen) { maxLen = dp[i]; lastIdx = i; }
    }

    // Reconstruct
    vector<int> result;
    for (int i = lastIdx; i != -1; i = parent[i])
        result.push_back(nums[i]);
    reverse(result.begin(), result.end());
    return result;
}

int main() {
    vector<int> nums = {10, 9, 2, 5, 3, 7, 101, 18};
    auto seq = lisPrint(nums);
    for (int x : seq) cout << x << " ";
    cout << endl;  // Output: 2 3 7 101  (or 2 5 7 101)
}
```

---

## 11. Longest Bitonic Subsequence

### Problem

Find the length of the **Longest Bitonic Subsequence** — first strictly increasing then strictly decreasing.

**Example:**
```
nums = [1, 11, 2, 10, 4, 5, 2, 1]
Output: 6   →  [1, 2, 10, 4, 2, 1]
```

**Approach:** For each index `i`, compute:
- `lis[i]` = LIS ending at `i`
- `lds[i]` = LIS starting at `i` (LDS = longest decreasing from `i`)
- Answer = max of `lis[i] + lds[i] - 1`

```cpp
#include <iostream>
#include <vector>
using namespace std;

int longestBitonicSubsequence(vector<int>& nums) {
    int n = nums.size();
    vector<int> lis(n, 1), lds(n, 1);

    // Compute LIS ending at each i (left to right)
    for (int i = 1; i < n; i++)
        for (int j = 0; j < i; j++)
            if (nums[j] < nums[i])
                lis[i] = max(lis[i], lis[j] + 1);

    // Compute LDS starting at each i (right to left = LIS from the right)
    for (int i = n-2; i >= 0; i--)
        for (int j = i+1; j < n; j++)
            if (nums[j] < nums[i])
                lds[i] = max(lds[i], lds[j] + 1);

    int maxLen = 0;
    for (int i = 0; i < n; i++)
        if (lis[i] > 1 && lds[i] > 1)       // must have both increasing and decreasing parts
            maxLen = max(maxLen, lis[i] + lds[i] - 1);

    return maxLen;
}

int main() {
    vector<int> n1 = {1, 11, 2, 10, 4, 5, 2, 1};
    cout << longestBitonicSubsequence(n1) << endl;  // Output: 6

    vector<int> n2 = {0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15};
    cout << longestBitonicSubsequence(n2) << endl;  // Output: 7
}
```

---

## 12. Maximum Sum Increasing Subsequence

### Problem

Find the **maximum sum** of an increasing subsequence (not maximum length).

**Example:**
```
nums = [1, 101, 2, 3, 100, 4, 5]
Output: 106   →  [1, 2, 3, 100]
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int maxSumIS(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp = nums;  // dp[i] = max sum of increasing subseq ending at i

    for (int i = 1; i < n; i++)
        for (int j = 0; j < i; j++)
            if (nums[j] < nums[i])
                dp[i] = max(dp[i], dp[j] + nums[i]);

    return *max_element(dp.begin(), dp.end());
}

int main() {
    vector<int> nums = {1, 101, 2, 3, 100, 4, 5};
    cout << maxSumIS(nums) << endl;  // Output: 106
}
```

---

## 13. Number of LIS

### Problem

Count the **number of distinct Longest Increasing Subsequences**.

**Example:**
```
nums = [1, 3, 5, 4, 7]  →  Output: 2  ([1,3,5,7] and [1,3,4,7])
nums = [2, 2, 2, 2]      →  Output: 1
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int findNumberOfLIS(vector<int>& nums) {
    int n = nums.size();
    vector<int> len(n, 1), cnt(n, 1);  // len[i]=LIS ending at i, cnt[i]=# of such LIS

    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                if (len[j] + 1 > len[i]) {
                    len[i] = len[j] + 1;
                    cnt[i] = cnt[j];               // new longer LIS found
                } else if (len[j] + 1 == len[i]) {
                    cnt[i] += cnt[j];              // another LIS of same length
                }
            }
        }
    }

    int maxLen = *max_element(len.begin(), len.end());
    int result = 0;
    for (int i = 0; i < n; i++)
        if (len[i] == maxLen) result += cnt[i];
    return result;
}

int main() {
    vector<int> n1 = {1, 3, 5, 4, 7};
    cout << findNumberOfLIS(n1) << endl;  // Output: 2

    vector<int> n2 = {2, 2, 2, 2};
    cout << findNumberOfLIS(n2) << endl;  // Output: 4 (each single element)
}
```

---

## 14. Russian Doll Envelopes

### Problem

Each envelope has dimensions `[w, h]`. Envelope A fits inside B if both `w_A < w_B` AND `h_A < h_B`. Find the **maximum number of envelopes** that can be nested.

**Example:**
```
envelopes = [[5,4],[6,4],[6,7],[2,3]]
Output: 3   →  [2,3] ⊂ [5,4]? No. [2,3] ⊂ [6,7]: Yes. [5,4] ⊂ [6,7]: Yes.
              → [2,3] → [5,4] → [6,7] = 3
```

**Trick:** Sort by width ascending; for equal widths sort by height **descending** (prevents using two same-width envelopes). Then find LIS on heights only.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int maxEnvelopes(vector<vector<int>>& envelopes) {
    // Sort by width asc, then height DESC for equal widths
    sort(envelopes.begin(), envelopes.end(), [](const vector<int>& a, const vector<int>& b) {
        return a[0] != b[0] ? a[0] < b[0] : a[1] > b[1];
    });

    // LIS on heights
    vector<int> tails;
    for (auto& e : envelopes) {
        int h = e[1];
        auto it = lower_bound(tails.begin(), tails.end(), h);
        if (it == tails.end()) tails.push_back(h);
        else                   *it = h;
    }
    return tails.size();
}

int main() {
    vector<vector<int>> e1 = {{5,4},{6,4},{6,7},{2,3}};
    cout << maxEnvelopes(e1) << endl;  // Output: 3

    vector<vector<int>> e2 = {{1,1},{1,1},{1,1}};
    cout << maxEnvelopes(e2) << endl;  // Output: 1
}
```

---

## 15. Distinct Subsequences

### Problem (already in Problem 7 — restated for completeness)

Count the number of distinct subsequences of `s` equal to `t`.

> See [Problem 7 — Subsequence Pattern Matching](#7-subsequence-pattern-matching-count) for the full solution.

---

## 16. Is Subsequence

### Problem

Given `s` and `t`, check if `s` is a **subsequence** of `t`.

**Example:**
```
s="abc", t="ahbgdc"  →  true
s="axc", t="ahbgdc"  →  false
```

```cpp
#include <iostream>
#include <string>
using namespace std;

// O(n) two pointer
bool isSubsequence(string s, string t) {
    int i = 0, j = 0;
    while (i < (int)s.size() && j < (int)t.size()) {
        if (s[i] == t[j]) i++;
        j++;
    }
    return i == (int)s.size();
}

// Follow-up: if many queries with same t, preprocess t
// For each position and each char, store next occurrence
bool isSubsequenceDP(string s, string t) {
    int m = t.size();
    // next[i][c] = next occurrence of char c at or after position i in t
    vector<array<int,26>> next(m+1);
    next[m].fill(m);  // sentinel: no more characters
    for (int i = m-1; i >= 0; i--) {
        next[i] = next[i+1];
        next[i][t[i]-'a'] = i;
    }

    int idx = 0;
    for (char c : s) {
        if (next[idx][c-'a'] == m) return false;
        idx = next[idx][c-'a'] + 1;
    }
    return true;
}

int main() {
    cout << isSubsequence("abc", "ahbgdc") << endl;  // Output: 1 (true)
    cout << isSubsequence("axc", "ahbgdc") << endl;  // Output: 0 (false)
    cout << isSubsequenceDP("abc", "ahbgdc") << endl; // Output: 1
}
```

---

## 17. Longest Palindromic Subsequence

### Problem

Find the length of the **longest subsequence** that is a palindrome.

**Example:**
```
s = "bbbab"  →  Output: 4  ("bbbb")
s = "cbbd"   →  Output: 2  ("bb")
```

**Key Insight:** `LPS(s) = LCS(s, reverse(s))`

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

int longestPalindromicSubsequence(string s) {
    string rev = s;
    reverse(rev.begin(), rev.end());

    // LCS of s and its reverse
    int n = s.size();
    vector<vector<int>> dp(n+1, vector<int>(n+1, 0));
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            if (s[i-1] == rev[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
            else                      dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
    return dp[n][n];
}

// Direct interval DP approach
int lpsDirect(string& s) {
    int n = s.size();
    vector<vector<int>> dp(n, vector<int>(n, 0));
    for (int i = 0; i < n; i++) dp[i][i] = 1;  // single char is palindrome

    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            if (s[i] == s[j]) dp[i][j] = dp[i+1][j-1] + 2;
            else               dp[i][j] = max(dp[i+1][j], dp[i][j-1]);
        }
    }
    return dp[0][n-1];
}

int main() {
    string s1 = "bbbab";
    cout << longestPalindromicSubsequence(s1) << endl;  // Output: 4
    cout << lpsDirect(s1) << endl;                      // Output: 4

    string s2 = "cbbd";
    cout << lpsDirect(s2) << endl;  // Output: 2
}
```

---

## 18. Minimum Deletions to Make Palindrome

### Problem

Find the **minimum number of deletions** to make a string a palindrome.

**Formula:** `n - LPS(s)` (delete everything that's NOT in the longest palindromic subsequence)

```cpp
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

int minDeletionsPalindrome(string s) {
    string rev = s;
    reverse(rev.begin(), rev.end());
    int n = s.size();
    vector<vector<int>> dp(n+1, vector<int>(n+1, 0));
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= n; j++)
            if (s[i-1] == rev[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
            else                      dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
    return n - dp[n][n];  // n - LPS
}

int main() {
    cout << minDeletionsPalindrome("abcba")  << endl;  // Output: 0 (already palindrome)
    cout << minDeletionsPalindrome("abcbea") << endl;  // Output: 1 (delete 'e')
    cout << minDeletionsPalindrome("aabb")   << endl;  // Output: 2
}
```

---

## 19. Longest Alternating Subsequence

### Problem

Find the length of the **longest alternating subsequence** — elements alternately greater and less than the preceding element.

**Example:**
```
nums = [1, 17, 5, 10, 13, 15, 10, 5, 16, 8]
Output: 7   →  [1, 17, 5, 15, 5, 16, 8]
```

```cpp
#include <iostream>
#include <vector>
using namespace std;

int longestAlternatingSubsequence(vector<int>& nums) {
    int n = nums.size();
    // up[i]   = LAS ending at i where last move was going UP
    // down[i] = LAS ending at i where last move was going DOWN
    int up = 1, down = 1;  // space-optimized

    for (int i = 1; i < n; i++) {
        if (nums[i] > nums[i-1])      up   = down + 1;
        else if (nums[i] < nums[i-1]) down = up   + 1;
        // equal: no change
    }
    return max(up, down);
}

int main() {
    vector<int> n1 = {1, 17, 5, 10, 13, 15, 10, 5, 16, 8};
    cout << longestAlternatingSubsequence(n1) << endl;  // Output: 7

    vector<int> n2 = {1, 2, 3, 4, 5};
    cout << longestAlternatingSubsequence(n2) << endl;  // Output: 2 (any peak pair)
}
```

---

## 20. Maximum Length of Repeated Subarray

### Problem

Find the maximum length of a **subarray** (contiguous) that appears in both arrays.

> This is equivalent to **Longest Common Substring** applied to arrays.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int findLength(vector<int>& A, vector<int>& B) {
    int m = A.size(), n = B.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    int maxLen = 0;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (A[i-1] == B[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;    // extend contiguous match
                maxLen = max(maxLen, dp[i][j]);
            }
            // else dp[i][j] = 0 (reset — continuity broken)
        }
    }
    return maxLen;
}

int main() {
    vector<int> A = {1,2,3,2,1}, B = {3,2,1,4,7};
    cout << findLength(A, B) << endl;  // Output: 3 ([3,2,1])

    vector<int> A2 = {0,0,0,0,0}, B2 = {0,0,0,0,0};
    cout << findLength(A2, B2) << endl;  // Output: 5
}
```

---

## LCS vs LIS — Comparison

| Property | LCS | LIS |
|---|---|---|
| Inputs | Two sequences | One sequence |
| Table | 2D: dp[i][j] | 1D: dp[i] |
| Base case | dp[0][j]=dp[i][0]=0 | dp[i]=1 (every element) |
| Transition (match) | dp[i-1][j-1]+1 | max(dp[j]+1) for all j<i |
| Transition (no match) | max(dp[i-1][j], dp[i][j-1]) | N/A |
| Time (basic) | O(mn) | O(n²) |
| Time (optimal) | O(mn) — already optimal | O(n log n) — patience sort |
| Print path | Traceback from dp[m][n] | Track parent array |

## Complexity Quick Reference

| Problem | Time | Space |
|---|---|---|
| LCS | O(mn) | O(mn) → O(n) |
| LCS print | O(mn) | O(mn) |
| Shortest Common Supersequence | O(mn) | O(mn) |
| Min Insertions/Deletions | O(mn) | O(mn) |
| Longest Common Substring | O(mn) | O(mn) → O(n) |
| Longest Repeating Subsequence | O(n²) | O(n²) |
| Subsequence Count | O(mn) | O(mn) |
| LIS (DP) | O(n²) | O(n) |
| LIS (optimal) | O(n log n) | O(n) |
| Longest Bitonic Subseq | O(n²) | O(n) |
| Max Sum Increasing Subseq | O(n²) | O(n) |
| Number of LIS | O(n²) | O(n) |
| Russian Doll Envelopes | O(n log n) | O(n) |
| Longest Palindromic Subseq | O(n²) | O(n²) |
| Min Deletions → Palindrome | O(n²) | O(n²) |
| Longest Alternating Subseq | O(n) | O(1) |
| Max Repeated Subarray | O(mn) | O(mn) |

{% endraw %}
