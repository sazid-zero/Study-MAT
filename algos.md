---
layout: docs
title: Common Algorithms
permalink: /algos/
---

# Algorithms & Data Structures

> Master standard algorithms, common patterns, and problem-solving techniques.

[⬅️ Back to Home]({{ '/' | relative_url }})

---

## Standard Algorithms

The standard library (STL) provides optimized implementations of efficient algorithms that work on iterators.

**Header:** `#include <algorithm>`

### Sorting

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
vector<pair<int,int>> v = {{ "{{" }}1,2}, {1,1}, {1,3}};
stable_sort(v.begin(), v.end());             // maintains relative order
```

---

### Searching

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

### Min/Max Operations

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

### Other Essential Algorithms

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

## Functors (Function Objects)

Custom behaviors for algorithms (e.g., for `sort` or `priority_queue`).

### Custom Comparators
```cpp
struct Comparator {
    bool operator()(pair<int,int> a, pair<int,int> b) {
        if(a.second != b.second) return a.second > b.second; // Descending by 2nd
        return a.first < b.first;                            // Ascending by 1st
    }
};

vector<pair<int,int>> v = {{ "{{" }}1,3}, {2,3}, {1,2}};
sort(v.begin(), v.end(), Comparator());
```

### Lambda Expressions (C++11+)
More concise way to write comparators.
```cpp
auto cmp = [](int a, int b) { return a > b; };
sort(v.begin(), v.end(), cmp);
```

---

## Common Algorithmic Patterns

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

[Back to Top](#algorithms--data-structures) | [Home](/)

---

## Graph Algorithms

Essential for traversing networks, solving maze problems, and dependency resolution.

### BFS (Breadth-First Search)

**Concept**: Explore the graph layer by layer, like ripples in a pond. It uses a **Queue** (FIFO).
**Real-World Use Cases**:
-   **GPS Navigation**: Finding the route with the fewest turns.
-   **Social Networks**: Finding people within "2 degrees of separation".
-   **Web Crawlers**: Visiting links level by level.

**Complexity**:
-   **Time**: `O(V + E)` (Visit every vertex and edge once).
-   **Space**: `O(V)` (Queue can hold all vertices in worst case).

```cpp
void bfs(vector<vector<int>>& graph, int start) {
    int n = graph.size();
    vector<bool> visited(n, false);
    queue<int> q;
    
    q.push(start);
    visited[start] = true;
    
    while(!q.empty()) {
        int node = q.front();
        q.pop();
        cout << node << " ";
        
        for(int neighbor : graph[node]) {
            if(!visited[neighbor]) {
                q.push(neighbor);
                visited[neighbor] = true;
            }
        }
    }
}
```

### DFS (Depth-First Search)

**Concept**: Explore as deep as possible along each branch before backtracking. It uses a **Stack** (LIFO) or Recursion.
**Real-World Use Cases**:
-   **Maze Solving**: Trying a path until you hit a wall, then backtracking.
-   **Cycle Detection**: Checking for circular dependencies (e.g., A needs B, B needs A).
-   **Topological Sort**: Scheduling dependent tasks.

**Complexity**:
-   **Time**: `O(V + E)`.
-   **Space**: `O(V)` (Recursion stack height).

```cpp
void dfs(vector<vector<int>>& graph, int node, vector<bool>& visited) {
    visited[node] = true;
    cout << node << " ";
    
    for(int neighbor : graph[node]) {
        if(!visited[neighbor]) {
            dfs(graph, neighbor, visited);
        }
    }
}
```

### Cycle Detection (Directed)
```cpp
bool hasCycleDFS(vector<vector<int>>& graph, int node, 
                 vector<bool>& visited, vector<bool>& recStack) {
    visited[node] = true;
    recStack[node] = true;
    
    for(int neighbor : graph[node]) {
        if(!visited[neighbor]) {
            if(hasCycleDFS(graph, neighbor, visited, recStack)) return true;
        } else if(recStack[neighbor]) {
            return true;
        }
    }
    
    recStack[node] = false;
    return false;
}
```

---

## Dynamic Programming Patterns

### 1. Fibonacci (Memoization vs Tabulation)

**Concept**: Calculate `F(n) = F(n-1) + F(n-2)`.
-   **Naive Recursion**: `O(2^n)` (Exponential). Re-calculates same subproblems.
-   **Memoization (Top-Down)**: Store results in a map/array. `O(n)`.
-   **Tabulation (Bottom-Up)**: Iteratively build the table from 0 to n. `O(n)`.

```cpp
// Memoization (Top-Down)
int fibMemo(int n, vector<int>& memo) {
    if(n <= 1) return n;
    if(memo[n] != -1) return memo[n];
    return memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo);
}

// Tabulation (Bottom-Up)
int fibTab(int n) {
    if(n <= 1) return n;
    vector<int> dp(n+1);
    dp[0] = 0; dp[1] = 1;
    for(int i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}
```

### 2. 0/1 Knapsack

**Problem**: You have a bag with capacity `W` and items with `weight` and `value`. Maximize total value without exceeding capacity.
**Decision Tree**: For each item, you have two choices:
1.  **Include it**: Value = `val[i] + knapSack(W - wt[i])`.
2.  **Exclude it**: Value = `knapSack(W)`.
**Take the max of both.**

```cpp
int knapSack(int W, const vector<int>& wt, const vector<int>& val, int n) {
    vector<vector<int>> dp(n + 1, vector<int>(W + 1));

    for (int i = 0; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            if (i == 0 || w == 0)
                dp[i][w] = 0;
            else if (wt[i - 1] <= w)
                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            else
                dp[i][w] = dp[i - 1][w];
        }
    }
    return dp[n][W];
}
```

### 3. Longest Common Subsequence (LCS)

**Problem**: Find length of longest subsequence present in `text1` and `text2` (e.g., "ace" is subseq of "abcde").
**Logic**:
-   If `text1[i] == text2[j]`: Match found! `1 + LCS(next chars)`.
-   Else: Max of `LCS(skip char in text1)` vs `LCS(skip char in text2)`.

**Use Case**: Diff tools (Git), DNA sequencing.

```cpp
int lcs(string text1, string text2) {
    int m = text1.size(), n = text2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    for(int i = 1; i <= m; i++) {
        for(int j = 1; j <= n; j++) {
            if(text1[i-1] == text2[j-1]) {
                dp[i][j] = 1 + dp[i-1][j-1];
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    return dp[m][n];
}
```

### 4. Longest Increasing Subsequence (LIS)

**Problem**: Find length of longest strictly increasing subsequence.
**Logic**: For every element `i`, check all previous elements `j`. If `nums[i] > nums[j]`, we can extend the sequence ending at `j`.

```cpp
int lengthOfLIS(vector<int>& nums) {
    if (nums.empty()) return 0;
    vector<int> dp(nums.size(), 1);
    int maxAns = 1;
    for (int i = 1; i < nums.size(); i++) {
        for (int j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                dp[i] = max(dp[i], dp[j] + 1);
            }
        }
        maxAns = max(maxAns, dp[i]);
    }
    return maxAns;
}
```

---

## Advanced Graph Algorithms

### 1. Dijkstra (Shortest Path)

**Concept**: Finds the shortest path from a starting node to *all* other nodes in a weighted graph. It's a "Greedy" algorithm.
**How it works**:
1.  Set distance to start = 0, all others = infinity.
2.  Use a **Priority Queue** to always pick the "closest" unvisited node.
3.  "Relax" edges: If going through current node is shorter than previous known path, update distance.

**Real-World Use Cases**:
-   **Google Maps**: Finding the fastest route (time = weight).
-   **IP Routing**: OSPF (Open Shortest Path First) protocol.

```cpp
vector<int> dijkstra(int V, vector<vector<pair<int, int>>>& adj, int S) {
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    vector<int> dist(V, INT_MAX);

    dist[S] = 0;
    pq.push({0, S});

    while (!pq.empty()) {
        int d = pq.top().first;
        int u = pq.top().second;
        pq.pop();

        if (d > dist[u]) continue;

        for (auto& edge : adj[u]) {
            int v = edge.first;
            int weight = edge.second;
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}
```

### 2. Topological Sort (Kahn's Algorithm)

**Concept**: Linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every edge `u -> v`, `u` comes before `v`.
**Real-World Use Cases**:
-   **Build Systems**: Building dependencies (e.g., `make`, `npm install`). Library A must be built before Library B.
-   **Task Scheduling**: Pre-requisite courses in university.

**Complexity**: `O(V + E)` using Indegree array.

```cpp
vector<int> topologicalSort(int V, vector<vector<int>>& adj) {
    vector<int> inDegree(V, 0);
    for (int u = 0; u < V; u++) {
        for (int v : adj[u]) inDegree[v]++;
    }

    queue<int> q;
    for (int i = 0; i < V; i++) {
        if (inDegree[i] == 0) q.push(i);
    }

    vector<int> result;
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        result.push_back(u);

        for (int v : adj[u]) {
            inDegree[v]--;
            if (inDegree[v] == 0) q.push(v);
        }
    }
    return result;
}
```

### 3. Disjoint Set Union (DSU) / Union-Find

**Concept**: Keeps track of elements partitioned into disjoint (non-overlapping) sets. logic: "Are these two friends in the same circle?"
**Operations**:
-   **Find**: Determine which subset an element is in.
-   **Union**: Join two subsets into a single subset.

**Real-World Use Cases**:
-   **Network Connectivity**: Are computer A and B connected?
-   **Image Processing**: Finding connected components (blobs).
-   **Kruskal's Algorithm**: Finding MST.

```cpp
class DSU {
    vector<int> parent, rank;
public:
    DSU(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        for(int i=0; i<n; i++) parent[i] = i;
    }
    
    int find(int i) {
        if(parent[i] == i) return i;
        return parent[i] = find(parent[i]); // Path compression: flattens the tree
    }
    
    void unite(int i, int j) {
        int root_i = find(i);
        int root_j = find(j);
        if(root_i != root_j) {
            if(rank[root_i] < rank[root_j])
                parent[root_i] = root_j;
            else {
                parent[root_j] = root_i;
                if(rank[root_i] == rank[root_j]) rank[root_i]++;
            }
        }
    }
};
```

### 4. Trie (Prefix Tree)

**Concept**: Tree-like structure where each node represents a character. "Hell" and "Hello" share the path `H-e-l-l`.
**Complexity**: `O(L)` where L is word length. Constant time relative to number of words!
**Use Case**: Typeahead Autocomplete, Spell Checker, IP Routing.

```cpp
struct TrieNode {
    TrieNode* children[26];
    bool isEnd;
    
    TrieNode() {
        for(int i=0; i<26; i++) children[i] = nullptr;
        isEnd = false;
    }
};

class Trie {
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }
    
    void insert(string word) {
        TrieNode* curr = root;
        for(char c : word) {
            int idx = c - 'a';
            if(!curr->children[idx]) curr->children[idx] = new TrieNode();
            curr = curr->children[idx];
        }
        curr->isEnd = true;
    }
    
    bool search(string word) {
        TrieNode* curr = root;
        for(char c : word) {
            int idx = c - 'a';
            if(!curr->children[idx]) return false;
            curr = curr->children[idx];
        }
        return curr->isEnd;
    }
    
    bool startsWith(string prefix) {
        TrieNode* curr = root;
        for(char c : prefix) {
            int idx = c - 'a';
            if(!curr->children[idx]) return false;
            curr = curr->children[idx];
        }
        return true;
    }
};
```

### 5. Segment Tree

**Concept**: A binary tree used for storing intervals or segments. Key for **Range Queries** where updates happen frequently.
**Visual**:
-   Root stores sum of `[0...n]`.
-   Left child `[0...mid]`, Right child `[mid+1...n]`.
**Complexity**: Build `O(N)`, Query `O(log N)`, Update `O(log N)`.

```cpp
const int N = 1e5; 
int tree[4 * N];
int arr[N];

void build(int node, int start, int end) {
    if(start == end) {
        tree[node] = arr[start];
    } else {
        int mid = (start + end) / 2;
        build(2*node, start, mid);
        build(2*node+1, mid+1, end);
        tree[node] = tree[2*node] + tree[2*node+1];
    }
}

void update(int node, int start, int end, int idx, int val) {
    if(start == end) {
        arr[idx] = val;
        tree[node] = val;
    } else {
        int mid = (start + end) / 2;
        if(start <= idx && idx <= mid)
            update(2*node, start, mid, idx, val);
        else
            update(2*node+1, mid+1, end, idx, val);
        tree[node] = tree[2*node] + tree[2*node+1];
    }
}

int query(int node, int start, int end, int l, int r) {
    if(r < start || end < l) return 0;
    if(l <= start && end <= r) return tree[node];
    
    int mid = (start + end) / 2;
    int p1 = query(2*node, start, mid, l, r);
    int p2 = query(2*node+1, mid+1, end, l, r);
    return p1 + p2;
}
```

---

---

## Time & Space Complexity Cheat Sheet

| Algorithm | Best | Average | Worst | Space |
|-----------|------|---------|-------|-------|
| **Binary Search** | O(1) | O(log N) | O(log N) | O(1) |
| **Merge Sort** | O(N log N) | O(N log N) | O(N log N) | O(N) |
| **Quick Sort** | O(N log N) | O(N log N) | O(N^2) | O(log N) |
| **BFS/DFS (Graph)** | O(V + E) | O(V + E) | O(V + E) | O(V) |
| **Dijkstra** | O((V+E) log V) | O((V+E) log V) | O((V+E) log V) | O(V) |

---

[Back to Top](#algorithms--data-structures) | [Home](/)
