---
layout: docs
title: Searching Algorithms
permalink: /searching/
---

[⬅️ Back to Home]({{ '/' | relative_url }})

---
{% raw %}
# Searching Algorithms — Complete Problem Set

Searching is one of the most tested algorithm families in job written exams and coding rounds. This file covers every variant you need: Binary Search (basic through advanced), Ternary Search, and 2D Matrix Search.

---


## Table of Contents

### Binary Search
1. [Basic Binary Search](#1-basic-binary-search)
2. [Search Insert Position](#2-search-insert-position)
3. [First Occurrence of Target](#3-first-occurrence-of-target)
4. [Last Occurrence of Target](#4-last-occurrence-of-target)
5. [Count Occurrences of Target](#5-count-occurrences-of-target)
6. [Find Peak Element](#6-find-peak-element)
7. [Integer Square Root](#7-integer-square-root)
8. [Search in Rotated Sorted Array (No Duplicates)](#8-search-in-rotated-sorted-array-no-duplicates)
9. [Search in Rotated Sorted Array (With Duplicates)](#9-search-in-rotated-sorted-array-with-duplicates)
10. [Find Minimum in Rotated Sorted Array](#10-find-minimum-in-rotated-sorted-array)
11. [Find Rotation Count (Number of Times Array Was Rotated)](#11-find-rotation-count)
12. [Binary Search on Answer — Koko Eating Bananas](#12-binary-search-on-answer--koko-eating-bananas)
13. [Binary Search on Answer — Minimum Days to Make Bouquets](#13-binary-search-on-answer--minimum-days-to-make-bouquets)
14. [Find Smallest Letter Greater Than Target](#14-find-smallest-letter-greater-than-target)
15. [Search in Infinite / Unknown-Size Sorted Array](#15-search-in-infinite--unknown-size-sorted-array)

### Ternary Search
16. [Ternary Search — Find Maximum of Unimodal Array](#16-ternary-search--find-maximum-of-unimodal-array)
17. [Ternary Search — Find Minimum of Unimodal Array](#17-ternary-search--find-minimum-of-unimodal-array)
18. [Ternary Search — Optimize a Mathematical Function](#18-ternary-search--optimize-a-mathematical-function)

### Search in 2D Matrices
19. [Search in Fully Sorted Matrix (Binary Search)](#19-search-in-fully-sorted-matrix-binary-search)
20. [Search in Row-Sorted and Column-Sorted Matrix (Staircase)](#20-search-in-row-sorted-and-column-sorted-matrix-staircase)
21. [Search in Row-Wise Sorted Matrix (Binary Search Per Row)](#21-search-in-row-wise-sorted-matrix-binary-search-per-row)
22. [Find a Peak Element in 2D Matrix](#22-find-a-peak-element-in-2d-matrix)

---

## Key Concept: Why Binary Search Works

Binary search requires a **monotone** (sorted / unimodal) property. At each step, you eliminate half the search space by asking: *"Is the answer in the left half or the right half?"*

```
Sorted array:  [1, 3, 5, 7, 9, 11, 13]
                ^                    ^
               low                 high
               
Each step: mid = (low + high) / 2
  arr[mid] < target  →  low  = mid + 1   (discard left half)
  arr[mid] > target  →  high = mid - 1   (discard right half)
  arr[mid] == target →  found
```

**Time:** O(log n) for all binary search variants | **Space:** O(1) iterative, O(log n) recursive

---

## 1. Basic Binary Search

### Problem

Given a **sorted** array and a target, return the index of target. Return `-1` if not found.

**Example:**
```
Input:  arr = [1, 3, 5, 7, 9, 11, 13],  target = 7
Output: 3
```

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

int binarySearch(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;  // avoids integer overflow vs (low+high)/2

        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low  = mid + 1;  // target is in right half
        else                        high = mid - 1;  // target is in left half
    }
    return -1;  // not found
}

int main() {
    vector<int> arr = {1, 3, 5, 7, 9, 11, 13};
    cout << binarySearch(arr, 7)  << endl;  // Output: 3
    cout << binarySearch(arr, 6)  << endl;  // Output: -1
}
```

> **Important:** Always use `mid = low + (high - low) / 2` instead of `(low + high) / 2` to prevent integer overflow when `low + high` exceeds `INT_MAX`.

---

## 2. Search Insert Position

### Problem

Given a sorted array and a target, return the index where target is found, or the index where it **would be inserted** to keep the array sorted.

**Example:**
```
Input:  arr = [1, 3, 5, 6],  target = 5  →  Output: 2
Input:  arr = [1, 3, 5, 6],  target = 2  →  Output: 1
Input:  arr = [1, 3, 5, 6],  target = 7  →  Output: 4
```

### Approach

Run standard binary search. When the loop ends without finding the target, `low` is exactly the correct insertion position — it points to the first element greater than target.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int searchInsert(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if      (arr[mid] == target) return mid;
        else if (arr[mid] <  target) low  = mid + 1;
        else                         high = mid - 1;
    }
    return low;  // insertion point when target is not found
}

int main() {
    vector<int> arr = {1, 3, 5, 6};
    cout << searchInsert(arr, 5) << endl;  // Output: 2
    cout << searchInsert(arr, 2) << endl;  // Output: 1
    cout << searchInsert(arr, 7) << endl;  // Output: 4
    cout << searchInsert(arr, 0) << endl;  // Output: 0
}
```

---

## 3. First Occurrence of Target

### Problem

Given a sorted array that may contain **duplicates**, find the **index of the first occurrence** of a target value. Return `-1` if not found.

**Example:**
```
Input:  arr = [1, 2, 2, 2, 3, 4],  target = 2
Output: 1
```

### Approach

When `arr[mid] == target`, **do not stop** — record `mid` as a candidate and keep searching the **left half** to see if an earlier occurrence exists.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int firstOccurrence(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    int result = -1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) {
            result = mid;       // found a candidate
            high = mid - 1;     // but keep searching LEFT for an earlier one
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return result;
}

int main() {
    vector<int> arr = {1, 2, 2, 2, 3, 4};
    cout << firstOccurrence(arr, 2) << endl;  // Output: 1
    cout << firstOccurrence(arr, 5) << endl;  // Output: -1
}
```

---

## 4. Last Occurrence of Target

### Problem

Given a sorted array with duplicates, find the **index of the last occurrence** of a target. Return `-1` if not found.

**Example:**
```
Input:  arr = [1, 2, 2, 2, 3, 4],  target = 2
Output: 3
```

### Approach

Mirror of first occurrence — when `arr[mid] == target`, record it and search the **right half** for a later occurrence.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int lastOccurrence(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    int result = -1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) {
            result = mid;      // found a candidate
            low = mid + 1;     // keep searching RIGHT for a later one
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return result;
}

int main() {
    vector<int> arr = {1, 2, 2, 2, 3, 4};
    cout << lastOccurrence(arr, 2) << endl;  // Output: 3
}
```

---

## 5. Count Occurrences of Target

### Problem

Given a sorted array, count how many times a target appears.

**Example:**
```
Input:  arr = [1, 2, 2, 2, 3, 4],  target = 2
Output: 3
```

### Approach

`count = lastOccurrence(target) - firstOccurrence(target) + 1`. Two binary searches = O(log n).

```cpp
#include <iostream>
#include <vector>
using namespace std;

int firstOccurrence(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1, result = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if      (arr[mid] == target) { result = mid; high = mid - 1; }
        else if (arr[mid] <  target) low  = mid + 1;
        else                         high = mid - 1;
    }
    return result;
}

int lastOccurrence(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1, result = -1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if      (arr[mid] == target) { result = mid; low = mid + 1; }
        else if (arr[mid] <  target) low  = mid + 1;
        else                         high = mid - 1;
    }
    return result;
}

int countOccurrences(vector<int>& arr, int target) {
    int first = firstOccurrence(arr, target);
    if (first == -1) return 0;
    return lastOccurrence(arr, target) - first + 1;
}

int main() {
    vector<int> arr = {1, 2, 2, 2, 3, 4};
    cout << countOccurrences(arr, 2) << endl;  // Output: 3
    cout << countOccurrences(arr, 5) << endl;  // Output: 0
}
```

---

## 6. Find Peak Element

### Problem

A **peak element** is one that is strictly greater than its neighbors. Given an array where `arr[i] != arr[i+1]`, find any peak element's index. Assume `arr[-1] = arr[n] = -∞`.

**Example:**
```
Input:  arr = [1, 2, 3, 1]       →  Output: 2  (arr[2]=3 is a peak)
Input:  arr = [1, 2, 1, 3, 5, 6, 4]  →  Output: 5  (one valid answer)
```

### Approach

Binary search on the slope. At `mid`:
- If `arr[mid] < arr[mid+1]` → peak is in the **right** half (we're on an uphill slope going right).
- Otherwise → peak is in the **left** half (we're on a downhill or at a peak).

```cpp
#include <iostream>
#include <vector>
using namespace std;

int findPeakElement(vector<int>& arr) {
    int low = 0, high = arr.size() - 1;

    while (low < high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] < arr[mid + 1])
            low = mid + 1;   // ascending slope — peak is to the right
        else
            high = mid;      // descending slope — peak is here or to the left
    }
    return low;  // low == high == peak index
}

int main() {
    vector<int> arr1 = {1, 2, 3, 1};
    cout << findPeakElement(arr1) << endl;      // Output: 2

    vector<int> arr2 = {1, 2, 1, 3, 5, 6, 4};
    cout << findPeakElement(arr2) << endl;      // Output: 5
}
```

---

## 7. Integer Square Root

### Problem

Given a non-negative integer `n`, return the **integer square root** (floor of √n) without using `sqrt()`.

**Example:**
```
Input:  n = 8   →  Output: 2   (√8 ≈ 2.828, floor = 2)
Input:  n = 9   →  Output: 3
```

### Approach

Binary search on the answer space `[0..n]`. For each `mid`, check if `mid*mid <= n`. Keep the largest `mid` that satisfies this.

```cpp
#include <iostream>
using namespace std;

int mySqrt(int n) {
    if (n < 2) return n;
    int low = 1, high = n / 2;  // sqrt(n) <= n/2 for n >= 4
    int result = 1;

    while (low <= high) {
        long long mid = low + (high - low) / 2;
        if (mid * mid <= n) {
            result = mid;       // valid candidate, try larger
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return result;
}

int main() {
    cout << mySqrt(8)   << endl;  // Output: 2
    cout << mySqrt(9)   << endl;  // Output: 3
    cout << mySqrt(100) << endl;  // Output: 10
    cout << mySqrt(2)   << endl;  // Output: 1
}
```

---

## 8. Search in Rotated Sorted Array (No Duplicates)

### Problem

A sorted array has been **rotated** at some unknown pivot. Find the index of a target. Return `-1` if not found.

**Example:**
```
Input:  arr = [4, 5, 6, 7, 0, 1, 2],  target = 0
Output: 4

Input:  arr = [4, 5, 6, 7, 0, 1, 2],  target = 3
Output: -1
```

### Approach

At any `mid`, **one half is always sorted**. Check which half is sorted:
- If `arr[low] <= arr[mid]` → left half is sorted. Check if target falls in `[arr[low], arr[mid])`. If yes, search left. Else search right.
- Otherwise → right half is sorted. Check if target falls in `(arr[mid], arr[high]]`. If yes, search right. Else search left.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int searchRotated(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;

        // Left half is sorted
        if (arr[low] <= arr[mid]) {
            if (arr[low] <= target && target < arr[mid])
                high = mid - 1;  // target is in the sorted left half
            else
                low = mid + 1;
        }
        // Right half is sorted
        else {
            if (arr[mid] < target && target <= arr[high])
                low = mid + 1;   // target is in the sorted right half
            else
                high = mid - 1;
        }
    }
    return -1;
}

int main() {
    vector<int> arr = {4, 5, 6, 7, 0, 1, 2};
    cout << searchRotated(arr, 0) << endl;  // Output: 4
    cout << searchRotated(arr, 3) << endl;  // Output: -1
    cout << searchRotated(arr, 6) << endl;  // Output: 2
}
```

---

## 9. Search in Rotated Sorted Array (With Duplicates)

### Problem

Same as problem 8, but the array **may contain duplicate values**. Return `true` if target exists, `false` otherwise.

**Example:**
```
Input:  arr = [2, 5, 6, 0, 0, 1, 2],  target = 0  →  true
Input:  arr = [2, 5, 6, 0, 0, 1, 2],  target = 3  →  false
```

### Approach

Duplicates break the "one half is always clearly sorted" guarantee. When `arr[low] == arr[mid] == arr[high]`, we cannot determine which side is sorted — we must shrink both ends by one to skip the ambiguity. Worst case becomes O(n) when all elements are duplicates.

```cpp
#include <iostream>
#include <vector>
using namespace std;

bool searchRotatedWithDups(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return true;

        // Ambiguous case — duplicates at both ends
        if (arr[low] == arr[mid] && arr[mid] == arr[high]) {
            low++;
            high--;
        }
        // Left half is sorted
        else if (arr[low] <= arr[mid]) {
            if (arr[low] <= target && target < arr[mid])
                high = mid - 1;
            else
                low = mid + 1;
        }
        // Right half is sorted
        else {
            if (arr[mid] < target && target <= arr[high])
                low = mid + 1;
            else
                high = mid - 1;
        }
    }
    return false;
}

int main() {
    vector<int> arr = {2, 5, 6, 0, 0, 1, 2};
    cout << searchRotatedWithDups(arr, 0) << endl;  // Output: 1 (true)
    cout << searchRotatedWithDups(arr, 3) << endl;  // Output: 0 (false)
}
```

---

## 10. Find Minimum in Rotated Sorted Array

### Problem

Given a rotated sorted array **without duplicates**, find the **minimum element**.

**Example:**
```
Input:  arr = [3, 4, 5, 1, 2]  →  Output: 1
Input:  arr = [4, 5, 6, 7, 0, 1, 2]  →  Output: 0
Input:  arr = [1]  →  Output: 1
```

### Approach

The minimum element is at the **rotation point**. If `arr[mid] > arr[high]`, the minimum is in the right half (the rotation point is there). Otherwise it's in the left half (including `mid` itself).

```cpp
#include <iostream>
#include <vector>
using namespace std;

int findMin(vector<int>& arr) {
    int low = 0, high = arr.size() - 1;

    while (low < high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] > arr[high])
            low = mid + 1;   // min is in right half
        else
            high = mid;      // min is here or in left half
    }
    return arr[low];
}

int main() {
    vector<int> arr1 = {3, 4, 5, 1, 2};
    cout << findMin(arr1) << endl;           // Output: 1

    vector<int> arr2 = {4, 5, 6, 7, 0, 1, 2};
    cout << findMin(arr2) << endl;           // Output: 0

    vector<int> arr3 = {11, 13, 15, 17};    // not rotated
    cout << findMin(arr3) << endl;           // Output: 11
}
```

---

## 11. Find Rotation Count

### Problem

Given a rotated sorted array, find **how many times it was rotated** (i.e., the index of the minimum element equals the rotation count).

**Example:**
```
Input:  arr = [15, 18, 2, 3, 6, 12]  →  Output: 2  (rotated 2 times)
Input:  arr = [7, 9, 11, 12, 5]      →  Output: 4
Input:  arr = [1, 2, 3, 4, 5]        →  Output: 0  (not rotated)
```

### Approach

The rotation count equals the **index of the minimum element**. Use the same logic as problem 10 but return the index instead.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int findRotationCount(vector<int>& arr) {
    int low = 0, high = arr.size() - 1;

    // Array is not rotated or has one element
    if (arr[low] <= arr[high]) return 0;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        // mid+1 is the minimum element (rotation point)
        if (arr[mid] > arr[mid + 1]) return mid + 1;
        // mid is the minimum element
        if (arr[mid] < arr[mid - 1]) return mid;

        if (arr[mid] > arr[0]) low  = mid + 1;
        else                   high = mid - 1;
    }
    return 0;
}

int main() {
    vector<int> arr1 = {15, 18, 2, 3, 6, 12};
    cout << findRotationCount(arr1) << endl;  // Output: 2

    vector<int> arr2 = {7, 9, 11, 12, 5};
    cout << findRotationCount(arr2) << endl;  // Output: 4

    vector<int> arr3 = {1, 2, 3, 4, 5};
    cout << findRotationCount(arr3) << endl;  // Output: 0
}
```

---

## 12. Binary Search on Answer — Koko Eating Bananas

### Problem

Koko has `n` piles of bananas. She must eat all bananas in `h` hours. Find the **minimum eating speed** `k` (bananas/hour) such that she finishes in time. She eats from one pile per hour; if the pile has fewer than `k` bananas, she eats the whole pile.

**Example:**
```
Input:  piles = [3, 6, 7, 11],  h = 8
Output: 4   (at speed 4: ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3 = 8 hours)
```

### Approach

**Binary search on the answer space.** Speed ranges from `1` to `max(piles)`. For a given speed `k`, compute total hours needed — if it's `<= h`, speed `k` is feasible. Find the minimum feasible speed.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

bool canFinish(vector<int>& piles, int h, int speed) {
    long long hours = 0;
    for (int p : piles)
        hours += (p + speed - 1) / speed;  // ceil(p / speed)
    return hours <= h;
}

int minEatingSpeed(vector<int>& piles, int h) {
    int low = 1, high = *max_element(piles.begin(), piles.end());
    int result = high;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (canFinish(piles, h, mid)) {
            result = mid;       // feasible — try slower
            high = mid - 1;
        } else {
            low = mid + 1;      // too slow — try faster
        }
    }
    return result;
}

int main() {
    vector<int> piles = {3, 6, 7, 11};
    cout << minEatingSpeed(piles, 8) << endl;  // Output: 4

    vector<int> piles2 = {30, 11, 23, 4, 20};
    cout << minEatingSpeed(piles2, 5) << endl; // Output: 30
}
```

> **Pattern:** Whenever a problem asks for the *minimum/maximum value that satisfies a condition*, and you can write a `isValid(x)` check function, binary search on the answer space.

---

## 13. Binary Search on Answer — Minimum Days to Make Bouquets

### Problem

Given an array `bloomDay` where `bloomDay[i]` is the day flower `i` blooms, and integers `m` (bouquets needed) and `k` (consecutive flowers per bouquet), find the **minimum number of days** to make `m` bouquets. Return `-1` if impossible.

**Example:**
```
Input:  bloomDay = [1, 10, 3, 10, 2],  m = 3,  k = 1
Output: 3
```

### Approach

Binary search on the day (answer space `[1..max(bloomDay)]`). For a given day `d`, count how many bouquets can be formed from consecutive bloomed flowers. If `>= m`, day `d` is feasible.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

bool canMake(vector<int>& bloomDay, int m, int k, int day) {
    int bouquets = 0, consecutive = 0;
    for (int b : bloomDay) {
        if (b <= day) {
            consecutive++;
            if (consecutive == k) { bouquets++; consecutive = 0; }
        } else {
            consecutive = 0;  // chain broken
        }
    }
    return bouquets >= m;
}

int minDays(vector<int>& bloomDay, int m, int k) {
    long long total = (long long)m * k;
    if (total > bloomDay.size()) return -1;  // impossible

    int low = 1, high = *max_element(bloomDay.begin(), bloomDay.end());
    int result = high;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (canMake(bloomDay, m, k, mid)) {
            result = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return result;
}

int main() {
    vector<int> bd = {1, 10, 3, 10, 2};
    cout << minDays(bd, 3, 1) << endl;  // Output: 3
    cout << minDays(bd, 3, 2) << endl;  // Output: -1
}
```

---

## 14. Find Smallest Letter Greater Than Target

### Problem

Given a sorted array of lowercase letters that wraps around, find the **smallest letter strictly greater than** the target. If no such letter exists in the array, return the first letter (wrap around).

**Example:**
```
Input:  letters = ['c', 'f', 'j'],  target = 'a'  →  Output: 'c'
Input:  letters = ['c', 'f', 'j'],  target = 'c'  →  Output: 'f'
Input:  letters = ['c', 'f', 'j'],  target = 'j'  →  Output: 'c'  (wrap)
```

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

char nextGreatestLetter(vector<char>& letters, char target) {
    int low = 0, high = letters.size() - 1;
    int result = 0;  // default: wrap to first letter

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (letters[mid] > target) {
            result = mid;       // candidate found, look for smaller one
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return letters[result];
}

int main() {
    vector<char> letters = {'c', 'f', 'j'};
    cout << nextGreatestLetter(letters, 'a') << endl;  // Output: c
    cout << nextGreatestLetter(letters, 'c') << endl;  // Output: f
    cout << nextGreatestLetter(letters, 'j') << endl;  // Output: c (wrap)
}
```

---

## 15. Search in Infinite / Unknown-Size Sorted Array

### Problem

Given a sorted array whose size is **unknown** (pretend you only have `get(i)` access), find the index of a target. If out of bounds, `get(i)` returns `INT_MAX`.

**Example:**
```
Input:  arr = [1, 3, 5, 7, 9, ...∞],  target = 7
Output: 3
```

### Approach

First, **exponential search** to find a valid range `[low, high]` that contains the target (double `high` each step). Then apply standard binary search within that range.

```cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

// Simulated infinite array
struct InfiniteArray {
    vector<int> data;
    int get(int i) { return i < (int)data.size() ? data[i] : INT_MAX; }
};

int searchInfinite(InfiniteArray& arr, int target) {
    // Step 1: Find search range using exponential doubling
    int low = 0, high = 1;
    while (arr.get(high) < target) {
        low = high;
        high *= 2;
    }

    // Step 2: Standard binary search in [low, high]
    while (low <= high) {
        int mid = low + (high - low) / 2;
        int val = arr.get(mid);
        if      (val == target) return mid;
        else if (val <  target) low  = mid + 1;
        else                    high = mid - 1;
    }
    return -1;
}

int main() {
    InfiniteArray arr;
    arr.data = {1, 3, 5, 7, 9, 11, 13, 15, 17};
    cout << searchInfinite(arr, 7)  << endl;  // Output: 3
    cout << searchInfinite(arr, 10) << endl;  // Output: -1
}
```

**Time:** O(log n) for both phases | **Space:** O(1)

---

## 16. Ternary Search — Find Maximum of Unimodal Array

### Problem

Given a **unimodal** array (values increase then decrease — one peak), find the **maximum element**.

**Example:**
```
Input:  arr = [1, 3, 5, 8, 6, 4, 2]
Output: 8   (at index 3)
```

### How Ternary Search Works

Divide the search space into **three parts** using two midpoints `m1` and `m2`:
- If `arr[m1] < arr[m2]` → maximum is in `[m1+1, high]` (right two-thirds)
- If `arr[m1] > arr[m2]` → maximum is in `[low, m2-1]` (left two-thirds)
- If equal → narrow both ends

Each step eliminates one-third of the search space.
**Time:** O(log₃ n) ≈ O(log n) | **Space:** O(1)

```cpp
#include <iostream>
#include <vector>
using namespace std;

int ternarySearchMax(vector<int>& arr) {
    int low = 0, high = arr.size() - 1;

    while (high - low > 2) {
        int m1 = low + (high - low) / 3;
        int m2 = high - (high - low) / 3;

        if (arr[m1] < arr[m2])
            low = m1 + 1;   // peak is in right portion
        else if (arr[m1] > arr[m2])
            high = m2 - 1;  // peak is in left portion
        else {
            low  = m1 + 1;  // narrow both ends
            high = m2 - 1;
        }
    }

    // Find max in the small remaining segment
    int maxVal = arr[low];
    for (int i = low + 1; i <= high; i++)
        maxVal = max(maxVal, arr[i]);
    return maxVal;
}

int main() {
    vector<int> arr = {1, 3, 5, 8, 6, 4, 2};
    cout << ternarySearchMax(arr) << endl;  // Output: 8

    vector<int> arr2 = {2, 4, 6, 9, 7, 5, 1};
    cout << ternarySearchMax(arr2) << endl; // Output: 9
}
```

---

## 17. Ternary Search — Find Minimum of Unimodal Array

### Problem

Given a unimodal array (decreases then increases — one valley), find the **minimum element**.

**Example:**
```
Input:  arr = [8, 6, 3, 1, 4, 7, 9]
Output: 1
```

### Solution

Mirror of problem 16 — compare `arr[m1]` and `arr[m2]`, shrink toward the valley.

```cpp
#include <iostream>
#include <vector>
using namespace std;

int ternarySearchMin(vector<int>& arr) {
    int low = 0, high = arr.size() - 1;

    while (high - low > 2) {
        int m1 = low + (high - low) / 3;
        int m2 = high - (high - low) / 3;

        if (arr[m1] > arr[m2])
            low = m1 + 1;   // valley is in right portion
        else if (arr[m1] < arr[m2])
            high = m2 - 1;  // valley is in left portion
        else {
            low  = m1 + 1;
            high = m2 - 1;
        }
    }

    int minVal = arr[low];
    for (int i = low + 1; i <= high; i++)
        minVal = min(minVal, arr[i]);
    return minVal;
}

int main() {
    vector<int> arr = {8, 6, 3, 1, 4, 7, 9};
    cout << ternarySearchMin(arr) << endl;  // Output: 1
}
```

---

## 18. Ternary Search — Optimize a Mathematical Function

### Problem

Given a **unimodal continuous function** `f(x)`, find the value of `x` in range `[lo, hi]` that **maximizes** `f(x)` to a precision of `1e-9`.

**Example:**
```
f(x) = -(x - 3)^2 + 9    (parabola opening down, peak at x=3)
Output: x ≈ 3.0,  f(x) ≈ 9.0
```

### Why Continuous Ternary Search?

Binary search requires a monotone (always increasing or decreasing) function. For unimodal functions (one peak, not monotone), ternary search is the correct tool — it narrows down the peak.

```cpp
#include <iostream>
#include <cmath>
using namespace std;

// Example: f(x) = -(x-3)^2 + 9, maximized at x=3
double f(double x) {
    return -(x - 3) * (x - 3) + 9;
}

double ternarySearchContinuous(double lo, double hi) {
    for (int i = 0; i < 200; i++) {  // 200 iterations gives ~1e-60 precision
        double m1 = lo + (hi - lo) / 3.0;
        double m2 = hi - (hi - lo) / 3.0;
        if (f(m1) < f(m2))
            lo = m1;
        else
            hi = m2;
    }
    return (lo + hi) / 2.0;
}

int main() {
    double xMax = ternarySearchContinuous(-10.0, 10.0);
    cout << "x = " << xMax << ", f(x) = " << f(xMax) << endl;
    // Output: x = 3.0, f(x) = 9.0
}
```

---

## 19. Search in Fully Sorted Matrix (Binary Search)

### Problem

Given an `m x n` matrix where:
- Each row is sorted left to right,
- The **first element of each row is greater than the last element of the previous row** (fully sorted end-to-end),

Find if a target exists.

**Example:**
```
Matrix:
  [ 1,  3,  5,  7]
  [10, 11, 16, 20]
  [23, 30, 34, 60]
target = 3  →  true
target = 13 →  false
```

### Approach

Treat the 2D matrix as a **virtual 1D sorted array** of size `m*n`. For index `i` in 1D: `row = i / n`, `col = i % n`. Apply standard binary search.

**Time:** O(log(m×n)) | **Space:** O(1)

```cpp
#include <iostream>
#include <vector>
using namespace std;

bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int m = matrix.size(), n = matrix[0].size();
    int low = 0, high = m * n - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        int val = matrix[mid / n][mid % n];  // convert 1D index to 2D

        if      (val == target) return true;
        else if (val <  target) low  = mid + 1;
        else                    high = mid - 1;
    }
    return false;
}

int main() {
    vector<vector<int>> matrix = {
        { 1,  3,  5,  7},
        {10, 11, 16, 20},
        {23, 30, 34, 60}
    };
    cout << searchMatrix(matrix, 3)  << endl;  // Output: 1 (true)
    cout << searchMatrix(matrix, 13) << endl;  // Output: 0 (false)
}
```

---

## 20. Search in Row-Sorted and Column-Sorted Matrix (Staircase)

### Problem

Given an `m x n` matrix where:
- Each row is sorted **left to right**,
- Each column is sorted **top to bottom**,
- (Rows are NOT globally linked — this is different from problem 19)

Find if a target exists.

**Example:**
```
Matrix:
  [ 1,  4,  7, 11]
  [ 2,  5,  8, 12]
  [ 3,  6,  9, 16]
  [10, 13, 14, 17]
target = 5  →  true
target = 20 →  false
```

### Approach

**Staircase Search:** Start at the **top-right corner** (`row=0`, `col=n-1`):
- If `matrix[row][col] == target` → found.
- If `matrix[row][col] > target` → move **left** (values decrease going left in row).
- If `matrix[row][col] < target` → move **down** (values increase going down in column).

Each step eliminates an entire row or column.

**Time:** O(m + n) | **Space:** O(1)

```cpp
#include <iostream>
#include <vector>
using namespace std;

bool searchMatrixII(vector<vector<int>>& matrix, int target) {
    int row = 0, col = matrix[0].size() - 1;  // start top-right

    while (row < (int)matrix.size() && col >= 0) {
        if (matrix[row][col] == target) return true;
        else if (matrix[row][col] > target) col--;   // eliminate this column
        else                                row++;    // eliminate this row
    }
    return false;
}

int main() {
    vector<vector<int>> matrix = {
        { 1,  4,  7, 11},
        { 2,  5,  8, 12},
        { 3,  6,  9, 16},
        {10, 13, 14, 17}
    };
    cout << searchMatrixII(matrix, 5)  << endl;  // Output: 1 (true)
    cout << searchMatrixII(matrix, 20) << endl;  // Output: 0 (false)
}
```

---

## 21. Search in Row-Wise Sorted Matrix (Binary Search Per Row)

### Problem

Given a matrix where **only each individual row is sorted** (no global ordering and no column sorting), find if target exists.

**Example:**
```
Matrix:
  [10,  2,  5]
  [ 7,  6,  4]
  [ 1,  3,  8]
target = 6  →  true
```

### Approach

Binary search on each row independently.

**Time:** O(m log n) | **Space:** O(1)

```cpp
#include <iostream>
#include <vector>
using namespace std;

bool searchRowSorted(vector<vector<int>>& matrix, int target) {
    int n = matrix[0].size();

    for (auto& row : matrix) {
        // Binary search within this row
        int low = 0, high = n - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if      (row[mid] == target) return true;
            else if (row[mid] <  target) low  = mid + 1;
            else                         high = mid - 1;
        }
    }
    return false;
}

int main() {
    vector<vector<int>> matrix = {
        {10, 2, 5},
        { 7, 6, 4},
        { 1, 3, 8}
    };
    cout << searchRowSorted(matrix, 6)  << endl;  // Output: 1 (true)
    cout << searchRowSorted(matrix, 11) << endl;  // Output: 0 (false)
}
```

---

## 22. Find a Peak Element in 2D Matrix

### Problem

A **peak** in a 2D matrix is an element that is greater than or equal to all its 4 neighbors (up, down, left, right). Find any peak element's `[row, col]`.

**Example:**
```
Matrix:
  [10, 20, 15]
  [21, 30, 14]
  [7,  16, 32]
Output: [1,1] (30 ≥ all neighbors) or [2,2] (32 ≥ neighbors)
```

### Approach

**Binary search on columns.** Find the column midpoint `mid`. Find the maximum element in column `mid` (let it be at row `maxRow`). Then:
- If `matrix[maxRow][mid-1] > matrix[maxRow][mid]` → peak is in the left half.
- If `matrix[maxRow][mid+1] > matrix[maxRow][mid]` → peak is in the right half.
- Otherwise → `matrix[maxRow][mid]` is a peak.

**Time:** O(m log n) | **Space:** O(1)

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> findPeak2D(vector<vector<int>>& matrix) {
    int m = matrix.size(), n = matrix[0].size();
    int low = 0, high = n - 1;

    while (low <= high) {
        int midCol = low + (high - low) / 2;

        // Find row with max value in this column
        int maxRow = 0;
        for (int r = 1; r < m; r++)
            if (matrix[r][midCol] > matrix[maxRow][midCol])
                maxRow = r;

        bool leftBigger  = midCol > 0       && matrix[maxRow][midCol-1] > matrix[maxRow][midCol];
        bool rightBigger = midCol < n - 1   && matrix[maxRow][midCol+1] > matrix[maxRow][midCol];

        if (!leftBigger && !rightBigger)
            return {maxRow, midCol};  // found peak
        else if (leftBigger)
            high = midCol - 1;
        else
            low = midCol + 1;
    }
    return {-1, -1};
}

int main() {
    vector<vector<int>> matrix = {
        {10, 20, 15},
        {21, 30, 14},
        { 7, 16, 32}
    };
    auto peak = findPeak2D(matrix);
    cout << "[" << peak[0] << ", " << peak[1] << "]" << endl;
    cout << "Value: " << matrix[peak[0]][peak[1]] << endl;
    // Output: [1, 1] or [2, 2]  (any valid peak)
}
```

---

## Patterns Summary

### Binary Search Variants

| Variant | Key Condition | Termination |
|---|---|---|
| Exact match | `arr[mid] == target` | Return `mid` |
| First occurrence | `arr[mid] == target` → save, go left | Return `result` |
| Last occurrence | `arr[mid] == target` → save, go right | Return `result` |
| Lower bound | First index where `arr[i] >= target` | Return `low` |
| Upper bound | First index where `arr[i] > target` | Return `low` |
| Search on answer | Check `isValid(mid)` → save, narrow | Return `result` |

### Which Search for Which Matrix?

| Matrix Type | Best Algorithm | Time |
|---|---|---|
| Fully sorted (rows + last→first link) | Binary Search (treat as 1D) | O(log(m×n)) |
| Row + column sorted (independent) | Staircase search (top-right) | O(m+n) |
| Only row sorted | Binary search per row | O(m log n) |
| Find 2D peak | Binary search on columns | O(m log n) |

### Binary Search on Answer — Template

```cpp
// Use when: "find minimum/maximum X such that condition(X) is true"
int low = minPossible, high = maxPossible, result = -1;
while (low <= high) {
    int mid = low + (high - low) / 2;
    if (isValid(mid)) {
        result = mid;
        high = mid - 1;  // for minimum: try smaller
        // low = mid + 1;  // for maximum: try larger
    } else {
        low = mid + 1;   // for minimum: need bigger
        // high = mid - 1; // for maximum: need smaller
    }
}
return result;
```

### Complexity Quick Reference

| Problem | Time | Space |
|---|---|---|
| Basic Binary Search | O(log n) | O(1) |
| First / Last Occurrence | O(log n) | O(1) |
| Count Occurrences | O(log n) | O(1) |
| Peak Element (1D) | O(log n) | O(1) |
| Integer Square Root | O(log n) | O(1) |
| Rotated Search (no dups) | O(log n) | O(1) |
| Rotated Search (with dups) | O(n) worst | O(1) |
| Find Minimum in Rotated | O(log n) | O(1) |
| Binary Search on Answer | O(n log maxVal) | O(1) |
| Infinite Array Search | O(log n) | O(1) |
| Ternary Search (array) | O(log n) | O(1) |
| Ternary Search (continuous) | O(iterations) | O(1) |
| 2D Fully Sorted Matrix | O(log(m×n)) | O(1) |
| 2D Row+Col Sorted (Staircase) | O(m+n) | O(1) |
| 2D Row Sorted Only | O(m log n) | O(1) |
| 2D Peak Element | O(m log n) | O(1) |

{% endraw %}
