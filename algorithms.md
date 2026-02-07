---
layout: page
title: Algorithms & Data Structures
permalink: /algorithms/
---

# 🚀 Algorithms & Data Structures

> Master standard algorithms, common patterns, and problem-solving techniques.

[⬅️ Back to Home](/)

---

## ⚡ Standard Algorithms

The standard library (STL) provides optimized implementations of efficient algorithms that work on iterators.

**Header:** `#include <algorithm>`

### 🔢 Sorting

Sorting is fundamental to many algorithms.

#### **sort** - O(N log N)
Standard sort using Introsort (QuickSort + HeapSort + InsertionSort).
```cpp
vector<int> v = {3, 1, 2};
sort(v.begin(), v.end());                    // {1, 2, 3}

// Descending order
sort(v.begin(), v.end(), greater<int>());    // {3, 2, 1}

// Custom comparator
bool cmp(int a, int b) {
    return a > b;                            // descending
}
sort(v.begin(), v.end(), cmp);

// Lambda comparator
sort(v.begin(), v.end(), [](int a, int b) {
    return a > b;
});
```

#### **stable_sort** - O(N log N)
Preserves the relative order of equal elements.
```cpp
{% raw %}
vector<pair<int,int>> v = {{1,2}, {1,1}, {1,3}};
{% endraw %}
stable_sort(v.begin(), v.end());             // maintains relative order
```

---

### 🔍 Searching

#### **find** - O(N)
Linear search. Returns iterator to first occurrence or `end()`.
```cpp
vector<int> v = {1, 2, 3};
auto it = find(v.begin(), v.end(), 2);       // points to 2
if(it != v.end()) {
    cout << "Found at index: " << (it - v.begin());
}
```

#### **binary_search** - O(log N)
Returns `true` if element exists. **Requires sorted range.**
```cpp
vector<int> v = {1, 2, 3, 4, 5};
bool found = binary_search(v.begin(), v.end(), 3);  // true
```

#### **lower_bound** - O(log N)
Returns iterator to the **first element >= val**. **Requires sorted range.**
```cpp
vector<int> v = {1, 2, 4, 4, 5};
auto it = lower_bound(v.begin(), v.end(), 4);      // points to first 4
```

#### **upper_bound** - O(log N)
Returns iterator to the **first element > val**. **Requires sorted range.**
```cpp
auto it = upper_bound(v.begin(), v.end(), 4);      // points to 5
```

---

### 📊 Min/Max Operations

```cpp
vector<int> v = {3, 1, 4, 1, 5};

// Find min/max element
auto min_it = min_element(v.begin(), v.end());     // points to 1
auto max_it = max_element(v.begin(), v.end());     // points to 5

cout << *min_it << ", " << *max_it;                // 1, 5

// minmax_element returns pair of iterators
auto [min_it, max_it] = minmax_element(v.begin(), v.end());
```

---

### 🛠️ Other Essential Algorithms

#### **reverse** - O(N)
Reverses the order of elements.
```cpp
vector<int> v = {1, 2, 3};
reverse(v.begin(), v.end());                       // {3, 2, 1}
```

#### **unique** - O(N)
Removes **consecutive** duplicates. Usually requires sorting first.
```cpp
vector<int> v = {1, 1, 2, 2, 3};
sort(v.begin(), v.end());                          // sort first!
auto it = unique(v.begin(), v.end());              // {1, 2, 3, ?, ?}
v.erase(it, v.end());                              // {1, 2, 3}

// Idiomatic "Erase-Remove" pattern
v.erase(unique(v.begin(), v.end()), v.end());
```

#### **fill** - O(N)
Assigns a value to a range.
```cpp
vector<int> v(5);
fill(v.begin(), v.end(), 10);                      // {10, 10, 10, 10, 10}
```

#### **count** - O(N)
Counts occurrences of a value.
```cpp
vector<int> v = {1, 2, 1, 3, 1};
int cnt = count(v.begin(), v.end(), 1);            // 3
```

#### **accumulate** - O(N)
Calculates sum of range. (`#include <numeric>`)
```cpp
#include <numeric>
vector<int> v = {1, 2, 3, 4, 5};
long long sum = accumulate(v.begin(), v.end(), 0LL);       // 15
```

#### **next_permutation** - O(N)
Transforms range to next lexicographical permutation.
```cpp
vector<int> v = {1, 2, 3};
do {
    for(int x : v) cout << x << " ";
    cout << "\n";
} while(next_permutation(v.begin(), v.end()));
```

---

## 🎯 Functors (Function Objects)

Custom behaviors for algorithms (e.g., for `sort` or `priority_queue`).

### Custom Comparators
```cpp
struct Comparator {
    bool operator()(pair<int,int> a, pair<int,int> b) {
        if(a.second != b.second) return a.second > b.second; // Descending by 2nd
        return a.first < b.first;                            // Ascending by 1st
    }
};

{% raw %}
vector<pair<int,int>> v = {{1,3}, {2,3}, {1,2}};
{% endraw %}
sort(v.begin(), v.end(), Comparator());
```

### Lambda Expressions (C++11+)
More concise way to write comparators.
```cpp
auto cmp = [](int a, int b) { return a > b; };
sort(v.begin(), v.end(), cmp);
```

---

## 🧩 Common Algorithmic Patterns

### Two Pointers
Used for searching pairs in sorted arrays or merging.
```cpp
int left = 0, right = n - 1;
while(left < right) {
    if(arr[left] + arr[right] == target) { /* found */ }
    else if(arr[left] + arr[right] < target) left++;
    else right--;
}
```

### Sliding Window
Used for subarray problems.
```cpp
// Example: Max in window of size k
deque<int> dq;
for(int i = 0; i < n; i++) {
    while(!dq.empty() && arr[dq.back()] <= arr[i]) dq.pop_back();
    dq.push_back(i);
    if(dq.front() <= i - k) dq.pop_front();
}
```

### Prefix Sum
Used for range sum queries in O(1).
```cpp
vector<int> prefix(n + 1, 0);
for(int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + arr[i];
// Sum [L, R] = prefix[R+1] - prefix[L]
```

---

[⬆️ Back to Top](#-algorithms--data-structures) | [🏠 Home](/)
