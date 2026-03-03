---
layout: docs
title: Advanced Data Structures
permalink: /advanced-data-structures/
---

[⬅️ Back to Home]({{ '/' | relative_url }})

---
{% raw %}
# Advanced Data Structures

## At a Glance

| Structure | Push/Insert | Delete/Pop | Query/Search | Space |
|---|---|---|---|---|
| Binary Heap | O(log n) | O(log n) | O(1) peek | O(n) |
| Hash Table | O(1) avg | O(1) avg | O(1) avg | O(n) |
| AVL Tree | O(log n) | O(log n) | O(log n) | O(n) |
| Sparse Table | O(n log n) build | — | O(1) RMQ | O(n log n) |
| Monotonic Stack/Queue | O(n) amortized | O(1) | O(n) | O(n) |
| Deque / Sliding Window | O(1) | O(1) | O(1) | O(n) |
| Order Statistics Tree | O(log n) | O(log n) | O(log n) rank | O(n) |
| DSU with rollback | O(log n) | O(log n) rollback | O(log n) | O(n) |

---


## Table of Contents

1. [Binary Heap — Build, Push, Pop, Custom Comparator](#1-binary-heap)
2. [Heap — K-th Largest element (two-heap approach)](#2-heap--k-th-largest)
3. [Heap — Merge K Sorted Lists](#3-heap--merge-k-sorted-lists)
4. [Heap — Median Maintenance (two heaps)](#4-heap--median-maintenance)
5. [Hash Table — Separate Chaining](#5-hash-table--separate-chaining)
6. [Hash Table — Open Addressing (Linear Probing)](#6-hash-table--open-addressing)
7. [AVL Tree — Insert with Rotations](#7-avl-tree--insert-with-rotations)
8. [Sparse Table — Range Minimum/Maximum Query](#8-sparse-table--range-minimummaximum-query)
9. [Monotonic Stack — Next Greater Element](#9-monotonic-stack--next-greater-element)
10. [Monotonic Stack — Largest Rectangle in Histogram](#10-monotonic-stack--largest-rectangle-in-histogram)
11. [Monotonic Deque — Sliding Window Maximum](#11-monotonic-deque--sliding-window-maximum)
12. [Deque — Shortest Subarray with Sum ≥ K](#12-deque--shortest-subarray-with-sum--k)
13. [DSU — Weighted/Potential Union-Find](#13-dsu--weightedpotential-union-find)
14. [DSU — Rollback (offline dynamic connectivity)](#14-dsu--rollback-offline-dynamic-connectivity)
15. [Order Statistics Tree (policy-based)](#15-order-statistics-tree-policy-based)
16. [Treap (Randomized BST)](#16-treap-randomized-bst)
17. [Skip List (conceptual + simple implementation)](#17-skip-list)
18. [LRU Cache](#18-lru-cache)
19. [LFU Cache](#19-lfu-cache)

---

## 1. Binary Heap

### Heap properties
- **Max-heap:** parent ≥ children. Root = maximum.
- **Min-heap:** parent ≤ children. Root = minimum.
- Build from array: O(n) via heapify-down from n/2 to 1.

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <functional>
using namespace std;

// ----- Manual Binary Heap (Max-Heap) -----
struct MaxHeap {
    vector<int> h;

    void push(int val) {
        h.push_back(val);
        siftUp(h.size() - 1);
    }

    int top() { return h[0]; }

    void pop() {
        h[0] = h.back(); h.pop_back();
        if (!h.empty()) siftDown(0);
    }

    bool empty() { return h.empty(); }
    int size() { return h.size(); }

    // Build from array in O(n)
    void build(vector<int>& arr) {
        h = arr;
        for (int i = h.size()/2 - 1; i >= 0; i--) siftDown(i);
    }

private:
    void siftUp(int i) {
        while (i > 0) {
            int p = (i-1)/2;
            if (h[p] < h[i]) { swap(h[p], h[i]); i = p; }
            else break;
        }
    }
    void siftDown(int i) {
        int n = h.size();
        while (true) {
            int largest = i, l = 2*i+1, r = 2*i+2;
            if (l < n && h[l] > h[largest]) largest = l;
            if (r < n && h[r] > h[largest]) largest = r;
            if (largest == i) break;
            swap(h[i], h[largest]); i = largest;
        }
    }
};

// ----- STL Priority Queue -----
void stlHeap() {
    // Max-heap (default)
    priority_queue<int> maxq;
    maxq.push(3); maxq.push(1); maxq.push(4);
    cout << maxq.top() << "\n";  // 4

    // Min-heap
    priority_queue<int, vector<int>, greater<int>> minq;
    minq.push(3); minq.push(1); minq.push(4);
    cout << minq.top() << "\n";  // 1

    // Custom comparator: max-heap by second element of pair
    auto cmp = [](pair<int,int> a, pair<int,int> b) { return a.second < b.second; };
    priority_queue<pair<int,int>, vector<pair<int,int>>, decltype(cmp)> pq(cmp);
    pq.push({1, 5}); pq.push({2, 3}); pq.push({3, 8});
    cout << pq.top().first << "\n";  // 3 (largest second)
}

// Heap sort in-place using STL make_heap/push_heap/pop_heap
void heapSort(vector<int>& arr) {
    make_heap(arr.begin(), arr.end());  // O(n)
    for (int i = arr.size()-1; i > 0; i--) {
        pop_heap(arr.begin(), arr.begin()+i+1);  // move max to end
    }
}

int main() {
    MaxHeap mh;
    for (int x : {5, 3, 8, 1, 2}) mh.push(x);
    while (!mh.empty()) { cout << mh.top() << " "; mh.pop(); }  // 8 5 3 2 1
    cout << "\n";
}
```

---

## 2. Heap — K-th Largest

**Maintain a min-heap of size k.** When inserting: if heap size > k and new value > heap.top(), replace top.

```cpp
#include <queue>
#include <vector>
using namespace std;

// K-th largest in a stream: maintain min-heap of size k
class KthLargest {
    priority_queue<int, vector<int>, greater<int>> minHeap;
    int k;
public:
    KthLargest(int k, vector<int>& nums) : k(k) {
        for (int x : nums) add(x);
    }
    int add(int val) {
        minHeap.push(val);
        if ((int)minHeap.size() > k) minHeap.pop();  // remove smallest of top-k
        return minHeap.top();  // top of min-heap = k-th largest
    }
};

// K largest elements from array
vector<int> kLargest(vector<int>& arr, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;
    for (int x : arr) {
        minHeap.push(x);
        if ((int)minHeap.size() > k) minHeap.pop();
    }
    vector<int> res;
    while (!minHeap.empty()) { res.push_back(minHeap.top()); minHeap.pop(); }
    return res;
}
```

---

## 3. Heap — Merge K Sorted Lists

**Use min-heap to always pick smallest current element** from any of the k lists.

```cpp
#include <queue>
#include <vector>
using namespace std;

struct ListNode {
    int val; ListNode* next;
    ListNode(int v) : val(v), next(nullptr) {}
};

ListNode* mergeKLists(vector<ListNode*>& lists) {
    // {value, list_index, pointer}
    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);

    for (ListNode* l : lists) if (l) pq.push(l);

    ListNode dummy(0); ListNode* cur = &dummy;
    while (!pq.empty()) {
        ListNode* node = pq.top(); pq.pop();
        cur->next = node; cur = cur->next;
        if (node->next) pq.push(node->next);
    }
    return dummy.next;
}
// Time: O(N log k) where N = total nodes, k = number of lists
```

---

## 4. Heap — Median Maintenance

**Maintain running median** using a max-heap (lower half) and min-heap (upper half).

```cpp
#include <queue>
using namespace std;

class MedianFinder {
    priority_queue<int> maxHeap;                          // lower half
    priority_queue<int, vector<int>, greater<int>> minHeap; // upper half
public:
    void addNum(int num) {
        maxHeap.push(num);
        minHeap.push(maxHeap.top()); maxHeap.pop();  // balance
        if (minHeap.size() > maxHeap.size() + 1) {
            maxHeap.push(minHeap.top()); minHeap.pop();
        }
    }
    double findMedian() {
        if (minHeap.size() == maxHeap.size())
            return (maxHeap.top() + minHeap.top()) / 2.0;
        return minHeap.top();
    }
};
```

---

## 5. Hash Table — Separate Chaining

```cpp
#include <vector>
#include <list>
#include <string>
using namespace std;

struct HashMap {
    int cap;
    vector<list<pair<int,int>>> table;

    HashMap(int cap = 1009) : cap(cap), table(cap) {}

    int hash(int key) { return ((key % cap) + cap) % cap; }

    void put(int key, int val) {
        int h = hash(key);
        for (auto& [k, v] : table[h]) if (k == key) { v = val; return; }
        table[h].push_back({key, val});
    }

    int get(int key) {
        for (auto& [k, v] : table[hash(key)]) if (k == key) return v;
        return -1;  // not found
    }

    void remove(int key) {
        int h = hash(key);
        table[h].remove_if([key](auto& p) { return p.first == key; });
    }
};
```

---

## 6. Hash Table — Open Addressing

```cpp
#include <vector>
using namespace std;

struct HashMap2 {
    int cap;
    vector<int> keys, vals;
    vector<bool> used;
    int sz = 0;

    HashMap2(int cap = 1024) : cap(cap), keys(cap), vals(cap), used(cap, false) {}

    int hash(int k) { return ((k % cap) + cap) % cap; }

    void put(int key, int val) {
        int h = hash(key);
        while (used[h] && keys[h] != key) h = (h+1) % cap;  // linear probe
        if (!used[h]) { used[h] = true; sz++; }
        keys[h] = key; vals[h] = val;
    }

    int get(int key) {
        int h = hash(key);
        while (used[h]) {
            if (keys[h] == key) return vals[h];
            h = (h+1) % cap;
        }
        return -1;
    }
    // Deletion in open addressing requires "tombstone" markers for correctness
};
```

---

## 7. AVL Tree — Insert with Rotations

**AVL Tree:** BST with height balance property: for every node, |height(left) - height(right)| ≤ 1.

```cpp
#include <iostream>
#include <algorithm>
using namespace std;

struct AVLNode {
    int val, height;
    AVLNode *left, *right;
    AVLNode(int v) : val(v), height(1), left(nullptr), right(nullptr) {}
};

int height(AVLNode* n) { return n ? n->height : 0; }
int bf(AVLNode* n) { return n ? height(n->left) - height(n->right) : 0; }  // balance factor
void updateHeight(AVLNode* n) { if(n) n->height = 1 + max(height(n->left), height(n->right)); }

//  Right rotation (LL case)
//      y              x
//     / \            / \
//    x   C    →    A    y
//   / \                / \
//  A   B              B   C
AVLNode* rotateRight(AVLNode* y) {
    AVLNode* x = y->left, *B = x->right;
    x->right = y; y->left = B;
    updateHeight(y); updateHeight(x);
    return x;
}

// Left rotation (RR case)
AVLNode* rotateLeft(AVLNode* x) {
    AVLNode* y = x->right, *B = y->left;
    y->left = x; x->right = B;
    updateHeight(x); updateHeight(y);
    return y;
}

AVLNode* balance(AVLNode* n) {
    updateHeight(n);
    int b = bf(n);
    // LL: right-heavy left child
    if (b > 1 && bf(n->left) >= 0)  return rotateRight(n);
    // LR: right-heavy left child → double rotation
    if (b > 1) { n->left = rotateLeft(n->left); return rotateRight(n); }
    // RR
    if (b < -1 && bf(n->right) <= 0) return rotateLeft(n);
    // RL
    if (b < -1) { n->right = rotateRight(n->right); return rotateLeft(n); }
    return n;
}

AVLNode* insert(AVLNode* root, int val) {
    if (!root) return new AVLNode(val);
    if (val < root->val) root->left  = insert(root->left,  val);
    else if (val > root->val) root->right = insert(root->right, val);
    return balance(root);
}

void inorder(AVLNode* root) {
    if (!root) return;
    inorder(root->left); cout << root->val << " "; inorder(root->right);
}

int main() {
    AVLNode* root = nullptr;
    for (int x : {10, 20, 30, 40, 50, 25}) root = insert(root, x);
    inorder(root); cout << "\n";  // 10 20 25 30 40 50 (sorted, balanced)
}
```

---

## 8. Sparse Table — Range Minimum/Maximum Query

**Sparse Table:** O(n log n) build, **O(1)** static range min/max (idempotent queries). No updates.

```cpp
#include <vector>
#include <cmath>
#include <algorithm>
using namespace std;

struct SparseTable {
    int n, LOG;
    vector<vector<int>> table;  // table[j][i] = min of [i, i+2^j)
    vector<int> log2_;

    SparseTable(vector<int>& arr) {
        n = arr.size();
        LOG = __lg(n) + 1;  // floor(log2(n)) + 1
        table.assign(LOG, vector<int>(n));
        log2_.resize(n+1);
        log2_[1] = 0;
        for (int i = 2; i <= n; i++) log2_[i] = log2_[i/2] + 1;

        table[0] = arr;  // base: intervals of length 1
        for (int j = 1; j < LOG; j++)
            for (int i = 0; i + (1<<j) <= n; i++)
                table[j][i] = min(table[j-1][i], table[j-1][i + (1<<(j-1))]);
    }

    // RMQ [l, r] in O(1): overlapping intervals are fine for min (idempotent)
    int query(int l, int r) {
        int k = log2_[r - l + 1];
        return min(table[k][l], table[k][r - (1<<k) + 1]);
    }
};

int main() {
    vector<int> arr = {2, 4, 3, 1, 6, 7, 8, 9, 1, 7};
    SparseTable st(arr);
    cout << st.query(0, 4) << "\n";  // 1
    cout << st.query(4, 7) << "\n";  // 6
    cout << st.query(0, 9) << "\n";  // 1
}
```

---

## 9. Monotonic Stack — Next Greater Element

**Monotonic Stack:** Maintains elements in monotone order (increasing/decreasing). Used for nearest smaller/larger, stock span, trapping rain water, etc.

```cpp
#include <vector>
#include <stack>
using namespace std;

// Next Greater Element to the right (NGR)
vector<int> nextGreater(vector<int>& arr) {
    int n = arr.size();
    vector<int> res(n, -1);
    stack<int> stk;  // indices of elements with no NGR found yet
    for (int i = 0; i < n; i++) {
        while (!stk.empty() && arr[stk.top()] < arr[i]) {
            res[stk.top()] = arr[i];
            stk.pop();
        }
        stk.push(i);
    }
    return res;
}

// Previous Smaller Element to the left (PSL)
vector<int> prevSmaller(vector<int>& arr) {
    int n = arr.size();
    vector<int> res(n, -1);
    stack<int> stk;
    for (int i = 0; i < n; i++) {
        while (!stk.empty() && arr[stk.top()] >= arr[i]) stk.pop();
        res[i] = stk.empty() ? -1 : arr[stk.top()];
        stk.push(i);
    }
    return res;
}

// Stock span: how many consecutive days before today with price ≤ today
vector<int> stockSpan(vector<int>& prices) {
    int n = prices.size();
    vector<int> span(n);
    stack<int> stk;
    for (int i = 0; i < n; i++) {
        while (!stk.empty() && prices[stk.top()] <= prices[i]) stk.pop();
        span[i] = stk.empty() ? i+1 : i - stk.top();
        stk.push(i);
    }
    return span;
}
```

---

## 10. Monotonic Stack — Largest Rectangle in Histogram

```cpp
#include <vector>
#include <stack>
using namespace std;

// Largest rectangle in histogram in O(n)
int largestRectangleArea(vector<int>& heights) {
    int n = heights.size();
    stack<int> stk;  // monotonically increasing stack of indices
    int maxArea = 0;
    for (int i = 0; i <= n; i++) {
        int h = (i == n) ? 0 : heights[i];
        while (!stk.empty() && heights[stk.top()] > h) {
            int height = heights[stk.top()]; stk.pop();
            int width = stk.empty() ? i : i - stk.top() - 1;
            maxArea = max(maxArea, height * width);
        }
        stk.push(i);
    }
    return maxArea;
}

// Maximal rectangle in binary matrix (uses histogram approach per row)
int maximalRectangle(vector<vector<char>>& matrix) {
    if (matrix.empty()) return 0;
    int m = matrix.size(), n = matrix[0].size();
    vector<int> heights(n, 0);
    int maxArea = 0;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++)
            heights[j] = (matrix[i][j] == '1') ? heights[j]+1 : 0;
        maxArea = max(maxArea, largestRectangleArea(heights));
    }
    return maxArea;
}
```

---

## 11. Monotonic Deque — Sliding Window Maximum

**Monotonically decreasing deque** maintains maximum of current window.

```cpp
#include <vector>
#include <deque>
using namespace std;

// Sliding window maximum: for each window [i-k+1, i], find max
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    int n = nums.size();
    deque<int> dq;  // indices of candidates, front = maximum of window
    vector<int> res;

    for (int i = 0; i < n; i++) {
        // Remove elements outside window
        while (!dq.empty() && dq.front() < i - k + 1) dq.pop_front();
        // Remove elements smaller than nums[i] from back (they can never be max)
        while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k-1) res.push_back(nums[dq.front()]);
    }
    return res;
}

// Sliding window minimum: reverse comparison
vector<int> minSlidingWindow(vector<int>& nums, int k) {
    int n = nums.size();
    deque<int> dq;
    vector<int> res;
    for (int i = 0; i < n; i++) {
        while (!dq.empty() && dq.front() < i-k+1) dq.pop_front();
        while (!dq.empty() && nums[dq.back()] > nums[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k-1) res.push_back(nums[dq.front()]);
    }
    return res;
}
```

---

## 12. Deque — Shortest Subarray with Sum ≥ K

```cpp
#include <vector>
#include <deque>
using namespace std;

// Use prefix sums + monotone deque
// Shortest subarray with sum ≥ K (array can have negatives)
int shortestSubarray(vector<int>& nums, int k) {
    int n = nums.size();
    vector<long long> prefix(n+1, 0);
    for (int i = 0; i < n; i++) prefix[i+1] = prefix[i] + nums[i];

    deque<int> dq;  // increasing prefix sums
    int res = n+1;

    for (int i = 0; i <= n; i++) {
        // While front of deque forms a valid subarray
        while (!dq.empty() && prefix[i] - prefix[dq.front()] >= k) {
            res = min(res, i - dq.front());
            dq.pop_front();
        }
        // Maintain increasing prefix sums in deque
        while (!dq.empty() && prefix[dq.back()] >= prefix[i]) dq.pop_back();
        dq.push_back(i);
    }
    return (res == n+1) ? -1 : res;
}
```

---

## 13. DSU — Weighted/Potential Union-Find

**Weighted DSU** stores relative weight/potential between nodes (e.g., equation division, group differences).

```cpp
#include <vector>
#include <functional>
using namespace std;

struct WeightedDSU {
    vector<int> parent, rank_;
    vector<double> weight;  // weight[i] = ratio: value[i] / value[parent[i]]

    WeightedDSU(int n) : parent(n), rank_(n, 0), weight(n, 1.0) {
        iota(parent.begin(), parent.end(), 0);
    }

    pair<int, double> find(int x) {  // returns {root, product of weights}
        if (parent[x] == x) return {x, 1.0};
        auto [root, w] = find(parent[x]);
        weight[x] *= w;
        parent[x] = root;
        return {root, weight[x]};
    }

    void unite(int x, int y, double ratio) {
        // ratio = value[x] / value[y]
        auto [px, wx] = find(x);
        auto [py, wy] = find(y);
        if (px == py) return;
        if (rank_[px] < rank_[py]) { swap(px, py); ratio = 1.0/ratio; swap(wx, wy); }
        parent[py] = px;
        weight[py] = wx / wy / ratio;
        if (rank_[px] == rank_[py]) rank_[px]++;
    }

    double query(int x, int y) {
        auto [px, wx] = find(x);
        auto [py, wy] = find(y);
        if (px != py) return -1.0;
        return wx / wy;
    }
};

// Example usage: a/b=2.0, b/c=3.0 → a/c=6.0
int main() {
    WeightedDSU dsu(3);  // nodes 0=a, 1=b, 2=c
    dsu.unite(0, 1, 2.0);  // a/b = 2.0
    dsu.unite(1, 2, 3.0);  // b/c = 3.0
    printf("%.1f\n", dsu.query(0, 2));  // 6.0 (a/c)
}
```

---

## 14. DSU — Rollback (offline dynamic connectivity)

**DSU with rollback** supports undo of unite operations (no path compression — only union by rank).

```cpp
#include <vector>
using namespace std;

struct RollbackDSU {
    vector<int> parent, rank_;
    vector<pair<int*,int>> history;  // {pointer, old_value}

    RollbackDSU(int n) : parent(n), rank_(n, 0) {
        iota(parent.begin(), parent.end(), 0);
    }

    int find(int x) {  // NO path compression (needed for rollback correctness)
        while (parent[x] != x) x = parent[x];
        return x;
    }

    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (rank_[a] < rank_[b]) swap(a, b);
        history.push_back({&parent[b], parent[b]});
        history.push_back({&rank_[a],  rank_[a]});
        parent[b] = a;
        if (rank_[a] == rank_[b]) rank_[a]++;
        return true;
    }

    int save() { return history.size(); }

    void rollback(int checkpoint) {
        while ((int)history.size() > checkpoint) {
            *history.back().first = history.back().second;
            history.pop_back();
        }
    }
};
```

---

## 15. Order Statistics Tree (Policy-Based)

**GNU policy-based tree** provides O(log n) order statistics: k-th smallest, order/rank of element.

```cpp
#include <iostream>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
using namespace std;
using namespace __gnu_pbds;

typedef tree<int, null_type, less<int>, rb_tree_tag, tree_order_statistics_node_update> OST;

int main() {
    OST ost;
    ost.insert(3); ost.insert(1); ost.insert(4); ost.insert(1);  // note: set (no duplicates)
    // For duplicates: use pair<int,int> with unique second key

    cout << *ost.find_by_order(0) << "\n";  // 0-indexed: 1 (smallest)
    cout << *ost.find_by_order(2) << "\n";  // 4 (3rd smallest)
    cout << ost.order_of_key(4)   << "\n";  // 2 (0-indexed rank of 4)
    cout << ost.order_of_key(5)   << "\n";  // 3 (count of elements < 5)
}
```

---

## 16. Treap (Randomized BST)

**Treap** = BST + Heap. Each node has a random priority. Maintains BST on key, heap on priority → expected O(log n) for split/merge.

```cpp
#include <cstdlib>
#include <iostream>
using namespace std;

struct TreapNode {
    int key, priority, size;
    TreapNode *left, *right;
    TreapNode(int k) : key(k), priority(rand()), size(1), left(nullptr), right(nullptr) {}
};

int sz(TreapNode* t) { return t ? t->size : 0; }
void upd(TreapNode* t) { if(t) t->size = 1 + sz(t->left) + sz(t->right); }

// Split into (t_left with keys ≤ key, t_right with keys > key)
pair<TreapNode*, TreapNode*> split(TreapNode* t, int key) {
    if (!t) return {nullptr, nullptr};
    if (t->key <= key) {
        auto [l, r] = split(t->right, key);
        t->right = l; upd(t); return {t, r};
    } else {
        auto [l, r] = split(t->left, key);
        t->left = r; upd(t); return {l, t};
    }
}

// Merge two treaps (all keys in l ≤ all keys in r)
TreapNode* merge(TreapNode* l, TreapNode* r) {
    if (!l || !r) return l ? l : r;
    if (l->priority > r->priority) {
        l->right = merge(l->right, r); upd(l); return l;
    } else {
        r->left = merge(l, r->left); upd(r); return r;
    }
}

void insert(TreapNode*& root, int key) {
    auto [l, r] = split(root, key-1);
    root = merge(merge(l, new TreapNode(key)), r);
}

void erase(TreapNode*& root, int key) {
    auto [l, r] = split(root, key-1);
    auto [m, r2] = split(r, key);
    delete m;
    root = merge(l, r2);
}

// K-th smallest (1-indexed)
int kth(TreapNode* t, int k) {
    if (!t) return -1;
    int leftSz = sz(t->left);
    if (k == leftSz+1) return t->key;
    if (k <= leftSz) return kth(t->left, k);
    return kth(t->right, k - leftSz - 1);
}

int main() {
    TreapNode* root = nullptr;
    for (int x : {5, 3, 7, 1, 4}) insert(root, x);
    cout << kth(root, 3) << "\n";  // 4 (3rd smallest: 1,3,4,5,7)
    erase(root, 3);
    cout << kth(root, 3) << "\n";  // 5 (3rd smallest: 1,4,5,7)
}
```

---

## 17. Skip List

**Skip List:** Layered linked list with probabilistic O(log n) expected operations. Alternatives: AVL for deterministic, Treap for simpler randomized.

```cpp
#include <vector>
#include <cstdlib>
#include <climits>
using namespace std;

struct SkipNode {
    int val;
    vector<SkipNode*> next;
    SkipNode(int v, int lvl) : val(v), next(lvl, nullptr) {}
};

struct SkipList {
    static const int MAXLVL = 16;
    static constexpr double P = 0.5;
    int level;
    SkipNode* head;

    SkipList() : level(1), head(new SkipNode(INT_MIN, MAXLVL)) {}

    int randLevel() {
        int lvl = 1;
        while ((double)rand() / RAND_MAX < P && lvl < MAXLVL) lvl++;
        return lvl;
    }

    void insert(int val) {
        vector<SkipNode*> update(MAXLVL);
        SkipNode* cur = head;
        for (int i = level-1; i >= 0; i--) {
            while (cur->next[i] && cur->next[i]->val < val) cur = cur->next[i];
            update[i] = cur;
        }
        int lvl = randLevel();
        if (lvl > level) { for (int i = level; i < lvl; i++) update[i] = head; level = lvl; }
        SkipNode* node = new SkipNode(val, lvl);
        for (int i = 0; i < lvl; i++) { node->next[i] = update[i]->next[i]; update[i]->next[i] = node; }
    }

    bool search(int val) {
        SkipNode* cur = head;
        for (int i = level-1; i >= 0; i--)
            while (cur->next[i] && cur->next[i]->val < val) cur = cur->next[i];
        cur = cur->next[0];
        return cur && cur->val == val;
    }
};
```

---

## 18. LRU Cache

**LRU (Least Recently Used):** O(1) get and put using doubly-linked list + hash map.

```cpp
#include <unordered_map>
#include <list>
using namespace std;

class LRUCache {
    int cap;
    list<pair<int,int>> cache;  // {key, value}, front = most recent
    unordered_map<int, list<pair<int,int>>::iterator> map;

public:
    LRUCache(int cap) : cap(cap) {}

    int get(int key) {
        if (!map.count(key)) return -1;
        cache.splice(cache.begin(), cache, map[key]);  // move to front: O(1)
        return map[key]->second;
    }

    void put(int key, int value) {
        if (map.count(key)) {
            map[key]->second = value;
            cache.splice(cache.begin(), cache, map[key]);
        } else {
            if ((int)cache.size() == cap) {
                map.erase(cache.back().first);
                cache.pop_back();
            }
            cache.push_front({key, value});
            map[key] = cache.begin();
        }
    }
};
```

---

## 19. LFU Cache

**LFU (Least Frequently Used):** O(1) get and put using frequency-grouped DLL + hash maps.

```cpp
#include <unordered_map>
#include <list>
using namespace std;

class LFUCache {
    int cap, minFreq;
    unordered_map<int, pair<int,int>> vals;       // key → {value, freq}
    unordered_map<int, list<int>> freqList;       // freq → list of keys (MRU at front)
    unordered_map<int, list<int>::iterator> pos;  // key → iterator in freqList

public:
    LFUCache(int cap) : cap(cap), minFreq(0) {}

    void touch(int key) {
        int f = vals[key].second++;
        freqList[f].erase(pos[key]);
        if (freqList[f].empty() && f == minFreq) minFreq++;
        freqList[f+1].push_front(key);
        pos[key] = freqList[f+1].begin();
    }

    int get(int key) {
        if (!vals.count(key)) return -1;
        touch(key);
        return vals[key].first;
    }

    void put(int key, int value) {
        if (cap <= 0) return;
        if (vals.count(key)) { vals[key].first = value; touch(key); return; }
        if ((int)vals.size() == cap) {
            int evict = freqList[minFreq].back();
            freqList[minFreq].pop_back();
            pos.erase(evict); vals.erase(evict);
        }
        vals[key] = {value, 1};
        freqList[1].push_front(key);
        pos[key] = freqList[1].begin();
        minFreq = 1;
    }
};
```

---

## Pattern Summary

| Problem Type | Best Data Structure | Why |
|---|---|---|
| Dynamic median | Two heaps (max+min) | O(log n) insert, O(1) query |
| Sliding window max/min | Monotonic deque | O(1) amortized per element |
| Next greater/smaller | Monotonic stack | O(n) total, processes once |
| Static RMQ | Sparse table | O(1) query after O(n log n) build |
| Dynamic RMQ | Segment tree | O(log n) update + query |
| Rank/order queries | Order statistics tree | O(log n) find_by_order, order_of_key |
| Cache eviction LRU | DLL + hash map | O(1) get, put, evict |
| Cache eviction LFU | DLL + two hash maps | O(1) all ops |
| Union-Find with undo | DSU with rollback (no path compression) | O(log n), supports rollback |

## Complexity Quick Reference

| Structure | Insert | Delete | Query | Build |
|---|---|---|---|---|
| Binary Heap | O(log n) | O(log n) | O(1) top | O(n) |
| Sparse Table | — | — | O(1) RMQ | O(n log n) |
| Segment Tree | O(log n) | O(log n) | O(log n) | O(n) |
| Lazy Seg Tree | O(log n) range | O(log n) | O(log n) | O(n) |
| BIT/Fenwick | O(log n) | O(log n) | O(log n) | O(n log n) |
| AVL Tree | O(log n) | O(log n) | O(log n) | O(n log n) |
| Treap | O(log n) exp | O(log n) exp | O(log n) exp | O(n log n) exp |
| Skip List | O(log n) exp | O(log n) exp | O(log n) exp | — |
| DSU (rollback) | O(log n) | O(log n) rollback | O(log n) | O(n) |
| LRU Cache | O(1) | O(1) | O(1) | — |
| LFU Cache | O(1) | O(1) | O(1) | — |

{% endraw %}
