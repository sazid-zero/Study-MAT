---
layout: docs
title: String Algorithms
permalink: /string-algorithms/
---

[⬅️ Back to Home]({{ '/' | relative_url }})

---
{% raw %}
# String Algorithms

## At a Glance

| Algorithm | Use Case | Time | Space |
|---|---|---|---|
| KMP | Single pattern search | O(n+m) | O(m) |
| Rabin-Karp | Multi-pattern / rolling hash | O(n+m) avg | O(m) |
| Z-Algorithm | Pattern search, string periods | O(n+m) | O(n+m) |
| Manacher's | Longest palindromic substring | O(n) | O(n) |
| Aho-Corasick | Multiple patterns simultaneously | O(n+Σ|Pi|) | O(Σ|Pi|×Σ) |
| Suffix Array | All suffixes sorted; LCP queries | O(n log n) | O(n) |
| String Hashing | Fast substring equality/comparison | O(n) preprocess, O(1) query | O(n) |

---


## Table of Contents

1. [KMP — Failure Function + Pattern Search](#1-kmp--failure-function--pattern-search)
2. [Rabin-Karp — Rolling Hash](#2-rabin-karp--rolling-hash)
3. [Rabin-Karp — Multiple Pattern Search](#3-rabin-karp--multiple-pattern-search)
4. [Z-Algorithm](#4-z-algorithm)
5. [Z-Algorithm — Minimum Period of String](#5-z-algorithm--minimum-period-of-string)
6. [Manacher's Algorithm — Longest Palindromic Substring](#6-manachers-algorithm--longest-palindromic-substring)
7. [Manacher's — Count All Palindromic Substrings](#7-manachers--count-all-palindromic-substrings)
8. [Aho-Corasick — Multi-Pattern Search](#8-aho-corasick--multi-pattern-search)
9. [Suffix Array — O(n log n) Construction](#9-suffix-array--on-log-n-construction)
10. [Suffix Array — LCP Array (Kasai's Algorithm)](#10-suffix-array--lcp-array-kasais-algorithm)
11. [String Hashing — Polynomial Rolling Hash](#11-string-hashing--polynomial-rolling-hash)
12. [String Hashing — Count Distinct Substrings](#12-string-hashing--count-distinct-substrings)
13. [Longest Repeated Substring (Suffix Array + LCP)](#13-longest-repeated-substring-suffix-array--lcp)
14. [Shortest Superstring (bitmask DP + string matching)](#14-shortest-superstring-bitmask-dp--string-matching)
15. [String Rotation Check](#15-string-rotation-check)

---

## 1. KMP — Failure Function + Pattern Search

### Problem

Find all occurrences of pattern `p` in text `t` in O(n+m) time.

### How KMP Works

1. Build **failure function (prefix table)** `pi[i]` = length of longest proper prefix of `p[0..i]` that is also a suffix.
2. Use `pi` to skip unnecessary comparisons: when a mismatch at `p[j]` after matching `p[0..j-1]`, fallback to `p[pi[j-1]]` instead of restarting.

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

// Build prefix (failure) table
// pi[i] = length of longest proper prefix of pattern[0..i] that is also a suffix
vector<int> buildPi(const string& p) {
    int m = p.size();
    vector<int> pi(m, 0);
    int k = 0;
    for (int i = 1; i < m; i++) {
        while (k > 0 && p[i] != p[k]) k = pi[k-1];  // fallback
        if (p[i] == p[k]) k++;
        pi[i] = k;
    }
    return pi;
}

// Find all occurrences of pattern in text, return starting indices (0-based)
vector<int> kmpSearch(const string& text, const string& pattern) {
    string s = pattern + '#' + text;  // concat trick: search in combined string
    vector<int> pi = buildPi(s);
    int m = pattern.size();
    vector<int> matches;
    for (int i = m + 1; i < (int)s.size(); i++) {
        if (pi[i] == m) matches.push_back(i - 2*m);  // found at i-2m in original text
    }
    return matches;
}

// Alternative: direct KMP matching without concat
vector<int> kmpDirect(const string& text, const string& pattern) {
    int n = text.size(), m = pattern.size();
    vector<int> pi = buildPi(pattern);
    vector<int> matches;
    int j = 0;  // matched length in pattern
    for (int i = 0; i < n; i++) {
        while (j > 0 && text[i] != pattern[j]) j = pi[j-1];
        if (text[i] == pattern[j]) j++;
        if (j == m) {
            matches.push_back(i - m + 1);
            j = pi[j-1];  // continue searching for overlapping matches
        }
    }
    return matches;
}

int main() {
    string text = "aabxaabaaxaabya", pattern = "aab";
    auto occ = kmpDirect(text, pattern);
    for (int i : occ) cout << i << " ";  // 0 7 11
    cout << "\n";

    // Prefix table example: pattern = "ababab"
    // pi = [0, 0, 1, 2, 3, 4]
    auto pi = buildPi("ababab");
    for (int x : pi) cout << x << " "; cout << "\n";
}
```

---

## 2. Rabin-Karp — Rolling Hash

### Problem

Find first occurrence of pattern in text using hash comparison. Average O(n+m), worst O(nm).

**Rolling hash:** When sliding window by one character:
`hash = (hash - old_char * base^(m-1)) * base + new_char`

```cpp
#include <iostream>
#include <string>
using namespace std;

int rabinKarp(const string& text, const string& pattern) {
    int n = text.size(), m = pattern.size();
    if (n < m) return -1;

    const long long BASE = 31, MOD = 1e9 + 9;

    // Precompute BASE^(m-1) mod MOD
    long long power = 1;
    for (int i = 0; i < m-1; i++) power = power * BASE % MOD;

    // Compute initial hashes
    long long patHash = 0, winHash = 0;
    for (int i = 0; i < m; i++) {
        patHash = (patHash * BASE + (pattern[i] - 'a' + 1)) % MOD;
        winHash = (winHash * BASE + (text[i]   - 'a' + 1)) % MOD;
    }

    // Slide window
    for (int i = 0; i <= n - m; i++) {
        if (winHash == patHash) {
            // Hash match: verify to handle collision
            if (text.substr(i, m) == pattern) return i;
        }
        if (i < n - m) {
            winHash = (winHash - (text[i] - 'a' + 1) * power % MOD + MOD) % MOD;
            winHash = (winHash * BASE + (text[i+m] - 'a' + 1)) % MOD;
        }
    }
    return -1;
}

int main() {
    cout << rabinKarp("abcxabcdabcdabcy", "abcdabcy") << "\n";  // 8
}
```

---

## 3. Rabin-Karp — Multiple Pattern Search

```cpp
#include <unordered_set>
#include <string>
#include <vector>
using namespace std;

vector<int> multiPatternSearch(const string& text, const vector<string>& patterns) {
    // All patterns assumed same length m (for simplicity)
    if (patterns.empty()) return {};
    int m = patterns[0].size();
    int n = text.size();

    const long long BASE = 31, MOD = 1e9 + 9;
    long long power = 1;
    for (int i = 0; i < m-1; i++) power = power * BASE % MOD;

    // Hash all patterns
    unordered_set<long long> patHashes;
    unordered_set<string> patSet(patterns.begin(), patterns.end());
    for (auto& p : patterns) {
        long long h = 0;
        for (char c : p) h = (h * BASE + (c - 'a' + 1)) % MOD;
        patHashes.insert(h);
    }

    // Slide over text
    long long winHash = 0;
    vector<int> matches;
    for (int i = 0; i < n; i++) {
        winHash = (winHash * BASE + (text[i] - 'a' + 1)) % MOD;
        if (i >= m) {
            winHash = (winHash - (text[i-m] - 'a' + 1) * power % MOD * BASE % MOD + MOD * 2) % MOD;
        }
        if (i >= m-1 && patHashes.count(winHash)) {
            string sub = text.substr(i-m+1, m);
            if (patSet.count(sub)) matches.push_back(i-m+1);  // verify
        }
    }
    return matches;
}
```

---

## 4. Z-Algorithm

### Problem

Build Z-array where `z[i]` = length of longest substring starting at `s[i]` that matches a prefix of `s`. Use for O(n+m) pattern searching.

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

// Build Z-array: z[i] = longest common prefix of s and s[i..]
// z[0] = 0 by convention (or n, depending on implementation)
vector<int> buildZ(const string& s) {
    int n = s.size();
    vector<int> z(n, 0);
    int l = 0, r = 0;  // current Z-box [l, r)
    for (int i = 1; i < n; i++) {
        if (i < r) z[i] = min(r - i, z[i - l]);  // use previous result inside Z-box
        // Extend Z[i] beyond current Z-box
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
        // Update Z-box
        if (i + z[i] > r) { l = i; r = i + z[i]; }
    }
    return z;
}

// Search using Z-algorithm: form "pattern#text", z[i]==m → match at i-m-1 in text
vector<int> zSearch(const string& text, const string& pattern) {
    string s = pattern + '#' + text;
    vector<int> z = buildZ(s);
    int m = pattern.size();
    vector<int> matches;
    for (int i = m+1; i < (int)s.size(); i++)
        if (z[i] == m) matches.push_back(i - m - 1);
    return matches;
}

int main() {
    auto matches = zSearch("aabxaabaaxaabya", "aab");
    for (int i : matches) cout << i << " ";  // 0 7 11
    cout << "\n";

    // Z-array of "aabxaa": z = [0,1,0,0,2,1]
    vector<int> z = buildZ("aabxaa");
    for (int x : z) cout << x << " "; cout << "\n";
}
```

---

## 5. Z-Algorithm — Minimum Period of String

```cpp
#include <string>
#include <vector>
using namespace std;

// Minimum period p such that s[i] = s[i mod p] for all i
int minPeriod(const string& s) {
    int n = s.size();
    vector<int> z = buildZ(s);
    for (int p = 1; p <= n; p++)
        if (n % p == 0 && (p == n || z[p] == n - p)) return p;
    return n;
}

// Also computable from KMP: period = n - pi[n-1]
// Works if n % period == 0, otherwise string has no exact period
int minPeriodKMP(const string& s) {
    int n = s.size();
    vector<int> pi = buildPi(s);  // from KMP section
    int candidate = n - pi[n-1];
    return (n % candidate == 0) ? candidate : n;
}
```

---

## 6. Manacher's Algorithm — Longest Palindromic Substring

### Problem

Find the longest palindromic substring in O(n) time.

### Key Idea

Transform `s` into `#a#b#a#` to handle both odd and even lengths uniformly. Maintain center `c` and right boundary `r` of the furthest-reaching palindrome.

```cpp
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

// Returns {start, length} of longest palindromic substring in s
pair<int,int> manacher(const string& s) {
    // Transform: "abc" → "#a#b#c#"
    string t = "#";
    for (char c : s) { t += c; t += '#'; }
    int n = t.size();

    vector<int> p(n, 0);  // p[i] = radius of palindrome centered at t[i]
    int c = 0, r = 0;     // center and right boundary of rightmost palindrome

    for (int i = 0; i < n; i++) {
        int mirror = 2*c - i;  // mirror of i around center c
        if (i < r) p[i] = min(r - i, p[mirror]);  // use mirror's radius
        // Expand around center i
        while (i - p[i] - 1 >= 0 && i + p[i] + 1 < n && t[i-p[i]-1] == t[i+p[i]+1])
            p[i]++;
        // Update rightmost palindrome
        if (i + p[i] > r) { c = i; r = i + p[i]; }
    }

    // Find maximum radius and convert back to original indices
    int maxR = *max_element(p.begin(), p.end());
    int center = max_element(p.begin(), p.end()) - p.begin();
    int start = (center - maxR) / 2;  // convert from transformed to original
    return {start, maxR};
}

string longestPalindrome(string s) {
    auto [start, len] = manacher(s);
    return s.substr(start, len);
}

int main() {
    cout << longestPalindrome("babad")  << "\n";  // "bab" or "aba"
    cout << longestPalindrome("cbbd")   << "\n";  // "bb"
    cout << longestPalindrome("racecar")<< "\n";  // "racecar"
}
```

---

## 7. Manacher's — Count All Palindromic Substrings

```cpp
#include <string>
#include <vector>
using namespace std;

// Count palindromic substrings in O(n) using Manacher's p[] array
int countPalindromes(const string& s) {
    string t = "#";
    for (char c : s) { t += c; t += '#'; }
    int n = t.size();
    vector<int> p(n, 0);
    int c = 0, r = 0;
    for (int i = 0; i < n; i++) {
        int mirror = 2*c - i;
        if (i < r) p[i] = min(r-i, p[mirror]);
        while (i-p[i]-1 >= 0 && i+p[i]+1 < n && t[i-p[i]-1] == t[i+p[i]+1]) p[i]++;
        if (i+p[i] > r) { c = i; r = i+p[i]; }
    }
    // Each transformed center i contributes ceil(p[i]+1)/2 palindromes (roughly)
    // Exact: odd-length palindromes from even transformed indices, even from odd
    int count = 0;
    for (int i = 0; i < n; i++) count += (p[i]+1) / 2;
    return count;
    // Note: "(p[i]+1)/2" counts palindromes centered at both original chars and gaps
    // For original substrings only: for i at original chars (even index in t): (p[i]/2)+1 odd ones
    //                              for i at gaps (odd index in t): p[i]/2 even ones
}
```

---

## 8. Aho-Corasick — Multi-Pattern Search

### Problem

Find all occurrences of all patterns simultaneously in a text in O(n + sum of pattern lengths + number of matches).

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <queue>
using namespace std;

struct AhoCorasick {
    struct Node {
        int children[26];
        int fail;        // failure (suffix) link
        int output;      // bitmask or index of matched pattern (-1 = none)
        Node() { fill(children, children+26, -1); fail = 0; output = -1; }
    };

    vector<Node> trie;

    AhoCorasick() { trie.push_back(Node()); }

    void insert(const string& word, int idx) {
        int cur = 0;
        for (char c : word) {
            int ch = c - 'a';
            if (trie[cur].children[ch] == -1) {
                trie[cur].children[ch] = trie.size();
                trie.push_back(Node());
            }
            cur = trie[cur].children[ch];
        }
        trie[cur].output = idx;  // marks end of pattern idx
    }

    void build() {  // BFS to compute failure links
        queue<int> q;
        trie[0].fail = 0;
        for (int c = 0; c < 26; c++) {
            int child = trie[0].children[c];
            if (child == -1) trie[0].children[c] = 0;  // loop back root
            else { trie[child].fail = 0; q.push(child); }
        }
        while (!q.empty()) {
            int u = q.front(); q.pop();
            // If u matches a pattern AND fail link also does: chain outputs
            if (trie[trie[u].fail].output != -1 && trie[u].output == -1)
                trie[u].output = trie[trie[u].fail].output;

            for (int c = 0; c < 26; c++) {
                int child = trie[u].children[c];
                if (child == -1) {
                    trie[u].children[c] = trie[trie[u].fail].children[c];
                } else {
                    trie[child].fail = trie[trie[u].fail].children[c];
                    q.push(child);
                }
            }
        }
    }

    // Search text; callback called with (text_position, pattern_index)
    void search(const string& text, vector<pair<int,int>>& matches) {
        int cur = 0;
        for (int i = 0; i < (int)text.size(); i++) {
            cur = trie[cur].children[text[i]-'a'];
            if (trie[cur].output != -1)
                matches.push_back({i, trie[cur].output});
        }
    }
};

int main() {
    AhoCorasick ac;
    vector<string> patterns = {"he","she","his","hers"};
    for (int i = 0; i < (int)patterns.size(); i++) ac.insert(patterns[i], i);
    ac.build();

    string text = "ahishers";
    vector<pair<int,int>> matches;
    ac.search(text, matches);
    for (auto [pos, idx] : matches)
        cout << "Found '" << patterns[idx] << "' at position " << pos - (int)patterns[idx].size() + 1 << "\n";
}
```

---

## 9. Suffix Array — O(n log n) Construction

**Suffix Array** `sa[]` where `sa[i]` = starting index of i-th lexicographically smallest suffix.

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <numeric>
using namespace std;

vector<int> buildSuffixArray(const string& s) {
    int n = s.size();
    vector<int> sa(n), rank_(n), tmp(n);

    // Initial ranking from character values
    iota(sa.begin(), sa.end(), 0);
    for (int i = 0; i < n; i++) rank_[i] = s[i];

    for (int gap = 1; gap < n; gap *= 2) {
        // Comparator: sort by (rank_[i], rank_[i+gap])
        auto cmp = [&](int a, int b) {
            if (rank_[a] != rank_[b]) return rank_[a] < rank_[b];
            int ra = (a+gap < n) ? rank_[a+gap] : -1;
            int rb = (b+gap < n) ? rank_[b+gap] : -1;
            return ra < rb;
        };
        sort(sa.begin(), sa.end(), cmp);

        // Re-rank
        tmp[sa[0]] = 0;
        for (int i = 1; i < n; i++)
            tmp[sa[i]] = tmp[sa[i-1]] + (cmp(sa[i-1], sa[i]) ? 1 : 0);
        rank_ = tmp;
        if (rank_[sa[n-1]] == n-1) break;  // all ranks unique: done early
    }
    return sa;
}

int main() {
    string s = "banana";
    vector<int> sa = buildSuffixArray(s);
    for (int i : sa) cout << i << " " << s.substr(i) << "\n";
    // 5 a | 3 ana | 1 anana | 0 banana | 4 na | 2 nana
}
```

---

## 10. Suffix Array — LCP Array (Kasai's Algorithm)

**LCP array:** `lcp[i]` = length of longest common prefix of `sa[i]` and `sa[i-1]` (adjacent suffixes in sorted order). Kasai's builds LCP in O(n) given SA.

```cpp
#include <vector>
#include <string>
using namespace std;

// Build LCP array from suffix array in O(n) — Kasai's
vector<int> buildLCP(const string& s, const vector<int>& sa) {
    int n = s.size();
    vector<int> rank_(n), lcp(n, 0);

    // Inverse of SA: rank[sa[i]] = i
    for (int i = 0; i < n; i++) rank_[sa[i]] = i;

    int h = 0;  // current LCP length
    for (int i = 0; i < n; i++) {
        if (rank_[i] > 0) {
            int j = sa[rank_[i] - 1];  // previous suffix in sorted order
            while (i+h < n && j+h < n && s[i+h] == s[j+h]) h++;
            lcp[rank_[i]] = h;
            if (h > 0) h--;  // LCP can decrease by at most 1 when moving to next suffix
        }
    }
    return lcp;
}

int main() {
    string s = "aabaa";
    auto sa  = buildSuffixArray(s);
    auto lcp = buildLCP(s, sa);
    // sa  = [3 4 0 1 2]  → "aa" "a" "aabaa" "abaa" "baa"
    // lcp = [0 1 0 2 1]
    for (int i = 0; i < (int)sa.size(); i++)
        cout << sa[i] << " lcp=" << lcp[i] << " " << s.substr(sa[i]) << "\n";
}
```

---

## 11. String Hashing — Polynomial Rolling Hash

**Two hashes** (double hashing) to eliminate collisions in practice.

```cpp
#include <string>
#include <vector>
using namespace std;

struct StringHash {
    int n;
    vector<long long> h1, h2, p1, p2;
    static const long long B1 = 31, B2 = 37, MOD1 = 1e9+7, MOD2 = 1e9+9;

    StringHash(const string& s) : n(s.size()), h1(n+1,0), h2(n+1,0), p1(n+1,1), p2(n+1,1) {
        for (int i = 0; i < n; i++) {
            h1[i+1] = (h1[i] * B1 + (s[i]-'a'+1)) % MOD1;
            h2[i+1] = (h2[i] * B2 + (s[i]-'a'+1)) % MOD2;
            p1[i+1] = p1[i] * B1 % MOD1;
            p2[i+1] = p2[i] * B2 % MOD2;
        }
    }

    // Hash of s[l..r] (0-indexed, inclusive)
    pair<long long,long long> get(int l, int r) {
        long long v1 = (h1[r+1] - h1[l] * p1[r-l+1] % MOD1 + MOD1*2) % MOD1;
        long long v2 = (h2[r+1] - h2[l] * p2[r-l+1] % MOD2 + MOD2*2) % MOD2;
        return {v1, v2};
    }

    bool equal(int l1, int r1, int l2, int r2) { return get(l1,r1) == get(l2,r2); }
};

// Binary search + hashing for Longest Palindromic Substring in O(n log n)
// (Faster setup than Manacher's to implement, but O(n) Manacher's is better theoretically)
```

---

## 12. String Hashing — Count Distinct Substrings

```cpp
#include <string>
#include <unordered_set>
#include <set>
using namespace std;

// Count distinct substrings using rolling hash
int countDistinctSubstrings(const string& s) {
    int n = s.size();
    set<pair<long long,long long>> seen;
    StringHash sh(s);
    for (int len = 1; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++)
            seen.insert(sh.get(i, i+len-1));
    return seen.size();  // O(n^2 log n) — for O(n log n) use Suffix Array: n*(n+1)/2 - sum(lcp)
}

// Optimal using suffix array: distinct substrings = n*(n+1)/2 - sum(lcp[i])
int countDistinctSubstringsSA(const string& s) {
    int n = s.size();
    auto sa = buildSuffixArray(s);
    auto lcp = buildLCP(s, sa);
    long long total = (long long)n*(n+1)/2;
    for (int x : lcp) total -= x;
    return total;
}
```

---

## 13. Longest Repeated Substring (Suffix Array + LCP)

```cpp
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

string longestRepeatedSubstring(const string& s) {
    auto sa = buildSuffixArray(s);
    auto lcp = buildLCP(s, sa);
    // Maximum value in lcp array is the length of longest repeated substring
    int maxLen = *max_element(lcp.begin(), lcp.end());
    int idx = max_element(lcp.begin(), lcp.end()) - lcp.begin();
    return s.substr(sa[idx], maxLen);
}

int main() {
    cout << longestRepeatedSubstring("banana") << "\n";  // "ana"
    cout << longestRepeatedSubstring("abcabc") << "\n";  // "abc"
}
```

---

## 14. Shortest Superstring (bitmask DP + string matching)

### Problem

Given n strings, find the shortest superstring containing all as substrings. Bitmask DP over subsets.

```cpp
#include <vector>
#include <string>
#include <climits>
using namespace std;

// Overlap: how much of b's prefix matches a's suffix
int overlap(const string& a, const string& b) {
    string s = b + '#' + a;
    vector<int> pi(s.size(), 0);
    int k = 0;
    for (int i = 1; i < (int)s.size(); i++) {
        while (k > 0 && s[i] != s[k]) k = pi[k-1];
        if (s[i] == s[k]) k++;
        pi[i] = k;
    }
    return pi.back();  // longest prefix of b that is suffix of a
}

string shortestSuperstring(vector<string>& words) {
    int n = words.size();
    vector<vector<int>> ov(n, vector<int>(n, 0));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            if (i != j) ov[i][j] = overlap(words[i], words[j]);

    // dp[mask][i] = min length of superstring covering 'mask' words, ending with words[i]
    vector<vector<int>> dp(1<<n, vector<int>(n, INT_MAX/2));
    vector<vector<int>> par(1<<n, vector<int>(n, -1));
    for (int i = 0; i < n; i++) dp[1<<i][i] = words[i].size();

    for (int mask = 1; mask < (1<<n); mask++) {
        for (int last = 0; last < n; last++) {
            if (!(mask & (1<<last))) continue;
            if (dp[mask][last] == INT_MAX/2) continue;
            for (int next = 0; next < n; next++) {
                if (mask & (1<<next)) continue;
                int newMask = mask | (1<<next);
                int newLen = dp[mask][last] + (int)words[next].size() - ov[last][next];
                if (newLen < dp[newMask][next]) {
                    dp[newMask][next] = newLen;
                    par[newMask][next] = last;
                }
            }
        }
    }

    // Find best ending
    int fullMask = (1<<n)-1, last = -1, minLen = INT_MAX;
    for (int i = 0; i < n; i++)
        if (dp[fullMask][i] < minLen) { minLen = dp[fullMask][i]; last = i; }

    // Reconstruct
    string res;
    int mask = fullMask;
    while (last != -1) {
        int prev = par[mask][last];
        if (prev == -1) res = words[last] + res;
        else res = words[last].substr(ov[prev][last]) + res;
        mask ^= (1<<last);
        last = prev;
    }
    return res;
}

int main() {
    vector<string> w = {"alex","loves","leetcode"};
    cout << shortestSuperstring(w) << "\n";  // "alexlovesleetcode"
}
```

---

## 15. String Rotation Check

```cpp
#include <string>
using namespace std;

// s2 is a rotation of s1 iff s2 is a substring of s1+s1
bool isRotation(const string& s1, const string& s2) {
    if (s1.size() != s2.size()) return false;
    string doubled = s1 + s1;
    return doubled.find(s2) != string::npos;
    // Use KMP for O(n): kmpDirect(doubled, s2)
}

// All rotations of a string
vector<string> allRotations(const string& s) {
    int n = s.size();
    vector<string> res;
    for (int i = 0; i < n; i++) res.push_back(s.substr(i) + s.substr(0, i));
    return res;
}
```

---

## Complexity Quick Reference

| Algorithm | Build/Preprocess | Search | Space |
|---|---|---|---|
| Naive | O(1) | O(nm) | O(1) |
| KMP | O(m) — build pi | O(n+m) | O(m) |
| Rabin-Karp | O(m) — compute hash | O(n+m) avg | O(1) |
| Z-Algorithm | O(n+m) — build Z | O(n+m) | O(n+m) |
| Aho-Corasick | O(Σ|Pi|) — build trie+fail | O(n+matches) | O(Σ|Pi|×26) |
| Suffix Array | O(n log n) — build SA | O(m log n) — with SA | O(n) |
| LCP (Kasai's) | O(n) — given SA | O(log n) — RMQ on LCP | O(n) |
| Hash preprocessed | O(n) | O(1) per query | O(n) |

{% endraw %}
