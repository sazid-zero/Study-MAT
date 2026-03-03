---
layout: docs
title: Graph Algorithms - MST & Topology
permalink: /graph-mst-topology/
---

[⬅️ Back to Home]({{ '/' | relative_url }})

---
# Graph Algorithms — MST, Topological Sort & Union-Find

---

## Table of Contents

1. [Union-Find — Basic Implementation](#1-union-find--basic-implementation)
2. [Union-Find — Path Compression + Union by Rank/Size](#2-union-find--path-compression--union-by-ranksize)
3. [Union-Find — Connected Components](#3-union-find--connected-components)
4. [Union-Find — Cycle Detection](#4-union-find--cycle-detection)
5. [Union-Find — Dynamic Connectivity](#5-union-find--dynamic-connectivity)
6. [Kruskal's Algorithm — MST](#6-kruskals-algorithm--mst)
7. [Prim's Algorithm — MST (Min-Heap)](#7-prims-algorithm--mst-min-heap)
8. [Prim's Algorithm — MST (Dense Graph, O(V²))](#8-prims-algorithm--mst-dense-graph-ov)
9. [MST Applications — Remove Max-Weight Edge](#9-mst-applications--remove-max-weight-edge)
10. [Second Minimum Spanning Tree](#10-second-minimum-spanning-tree)
11. [Borůvka's Algorithm — MST](#11-borůvkas-algorithm--mst)
12. [Topological Sort — Kahn's BFS](#12-topological-sort--kahns-bfs)
13. [Topological Sort — DFS Post-Order](#13-topological-sort--dfs-post-order)
14. [Course Schedule — Cycle Check in DAG](#14-course-schedule--cycle-check-in-dag)
15. [Alien Dictionary — Topo Sort on Characters](#15-alien-dictionary--topo-sort-on-characters)
16. [Parallel Courses — Minimum Semesters](#16-parallel-courses--minimum-semesters)
17. [Sequence Reconstruction](#17-sequence-reconstruction)
18. [Critical Connections (Bridges)](#18-critical-connections-bridges)

---

## 1. Union-Find — Basic Implementation

### Concept

A **Disjoint Set Union (DSU)** data structure that tracks a partition of elements into disjoint sets. Supports two operations:
- `find(x)`: return the representative (root) of x's set
- `union(x, y)`: merge the sets containing x and y

**Without optimizations:** both operations O(n) worst case (degenerate tree).

```cpp
#include <iostream>
#include <vector>
using namespace std;

struct UnionFind {
    vector<int> parent;

    UnionFind(int n) : parent(n) {
        for (int i = 0; i < n; i++) parent[i] = i;  // each node is its own root
    }

    // Find root (no optimization — O(n) worst)
    int find(int x) {
        if (parent[x] != x) return find(parent[x]);
        return x;
    }

    // Union: merge sets containing x and y
    bool unite(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return false;  // already in same set
        parent[rx] = ry;
        return true;
    }

    bool connected(int x, int y) { return find(x) == find(y); }
};

int main() {
    UnionFind uf(5);
    uf.unite(0, 1); uf.unite(1, 2); uf.unite(3, 4);
    cout << uf.connected(0, 2) << "\n";  // 1 (same set)
    cout << uf.connected(0, 3) << "\n";  // 0 (different sets)
    uf.unite(2, 3);
    cout << uf.connected(0, 4) << "\n";  // 1 (now same set)
}
```

---

## 2. Union-Find — Path Compression + Union by Rank/Size

### Concept

Two optimizations that together make operations nearly O(1) amortized — O(α(n)) where α is the inverse Ackermann function (≤ 4 for all practical n).

- **Path Compression:** When finding root, point all nodes directly to the root (flatten the tree).
- **Union by Rank:** Always attach smaller tree under root of taller tree.
- **Union by Size (alternative):** Attach smaller set under the larger.

```cpp
#include <iostream>
#include <vector>
using namespace std;

struct DSU {
    vector<int> parent, rank_, size_;
    int components;

    DSU(int n) : parent(n), rank_(n, 0), size_(n, 1), components(n) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    // Path compression: point directly to root
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);  // path compression
        return parent[x];
    }

    // Union by rank
    bool uniteByRank(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return false;
        if (rank_[rx] < rank_[ry]) swap(rx, ry);
        parent[ry] = rx;                   // attach shorter tree under taller
        if (rank_[rx] == rank_[ry]) rank_[rx]++;
        components--;
        return true;
    }

    // Union by size (often preferred over rank in practice)
    bool uniteBySize(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return false;
        if (size_[rx] < size_[ry]) swap(rx, ry);
        parent[ry] = rx;                  // attach smaller under larger
        size_[rx] += size_[ry];
        components--;
        return true;
    }

    bool connected(int x, int y) { return find(x) == find(y); }
    int getSize(int x) { return size_[find(x)]; }
};

int main() {
    DSU dsu(6);
    dsu.uniteByRank(0, 1); dsu.uniteByRank(1, 2);
    dsu.uniteByRank(3, 4);
    cout << "Components: " << dsu.components << "\n";  // 3 ({0,1,2},{3,4},{5})
    cout << "Size of 0's set: " << dsu.getSize(0) << "\n";  // 3

    dsu.uniteByRank(2, 5);
    dsu.uniteByRank(4, 5);
    cout << "Components: " << dsu.components << "\n";  // 1
}
```

---

## 3. Union-Find — Connected Components

### Problem

Count the number of connected components and track which component each node belongs to. O(α(n)) per query.

```cpp
#include <iostream>
#include <vector>
using namespace std;

struct DSU {
    vector<int> parent, size_;
    int components;

    DSU(int n) : parent(n), size_(n, 1), components(n) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }
    bool unite(int x, int y) {
        x = find(x); y = find(y);
        if (x == y) return false;
        if (size_[x] < size_[y]) swap(x, y);
        parent[y] = x; size_[x] += size_[y]; components--;
        return true;
    }
    bool connected(int x, int y) { return find(x) == find(y); }
};

// Count components given edge list
int countComponents(int n, vector<pair<int,int>>& edges) {
    DSU dsu(n);
    for (auto& [u,v] : edges) dsu.unite(u, v);
    return dsu.components;
}

int main() {
    vector<pair<int,int>> edges = {{0,1},{1,2},{3,4}};
    cout << countComponents(5, edges) << "\n";  // 2 ({0,1,2} and {3,4}) → +node5 alone = wait n=5
    // Actually: {0,1,2}, {3,4} = 2 components
}
```

---

## 4. Union-Find — Cycle Detection

### Problem

Detect if adding an edge **creates a cycle** in an undirected graph. If both endpoints of an edge are already in the same set, the edge creates a cycle.

```cpp
#include <iostream>
#include <vector>
using namespace std;

struct DSU {
    vector<int> parent, rank_;
    DSU(int n) : parent(n), rank_(n, 0) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }
    bool unite(int x, int y) {
        x = find(x); y = find(y);
        if (x == y) return false;  // CYCLE DETECTED
        if (rank_[x] < rank_[y]) swap(x, y);
        parent[y] = x;
        if (rank_[x] == rank_[y]) rank_[x]++;
        return true;
    }
};

bool hasCycle(int n, vector<pair<int,int>>& edges) {
    DSU dsu(n);
    for (auto& [u,v] : edges)
        if (!dsu.unite(u, v)) return true;  // unite returns false if cycle
    return false;
}

int main() {
    // No cycle
    vector<pair<int,int>> e1 = {{0,1},{1,2},{2,3}};
    cout << hasCycle(4, e1) << "\n";  // 0

    // Has cycle: 0-1-2-0
    vector<pair<int,int>> e2 = {{0,1},{1,2},{2,0}};
    cout << hasCycle(3, e2) << "\n";  // 1
}
```

---

## 5. Union-Find — Dynamic Connectivity

### Problem

Support online queries: add edges and answer connectivity questions. Union-Find handles this in O(α(n)) per operation.

```cpp
#include <iostream>
#include <vector>
using namespace std;

struct DSU {
    vector<int> parent, size_;
    int components;
    DSU(int n) : parent(n), size_(n,1), components(n) {
        for(int i=0;i<n;i++) parent[i]=i;
    }
    int find(int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); }
    bool unite(int x, int y) {
        x=find(x); y=find(y);
        if(x==y) return false;
        if(size_[x]<size_[y]) swap(x,y);
        parent[y]=x; size_[x]+=size_[y]; components--;
        return true;
    }
    bool connected(int x, int y) { return find(x)==find(y); }
    int compCount() { return components; }
};

// Accounts for friend requests, social networks, etc.
vector<int> numIslandsOnline(int n, vector<pair<int,int>>& positions,
                              vector<vector<int>>& grid) {
    DSU dsu(n * n);
    vector<int> result;
    int dirs[4][2] = {{0,1},{0,-1},{1,0},{-1,0}};
    int islands = 0;

    for (auto& [r, c] : positions) {
        int idx = r * n + c;
        if (grid[r][c] == 1) { result.push_back(islands); continue; }
        grid[r][c] = 1;
        islands++;
        for (auto& d : dirs) {
            int nr = r+d[0], nc = c+d[1];
            if (nr>=0&&nr<n&&nc>=0&&nc<n && grid[nr][nc]==1)
                if (dsu.unite(idx, nr*n+nc)) islands--;
        }
        result.push_back(islands);
    }
    return result;
}

int main() {
    DSU dsu(5);
    cout << dsu.compCount() << "\n";  // 5
    dsu.unite(0,1); cout << dsu.compCount() << "\n";  // 4
    dsu.unite(1,2); cout << dsu.compCount() << "\n";  // 3
    cout << dsu.connected(0,2) << "\n";  // 1
    cout << dsu.connected(0,3) << "\n";  // 0
}
```

---

## 6. Kruskal's Algorithm — MST

### Problem

Find a **Minimum Spanning Tree** (MST): a spanning tree with minimum total edge weight.

**Kruskal's Strategy:**
1. Sort all edges by weight (ascending)
2. Greedily add each edge if it connects two different components (no cycle)
3. Stop when we have V-1 edges

**Best for sparse graphs.** Uses Union-Find for cycle detection.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct DSU {
    vector<int> parent, rank_;
    DSU(int n) : parent(n), rank_(n,0) {
        for(int i=0;i<n;i++) parent[i]=i;
    }
    int find(int x) { return parent[x]==x ? x : parent[x]=find(parent[x]); }
    bool unite(int x, int y) {
        x=find(x); y=find(y);
        if(x==y) return false;
        if(rank_[x]<rank_[y]) swap(x,y);
        parent[y]=x;
        if(rank_[x]==rank_[y]) rank_[x]++;
        return true;
    }
};

struct Edge { int u, v, w; };

// Returns {MST weight, MST edges}
pair<int, vector<Edge>> kruskal(int n, vector<Edge>& edges) {
    sort(edges.begin(), edges.end(), [](auto& a, auto& b){ return a.w < b.w; });

    DSU dsu(n);
    int mstWeight = 0, edgeCount = 0;
    vector<Edge> mstEdges;

    for (auto& e : edges) {
        if (dsu.unite(e.u, e.v)) {
            mstWeight += e.w;
            mstEdges.push_back(e);
            edgeCount++;
            if (edgeCount == n-1) break;  // MST complete
        }
    }

    if (edgeCount < n-1) return {-1, {}};  // graph not connected
    return {mstWeight, mstEdges};
}

int main() {
    int n = 6;
    vector<Edge> edges = {{0,1,4},{0,2,3},{1,2,1},{1,3,2},{2,3,4},
                           {3,4,2},{4,5,6}};
    auto [weight, mst] = kruskal(n, edges);
    cout << "MST weight: " << weight << "\n";  // 14
    cout << "MST edges:\n";
    for (auto& e : mst)
        cout << e.u << "-" << e.v << " (w=" << e.w << ")\n";
}
```

---

## 7. Prim's Algorithm — MST (Min-Heap)

### Problem

Same MST problem. **Prim's Strategy:**
1. Start from any vertex, mark it as in-MST
2. Greedily pick the minimum-weight edge crossing the MST boundary
3. Add the new vertex to MST; update frontier edges

**Best for dense graphs (adjacency matrix O(V²)) or with min-heap (O(E log V)).**

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

typedef pair<int,int> pii;

int prim(int n, vector<vector<pii>>& adj) {
    vector<int> key(n, INT_MAX);   // min edge to include node in MST
    vector<bool> inMST(n, false);
    vector<int> parent(n, -1);
    // min-heap: {weight, node}
    priority_queue<pii, vector<pii>, greater<pii>> pq;

    key[0] = 0;
    pq.push({0, 0});

    int mstWeight = 0;

    while (!pq.empty()) {
        auto [w, u] = pq.top(); pq.pop();

        if (inMST[u]) continue;  // already in MST
        inMST[u] = true;
        mstWeight += w;

        for (auto& [v, ew] : adj[u]) {
            if (!inMST[v] && ew < key[v]) {
                key[v] = ew;
                parent[v] = u;
                pq.push({ew, v});
            }
        }
    }

    cout << "MST edges:\n";
    for (int v = 1; v < n; v++)
        cout << parent[v] << "-" << v << " (key=" << key[v] << ")\n";

    return mstWeight;
}

int main() {
    int n = 5;
    vector<vector<pii>> adj(n);
    auto addEdge = [&](int u, int v, int w) {
        adj[u].push_back({v,w}); adj[v].push_back({u,w});
    };
    addEdge(0,1,2); addEdge(0,3,6); addEdge(1,2,3);
    addEdge(1,3,8); addEdge(1,4,5); addEdge(2,4,7); addEdge(3,4,9);

    cout << "MST weight: " << prim(n, adj) << "\n";  // 16
}
```

---

## 8. Prim's Algorithm — MST (Dense Graph, O(V²))

### Problem

For dense graphs where adjacency matrix is available, Prim's without a heap runs in O(V²) — which is better than O(E log V) when E ≈ V².

```cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int primDense(int n, vector<vector<int>>& dist) {
    // dist[u][v] = weight, INT_MAX = no edge
    vector<int> key(n, INT_MAX), parent(n, -1);
    vector<bool> inMST(n, false);
    key[0] = 0;
    int mstWeight = 0;

    for (int iter = 0; iter < n; iter++) {
        // Pick min key vertex not yet in MST
        int u = -1;
        for (int v = 0; v < n; v++)
            if (!inMST[v] && (u == -1 || key[v] < key[u])) u = v;

        inMST[u] = true;
        mstWeight += key[u];

        // Update keys of adjacent vertices
        for (int v = 0; v < n; v++) {
            if (!inMST[v] && dist[u][v] != INT_MAX && dist[u][v] < key[v]) {
                key[v] = dist[u][v];
                parent[v] = u;
            }
        }
    }

    cout << "MST edges:\n";
    for (int v = 1; v < n; v++)
        cout << parent[v] << "-" << v << " (w=" << key[v] << ")\n";

    return mstWeight;
}

int main() {
    int n = 4;
    const int I = INT_MAX;
    vector<vector<int>> d = {{0,10,6,5},{10,0,I,15},{6,I,0,4},{5,15,4,0}};
    cout << "MST weight: " << primDense(n, d) << "\n";  // 19
}
```

---

## 9. MST Applications — Remove Max-Weight Edge

### Problem

Given a graph with a required edge (it must be in the MST), find the minimum spanning tree that includes that edge. Equivalently: in a complete graph, connect all cities minimizing total cost where one road already exists.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct DSU {
    vector<int> parent, rank_;
    DSU(int n) : parent(n), rank_(n,0) { for(int i=0;i<n;i++) parent[i]=i; }
    int find(int x) { return parent[x]==x?x:parent[x]=find(parent[x]); }
    bool unite(int x, int y) {
        x=find(x); y=find(y); if(x==y) return false;
        if(rank_[x]<rank_[y]) swap(x,y); parent[y]=x;
        if(rank_[x]==rank_[y]) rank_[x]++; return true;
    }
};

struct Edge { int u, v, w; };

// MST excluding a specific edge (to find second MST or for constraint problems)
int kruskalExclude(int n, vector<Edge>& edges, int excludeIdx) {
    sort(edges.begin(), edges.end(), [](auto& a, auto& b){ return a.w < b.w; });
    DSU dsu(n);
    int w = 0, cnt = 0;
    for (int i = 0; i < (int)edges.size(); i++) {
        if (i == excludeIdx) continue;
        if (dsu.unite(edges[i].u, edges[i].v)) { w += edges[i].w; cnt++; }
        if (cnt == n-1) break;
    }
    return cnt == n-1 ? w : INT_MAX;
}

int main() {
    int n = 4;
    vector<Edge> edges = {{0,1,1},{0,2,4},{0,3,3},{1,2,2},{2,3,5}};
    // Kruskal normally picks: 0-1(1), 1-2(2), 0-3(3) = 6
    // Excluding edge index 0 (0-1, w=1): best remaining MST
    cout << kruskalExclude(n, edges, 0) << "\n";
}
```

---

## 10. Second Minimum Spanning Tree

### Problem

Find the spanning tree with the **second smallest total weight** (different from the MST by at least one edge).

**Approach:** For each MST edge, try replacing it with a non-MST edge (the cheapest such swap). The answer is `min over all MST edges e of (MST_cost - w(e) + w(best_non_MST_edge_crossing_cut_by_removing_e))`.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

struct DSU {
    vector<int> parent, rank_;
    DSU(int n) : parent(n), rank_(n,0) { for(int i=0;i<n;i++) parent[i]=i; }
    int find(int x) { return parent[x]==x?x:parent[x]=find(parent[x]); }
    bool unite(int x, int y) {
        x=find(x); y=find(y); if(x==y) return false;
        if(rank_[x]<rank_[y]) swap(x,y); parent[y]=x;
        if(rank_[x]==rank_[y]) rank_[x]++; return true;
    }
};

struct Edge { int u, v, w; bool inMST = false; };

// Simple O(E × V) approach: try swapping each MST edge
int secondMST(int n, vector<Edge>& edges) {
    sort(edges.begin(), edges.end(), [](auto& a, auto& b){ return a.w < b.w; });
    DSU dsu(n);
    int mstCost = 0;
    vector<int> mstEdgeIdx;

    for (int i = 0; i < (int)edges.size(); i++) {
        if (dsu.unite(edges[i].u, edges[i].v)) {
            mstCost += edges[i].w;
            edges[i].inMST = true;
            mstEdgeIdx.push_back(i);
        }
    }

    // Try removing each MST edge and finding cheapest replacement
    int secondBest = INT_MAX;
    for (int rem : mstEdgeIdx) {
        // Build MST without edge[rem]
        DSU dsu2(n);
        int cost = 0, cnt = 0;
        for (int i = 0; i < (int)edges.size(); i++) {
            if (i == rem) continue;
            if (dsu2.unite(edges[i].u, edges[i].v)) {
                cost += edges[i].w;
                cnt++;
            }
            if (cnt == n-1) break;
        }
        if (cnt == n-1 && cost != mstCost)
            secondBest = min(secondBest, cost);
    }
    return secondBest;
}

int main() {
    int n = 4;
    vector<Edge> edges = {{0,1,1},{1,2,2},{2,3,3},{0,3,4},{0,2,5}};
    cout << "MST: expected 6, 2nd MST: ";
    cout << secondMST(n, edges) << "\n";  // 7
}
```

---

## 11. Borůvka's Algorithm — MST

### Problem

Alternative MST algorithm. In each phase, every component selects its cheapest outgoing edge; merge components. O(E log V).

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

struct DSU {
    vector<int> parent, rank_;
    DSU(int n) : parent(n), rank_(n,0) { for(int i=0;i<n;i++) parent[i]=i; }
    int find(int x) { return parent[x]==x?x:parent[x]=find(parent[x]); }
    bool unite(int x, int y) {
        x=find(x); y=find(y); if(x==y) return false;
        if(rank_[x]<rank_[y]) swap(x,y); parent[y]=x;
        if(rank_[x]==rank_[y]) rank_[x]++; return true;
    }
};

struct Edge { int u, v, w; };

int boruvka(int n, vector<Edge>& edges) {
    DSU dsu(n);
    int mstCost = 0, components = n;

    while (components > 1) {
        // For each component, find cheapest outgoing edge
        vector<int> cheapest(n, -1);  // cheapest[comp] = edge index

        for (int i = 0; i < (int)edges.size(); i++) {
            int cu = dsu.find(edges[i].u), cv = dsu.find(edges[i].v);
            if (cu == cv) continue;  // same component
            if (cheapest[cu] == -1 || edges[i].w < edges[cheapest[cu]].w)
                cheapest[cu] = i;
            if (cheapest[cv] == -1 || edges[i].w < edges[cheapest[cv]].w)
                cheapest[cv] = i;
        }

        // Add all cheapest edges
        for (int v = 0; v < n; v++) {
            if (cheapest[v] == -1) continue;
            int i = cheapest[v];
            if (dsu.unite(edges[i].u, edges[i].v)) {
                mstCost += edges[i].w;
                components--;
            }
        }
    }
    return mstCost;
}

int main() {
    int n = 4;
    vector<Edge> edges = {{0,1,10},{0,2,6},{0,3,5},{1,3,15},{2,3,4}};
    cout << "MST: " << boruvka(n, edges) << "\n";  // 19
}
```

---

## 12. Topological Sort — Kahn's BFS

### Problem

Order vertices of a **DAG** so every directed edge `(u, v)` has `u` before `v`. Returns empty if cycle exists.

**Kahn's Algorithm:**
1. Compute in-degree of all vertices
2. Add all in-degree-0 nodes to queue
3. Process: remove node, decrease neighbor in-degrees; add new in-degree-0 nodes

```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

// Returns topo order, or empty vector if cycle exists
vector<int> topoSortKahn(int n, vector<vector<int>>& adj) {
    vector<int> indegree(n, 0);
    for (int u = 0; u < n; u++)
        for (int v : adj[u]) indegree[v]++;

    queue<int> q;
    for (int i = 0; i < n; i++)
        if (indegree[i] == 0) q.push(i);

    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) {
            if (--indegree[v] == 0) q.push(v);
        }
    }

    if ((int)order.size() != n) return {};  // cycle detected
    return order;
}

// With tie-breaking: lexicographically smallest topo order
vector<int> topoSortLex(int n, vector<vector<int>>& adj) {
    vector<int> indegree(n, 0);
    for (int u = 0; u < n; u++) for (int v : adj[u]) indegree[v]++;

    priority_queue<int, vector<int>, greater<int>> pq;  // min-heap for lex order
    for (int i = 0; i < n; i++) if (indegree[i] == 0) pq.push(i);

    vector<int> order;
    while (!pq.empty()) {
        int u = pq.top(); pq.pop();
        order.push_back(u);
        for (int v : adj[u]) if (--indegree[v] == 0) pq.push(v);
    }
    return order;
}

int main() {
    int n = 6;
    vector<vector<int>> adj(n);
    adj[5].push_back(2); adj[5].push_back(0);
    adj[4].push_back(0); adj[4].push_back(1);
    adj[2].push_back(3); adj[3].push_back(1);

    auto order = topoSortKahn(n, adj);
    for (int x : order) cout << x << " ";  // e.g. 4 5 0 2 3 1
    cout << "\n";
}
```

---

## 13. Topological Sort — DFS Post-Order

### Problem

DFS-based topological sort: run DFS, push each node to a stack after finishing all its descendants. The topo order is the stack popped in order.

```cpp
#include <iostream>
#include <vector>
#include <stack>
using namespace std;

bool dfsTopo(int u, vector<vector<int>>& adj, vector<int>& state, stack<int>& result) {
    state[u] = 1;  // gray: in current DFS path
    for (int v : adj[u]) {
        if (state[v] == 1) return false;  // back edge = cycle
        if (state[v] == 0)
            if (!dfsTopo(v, adj, state, result)) return false;
    }
    state[u] = 2;  // black: done
    result.push(u);
    return true;
}

vector<int> topoSortDFS(int n, vector<vector<int>>& adj) {
    vector<int> state(n, 0);
    stack<int> result;

    for (int i = 0; i < n; i++)
        if (state[i] == 0)
            if (!dfsTopo(i, adj, state, result)) return {};  // cycle

    vector<int> order;
    while (!result.empty()) { order.push_back(result.top()); result.pop(); }
    return order;
}

int main() {
    int n = 4;
    vector<vector<int>> adj(n);
    adj[0].push_back(1); adj[0].push_back(2);
    adj[1].push_back(3); adj[2].push_back(3);

    auto order = topoSortDFS(n, adj);
    for (int x : order) cout << x << " ";  // 0 2 1 3 or 0 1 2 3
    cout << "\n";
}
```

---

## 14. Course Schedule — Cycle Check in DAG

### Problem

Given `numCourses` and `prerequisites[i] = {a, b}` (must take `b` before `a`), determine if you can finish all courses.

**= Detect cycle in directed graph using Kahn's topo sort.**

```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

// Can finish all courses? Returns true if no cycle.
bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> adj(numCourses);
    vector<int> indegree(numCourses, 0);

    for (auto& p : prerequisites) {
        adj[p[1]].push_back(p[0]);  // p[1] must be done before p[0]
        indegree[p[0]]++;
    }

    queue<int> q;
    for (int i = 0; i < numCourses; i++) if (indegree[i] == 0) q.push(i);

    int completed = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop(); completed++;
        for (int v : adj[u]) if (--indegree[v] == 0) q.push(v);
    }
    return completed == numCourses;
}

// Return the actual course order (or [] if impossible)
vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> adj(numCourses);
    vector<int> indegree(numCourses, 0);
    for (auto& p : prerequisites) { adj[p[1]].push_back(p[0]); indegree[p[0]]++; }

    queue<int> q;
    for (int i = 0; i < numCourses; i++) if (indegree[i] == 0) q.push(i);

    vector<int> order;
    while (!q.empty()) {
        int u = q.front(); q.pop(); order.push_back(u);
        for (int v : adj[u]) if (--indegree[v] == 0) q.push(v);
    }
    return (int)order.size() == numCourses ? order : vector<int>{};
}

int main() {
    vector<vector<int>> pre1 = {{1,0}};
    cout << canFinish(2, pre1) << "\n";  // 1

    vector<vector<int>> pre2 = {{1,0},{0,1}};
    cout << canFinish(2, pre2) << "\n";  // 0 (cycle)

    vector<vector<int>> pre3 = {{1,0},{2,0},{3,1},{3,2}};
    auto order = findOrder(4, pre3);
    for (int x : order) cout << x << " ";  // 0 1 2 3 or 0 2 1 3
    cout << "\n";
}
```

---

## 15. Alien Dictionary — Topo Sort on Characters

### Problem

Given a sorted list of words in an alien language, determine the **character ordering** of the alien alphabet.

**Build graph:** for consecutive words, find the first differing character → that gives a directed edge (char1 comes before char2). Then topological sort.

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <queue>
#include <unordered_map>
#include <unordered_set>
using namespace std;

string alienOrder(vector<string>& words) {
    // Build adjacency list and in-degree for all unique chars
    unordered_map<char, unordered_set<char>> adj;
    unordered_map<char, int> indegree;

    for (auto& w : words) for (char c : w) if (!indegree.count(c)) indegree[c] = 0;

    // Extract edges from adjacent word pairs
    for (int i = 0; i + 1 < (int)words.size(); i++) {
        string& w1 = words[i], &w2 = words[i+1];
        int len = min(w1.size(), w2.size());
        // Edge case: w1 is longer prefix of w2 → invalid
        if (w1.size() > w2.size() && w1.substr(0, len) == w2) return "";

        for (int j = 0; j < (int)len; j++) {
            if (w1[j] != w2[j]) {
                if (!adj[w1[j]].count(w2[j])) {
                    adj[w1[j]].insert(w2[j]);
                    indegree[w2[j]]++;
                }
                break;  // only first difference matters
            }
        }
    }

    // Kahn's topo sort
    queue<char> q;
    for (auto& [c, d] : indegree) if (d == 0) q.push(c);

    string result;
    while (!q.empty()) {
        char c = q.front(); q.pop();
        result += c;
        for (char nc : adj[c]) if (--indegree[nc] == 0) q.push(nc);
    }

    if (result.size() != indegree.size()) return "";  // cycle
    return result;
}

int main() {
    vector<string> w1 = {"wrt","wrf","er","ett","rftt"};
    cout << alienOrder(w1) << "\n";  // "wertf" (one valid order)

    vector<string> w2 = {"z","x"};
    cout << alienOrder(w2) << "\n";  // "zx"

    vector<string> w3 = {"z","x","z"};  // invalid (cycle)
    cout << alienOrder(w3) << "\n";  // ""
}
```

---

## 16. Parallel Courses — Minimum Semesters

### Problem

Take `n` courses. Some courses have prerequisites. Each semester you can take **any subset of available courses**. Find the **minimum number of semesters** to complete all.

**= Find the longest path in the DAG (critical path = bottleneck).**

```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

int minNumberOfSemesters(int n, vector<vector<int>>& relations, int k) {
    vector<vector<int>> adj(n+1);
    vector<int> indegree(n+1, 0);

    for (auto& r : relations) {
        adj[r[0]].push_back(r[1]);
        indegree[r[1]]++;
    }

    queue<int> q;
    for (int i = 1; i <= n; i++) if (indegree[i] == 0) q.push(i);

    int semesters = 0, taken = 0;
    while (!q.empty()) {
        int sz = min((int)q.size(), k);  // take at most k courses per semester
        semesters++;
        vector<int> batch;
        for (int i = 0; i < sz; i++) { batch.push_back(q.front()); q.pop(); }
        for (int u : batch) {
            taken++;
            for (int v : adj[u]) if (--indegree[v] == 0) q.push(v);
        }
    }
    return taken == n ? semesters : -1;
}

// Without k limit: minimum semesters = longest path in DAG
int minSemesters(int n, vector<vector<int>>& relations) {
    vector<vector<int>> adj(n+1);
    vector<int> indegree(n+1, 0);
    for (auto& r : relations) { adj[r[0]].push_back(r[1]); indegree[r[1]]++; }

    queue<int> q;
    vector<int> dist(n+1, 1);  // earliest semester for each course
    for (int i = 1; i <= n; i++) if (indegree[i] == 0) q.push(i);

    int semesters = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        semesters = max(semesters, dist[u]);
        for (int v : adj[u]) {
            dist[v] = max(dist[v], dist[u] + 1);
            if (--indegree[v] == 0) q.push(v);
        }
    }
    return semesters;
}

int main() {
    vector<vector<int>> r = {{1,3},{2,3}};
    cout << minSemesters(3, r) << "\n";  // 2 (semester1: 1,2; semester2: 3)

    vector<vector<int>> r2 = {{1,3},{2,3},{3,4}};
    cout << minSemesters(4, r2) << "\n";  // 3
}
```

---

## 17. Sequence Reconstruction

### Problem

Given `org` (original sequence 1..n) and `seqs` (list of subsequences), determine if `org` is the **only** shortest supersequence reconstructible from `seqs`.

**= Check if topo sort of graph built from seqs gives exactly one valid order (unique topo order = only one node with in-degree 0 at each step).**

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <unordered_set>
using namespace std;

bool sequenceReconstruction(vector<int>& org, vector<vector<int>>& seqs) {
    int n = org.size();
    vector<unordered_set<int>> adj(n+1);
    vector<int> indegree(n+1, 0);
    bool hasNode = false;

    for (auto& seq : seqs) {
        for (int i = 0; i < (int)seq.size(); i++) {
            if (seq[i] < 1 || seq[i] > n) return false;  // out of range
            hasNode = true;
            if (i > 0 && !adj[seq[i-1]].count(seq[i])) {
                adj[seq[i-1]].insert(seq[i]);
                indegree[seq[i]]++;
            }
        }
    }

    if (!hasNode) return n == 0;

    queue<int> q;
    for (int i = 1; i <= n; i++) if (indegree[i] == 0) q.push(i);

    int idx = 0;
    while (!q.empty()) {
        if (q.size() > 1) return false;  // multiple choices → not unique
        int u = q.front(); q.pop();
        if (idx >= n || org[idx++] != u) return false;
        for (int v : adj[u]) if (--indegree[v] == 0) q.push(v);
    }
    return idx == n;
}

int main() {
    vector<int> org = {1,2,3};
    vector<vector<int>> s1 = {{1,2},{1,3}};
    cout << sequenceReconstruction(org, s1) << "\n";  // 0 (2,3 order unknown)

    vector<vector<int>> s2 = {{1,2},{1,3},{2,3}};
    cout << sequenceReconstruction(org, s2) << "\n";  // 1 (unique)
}
```

---

## 18. Critical Connections (Bridges)

### Problem

Find all **critical connections** in a network (bridges): edges whose removal disconnects the graph.

**= Find all bridges using Tarjan's low-link algorithm.**

```cpp
#include <iostream>
#include <vector>
using namespace std;

int bridge_timer = 0;

void dfs(int u, int parent, vector<vector<int>>& adj,
         vector<int>& disc, vector<int>& low, vector<vector<int>>& bridges) {
    disc[u] = low[u] = bridge_timer++;
    for (int v : adj[u]) {
        if (disc[v] == -1) {
            dfs(v, u, adj, disc, low, bridges);
            low[u] = min(low[u], low[v]);
            if (low[v] > disc[u]) bridges.push_back({u, v});  // bridge condition
        } else if (v != parent) {
            low[u] = min(low[u], disc[v]);
        }
    }
}

vector<vector<int>> criticalConnections(int n, vector<vector<int>>& connections) {
    vector<vector<int>> adj(n);
    for (auto& c : connections) {
        adj[c[0]].push_back(c[1]);
        adj[c[1]].push_back(c[0]);
    }

    vector<int> disc(n, -1), low(n);
    vector<vector<int>> bridges;
    bridge_timer = 0;

    for (int i = 0; i < n; i++)
        if (disc[i] == -1) dfs(i, -1, adj, disc, low, bridges);

    return bridges;
}

int main() {
    vector<vector<int>> conn = {{0,1},{1,2},{2,0},{1,3}};
    auto bridges = criticalConnections(4, conn);
    cout << "Bridges:\n";
    for (auto& b : bridges) cout << b[0] << "-" << b[1] << "\n";  // 1-3
}
```

---

## MST: Kruskal vs Prim

| | Kruskal's | Prim's |
|---|---|---|
| **Strategy** | Edge-based: sort edges, add greedily | Vertex-based: grow MST from a vertex |
| **Data structure** | Union-Find | Min-Heap / Priority Queue |
| **Best for** | Sparse graphs (E << V²) | Dense graphs (E ≈ V²) |
| **Time (heap)** | O(E log E) = O(E log V) | O(E log V) |
| **Time (matrix)** | O(E log E) | O(V²) — better for dense |
| **Handles disconnected** | Detects naturally | Need to run per component |

## Union-Find Quick Reference

| Operation | No Opt | Path Compress | + Union by Rank |
|---|---|---|---|
| find | O(n) | O(log n) amortized | O(α(n)) ≈ O(1) |
| union | O(n) | O(log n) amortized | O(α(n)) ≈ O(1) |

## Topo Sort: Kahn's vs DFS

| | Kahn's (BFS) | DFS post-order |
|---|---|---|
| **Cycle detection** | count processed == n? | detect back edge |
| **Unique order** | easy (check queue size) | harder |
| **Lex order** | use min-heap instead of queue | harder |
| **Implementation** | iterative, clean | recursive (stack overflow risk) |

## Complexity Quick Reference

| Algorithm | Time | Space | Notes |
|---|---|---|---|
| Union-Find (path+rank) | O(α(n)) per op | O(n) | Near-constant in practice |
| Kruskal's MST | O(E log E) | O(V) | Dominates: sort edges |
| Prim's MST (heap) | O(E log V) | O(V+E) | Better for sparse |
| Prim's MST (matrix) | O(V²) | O(V) | Better for dense |
| Borůvka's MST | O(E log V) | O(V) | Parallel-friendly |
| Kahn's Topo Sort | O(V+E) | O(V) | BFS-based |
| DFS Topo Sort | O(V+E) | O(V) | DFS-based |
| Course Schedule | O(V+E) | O(V+E) | Kahn's + cycle check |
| Alien Dictionary | O(C) C=total chars | O(1) only 26 chars | Topo on characters |
| Bridges/Articulation | O(V+E) | O(V) | Tarjan low-link |
