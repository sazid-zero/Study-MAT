---
layout: docs
title: Sliding Window Technique
permalink: /sliding-window/
---

[⬅️ Back to Home]({{ '/' | relative_url }})

---
# Sliding Window Technique — Problem Set

The **sliding window** technique maintains a contiguous subarray or substring (the "window") that expands or contracts as it moves across the input. It avoids recomputing results from scratch on every step, reducing O(n²) or O(nk) brute-force solutions to **O(n)**.

> **Relationship to Two Pointers:** Sliding window IS a two-pointer technique. `left` and `right` define the window boundaries. The difference is the *intent* — you're maintaining an aggregate (sum, frequency count, condition) over a dynamic range, not just searching for a pair.

---

## Table of Contents

1. [Maximum Sum Subarray of Size k](#1-maximum-sum-subarray-of-size-k)
2. [Longest Substring Without Repeating Characters](#2-longest-substring-without-repeating-characters)
3. [Minimum Size Subarray Sum](#3-minimum-size-subarray-sum)
4. [Find All Anagrams in a String](#4-find-all-anagrams-in-a-string)
5. [Longest Ones — Binary Array with k Flips](#5-longest-ones--binary-array-with-k-flips)
6. [Maximum Average Subarray of Size k](#6-maximum-average-subarray-of-size-k)
7. [Longest Substring with At Most k Distinct Characters](#7-longest-substring-with-at-most-k-distinct-characters)
8. [Minimum Window Substring](#8-minimum-window-substring)
9. [Permutation in String](#9-permutation-in-string)
10. [Subarray Product Less Than k](#10-subarray-product-less-than-k)
11. [Maximum Consecutive Ones III (Generalized Flip)](#11-maximum-consecutive-ones-iii-generalized-flip)
12. [Count Subarrays with Sum Equal to k](#12-count-subarrays-with-sum-equal-to-k)

---

## Window Type Reference

| Type | Window Size | Shrink Condition | Examples |
|---|---|---|---|
| **Fixed** | Always `k` | When `right - left + 1 > k` | Max sum, average, anagram search |
| **Variable — grow until invalid** | Dynamic | When constraint violated | Longest no-repeat, longest ones |
| **Variable — shrink until valid** | Dynamic | When sum/count satisfies condition | Min subarray sum, min window |
| **Frequency map** | Fixed or variable | Character count mismatch | Anagrams, permutation check |

---

## 1. Maximum Sum Subarray of Size k

### Problem

Given an array of integers and a number `k`, find the **maximum sum** of any contiguous subarray of exactly length `k`.

**Example:**
```
Input:  arr = [2, 1, 5, 1, 3, 2],  k = 3
Output: 9   (subarray [5, 1, 3])
```

### Approach

Compute the sum of the first window `[0..k-1]`. Then **slide** the window one step at a time: add the new right element and subtract the element leaving from the left (`arr[i-k]`). Track the maximum sum seen.

This avoids re-summing from scratch each step.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

int maxSumSubarray(vector<int>& arr, int k) {
    int n = arr.size();

    // Sum of the first window
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    int maxSum = windowSum;

    // Slide the window: add new element, remove oldest
    for (int i = k; i < n; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = max(maxSum, windowSum);
    }
    return maxSum;
}

int main() {
    vector<int> arr = {2, 1, 5, 1, 3, 2};
    int k = 3;
    cout << "Max sum = " << maxSumSubarray(arr, k) << endl;
    // Output: Max sum = 9
}
```

**Visual trace:**
```
Window [2,1,5] → sum=8
Window [1,5,1] → sum=7
Window [5,1,3] → sum=9  ← max
Window [1,3,2] → sum=6
```

---

## 2. Longest Substring Without Repeating Characters

### Problem

Given a string, find the **length of the longest substring** that contains no repeating characters.

**Example:**
```
Input:  s = "abcabcbb"
Output: 3   (substring "abc")

Input:  s = "pwwkew"
Output: 3   (substring "wke")

Input:  s = "bbbbb"
Output: 1   (substring "b")
```

### Approach

Variable-size window. Expand `right` one character at a time. If `s[right]` is already in the current window (tracked via a hash set), shrink from `left` until the duplicate is removed. The window always contains unique characters — track the maximum size.

**Time:** O(n) | **Space:** O(min(n, charset size))

### Solution

```cpp
#include <iostream>
#include <string>
#include <unordered_set>
using namespace std;

int lengthOfLongestSubstring(string s) {
    unordered_set<char> seen;  // characters currently in the window
    int left = 0, maxLen = 0;

    for (int right = 0; right < (int)s.size(); right++) {
        // Shrink window from left until s[right] is no longer a duplicate
        while (seen.count(s[right])) {
            seen.erase(s[left]);
            left++;
        }
        seen.insert(s[right]);
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}

int main() {
    cout << lengthOfLongestSubstring("abcabcbb") << endl;  // 3
    cout << lengthOfLongestSubstring("pwwkew")   << endl;  // 3
    cout << lengthOfLongestSubstring("bbbbb")    << endl;  // 1
}
```

---

## 3. Minimum Size Subarray Sum

### Problem

Given an array of **positive integers** and a target, find the **minimum length** of a contiguous subarray whose sum is **≥ target**. Return 0 if no such subarray exists.

**Example:**
```
Input:  nums = [2, 3, 1, 2, 4, 3],  target = 7
Output: 2   (subarray [4, 3])
```

### Approach

Variable window, shrink-until-valid pattern. Expand `right` to accumulate sum. Once `sum >= target`, record the current window length, then shrink from `left` to see if a shorter valid window exists. Repeat until the window is invalid again.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int minSubArrayLen(int target, vector<int>& nums) {
    int left = 0, sum = 0, minLen = INT_MAX;

    for (int right = 0; right < (int)nums.size(); right++) {
        sum += nums[right];

        // Shrink window as long as sum still meets the target
        while (sum >= target) {
            minLen = min(minLen, right - left + 1);
            sum -= nums[left++];  // remove leftmost element
        }
    }
    return (minLen == INT_MAX) ? 0 : minLen;
}

int main() {
    vector<int> nums = {2, 3, 1, 2, 4, 3};
    cout << minSubArrayLen(7, nums) << endl;  // Output: 2

    vector<int> nums2 = {1, 1, 1, 1};
    cout << minSubArrayLen(10, nums2) << endl; // Output: 0 (impossible)
}
```

---

## 4. Find All Anagrams in a String

### Problem

Given strings `s` and `p`, find **all starting indices** in `s` where a substring of length `p.size()` is an anagram of `p`.

**Example:**
```
Input:  s = "cbaebabacd",  p = "abc"
Output: [0, 6]
Explanation: s[0..2]="cba" and s[6..8]="bac" are both anagrams of "abc"
```

### Approach

Fixed window of size `p.size()`. Maintain a frequency array of 26 letters for both `p` (`freqP`) and the current window (`freqS`). Slide the window: add the new right character, remove the character leaving from the left. After each slide, compare `freqS == freqP` — if equal, the current window is an anagram.

**Time:** O(n) | **Space:** O(1) — frequency arrays are always size 26

### Solution

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<int> findAnagrams(string s, string p) {
    vector<int> result;
    if (s.size() < p.size()) return result;

    vector<int> freqP(26, 0), freqS(26, 0);
    for (char c : p) freqP[c - 'a']++;

    int left = 0;
    for (int right = 0; right < (int)s.size(); right++) {
        freqS[s[right] - 'a']++;  // expand window

        // If window exceeds size of p, shrink from left
        if (right - left + 1 > (int)p.size()) {
            freqS[s[left] - 'a']--;
            left++;
        }

        // Check if current window is an anagram
        if (freqS == freqP)
            result.push_back(left);
    }
    return result;
}

int main() {
    auto res = findAnagrams("cbaebabacd", "abc");
    for (int i : res) cout << i << " ";
    cout << endl;  // Output: 0 6
}
```

---

## 5. Longest Ones — Binary Array with k Flips

### Problem

Given a binary array and an integer `k`, find the **length of the longest subarray** containing only `1`s after flipping **at most k zeros** to ones.

**Example:**
```
Input:  nums = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0],  k = 2
Output: 6   (flip the two zeros at index 9 and 10... best window is [3..8] after flipping 2 zeros)
```

### Approach

Variable window. Expand `right`, counting zeros encountered. Once `zeroCount > k`, shrink from `left` until `zeroCount <= k` again (i.e., we stop counting a zero when the left pointer passes over one). Track the maximum window size.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

int longestOnes(vector<int>& nums, int k) {
    int left = 0, maxLen = 0, zeroCount = 0;

    for (int right = 0; right < (int)nums.size(); right++) {
        if (nums[right] == 0) zeroCount++;  // used one flip

        // If we've used more flips than allowed, shrink from left
        while (zeroCount > k) {
            if (nums[left] == 0) zeroCount--;  // reclaim a flip
            left++;
        }
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}

int main() {
    vector<int> nums = {1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0};
    cout << longestOnes(nums, 2) << endl;  // Output: 6

    vector<int> nums2 = {0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1};
    cout << longestOnes(nums2, 3) << endl; // Output: 10
}
```

---

## 6. Maximum Average Subarray of Size k

### Problem

Given an array of integers and an integer `k`, find the **maximum average** of any contiguous subarray of length exactly `k`.

**Example:**
```
Input:  nums = [1, 12, -5, -6, 50, 3],  k = 4
Output: 12.75   (subarray [12, -5, -6, 50] → avg = 51/4 = 12.75)
```

### Approach

Same as Maximum Sum Subarray — find the max sum window of size `k`, then divide by `k`.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

double findMaxAverage(vector<int>& nums, int k) {
    double windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += nums[i];
    double maxSum = windowSum;

    for (int i = k; i < (int)nums.size(); i++) {
        windowSum += nums[i] - nums[i - k];
        maxSum = max(maxSum, windowSum);
    }
    return maxSum / k;
}

int main() {
    vector<int> nums = {1, 12, -5, -6, 50, 3};
    cout << findMaxAverage(nums, 4) << endl;  // Output: 12.75
}
```

---

## 7. Longest Substring with At Most k Distinct Characters

### Problem

Given a string and integer `k`, find the **length of the longest substring** containing at most `k` distinct characters.

**Example:**
```
Input:  s = "eceba",  k = 2
Output: 3   (substring "ece")

Input:  s = "aa",  k = 1
Output: 2
```

### Approach

Variable window. Use a frequency map to count characters in the current window. Expand `right`. When the number of distinct characters in the map exceeds `k`, shrink `left` until distinct count `<= k` again (remove characters from the map when their count drops to 0).

**Time:** O(n) | **Space:** O(k)

### Solution

```cpp
#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

int lengthOfLongestSubstringKDistinct(string s, int k) {
    unordered_map<char, int> freq;
    int left = 0, maxLen = 0;

    for (int right = 0; right < (int)s.size(); right++) {
        freq[s[right]]++;  // add new character to window

        // Shrink until at most k distinct characters remain
        while ((int)freq.size() > k) {
            freq[s[left]]--;
            if (freq[s[left]] == 0)
                freq.erase(s[left]);  // remove it from the map entirely
            left++;
        }
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}

int main() {
    cout << lengthOfLongestSubstringKDistinct("eceba", 2) << endl;  // Output: 3
    cout << lengthOfLongestSubstringKDistinct("aa", 1)    << endl;  // Output: 2
}
```

---

## 8. Minimum Window Substring

### Problem

Given strings `s` and `t`, find the **shortest substring of `s`** that contains **all characters of `t`** (including duplicates). Return `""` if none exists.

**Example:**
```
Input:  s = "ADOBECODEBANC",  t = "ABC"
Output: "BANC"
```

### Approach

Expand `right` to include characters from `t` until all are covered (`formed == required` distinct chars). Then shrink `left` to minimize the window while still covering all of `t`. Record the smallest valid window. Continue expanding.

**Time:** O(n + m) | **Space:** O(n + m)

### Solution

```cpp
#include <iostream>
#include <string>
#include <unordered_map>
#include <climits>
using namespace std;

string minWindow(string s, string t) {
    unordered_map<char, int> need, window;
    for (char c : t) need[c]++;

    int left = 0, right = 0;
    int formed = 0;
    int required = need.size();  // number of distinct chars needed
    int minLen = INT_MAX, minLeft = 0;

    while (right < (int)s.size()) {
        char c = s[right++];
        window[c]++;
        // Check if this char's count in window satisfies need
        if (need.count(c) && window[c] == need[c])
            formed++;

        // Try shrinking while window is still valid
        while (formed == required) {
            if (right - left < minLen) {
                minLen  = right - left;
                minLeft = left;
            }
            char lc = s[left++];
            window[lc]--;
            if (need.count(lc) && window[lc] < need[lc])
                formed--;  // lost a required character
        }
    }
    return minLen == INT_MAX ? "" : s.substr(minLeft, minLen);
}

int main() {
    cout << minWindow("ADOBECODEBANC", "ABC") << endl;  // Output: BANC
    cout << minWindow("a", "aa")               << endl;  // Output: (empty)
}
```

---

## 9. Permutation in String

### Problem

Given strings `s1` and `s2`, return `true` if any **permutation** of `s1` is a substring of `s2`.

**Example:**
```
Input:  s1 = "ab",  s2 = "eidbaooo"
Output: true   ("ba" is a permutation of "ab" and appears in s2)

Input:  s1 = "ab",  s2 = "eidboaoo"
Output: false
```

### Approach

This is essentially Find All Anagrams but returns a boolean. Fixed window of size `s1.size()`. Compare frequency arrays of the window and `s1` at each step.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <string>
#include <vector>
using namespace std;

bool checkInclusion(string s1, string s2) {
    if (s1.size() > s2.size()) return false;

    vector<int> freq1(26, 0), freq2(26, 0);
    for (char c : s1) freq1[c - 'a']++;

    int k = s1.size();
    for (int i = 0; i < (int)s2.size(); i++) {
        freq2[s2[i] - 'a']++;  // add right element

        if (i >= k)
            freq2[s2[i - k] - 'a']--;  // remove element leaving the window

        if (freq1 == freq2) return true;
    }
    return false;
}

int main() {
    cout << checkInclusion("ab", "eidbaooo") << endl;  // Output: 1 (true)
    cout << checkInclusion("ab", "eidboaoo") << endl;  // Output: 0 (false)
}
```

---

## 10. Subarray Product Less Than k

### Problem

Given an array of **positive integers** and a value `k`, count the number of contiguous subarrays whose **product is strictly less than `k`**.

**Example:**
```
Input:  nums = [10, 5, 2, 6],  k = 100
Output: 8
Explanation: [10],[5],[2],[6],[10,5],[5,2],[2,6],[5,2,6] all have product < 100
```

### Approach

Variable window. Expand `right`, multiplying `product`. While `product >= k`, shrink from `left` (divide by `nums[left]`). For each valid right position, there are `right - left + 1` new valid subarrays ending at `right` (all subarrays from any position in `[left, right]` to `right`).

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

int numSubarrayProductLessThanK(vector<int>& nums, int k) {
    if (k <= 1) return 0;  // product is always >= 1

    int left = 0, product = 1, count = 0;

    for (int right = 0; right < (int)nums.size(); right++) {
        product *= nums[right];

        // Shrink until product is valid
        while (product >= k) {
            product /= nums[left++];
        }

        // All subarrays ending at right and starting from left..right are valid
        count += right - left + 1;
    }
    return count;
}

int main() {
    vector<int> nums = {10, 5, 2, 6};
    cout << numSubarrayProductLessThanK(nums, 100) << endl;  // Output: 8
}
```

---

## 11. Maximum Consecutive Ones III (Generalized Flip)

### Problem

Given a binary array and integer `k`, return the **maximum number of consecutive 1s** if you can flip at most `k` zeros. (Same as problem 5 but stated differently — this is the LeetCode 1004 framing commonly asked in exams.)

**Example:**
```
Input:  nums = [0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1],  k = 3
Output: 10
```

### Approach

Identical to Longest Ones. Window shrinks when number of zeros inside exceeds `k`. Added here because exams often phrase the same pattern with different wording — recognizing it is the skill.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

int longestOnes(vector<int>& nums, int k) {
    int left = 0, maxLen = 0, zeros = 0;

    for (int right = 0; right < (int)nums.size(); right++) {
        if (nums[right] == 0) zeros++;

        while (zeros > k) {
            if (nums[left] == 0) zeros--;
            left++;
        }
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}

int main() {
    vector<int> nums = {0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1};
    cout << longestOnes(nums, 3) << endl;  // Output: 10
}
```

---

## 12. Count Subarrays with Sum Equal to k

### Problem

Given an array of integers and a value `k`, count the **total number of subarrays** that sum exactly to `k`.

**Example:**
```
Input:  nums = [1, 1, 1],  k = 2
Output: 2

Input:  nums = [1, 2, 3],  k = 3
Output: 2   ([1,2] and [3])
```

### Approach

> This problem **cannot** be solved with a simple sliding window because the array can contain negative numbers. It requires the **prefix sum + hash map** technique, which is the natural extension of sliding window thinking.

Let `prefixSum[i]` = sum of elements from index 0 to i. A subarray `[j+1..i]` has sum `k` if `prefixSum[i] - prefixSum[j] == k`, i.e., `prefixSum[j] == prefixSum[i] - k`. Use a map to count how many times each prefix sum has been seen.

**Time:** O(n) | **Space:** O(n)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int subarraySum(vector<int>& nums, int k) {
    unordered_map<int, int> prefixCount;
    prefixCount[0] = 1;  // empty prefix (sum = 0) seen once

    int sum = 0, count = 0;

    for (int x : nums) {
        sum += x;
        // How many previous prefixes had sum == (sum - k)?
        if (prefixCount.count(sum - k))
            count += prefixCount[sum - k];
        prefixCount[sum]++;
    }
    return count;
}

int main() {
    vector<int> nums1 = {1, 1, 1};
    cout << subarraySum(nums1, 2) << endl;  // Output: 2

    vector<int> nums2 = {1, 2, 3};
    cout << subarraySum(nums2, 3) << endl;  // Output: 2
}
```

---

## Patterns Summary

| Pattern | Window Size | Shrink Trigger | Classic Problems |
|---|---|---|---|
| **Fixed size** | Always `k` | `right - left + 1 > k` | Max/min sum, average, anagram search, permutation check |
| **Grow until invalid, then shrink** | Dynamic | Constraint violated (duplicate, distinct > k, zeros > k) | Longest no-repeat, longest k-distinct, longest ones |
| **Shrink until valid, record min** | Dynamic | Condition satisfied (sum >= target) | Min subarray sum, min window substring |
| **Frequency map comparison** | Fixed or variable | Frequency arrays differ | Anagrams, permutation in string |
| **Prefix sum + map** | N/A (not a window) | — | Subarray sum = k (handles negatives) |

### Decision Tree — Which Window Type?

```
Is window size fixed?
├── YES → Fixed window (add right, remove arr[i-k] from left)
└── NO  → Variable window
         Can array have negatives?
         ├── YES → Prefix sum + hash map (not pure sliding window)
         └── NO  → Variable window
                  Are you maximizing?
                  ├── YES → Shrink when constraint broken
                  └── NO (minimizing) → Shrink while constraint holds
```

### Complexity Quick Reference

| Problem | Time | Space |
|---|---|---|
| Max Sum Subarray of Size k | O(n) | O(1) |
| Longest Substring No Repeat | O(n) | O(n) |
| Minimum Size Subarray Sum | O(n) | O(1) |
| Find All Anagrams | O(n) | O(1) |
| Longest Ones with k Flips | O(n) | O(1) |
| Maximum Average Subarray | O(n) | O(1) |
| Longest k-Distinct Substring | O(n) | O(k) |
| Minimum Window Substring | O(n+m) | O(n+m) |
| Permutation in String | O(n) | O(1) |
| Subarray Product < k | O(n) | O(1) |
| Max Consecutive Ones III | O(n) | O(1) |
| Subarray Sum Equals k | O(n) | O(n) |
