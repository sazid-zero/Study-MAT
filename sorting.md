---
layout: docs
title: Sorting Algorithms
permalink: /sorting/
---

[⬅️ Back to Home]({{ '/' | relative_url }})

---
# Sorting Algorithms — Complete Problem Set

Sorting is the backbone of computer science. A large portion of job exam questions either test sorting directly or use it as a prerequisite step. This file covers every algorithm you need — from the classic comparison sorts to non-comparison linear sorts, plus the critical skill of custom comparator sorting that appears constantly in real interview problems.

---

## Table of Contents

### Comparison-Based Sorts
1. [Merge Sort](#1-merge-sort)
2. [Quick Sort](#2-quick-sort)
3. [Quick Sort — Randomized Pivot](#3-quick-sort--randomized-pivot)
4. [Heap Sort](#4-heap-sort)

### Non-Comparison Sorts (Linear Time)
5. [Counting Sort](#5-counting-sort)
6. [Radix Sort](#6-radix-sort)
7. [Bucket Sort](#7-bucket-sort)

### Custom Comparator Sorting
8. [Sort Strings by Length](#8-sort-strings-by-length)
9. [Sort Strings Lexicographically, Then by Length](#9-sort-strings-lexicographically-then-by-length)
10. [Sort Array of Pairs by Second Element](#10-sort-array-of-pairs-by-second-element)
11. [Sort Custom Objects (Struct)](#11-sort-custom-objects-struct)
12. [Sort to Form Largest Number](#12-sort-to-form-largest-number)
13. [Sort by Frequency](#13-sort-by-frequency)
14. [Sort by Absolute Difference from a Value](#14-sort-by-absolute-difference-from-a-value)
15. [Stable Sort vs Unstable Sort](#15-stable-sort-vs-unstable-sort)

### Sorting-Based Problem Solving
16. [Find the Kth Smallest Element using Quick Select](#16-find-the-kth-smallest-element-using-quick-select)
17. [Count Inversions using Merge Sort](#17-count-inversions-using-merge-sort)
18. [Minimum Difference Between Any Two Elements After Sorting](#18-minimum-difference-between-any-two-elements-after-sorting)
19. [Meeting Rooms — Can One Person Attend All?](#19-meeting-rooms--can-one-person-attend-all)
20. [Merge Overlapping Intervals](#20-merge-overlapping-intervals)
21. [Sort a Linked List (Merge Sort on Linked List)](#21-sort-a-linked-list-merge-sort-on-linked-list)
22. [Sort a K-Sorted Array (Nearly Sorted)](#22-sort-a-k-sorted-array-nearly-sorted)
23. [Wiggle Sort](#23-wiggle-sort)

---

## Complexity Overview

| Algorithm | Best | Average | Worst | Space | Stable? |
|---|---|---|---|---|---|
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ No |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ No |
| Counting Sort | O(n+k) | O(n+k) | O(n+k) | O(k) | ✅ Yes |
| Radix Sort | O(nk) | O(nk) | O(nk) | O(n+k) | ✅ Yes |
| Bucket Sort | O(n+k) | O(n+k) | O(n²) | O(n+k) | ✅ Yes |
| `std::sort` | O(n log n) | O(n log n) | O(n log n) | O(log n) | ❌ No |
| `std::stable_sort` | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ Yes |

> **k** = range of values (Counting/Radix/Bucket), **n** = number of elements

---

## 1. Merge Sort

### Problem

Sort an array using the **divide and conquer** merge sort algorithm.

**Example:**
```
Input:  [38, 27, 43, 3, 9, 82, 10]
Output: [3, 9, 10, 27, 38, 43, 82]
```

### How It Works

1. **Divide** the array into two halves at the midpoint.
2. **Recursively sort** each half.
3. **Merge** the two sorted halves into one sorted array.

The merge step is the key — it compares elements from both halves and builds the result in order.

**Time:** O(n log n) always | **Space:** O(n) for the temporary merge array

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

// Merge two sorted halves: arr[left..mid] and arr[mid+1..right]
void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp;
    int i = left, j = mid + 1;

    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) temp.push_back(arr[i++]);
        else                  temp.push_back(arr[j++]);
    }
    while (i <= mid)   temp.push_back(arr[i++]);
    while (j <= right) temp.push_back(arr[j++]);

    // Copy sorted temp back into arr
    for (int k = 0; k < (int)temp.size(); k++)
        arr[left + k] = temp[k];
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left >= right) return;  // base case: single element

    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);       // sort left half
    mergeSort(arr, mid + 1, right);  // sort right half
    merge(arr, left, mid, right);    // merge both halves
}

int main() {
    vector<int> arr = {38, 27, 43, 3, 9, 82, 10};
    mergeSort(arr, 0, arr.size() - 1);
    for (int x : arr) cout << x << " ";
    cout << endl;  // Output: 3 9 10 27 38 43 82
}
```

**Visual trace for [38, 27, 43, 3]:**
```
Split:   [38,27,43,3] → [38,27] + [43,3]
Split:   [38,27] → [38] + [27]     |    [43,3] → [43] + [3]
Merge:   [38] + [27] → [27,38]     |    [43] + [3]  → [3,43]
Merge:   [27,38] + [3,43] → [3,27,38,43]
```

---

## 2. Quick Sort

### Problem

Sort an array using the **quick sort** algorithm with the last element as the pivot.

**Example:**
```
Input:  [10, 7, 8, 9, 1, 5]
Output: [1, 5, 7, 8, 9, 10]
```

### How It Works

1. **Choose a pivot** (here: last element).
2. **Partition** the array so all elements ≤ pivot go left, all > pivot go right. Place pivot at its correct final position.
3. **Recursively sort** the left and right sub-arrays.

**Time:** O(n log n) average, O(n²) worst (already sorted input) | **Space:** O(log n) stack

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

// Partition: place pivot at correct position, return pivot index
int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];  // choose last element as pivot
    int i = low - 1;        // i tracks last element <= pivot

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);  // move small element to left side
        }
    }
    swap(arr[i + 1], arr[high]);   // place pivot in its final position
    return i + 1;                  // return pivot index
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);   // sort left of pivot
        quickSort(arr, pi + 1, high);  // sort right of pivot
    }
}

int main() {
    vector<int> arr = {10, 7, 8, 9, 1, 5};
    quickSort(arr, 0, arr.size() - 1);
    for (int x : arr) cout << x << " ";
    cout << endl;  // Output: 1 5 7 8 9 10
}
```

**Partition trace for [10, 7, 8, 9, 1, 5], pivot=5:**
```
j=0: arr[0]=10 > 5, skip
j=1: arr[1]=7  > 5, skip
j=2: arr[2]=8  > 5, skip
j=3: arr[3]=9  > 5, skip
j=4: arr[4]=1  ≤ 5, i=0, swap(arr[0],arr[4]) → [1, 7, 8, 9, 10, 5]
Place pivot: swap(arr[1], arr[5])  → [1, 5, 8, 9, 10, 7]
Pivot index = 1
```

---

## 3. Quick Sort — Randomized Pivot

### Problem

Quick Sort with a last-element pivot degrades to O(n²) on sorted or nearly-sorted inputs. Use a **random pivot** to avoid this worst case in practice.

### Approach

Before partitioning, randomly swap a random element with the last element, then proceed with the same partition logic. This makes worst-case O(n²) extremely unlikely.

```cpp
#include <iostream>
#include <vector>
#include <cstdlib>
#include <ctime>
using namespace std;

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSortRandom(vector<int>& arr, int low, int high) {
    if (low < high) {
        // Pick a random pivot and move it to the end
        int randIdx = low + rand() % (high - low + 1);
        swap(arr[randIdx], arr[high]);

        int pi = partition(arr, low, high);
        quickSortRandom(arr, low, pi - 1);
        quickSortRandom(arr, pi + 1, high);
    }
}

int main() {
    srand(time(0));
    vector<int> arr = {1, 2, 3, 4, 5, 6, 7};  // already sorted — worst case for fixed pivot
    quickSortRandom(arr, 0, arr.size() - 1);
    for (int x : arr) cout << x << " ";
    cout << endl;  // Output: 1 2 3 4 5 6 7
}
```

---

## 4. Heap Sort

### Problem

Sort an array using **heap sort** — build a max-heap, then extract the maximum repeatedly.

**Example:**
```
Input:  [12, 11, 13, 5, 6, 7]
Output: [5, 6, 7, 11, 12, 13]
```

### How It Works

A **max-heap** is a complete binary tree where every parent is ≥ its children. In array representation, for index `i`: children are at `2i+1` and `2i+2`, parent is at `(i-1)/2`.

1. **Build max-heap** from the array (O(n)).
2. **Extract max** (swap root with last element, reduce heap size, sift root down). Repeat n times. Result is sorted ascending.

**Time:** O(n log n) always | **Space:** O(1) — sorts in-place

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

// Sift down: maintain max-heap property at index i, heap of size n
void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left    = 2 * i + 1;
    int right   = 2 * i + 2;

    if (left  < n && arr[left]  > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);  // recursively fix the affected subtree
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();

    // Phase 1: Build max-heap (start from last non-leaf node)
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);

    // Phase 2: Extract elements from heap one by one
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);  // move current max to end
        heapify(arr, i, 0);    // restore heap property for reduced heap
    }
}

int main() {
    vector<int> arr = {12, 11, 13, 5, 6, 7};
    heapSort(arr);
    for (int x : arr) cout << x << " ";
    cout << endl;  // Output: 5 6 7 11 12 13
}
```

---

## 5. Counting Sort

### Problem

Sort an array of **non-negative integers** whose values lie within a known range `[0..k]`.

**Example:**
```
Input:  arr = [4, 2, 2, 8, 3, 3, 1],  k = 8
Output: [1, 2, 2, 3, 3, 4, 8]
```

### How It Works

1. Create a **count array** of size `k+1`, count occurrences of each value.
2. Reconstruct the sorted array by iterating the count array.

No comparisons are made — this is why it breaks the O(n log n) lower bound. Works only when value range `k` is not excessively large.

**Time:** O(n + k) | **Space:** O(k)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

void countingSort(vector<int>& arr) {
    if (arr.empty()) return;
    int k = *max_element(arr.begin(), arr.end());

    vector<int> count(k + 1, 0);
    for (int x : arr) count[x]++;  // count occurrences

    // Reconstruct sorted array
    int idx = 0;
    for (int val = 0; val <= k; val++)
        while (count[val]-- > 0)
            arr[idx++] = val;
}

int main() {
    vector<int> arr = {4, 2, 2, 8, 3, 3, 1};
    countingSort(arr);
    for (int x : arr) cout << x << " ";
    cout << endl;  // Output: 1 2 2 3 3 4 8
}
```

> **Limitation:** If `k` is huge (e.g., sorting integers up to 10⁹), counting sort wastes enormous memory. Use Radix Sort in that case.

---

## 6. Radix Sort

### Problem

Sort an array of **non-negative integers** by processing one digit at a time, from least significant to most significant digit (LSD Radix Sort).

**Example:**
```
Input:  arr = [170, 45, 75, 90, 802, 24, 2, 66]
Output: [2, 24, 45, 66, 75, 90, 170, 802]
```

### How It Works

Run counting sort **on each digit position** from ones → tens → hundreds → ... The key is that counting sort here must be **stable** (preserve relative order of equal elements) so earlier digit sorting is preserved.

**Time:** O(n × d) where d = number of digits | **Space:** O(n + 10)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// Stable counting sort based on digit at position 'exp' (1, 10, 100, ...)
void countingSortByDigit(vector<int>& arr, int exp) {
    int n = arr.size();
    vector<int> output(n);
    vector<int> count(10, 0);

    // Count occurrences of each digit
    for (int x : arr) count[(x / exp) % 10]++;

    // Change count[i] to contain actual position in output
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];

    // Build output array (traverse right to left for stability)
    for (int i = n - 1; i >= 0; i--) {
        int digit = (arr[i] / exp) % 10;
        output[--count[digit]] = arr[i];
    }

    arr = output;
}

void radixSort(vector<int>& arr) {
    int maxVal = *max_element(arr.begin(), arr.end());

    // Process each digit position
    for (int exp = 1; maxVal / exp > 0; exp *= 10)
        countingSortByDigit(arr, exp);
}

int main() {
    vector<int> arr = {170, 45, 75, 90, 802, 24, 2, 66};
    radixSort(arr);
    for (int x : arr) cout << x << " ";
    cout << endl;  // Output: 2 24 45 66 75 90 170 802
}
```

**Digit-by-digit trace:**
```
Original: [170, 45, 75, 90, 802, 24, 2, 66]
After ones:  [170, 90, 802, 2, 24, 45, 75, 66]
After tens:  [802, 2, 24, 45, 66, 170, 75, 90]
After hundreds: [2, 24, 45, 66, 75, 90, 170, 802]
```

---

## 7. Bucket Sort

### Problem

Sort an array of **floating-point numbers** uniformly distributed in `[0, 1)`.

**Example:**
```
Input:  arr = [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68]
Output: [0.12, 0.17, 0.21, 0.23, 0.26, 0.39, 0.68, 0.72, 0.78, 0.94]
```

### How It Works

1. Create `n` buckets, each covering a sub-range of `[0, 1)`.
2. Distribute elements into buckets: element `x` goes into bucket `floor(n * x)`.
3. Sort each bucket individually (small, so insertion sort or `std::sort` is fine).
4. Concatenate buckets.

Works best when input is **uniformly distributed** — on average each bucket has O(1) elements.

**Time:** O(n + k) average, O(n²) worst | **Space:** O(n + k)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

void bucketSort(vector<float>& arr) {
    int n = arr.size();
    vector<vector<float>> buckets(n);

    // Distribute into buckets
    for (float x : arr) {
        int idx = (int)(n * x);  // bucket index
        idx = min(idx, n - 1);   // guard against x = 1.0
        buckets[idx].push_back(x);
    }

    // Sort each bucket and concatenate
    int pos = 0;
    for (auto& bucket : buckets) {
        sort(bucket.begin(), bucket.end());
        for (float x : bucket) arr[pos++] = x;
    }
}

int main() {
    vector<float> arr = {0.78f, 0.17f, 0.39f, 0.26f, 0.72f,
                         0.94f, 0.21f, 0.12f, 0.23f, 0.68f};
    bucketSort(arr);
    for (float x : arr) cout << x << " ";
    cout << endl;
    // Output: 0.12 0.17 0.21 0.23 0.26 0.39 0.68 0.72 0.78 0.94
}
```

---

## 8. Sort Strings by Length

### Problem

Given a vector of strings, sort them by **length** (shortest first). Strings of the same length maintain their original relative order (stable).

**Example:**
```
Input:  ["banana", "fig", "apple", "kiwi", "plum"]
Output: ["fig", "kiwi", "plum", "apple", "banana"]
```

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<string> words = {"banana", "fig", "apple", "kiwi", "plum"};

    // stable_sort preserves original order for equal-length strings
    stable_sort(words.begin(), words.end(), [](const string& a, const string& b) {
        return a.size() < b.size();
    });

    for (auto& w : words) cout << w << " ";
    cout << endl;
    // Output: fig kiwi plum apple banana
}
```

---

## 9. Sort Strings Lexicographically, Then by Length

### Problem

Sort strings: **primary key = alphabetical order**, **secondary key = length** (shorter first when alphabetically equal).

**Example:**
```
Input:  ["banana", "ball", "bat", "band", "bad"]
Output: ["bad", "ball", "band", "bat", "banana"]
```

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<string> words = {"banana", "ball", "bat", "band", "bad"};

    sort(words.begin(), words.end(), [](const string& a, const string& b) {
        if (a != b) return a < b;          // primary: lexicographic
        return a.size() < b.size();        // secondary: shorter first
    });

    for (auto& w : words) cout << w << " ";
    cout << endl;
    // Output: bad ball band bat banana
}
```

---

## 10. Sort Array of Pairs by Second Element

### Problem

Given a vector of `{name, score}` pairs, sort by score **descending**. If scores are equal, sort by name **ascending**.

**Example:**
```
Input:  [{"Alice",85}, {"Bob",92}, {"Charlie",85}, {"Dave",78}]
Output: [{"Bob",92}, {"Alice",85}, {"Charlie",85}, {"Dave",78}]
```

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<pair<string, int>> students = {
        {"Alice", 85}, {"Bob", 92}, {"Charlie", 85}, {"Dave", 78}
    };

    sort(students.begin(), students.end(), [](const pair<string,int>& a,
                                              const pair<string,int>& b) {
        if (a.second != b.second) return a.second > b.second;  // descending score
        return a.first < b.first;                              // ascending name
    });

    for (auto& [name, score] : students)
        cout << name << ":" << score << "  ";
    cout << endl;
    // Output: Bob:92  Alice:85  Charlie:85  Dave:78
}
```

---

## 11. Sort Custom Objects (Struct)

### Problem

Sort a vector of custom `Student` objects by GPA descending, then by name ascending as a tiebreaker.

**Example:**
```
Input:  [{"Alice",3.8}, {"Bob",3.9}, {"Charlie",3.8}, {"Dave",3.5}]
Output: Bob(3.9) → Alice(3.8) → Charlie(3.8) → Dave(3.5)
```

### Three Ways to Define a Custom Sort for a Struct

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Student {
    string name;
    double gpa;
};

// Method 1: Overload operator< inside the struct
// (used automatically by std::sort and std::set)
struct StudentByGPA {
    bool operator()(const Student& a, const Student& b) const {
        if (a.gpa != b.gpa) return a.gpa > b.gpa;   // descending gpa
        return a.name < b.name;                       // ascending name
    }
};

int main() {
    vector<Student> students = {
        {"Alice", 3.8}, {"Bob", 3.9}, {"Charlie", 3.8}, {"Dave", 3.5}
    };

    // Method 1: Functor
    sort(students.begin(), students.end(), StudentByGPA());

    // Method 2: Lambda (most common in modern C++)
    sort(students.begin(), students.end(), [](const Student& a, const Student& b) {
        if (a.gpa != b.gpa) return a.gpa > b.gpa;
        return a.name < b.name;
    });

    // Method 3: Comparison function
    auto cmp = [](const Student& a, const Student& b) {
        if (a.gpa != b.gpa) return a.gpa > b.gpa;
        return a.name < b.name;
    };
    sort(students.begin(), students.end(), cmp);

    for (auto& s : students)
        cout << s.name << "(" << s.gpa << ")  ";
    cout << endl;
    // Output: Bob(3.9)  Alice(3.8)  Charlie(3.8)  Dave(3.5)
}
```

---

## 12. Sort to Form Largest Number

### Problem

Given a list of non-negative integers, arrange them to form the **largest possible number** and return it as a string.

**Example:**
```
Input:  nums = [3, 30, 34, 5, 9]
Output: "9534330"

Input:  nums = [10, 2]
Output: "210"
```

### Approach

Convert numbers to strings. Define a custom comparator: `a` comes before `b` if the string `a+b > b+a` (i.e., concatenating a before b gives a larger number). This is one of the most common custom comparator exam problems.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
using namespace std;

string largestNumber(vector<int>& nums) {
    vector<string> strs;
    for (int x : nums) strs.push_back(to_string(x));

    sort(strs.begin(), strs.end(), [](const string& a, const string& b) {
        return a + b > b + a;  // "9"+"3" > "3"+"9" → 93 > 39, so 9 comes first
    });

    // Edge case: all zeros
    if (strs[0] == "0") return "0";

    string result = "";
    for (auto& s : strs) result += s;
    return result;
}

int main() {
    vector<int> nums1 = {3, 30, 34, 5, 9};
    cout << largestNumber(nums1) << endl;  // Output: 9534330

    vector<int> nums2 = {10, 2};
    cout << largestNumber(nums2) << endl;  // Output: 210

    vector<int> nums3 = {0, 0};
    cout << largestNumber(nums3) << endl;  // Output: 0
}
```

---

## 13. Sort by Frequency

### Problem

Given an array of integers, sort by **frequency** — the element that appears most often comes first. If two elements have the same frequency, sort by **value ascending**.

**Example:**
```
Input:  nums = [1, 1, 2, 3, 3, 3, 2]
Output: [3, 3, 3, 1, 1, 2, 2]
```

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <unordered_map>
using namespace std;

int main() {
    vector<int> nums = {1, 1, 2, 3, 3, 3, 2};

    // Step 1: Count frequencies
    unordered_map<int, int> freq;
    for (int x : nums) freq[x]++;

    // Step 2: Sort using frequency comparator
    sort(nums.begin(), nums.end(), [&freq](int a, int b) {
        if (freq[a] != freq[b]) return freq[a] > freq[b];  // higher freq first
        return a < b;                                        // lower value first (tiebreak)
    });

    for (int x : nums) cout << x << " ";
    cout << endl;
    // Output: 3 3 3 1 1 2 2
}
```

---

## 14. Sort by Absolute Difference from a Value

### Problem

Given an array and a value `k`, sort the array by **absolute difference from `k`** — elements closest to `k` come first. If two elements have the same distance, smaller value comes first.

**Example:**
```
Input:  arr = [10, 5, 3, 9, 2, 8],  k = 7
Output: [8, 5, 9, 10, 3, 2]
Differences: |8-7|=1, |5-7|=2, |9-7|=2, |10-7|=3, |3-7|=4, |2-7|=5
```

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

int main() {
    vector<int> arr = {10, 5, 3, 9, 2, 8};
    int k = 7;

    sort(arr.begin(), arr.end(), [k](int a, int b) {
        int da = abs(a - k), db = abs(b - k);
        if (da != db) return da < db;  // closer to k comes first
        return a < b;                  // smaller value on tie
    });

    for (int x : arr) cout << x << " ";
    cout << endl;
    // Output: 8 5 9 10 3 2
}
```

---

## 15. Stable Sort vs Unstable Sort

### Problem

Explain the difference between stable and unstable sorting, and demonstrate a case where it matters.

**Example:**
Given students sorted by name, now re-sort by grade — demonstrate that a stable sort preserves the alphabetical order among students with the same grade.

```
After stable sort by grade:
  Grade A: Alice, Charlie  (original alphabetical order preserved)
  Grade B: Bob, Dave

After unstable sort by grade:
  Grade A: Charlie, Alice  (order may be scrambled)
  Grade B: Dave, Bob
```

### Key Concept

A sort is **stable** if two elements with equal keys appear in the same relative order in the output as in the input.

- `std::stable_sort` — guaranteed stable, O(n log n), uses extra memory.
- `std::sort` — not guaranteed stable (uses introsort), O(n log n), in-place.
- Use stable sort when: secondary ordering already exists and must be preserved.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Student { string name; char grade; };

int main() {
    vector<Student> students = {
        {"Charlie", 'A'}, {"Alice", 'A'}, {"Dave", 'B'}, {"Bob", 'B'}
    };
    // Already sorted alphabetically by name within each grade group

    // Unstable sort — may scramble Alice/Charlie and Bob/Dave
    sort(students.begin(), students.end(), [](const Student& a, const Student& b) {
        return a.grade < b.grade;
    });

    cout << "After unstable sort: ";
    for (auto& s : students) cout << s.name << "(" << s.grade << ") ";
    cout << endl;

    // Reset
    students = {{"Charlie", 'A'}, {"Alice", 'A'}, {"Dave", 'B'}, {"Bob", 'B'}};

    // Stable sort — preserves Charlie before Alice (their original relative order)
    stable_sort(students.begin(), students.end(), [](const Student& a, const Student& b) {
        return a.grade < b.grade;
    });

    cout << "After stable sort:   ";
    for (auto& s : students) cout << s.name << "(" << s.grade << ") ";
    cout << endl;
    // Output: Charlie(A) Alice(A) Dave(B) Bob(B)  ← relative order preserved
}
```

---

## 16. Find the Kth Smallest Element using Quick Select

### Problem

Find the **Kth smallest element** in an unsorted array **without fully sorting it**.

**Example:**
```
Input:  arr = [7, 10, 4, 3, 20, 15],  k = 3
Output: 7   (sorted: [3, 4, 7, 10, 15, 20], 3rd smallest = 7)
```

### Approach

**Quick Select** — a variation of Quick Sort. After partitioning, the pivot is at its final sorted position `pi`:
- If `pi == k-1` → done, pivot is the answer.
- If `pi < k-1` → recursively look in the right part.
- If `pi > k-1` → recursively look in the left part.

**Time:** O(n) average, O(n²) worst | **Space:** O(log n)

```cpp
#include <iostream>
#include <vector>
using namespace std;

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++)
        if (arr[j] <= pivot) swap(arr[++i], arr[j]);
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

int quickSelect(vector<int>& arr, int low, int high, int k) {
    if (low == high) return arr[low];

    int pi = partition(arr, low, high);

    if (pi == k)       return arr[pi];
    else if (pi < k)   return quickSelect(arr, pi + 1, high, k);
    else               return quickSelect(arr, low, pi - 1, k);
}

int kthSmallest(vector<int>& arr, int k) {
    return quickSelect(arr, 0, arr.size() - 1, k - 1);  // k-1 for 0-based index
}

int main() {
    vector<int> arr = {7, 10, 4, 3, 20, 15};
    cout << kthSmallest(arr, 3) << endl;  // Output: 7
    cout << kthSmallest(arr, 1) << endl;  // Output: 3
}
```

---

## 17. Count Inversions using Merge Sort

### Problem

Count the number of **inversions** in an array — pairs `(i, j)` where `i < j` but `arr[i] > arr[j]`.

**Example:**
```
Input:  arr = [2, 4, 1, 3, 5]
Output: 3   (pairs: (2,1), (4,1), (4,3))
```

### Approach

Embed the inversion count inside the merge step of Merge Sort. When placing an element from the **right** subarray before elements remaining in the **left** subarray, all remaining left elements form inversions with it.

**Time:** O(n log n) | **Space:** O(n)

```cpp
#include <iostream>
#include <vector>
using namespace std;

long long mergeCount(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp;
    int i = left, j = mid + 1;
    long long inversions = 0;

    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp.push_back(arr[i++]);
        } else {
            // arr[j] is smaller than arr[i..mid] — all (mid - i + 1) elements form inversions
            inversions += (mid - i + 1);
            temp.push_back(arr[j++]);
        }
    }
    while (i <= mid)   temp.push_back(arr[i++]);
    while (j <= right) temp.push_back(arr[j++]);

    for (int k = 0; k < (int)temp.size(); k++)
        arr[left + k] = temp[k];

    return inversions;
}

long long mergeSortCount(vector<int>& arr, int left, int right) {
    if (left >= right) return 0;
    int mid = left + (right - left) / 2;
    long long count = 0;
    count += mergeSortCount(arr, left, mid);
    count += mergeSortCount(arr, mid + 1, right);
    count += mergeCount(arr, left, mid, right);
    return count;
}

int main() {
    vector<int> arr = {2, 4, 1, 3, 5};
    cout << mergeSortCount(arr, 0, arr.size() - 1) << endl;  // Output: 3

    vector<int> arr2 = {5, 4, 3, 2, 1};  // maximum inversions
    cout << mergeSortCount(arr2, 0, arr2.size() - 1) << endl;  // Output: 10
}
```

---

## 18. Minimum Difference Between Any Two Elements After Sorting

### Problem

Given an unsorted array, find the **minimum absolute difference** between any two elements.

**Example:**
```
Input:  arr = [1, 5, 3, 19, 18, 25]
Output: 1   (|18 - 19| = 1)
```

### Approach

Sort the array. The minimum difference must be between **adjacent elements** in the sorted order. Scan adjacent pairs and track the minimum.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

int minDifference(vector<int>& arr) {
    sort(arr.begin(), arr.end());
    int minDiff = INT_MAX;
    for (int i = 1; i < (int)arr.size(); i++)
        minDiff = min(minDiff, arr[i] - arr[i - 1]);
    return minDiff;
}

int main() {
    vector<int> arr = {1, 5, 3, 19, 18, 25};
    cout << minDifference(arr) << endl;  // Output: 1
}
```

---

## 19. Meeting Rooms — Can One Person Attend All?

### Problem

Given a list of meeting intervals `[start, end]`, determine if a person can attend **all** meetings (no overlaps).

**Example:**
```
Input:  intervals = [[0,30],[5,10],[15,20]]
Output: false   (meeting [0,30] overlaps with [5,10])

Input:  intervals = [[7,10],[2,4]]
Output: true
```

### Approach

Sort intervals by start time. Then check if any adjacent pair overlaps: the next start < current end.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

bool canAttendAll(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());  // sort by start time

    for (int i = 1; i < (int)intervals.size(); i++)
        if (intervals[i][0] < intervals[i-1][1])  // next starts before current ends
            return false;
    return true;
}

int main() {
    vector<vector<int>> iv1 = {{0,30},{5,10},{15,20}};
    cout << canAttendAll(iv1) << endl;  // Output: 0 (false)

    vector<vector<int>> iv2 = {{7,10},{2,4}};
    cout << canAttendAll(iv2) << endl;  // Output: 1 (true)
}
```

---

## 20. Merge Overlapping Intervals

### Problem

Given a collection of intervals, **merge all overlapping intervals** and return the result.

**Example:**
```
Input:  [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]

Input:  [[1,4],[4,5]]
Output: [[1,5]]
```

### Approach

Sort by start time. Iterate and maintain the current merged interval. If the next interval's start `<=` current end, extend the current end. Otherwise, push the current interval and start a new one.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());  // sort by start time
    vector<vector<int>> merged;

    for (auto& interval : intervals) {
        // If merged is empty or no overlap with last merged interval
        if (merged.empty() || merged.back()[1] < interval[0]) {
            merged.push_back(interval);
        } else {
            // Overlap — extend the end of the last merged interval
            merged.back()[1] = max(merged.back()[1], interval[1]);
        }
    }
    return merged;
}

int main() {
    vector<vector<int>> iv1 = {{1,3},{2,6},{8,10},{15,18}};
    auto res1 = mergeIntervals(iv1);
    for (auto& r : res1) cout << "[" << r[0] << "," << r[1] << "] ";
    cout << endl;  // Output: [1,6] [8,10] [15,18]

    vector<vector<int>> iv2 = {{1,4},{4,5}};
    auto res2 = mergeIntervals(iv2);
    for (auto& r : res2) cout << "[" << r[0] << "," << r[1] << "] ";
    cout << endl;  // Output: [1,5]
}
```

---

## 21. Sort a Linked List (Merge Sort on Linked List)

### Problem

Given the head of a singly linked list, sort it in **ascending order** and return the sorted head.

**Example:**
```
Input:  4 -> 2 -> 1 -> 3
Output: 1 -> 2 -> 3 -> 4
```

### Why This Is Different from Array Merge Sort

Arrays support random access — you can jump to the midpoint instantly. Linked lists don't. You must use the **slow/fast pointer trick** to find the middle, then split and recursively sort each half. The merge step is also different — you stitch nodes together instead of copying into a temp array.

**Time:** O(n log n) | **Space:** O(log n) for recursion stack

### Solution

```cpp
#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// Merge two sorted linked lists
ListNode* merge(ListNode* l1, ListNode* l2) {
    ListNode dummy(0);
    ListNode* curr = &dummy;
    while (l1 && l2) {
        if (l1->val <= l2->val) { curr->next = l1; l1 = l1->next; }
        else                    { curr->next = l2; l2 = l2->next; }
        curr = curr->next;
    }
    curr->next = l1 ? l1 : l2;  // attach remaining nodes
    return dummy.next;
}

// Find the middle node using slow/fast pointers, then split
ListNode* getMiddle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head->next;  // fast starts one ahead to get LEFT middle on even lists
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;  // slow is the middle
}

ListNode* sortList(ListNode* head) {
    if (!head || !head->next) return head;  // base case: 0 or 1 node

    // Split list into two halves
    ListNode* mid   = getMiddle(head);
    ListNode* right = mid->next;
    mid->next = nullptr;  // cut the list

    ListNode* leftSorted  = sortList(head);   // sort left half
    ListNode* rightSorted = sortList(right);  // sort right half
    return merge(leftSorted, rightSorted);    // merge sorted halves
}

void printList(ListNode* head) {
    while (head) { cout << head->val << " "; head = head->next; }
    cout << endl;
}

int main() {
    // Build: 4 -> 2 -> 1 -> 3
    ListNode* head = new ListNode(4);
    head->next = new ListNode(2);
    head->next->next = new ListNode(1);
    head->next->next->next = new ListNode(3);

    head = sortList(head);
    printList(head);  // Output: 1 2 3 4
}
```

**Key differences from array merge sort:**

| | Array Merge Sort | Linked List Merge Sort |
|---|---|---|
| Find middle | `mid = (l + r) / 2` | Slow/fast pointer |
| Split | Index arithmetic | `mid->next = nullptr` |
| Merge | Copy into temp array | Rewire `next` pointers |
| Space | O(n) for temp array | O(1) for merge, O(log n) stack |

---

## 22. Sort a K-Sorted Array (Nearly Sorted)

### Problem

Given an array where every element is **at most `k` positions away** from its sorted position, sort it efficiently.

**Example:**
```
Input:  arr = [6, 5, 3, 2, 8, 10, 9],  k = 3
Output: [2, 3, 5, 6, 8, 9, 10]
```

### Why Not Just Use `std::sort`?

`std::sort` is O(n log n) and ignores the k-sorted property — it does unnecessary work. Since each element is at most `k` away from its final position, the next smallest element in the entire remaining array is always within the first `k+1` elements. A **min-heap of size k+1** exploits this to achieve O(n log k).

**Time:** O(n log k) | **Space:** O(k)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <queue>     // priority_queue
using namespace std;

vector<int> sortKSorted(vector<int>& arr, int k) {
    // Min-heap (priority_queue with greater<int> gives min-heap)
    priority_queue<int, vector<int>, greater<int>> minHeap;
    vector<int> result;

    // Fill heap with first k+1 elements
    for (int i = 0; i <= min(k, (int)arr.size() - 1); i++)
        minHeap.push(arr[i]);

    // For each remaining element: extract min (it's the globally smallest
    // reachable), then add the next element to keep heap size = k+1
    for (int i = k + 1; i < (int)arr.size(); i++) {
        result.push_back(minHeap.top());
        minHeap.pop();
        minHeap.push(arr[i]);
    }

    // Drain remaining elements from heap
    while (!minHeap.empty()) {
        result.push_back(minHeap.top());
        minHeap.pop();
    }
    return result;
}

int main() {
    vector<int> arr = {6, 5, 3, 2, 8, 10, 9};
    auto res = sortKSorted(arr, 3);
    for (int x : res) cout << x << " ";
    cout << endl;  // Output: 2 3 5 6 8 9 10
}
```

**Why the heap has size k+1:** Each element is at most `k` positions from its correct place. So the globally smallest un-placed element must be within the first `k+1` elements of the remaining array — the heap always contains exactly those candidates.

| Input property | Best sort | Time |
|---|---|---|
| Fully random | `std::sort` | O(n log n) |
| Nearly sorted (k-sorted) | Min-heap of size k+1 | O(n log k) |
| Already sorted | Insertion sort (adaptive) | O(n) |

---

## 23. Wiggle Sort

### Problem

Rearrange an array **in-place** such that it satisfies the wiggle condition:
```
arr[0] < arr[1] > arr[2] < arr[3] > arr[4] ...
```
Every odd-indexed element is a local peak; every even-indexed element is a local valley.

**Example:**
```
Input:  nums = [3, 5, 2, 1, 6, 4]
Output: [3, 5, 1, 6, 2, 4]   (one valid answer — multiple answers exist)
Check:  3<5 ✓, 5>1 ✓, 1<6 ✓, 6>2 ✓, 2<4 ✓
```

### Approach 1 — O(n log n): Sort then Interleave

Sort the array. Take elements from the first half and second half in interleaved order: place smaller elements at even indices, larger at odd indices.

### Approach 2 — O(n): Single Pass (Greedy)

Iterate through the array. At each position, check if the wiggle condition is violated and swap adjacent elements if needed. For index `i`:
- Even index `i`: `nums[i]` should be a valley — if `nums[i] > nums[i-1]`, swap.
- Odd index `i`: `nums[i]` should be a peak — if `nums[i] < nums[i-1]`, swap.

This greedy swap works because fixing a violation at position `i` never breaks the invariant at `i-1`.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// Approach 1: O(n log n) — sort then interleave
vector<int> wiggleSortV1(vector<int> nums) {
    sort(nums.begin(), nums.end());
    int n = nums.size();
    vector<int> result(n);

    int low = 0, high = (n - 1) / 2;    // even indices get the smaller half
    int lo = 0, hi = (n - 1) / 2 + 1;  // odd  indices get the larger half
    for (int i = 0; i < n; i++) {
        if (i % 2 == 0) result[i] = nums[lo++];
        else            result[i] = nums[hi++];
    }
    return result;
}

// Approach 2: O(n) — single pass greedy swap
void wiggleSortV2(vector<int>& nums) {
    for (int i = 1; i < (int)nums.size(); i++) {
        // Even index should be less than previous (valley)
        if (i % 2 == 0 && nums[i] > nums[i - 1])
            swap(nums[i], nums[i - 1]);
        // Odd index should be greater than previous (peak)
        if (i % 2 == 1 && nums[i] < nums[i - 1])
            swap(nums[i], nums[i - 1]);
    }
}

void verify(const vector<int>& nums) {
    for (int i = 1; i < (int)nums.size(); i++) {
        if (i % 2 == 1 && nums[i] <= nums[i-1]) { cout << "FAIL at " << i; return; }
        if (i % 2 == 0 && nums[i] >= nums[i-1]) { cout << "FAIL at " << i; return; }
    }
    cout << "Valid wiggle" << endl;
}

int main() {
    vector<int> nums1 = {3, 5, 2, 1, 6, 4};
    auto res = wiggleSortV1(nums1);
    for (int x : res) cout << x << " "; cout << endl;
    verify(res);

    vector<int> nums2 = {3, 5, 2, 1, 6, 4};
    wiggleSortV2(nums2);
    for (int x : nums2) cout << x << " "; cout << endl;
    verify(nums2);
}
```

**Which approach to use in exams:**
- If asked for O(n) → Approach 2 (greedy single pass).
- If asked for a specific output or proof of correctness → Approach 1 (sort + interleave is easier to reason about).
- Note: multiple valid outputs exist — any arrangement satisfying the condition is accepted.

---

## When to Use Which Sort

### Algorithm Selection Guide

```
Is the range of values small (k << n)?
├── YES → Counting Sort  O(n+k) — integers in small range
│         Radix Sort     O(nk)  — large integers, fixed digits
│         Bucket Sort    O(n)   — floats uniformly distributed
│
└── NO → Comparison sort needed
         Need guaranteed O(n log n) worst case?
         ├── YES → Merge Sort (also stable) or Heap Sort (in-place)
         └── NO  → Quick Sort (fastest in practice, O(n²) rare)
                   Quick Select (for Kth element only — don't sort whole array)

Need stable sort?
├── YES → Merge Sort or std::stable_sort
└── NO  → std::sort (introsort — fastest general purpose)

Custom ordering?
→ Always use std::sort / std::stable_sort with a lambda comparator
```

### Custom Comparator Rules

```cpp
// The comparator must return true if 'a' should come BEFORE 'b'
// Must be a strict weak ordering: irreflexive, asymmetric, transitive

sort(v.begin(), v.end(), [](const T& a, const T& b) {
    // Primary key descending
    if (a.key1 != b.key1) return a.key1 > b.key1;
    // Secondary key ascending
    return a.key2 < b.key2;
});

// NEVER write: return a.val >= b.val  ← violates strict weak ordering → undefined behavior
// ALWAYS use strict <  or >  comparisons
```

### Complexity Quick Reference

| Problem | Algorithm Used | Time |
|---|---|---|
| General sort | `std::sort` (introsort) | O(n log n) |
| Stable sort | Merge Sort / `std::stable_sort` | O(n log n) |
| Guaranteed worst case | Merge Sort / Heap Sort | O(n log n) |
| Small integer range | Counting Sort | O(n+k) |
| Large integers, fixed digits | Radix Sort | O(nk) |
| Uniform floats [0,1) | Bucket Sort | O(n) avg |
| Kth element only | Quick Select | O(n) avg |
| Count inversions | Merge Sort (modified) | O(n log n) |
| Largest number from array | Custom comparator sort | O(n log n) |
| Merge intervals | Sort + linear scan | O(n log n) |
| Meeting rooms | Sort by start + scan | O(n log n) |
| Sort linked list | Merge Sort (linked list version) | O(n log n) |
| K-sorted array | Min-heap of size k+1 | O(n log k) |
| Wiggle sort (any valid output) | Greedy single pass | O(n) |
