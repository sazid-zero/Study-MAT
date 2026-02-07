---
layout: page
title: C++ STL Complete Guide
permalink: /stl-guide/
---

# 📚 Complete C++ STL Guide for Competitive Programming

> A comprehensive guide covering Containers, Iterators, Algorithms, and more!

[⬅️ Back to Home](/)

---

## 📦 1. Containers

Containers are divided into:

- **Sequence Containers**: Linear data
- **Associative Containers**: Sorted, key-based
- **Unordered Associative Containers**: Hash-based, unsorted
- **Container Adapters**: Stack-like wrappers

---

### 🔹 Sequence Containers

#### **Vector** (Dynamic array: Resizable, contiguous memory)

**Header:** `#include <vector>`

**Syntax:**
```cpp
vector<T> vec;                    // empty
vector<T> vec(size, value);       // initialized
vector<T> vec = {1, 2, 3};       // initializer list
```

**Key Operations:**

| Operation | Code | Complexity |
|-----------|------|------------|
| Insert | `vec.push_back(val);` | O(1) amortized |
| Insert at position | `vec.insert(it, val);` | O(N) worst |
| Access | `vec[i];` | O(1) |
| Access (bounds-checked) | `vec.at(i);` | O(1) |
| Delete from end | `vec.pop_back();` | O(1) |
| Erase | `vec.erase(it);` | O(N) |
| Size | `vec.size();` | O(1) |
| Capacity | `vec.capacity();` | O(1) |
| Resize | `vec.resize(new_size);` | O(N) |
| Clear | `vec.clear();` | O(N) |
| Front | `vec.front();` | O(1) |
| Back | `vec.back();` | O(1) |

**Code Example:**
```cpp
vector<int> v = {1, 2, 3};
v.push_back(4);              // v = {1, 2, 3, 4}
v.erase(v.begin() + 1);      // v = {1, 3, 4}
cout << v.size();            // 3

// Iterate
for(auto &x : v) {
    cout << x << " ";
}
```

**Use Cases:** Arrays in problems (e.g., two-pointer, sliding window). Good for random access.

---

#### **List** (Doubly-linked list: Non-contiguous, efficient inserts/deletes)

**Header:** `#include <list>`

**Syntax:**
```cpp
list<T> lst;                     // empty
list<T> lst = {1, 2, 3};        // initializer list
```

**Key Operations:**

| Operation | Code | Complexity |
|-----------|------|------------|
| Insert at end | `lst.push_back(val);` | O(1) |
| Insert at front | `lst.push_front(val);` | O(1) |
| Insert at position | `lst.insert(it, val);` | O(1) |
| Delete from end | `lst.pop_back();` | O(1) |
| Delete from front | `lst.pop_front();` | O(1) |
| Erase | `lst.erase(it);` | O(1) |
| Size | `lst.size();` | O(1) |
| Merge | `lst1.merge(lst2);` | O(N) |
| Sort | `lst.sort();` | O(N log N) |

**Code Example:**
```cpp
list<int> l = {1, 3};
l.insert(l.begin(), 0);      // {0, 1, 3}
l.push_front(-1);            // {-1, 0, 1, 3}
l.erase(l.begin());          // {0, 1, 3}
```

**Use Cases:** When frequent inserts/deletes in middle (e.g., LRU cache simulation).

---

#### **Deque** (Double-ended queue: Like vector but efficient at both ends)

**Header:** `#include <deque>`

**Syntax:**
```cpp
deque<T> dq;                     // empty
deque<T> dq = {1, 2, 3};        // initializer list
```

**Key Operations:** Similar to vector, plus:
```cpp
dq.push_front(val);              // O(1)
dq.pop_front();                  // O(1)
dq[i];                           // O(1) access
```

**Code Example:**
```cpp
deque<int> d = {2, 3};
d.push_front(1);                 // {1, 2, 3}
d.pop_back();                    // {1, 2}
```

**Use Cases:** Sliding window maximum (e.g., monotonic queue).

---

#### **Array** (Fixed-size array: Like C array but safer)

**Header:** `#include <array>`

**Syntax:**
```cpp
array<T, size> arr;              // must specify size
array<int, 3> arr = {1, 2, 3};  // initialized
```

**Key Operations:** Similar to vector but **fixed size**. No push/pop.
```cpp
arr[i];                          // access
arr.at(i);                       // bounds-checked
arr.size();                      // size
```

**Code Example:**
```cpp
array<int, 3> a = {1, 2, 3};
cout << a[1];                    // 2
```

**Use Cases:** When size known at compile time (rare in problems).

---

#### **Forward List** (Singly-linked list: Efficient forward traversal)

**Header:** `#include <forward_list>`

**Syntax:**
```cpp
forward_list<T> fl;              // empty
forward_list<T> fl = {1, 2, 3}; // initializer list
```

**Key Operations:** Like list but **no back operations**.
```cpp
fl.push_front(val);              // O(1)
fl.insert_after(it, val);        // O(1)
// No size() – count manually
```

**Code Example:**
```cpp
forward_list<int> fl = {1, 2};
fl.insert_after(fl.begin(), 3);  // {1, 3, 2}
```

**Use Cases:** Memory-efficient lists (less common).

---

### 🔹 Associative Containers (Sorted)

#### **Set** (Unique elements, sorted, typically red-black tree)

**Header:** `#include <set>`

**Syntax:**
```cpp
set<T> s;                        // empty
set<T> s = {1, 2, 3};           // initializer list
```

**Key Operations:**

| Operation | Code | Complexity |
|-----------|------|------------|
| Insert | `s.insert(val);` | O(log N) |
| Delete | `s.erase(val);` or `s.erase(it);` | O(log N) |
| Find | `auto it = s.find(val);` | O(log N) |
| Count | `s.count(val);` | O(log N) |
| Size | `s.size();` | O(1) |
| Lower bound | `s.lower_bound(val);` (first >= val) | O(log N) |
| Upper bound | `s.upper_bound(val);` (first > val) | O(log N) |

**Code Example:**
```cpp
set<int> st = {1, 3};
st.insert(2);                    // {1, 2, 3}
auto it = st.lower_bound(2);     // points to 2
st.erase(3);                     // {1, 2}

// Check if element exists
if(st.find(2) != st.end()) {
    cout << "Found!";
}
```

**Use Cases:** Unique sorted elements (e.g., remove duplicates, find next greater).

---

#### **Multiset** (Like set but allows duplicates)

**Syntax/Operations:** Same as set, but insert allows multiples. 

⚠️ **Note:** `erase(val)` removes **all** occurrences; use `erase(it)` for one.

**Code Example:**
```cpp
multiset<int> ms = {1, 1, 2};
ms.erase(ms.find(1));            // {1, 2} (removes one 1)
ms.erase(1);                     // {} (removes all 1s)
```

**Use Cases:** Sorted with duplicates (e.g., frequency counting).

---

#### **Map** (Key-value pairs, sorted by key, unique keys)

**Header:** `#include <map>`

**Syntax:**
{% raw %}
```cpp
map<K, V> m;                                     // empty
map<int, string> m = {{1, "a"}, {2, "b"}};      // initializer list
```
{% endraw %}

**Key Operations:**

| Operation | Code | Complexity |
|-----------|------|------------|
| Insert/Update | `m[key] = val;` | O(log N) |
| Insert pair | `m.insert({key, val});` | O(log N) |
| Access | `m[key];` (auto-inserts if not exists) | O(log N) |
| Delete | `m.erase(key);` | O(log N) |
| Find | `auto it = m.find(key);` | O(log N) |
| Count | `m.count(key);` | O(log N) |
| Lower bound | `m.lower_bound(key);` | O(log N) |

**Code Example:**
```cpp
map<int, string> mp;
mp[1] = "one";                   // inserts
cout << mp[1];                   // "one"

// Check if key exists
if(mp.find(2) != mp.end()) {
    cout << "Key exists!";
}

mp.erase(1);

// Iterate
for(auto &[key, val] : mp) {
    cout << key << ": " << val << "\n";
}
```

**Use Cases:** Dictionaries (e.g., frequency maps, memoization).

---

#### **Multimap** (Like map but duplicate keys)

**Operations:** Similar, but insert allows duplicate keys. **No `[]` operator.**

**Code Example:**
```cpp
multimap<int, string> mm;
mm.insert({1, "a"});
mm.insert({1, "b"});             // allowed
```

**Use Cases:** Multi-value per key.

---

### 🔹 Unordered Associative Containers (Hash-based, average O(1))

#### **Unordered Set** (Unique elements, unsorted)

**Header:** `#include <unordered_set>`

**Syntax:**
```cpp
unordered_set<T> us;
```

**Operations:** Like set but **O(1) average** insert/find/erase. No bounds.

**Code Example:**
```cpp
unordered_set<int> us = {1, 2};
us.insert(3);
if(us.count(2)) {
    cout << "found";
}
```

**Use Cases:** Fast lookups (e.g., seen set in two-sum).

---

#### **Unordered Multiset** (Duplicates allowed)

Similar to `unordered_set`, `erase(val)` removes all.

---

#### **Unordered Map** (Key-value, unsorted)

**Header:** `#include <unordered_map>`

**Syntax:**
```cpp
unordered_map<K, V> um;
```

**Operations:** Like map but **O(1) average**.

**Code Example:**
```cpp
unordered_map<string, int> um;
um["key"] = 10;
cout << um["key"];               // 10
um.erase("key");

// Frequency counter
vector<int> nums = {1, 2, 2, 3};
unordered_map<int, int> freq;
for(int x : nums) {
    freq[x]++;
}
```

**Use Cases:** Hash maps (e.g., anagrams grouping). 

⚠️ **Watch for hash collisions** (worst O(N)).

---

#### **Unordered Multimap** (Duplicate keys)

Similar to `unordered_map`, allows duplicate keys.

---

### 🔹 Container Adapters (Wrappers)

#### **Stack** (LIFO: Last In First Out)

**Header:** `#include <stack>`

**Syntax:**
```cpp
stack<T> st;                     // uses deque underneath
```

**Operations:**

| Operation | Code | Complexity |
|-----------|------|------------|
| Push | `st.push(val);` | O(1) |
| Pop | `st.pop();` | O(1) |
| Top | `st.top();` | O(1) |
| Size | `st.size();` | O(1) |
| Empty | `st.empty();` | O(1) |

**Code Example:**
```cpp
stack<int> s;
s.push(1);
s.push(2);
cout << s.top();                 // 2
s.pop();                         // removes 2
```

**Use Cases:** Recursion simulation, parentheses matching.

---

#### **Queue** (FIFO: First In First Out)

**Header:** `#include <queue>`

**Syntax:**
```cpp
queue<T> q;
```

**Operations:**

| Operation | Code | Complexity |
|-----------|------|------------|
| Push | `q.push(val);` | O(1) |
| Pop | `q.pop();` | O(1) |
| Front | `q.front();` | O(1) |
| Back | `q.back();` | O(1) |
| Size | `q.size();` | O(1) |

**Code Example:**
```cpp
queue<int> q;
q.push(1);
q.push(2);
cout << q.front();               // 1
q.pop();
```

**Use Cases:** BFS traversal.

---

#### **Priority Queue** (Heap: Max/min heap)

**Header:** `#include <queue>`

**Syntax:**
```cpp
priority_queue<T> pq;                                           // max-heap (default)
priority_queue<T, vector<T>, greater<T>> pq;                   // min-heap
```

**Operations:**

| Operation | Code | Complexity |
|-----------|------|------------|
| Push | `pq.push(val);` | O(log N) |
| Pop | `pq.pop();` | O(log N) |
| Top | `pq.top();` | O(1) |
| Size | `pq.size();` | O(1) |

⚠️ **No random access**

**Code Example:**
```cpp
// Max-heap
priority_queue<int> pq;
pq.push(3);
pq.push(1);
cout << pq.top();                // 3

// Min-heap
priority_queue<int, vector<int>, greater<int>> min_pq;
min_pq.push(3);
min_pq.push(1);
cout << min_pq.top();            // 1

// Custom comparator for pairs (min-heap on first element)
auto cmp = [](pair<int,int> a, pair<int,int> b) {
    return a.first > b.first;
};
priority_queue<pair<int,int>, vector<pair<int,int>>, decltype(cmp)> custom_pq(cmp);
```

**Use Cases:** Kth largest/smallest, Dijkstra's algorithm.

---

## 🔄 2. Iterators

Iterators traverse containers like pointers.

### Types:
- **Input**: Read-only
- **Output**: Write-only
- **Forward**: Single direction
- **Bidirectional**: Both directions
- **Random Access**: Jump anywhere

### Syntax:
```cpp
container::iterator it = cont.begin();       // start
container::iterator it = cont.end();         // past end (not valid element!)
```

### Operations:
```cpp
++it;                                        // next
*it;                                         // dereference
it != cont.end();                            // comparison
```

### Reverse Iterators:
```cpp
auto rit = cont.rbegin();                    // reverse begin
auto rit = cont.rend();                      // reverse end
```

### Code Example (Vector):
```cpp
vector<int> v = {1, 2, 3};

// Forward iteration
for(auto it = v.begin(); it != v.end(); ++it) {
    *it += 1;                                // modifies
}  // v = {2, 3, 4}

// Reverse iteration
for(auto rit = v.rbegin(); rit != v.rend(); ++rit) {
    cout << *rit << " ";                     // 4 3 2
}

// Const iterator (read-only)
for(auto it = v.cbegin(); it != v.cend(); ++it) {
    cout << *it << " ";
}
```

### Use in Problems:
- Custom traversals
- Erase while iterating (use `it = cont.erase(it);` to avoid invalidation)
```cpp
// Safe erase while iterating
for(auto it = v.begin(); it != v.end(); ) {
    if(*it % 2 == 0) {
        it = v.erase(it);                    // erase returns next valid iterator
    } else {
        ++it;
    }
}
```



---

## 🏗️ 3. Data Structures Operations (Beyond STL)

STL covers most, but here are additional structures:

### **Arrays**
Fixed size, O(1) access.
```cpp
int arr[100];                                          // raw array for speed
```

### **Linked Lists**
Manual implementation if needed (nodes with `next`/`prev`).
```cpp
struct Node {
    int data;
    Node* next;
};
```

### **Trees/Graphs**
Use vectors of vectors (adjacency list).
```cpp
int N = 5;
vector<vector<int>> graph(N);                          // adjacency list
graph[0].push_back(1);                                 // edge 0 -> 1
```

### **Hashing**
`unordered_map`/`unordered_set` handle it.

### **Heaps**
`priority_queue` is a binary heap.

### **Trie**
Implement manually with maps/structs for strings.
```cpp
struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};
```

### **Union-Find (DSU)**
Manual array for parent/rank.
```cpp
class DSU {
    vector<int> parent, rank;
public:
    DSU(int n) : parent(n), rank(n, 0) {
        iota(parent.begin(), parent.end(), 0);
    }
    
    int find(int x) {
        if(parent[x] != x) {
            parent[x] = find(parent[x]);               // path compression
        }
        return parent[x];
    }
    
    void unite(int x, int y) {
        int px = find(x), py = find(y);
        if(px == py) return;
        if(rank[px] < rank[py]) swap(px, py);
        parent[py] = px;
        if(rank[px] == rank[py]) rank[px]++;
    }
};
```

---

## 💡 Tips for Coding Problems

### 1. **Choose Based on Operations**
- **Vector** for access
- **Set/Map** for ordered unique
- **Unordered** for fast lookups

### 2. **Avoid Slow Operations**
- ❌ `list` for random access is bad
- ✅ Use `vector` instead

### 3. **Handle Iterators Carefully**
- Invalidation on `erase`
- Use `it = cont.erase(it);` pattern

### 4. **Use Pairs**
```cpp
pair<int, int> p = {1, 2};
map<int, pair<int,int>> m;
priority_queue<pair<int,int>> pq;
```

### 5. **Multisets for Kth Elements**
```cpp
multiset<int> ms = {1, 2, 3, 4, 5};
auto it = ms.begin();
advance(it, 2);                                        // 3rd element
cout << *it;                                           // 3
```

### 6. **Practice Problems**
- **Two Sum**: `unordered_map`
- **Merge Intervals**: `vector` + `sort`
- **Top K Frequent**: `priority_queue` + `map`
- **LRU Cache**: `list` + `unordered_map`

### 7. **Time Complexity**
- **O(1)**: Hash operations, vector access
- **O(log N)**: Binary search, set/map operations
- **O(N)**: Linear scan
- **O(N log N)**: Sorting

---

## 📊 Quick Reference Table

| Container | Ordered | Unique | Access | Insert | Search | Use Case |
|-----------|---------|--------|--------|--------|--------|----------|
| `vector` | ✅ | ❌ | O(1) | O(1)* | O(N) | Dynamic arrays |
| `list` | ✅ | ❌ | O(N) | O(1) | O(N) | Frequent insert/delete |
| `deque` | ✅ | ❌ | O(1) | O(1) | O(N) | Double-ended ops |
| `set` | ✅ | ✅ | O(log N) | O(log N) | O(log N) | Sorted unique |
| `multiset` | ✅ | ❌ | O(log N) | O(log N) | O(log N) | Sorted duplicates |
| `map` | ✅ | ✅ key | O(log N) | O(log N) | O(log N) | Key-value sorted |
| `unordered_set` | ❌ | ✅ | O(1)* | O(1)* | O(1)* | Fast unique |
| `unordered_map` | ❌ | ✅ key | O(1)* | O(1)* | O(1)* | Fast key-value |
| `stack` | ❌ | ❌ | O(1) | O(1) | - | LIFO |
| `queue` | ❌ | ❌ | O(1) | O(1) | - | FIFO |
| `priority_queue` | ❌ | ❌ | O(1) | O(log N) | - | Heap |

*O(1) amortized/average case

---

## 🚀 Common Patterns

### Pattern 1: Frequency Counter
```cpp
unordered_map<int, int> freq;
for(int x : arr) {
    freq[x]++;
}
```

### Pattern 2: Sliding Window Maximum
```cpp
deque<int> dq;
for(int i = 0; i < n; i++) {
    while(!dq.empty() && arr[dq.back()] <= arr[i]) {
        dq.pop_back();
    }
    dq.push_back(i);
    if(dq.front() <= i - k) dq.pop_front();
}
```

### Pattern 3: Two Pointers
```cpp
int left = 0, right = n - 1;
while(left < right) {
    if(arr[left] + arr[right] == target) {
        // found
    } else if(arr[left] + arr[right] < target) {
        left++;
    } else {
        right--;
    }
}
```

### Pattern 4: Prefix Sum
```cpp
vector<int> prefix(n + 1, 0);
for(int i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + arr[i];
}
// Sum from [l, r] = prefix[r+1] - prefix[l]
```

---

## 📝 Complete Example: Multiple Patterns

```cpp
#include <iostream>
#include <vector>
#include <map>
#include <set>
#include <unordered_map>
#include <algorithm>
#include <queue>
using namespace std;

int main() {
    // Input
    vector<int> arr = {3, 1, 4, 1, 5, 9, 2, 6, 5};
    
    // 1. Sort
    sort(arr.begin(), arr.end());
    // arr = {1, 1, 2, 3, 4, 5, 5, 6, 9}
    
    // 2. Remove duplicates
    vector<int> unique_arr = arr;
    unique_arr.erase(unique(unique_arr.begin(), unique_arr.end()), 
                     unique_arr.end());
    // unique_arr = {1, 2, 3, 4, 5, 6, 9}
    
    // 3. Frequency map
    unordered_map<int, int> freq;
    for(int x : arr) freq[x]++;
    
    // 4. Top 2 frequent elements (using priority queue)
    priority_queue<pair<int,int>> pq;  // max-heap on frequency
    for(auto [val, count] : freq) {
        pq.push({count, val});
    }
    
    cout << "Top 2 frequent: ";
    for(int i = 0; i < 2 && !pq.empty(); i++) {
        auto [count, val] = pq.top();
        pq.pop();
        cout << val << "(" << count << ") ";
    }
    cout << "\n";
    
    // 5. Binary search
    bool found = binary_search(arr.begin(), arr.end(), 5);
    cout << "5 found: " << (found ? "Yes" : "No") << "\n";
    
    // 6. Lower/upper bound
    auto lb = lower_bound(arr.begin(), arr.end(), 5);
    auto ub = upper_bound(arr.begin(), arr.end(), 5);
    cout << "Count of 5: " << (ub - lb) << "\n";
    
    // 7. Accumulate sum
    int sum = accumulate(arr.begin(), arr.end(), 0);
    cout << "Sum: " << sum << "\n";
    
    return 0;
}
```

**Output:**
```
Top 2 frequent: 1(2) 5(2) 
5 found: Yes
Count of 5: 2
Sum: 36
```

---

## 🎓 Conclusion

This covers **95%+ of STL usage** in coding problems. 

**Key Takeaways:**
- ✅ Master `vector`, `map`, `set`, and their unordered variants
- ✅ Understand time complexities
- ✅ Practice common patterns
- ✅ Use proper iterators
- ✅ Leverage built-in algorithms

**Practice makes perfect!** Solve problems on:
- LeetCode
- Codeforces
- AtCoder
- HackerRank

---

[⬆️ Back to Top](#-complete-c-stl-guide-for-competitive-programming) | [🏠 Home](/)

*Happy Coding! 🚀*
