---
layout: docs
title: Graph Algorithms - Shortest Paths
permalink: /graph-shortest-paths/
---

[⬅️ Back to Home]({{ '/' | relative_url }})

---
# Graph Algorithms — Shortest Paths

**At a glance — which algorithm to use:**

| Constraints | Algorithm | Complexity |
|---|---|---|
| Unweighted graph | BFS | O(V+E) |
| Non-negative weights, single source | Dijkstra | O(E log V) |
| Negative weights, no negative cycle | Bellman-Ford | O(VE) |
| Detect negative cycles | Bellman-Ford | O(VE) |
| All pairs shortest path | Floyd-Warshall | O(V³) |
| All pairs + negative weights | Floyd-Warshall | O(V³) |
| 0-1 weights | 0-1 BFS | O(V+E) |
| Heuristic-guided (grid, map) | A* | O(E log V) |

---

## Table of Contents

1. [Dijkstra's Algorithm — Single Source](#1-dijkstras-algorithm--single-source)
2. [Dijkstra's — Print Shortest Path](#2-dijkstras--print-shortest-path)
3. [Dijkstra's — On Grid](#3-dijkstras--on-grid)
4. [Dijkstra's — Modified (K stops)](#4-dijkstras--modified-k-stops)
5. [Bellman-Ford — Single Source](#5-bellman-ford--single-source)
6. [Bellman-Ford — Negative Cycle Detection](#6-bellman-ford--negative-cycle-detection)
7. [SPFA — Bellman-Ford with Queue](#7-spfa--bellman-ford-with-queue)
8. [Floyd-Warshall — All Pairs](#8-floyd-warshall--all-pairs)
9. [Floyd-Warshall — Path Reconstruction](#9-floyd-warshall--path-reconstruction)
10. [Floyd-Warshall — Negative Cycle Detection](#10-floyd-warshall--negative-cycle-detection)
11. [Floyd-Warshall — Transitive Closure](#11-floyd-warshall--transitive-closure)
12. [A* Search](#12-a-search)
13. [Network Delay Time](#13-network-delay-time)
14. [Cheapest Flights Within K Stops](#14-cheapest-flights-within-k-stops)
15. [Path with Minimum Effort (Grid)](#15-path-with-minimum-effort-grid)
16. [Longest Path in DAG](#16-longest-path-in-dag)

---

## 1. Dijkstra's Algorithm — Single Source

### Problem

Find shortest distances from a source to **all other nodes** in a graph with **non-negative edge weights**.

**Algorithm:**
- Use a min-heap (priority queue): always process the closest unvisited node
- Relax all outgoing edges, update distances if shorter path found
- Once a node is popped and processed, its distance is final

**Greedy correctness:** With non-negative weights, the first time a node is popped from the min-heap, we have the shortest path to it.

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

typedef pair<int,int> pii;  // {distance, node}

vector<int> dijkstra(int src, int n, vector<vector<pii>>& adj) {
    vector<int> dist(n, INT_MAX);
    priority_queue<pii, vector<pii>, greater<pii>> pq;  // min-heap

    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();

        // Lazy deletion: skip if we already found a better path
        if (d > dist[u]) continue;

        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}

int main() {
    int n = 5;
    vector<vector<pii>> adj(n);
    // Directed weighted edges
    auto addEdge = [&](int u, int v, int w) { adj[u].push_back({v, w}); };
    addEdge(0,1,4); addEdge(0,2,1); addEdge(2,1,2);
    addEdge(1,3,1); addEdge(2,3,5); addEdge(3,4,3);

    auto dist = dijkstra(0, n, adj);
    for (int i = 0; i < n; i++)
        cout << "dist[" << i << "] = " << dist[i] << "\n";
    // 0:0, 1:3 (0→2→1), 2:1, 3:4, 4:7
}
```

---

## 2. Dijkstra's — Print Shortest Path

### Problem

Same as above, but also reconstruct the actual path from source to a target.

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

typedef pair<int,int> pii;

pair<vector<int>, vector<int>> dijkstraPath(int src, int n, vector<vector<pii>>& adj) {
    vector<int> dist(n, INT_MAX), parent(n, -1);
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;

        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                parent[v] = u;
                pq.push({dist[v], v});
            }
        }
    }
    return {dist, parent};
}

vector<int> getPath(int src, int dst, vector<int>& parent) {
    vector<int> path;
    for (int v = dst; v != -1; v = parent[v]) path.push_back(v);
    reverse(path.begin(), path.end());
    if (path[0] != src) return {};  // unreachable
    return path;
}

int main() {
    int n = 5;
    vector<vector<pii>> adj(n);
    adj[0].push_back({1,4}); adj[0].push_back({2,1});
    adj[2].push_back({1,2}); adj[1].push_back({3,1});
    adj[3].push_back({4,3});

    auto [dist, parent] = dijkstraPath(0, n, adj);
    auto path = getPath(0, 4, parent);
    cout << "Distance 0→4: " << dist[4] << "\n";  // 7
    cout << "Path: ";
    for (int x : path) cout << x << " ";  // 0 2 1 3 4
    cout << "\n";
}
```

---

## 3. Dijkstra's — On Grid

### Problem

Find shortest path on a weighted grid from top-left to bottom-right, moving in 4 directions. Grid values are movement costs.

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

int dijkstraGrid(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<vector<int>> dist(m, vector<int>(n, INT_MAX));
    // {cost, row, col}
    priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, greater<>> pq;

    dist[0][0] = grid[0][0];
    pq.push({grid[0][0], 0, 0});

    int dirs[4][2] = {{0,1},{0,-1},{1,0},{-1,0}};
    while (!pq.empty()) {
        auto [d, r, c] = pq.top(); pq.pop();
        if (d > dist[r][c]) continue;
        if (r == m-1 && c == n-1) return d;

        for (auto& dir : dirs) {
            int nr = r + dir[0], nc = c + dir[1];
            if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                int nd = dist[r][c] + grid[nr][nc];
                if (nd < dist[nr][nc]) {
                    dist[nr][nc] = nd;
                    pq.push({nd, nr, nc});
                }
            }
        }
    }
    return dist[m-1][n-1];
}

int main() {
    vector<vector<int>> g = {{1,3,1},{1,5,1},{4,2,1}};
    cout << dijkstraGrid(g) << "\n";  // 7 (same as min path sum here)
}
```

---

## 4. Dijkstra's — Modified (K Stops)

### Problem

Cheapest flight from `src` to `dst` with **at most k stops** (k+1 edges). Edges have costs.

**Modified Dijkstra with state `(cost, node, stops_remaining)`:** Don't do lazy deletion by cost alone — must consider stops too.

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    vector<vector<pair<int,int>>> adj(n);
    for (auto& f : flights) adj[f[0]].push_back({f[1], f[2]});

    // {cost, node, hops_used}
    priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, greater<>> pq;
    // dist[node][hops] = min cost
    vector<vector<int>> dist(n, vector<int>(k+2, INT_MAX));

    dist[src][0] = 0;
    pq.push({0, src, 0});

    while (!pq.empty()) {
        auto [cost, u, hops] = pq.top(); pq.pop();
        if (u == dst) return cost;
        if (hops > k) continue;

        for (auto& [v, w] : adj[u]) {
            int newCost = cost + w;
            if (newCost < dist[v][hops+1]) {
                dist[v][hops+1] = newCost;
                pq.push({newCost, v, hops+1});
            }
        }
    }
    return -1;
}

int main() {
    // Bellman-Ford approach is actually cleaner — see problem 14
    vector<vector<int>> flights = {{0,1,100},{1,2,100},{0,2,500}};
    cout << findCheapestPrice(3, flights, 0, 2, 1) << "\n";  // 200 (0→1→2)
    cout << findCheapestPrice(3, flights, 0, 2, 0) << "\n";  // 500 (0→2 direct)
}
```

---

## 5. Bellman-Ford — Single Source

### Problem

Find shortest paths from source with **negative edge weights allowed** (but no negative cycles). Relax all edges `V-1` times.

**Why V-1 iterations?** The shortest path can have at most V-1 edges (in a V-node graph without cycles). Each iteration guarantees one more edge is correctly computed.

```cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

struct Edge { int u, v, w; };

// Returns distances. If negative cycle exists, returns empty.
vector<int> bellmanFord(int src, int n, vector<Edge>& edges) {
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;

    // Relax all edges V-1 times
    for (int iter = 0; iter < n-1; iter++) {
        bool updated = false;
        for (auto& e : edges) {
            if (dist[e.u] != INT_MAX && dist[e.u] + e.w < dist[e.v]) {
                dist[e.v] = dist[e.u] + e.w;
                updated = true;
            }
        }
        if (!updated) break;  // early termination
    }
    return dist;
}

int main() {
    int n = 5;
    vector<Edge> edges = {{0,1,6},{0,2,7},{1,2,8},{1,3,-4},{1,4,5},
                           {2,4,-3},{3,0,2},{4,3,7}};
    // Negative edges but no negative cycle
    auto dist = bellmanFord(0, n, edges);
    for (int i = 0; i < n; i++)
        cout << "dist[" << i << "] = " << (dist[i]==INT_MAX ? -1 : dist[i]) << "\n";
    // 0:0, 1:6, 2:7, 3:2, 4:4
}
```

---

## 6. Bellman-Ford — Negative Cycle Detection

### Problem

Detect if a graph contains a **negative cycle** (cycle with total weight < 0). If such a cycle is reachable from source, some distances become -∞.

**Detection:** After V-1 relaxations, do one more pass. If any distance still decreases → negative cycle exists.

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

struct Edge { int u, v, w; };

bool hasNegativeCycle(int src, int n, vector<Edge>& edges) {
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;

    for (int iter = 0; iter < n-1; iter++)
        for (auto& e : edges)
            if (dist[e.u] != INT_MAX && dist[e.u] + e.w < dist[e.v])
                dist[e.v] = dist[e.u] + e.w;

    // n-th iteration: any relaxation means negative cycle
    for (auto& e : edges)
        if (dist[e.u] != INT_MAX && dist[e.u] + e.w < dist[e.v])
            return true;
    return false;
}

// Find all nodes affected by negative cycle (dist = -inf)
vector<bool> negativeCycleNodes(int src, int n, vector<Edge>& edges) {
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;

    for (int iter = 0; iter < n-1; iter++)
        for (auto& e : edges)
            if (dist[e.u] != INT_MAX && dist[e.u] + e.w < dist[e.v])
                dist[e.v] = dist[e.u] + e.w;

    // BFS/DFS from any node that still relaxes
    vector<bool> inNegCycle(n, false);
    for (int iter = 0; iter < n; iter++) {
        for (auto& e : edges) {
            if (dist[e.u] != INT_MAX && dist[e.u] + e.w < dist[e.v]) {
                dist[e.v] = dist[e.u] + e.w;
                inNegCycle[e.v] = true;  // affected by negative cycle
            }
            if (inNegCycle[e.u]) inNegCycle[e.v] = true;  // propagate
        }
    }
    return inNegCycle;
}

int main() {
    // Negative cycle: 1→2→3→1 with total weight -1
    vector<Edge> edges = {{0,1,1},{1,2,2},{2,3,-4},{3,1,1}};
    cout << hasNegativeCycle(0, 4, edges) << "\n";  // 1 (has cycle)

    vector<Edge> edges2 = {{0,1,1},{1,2,2},{2,3,4},{3,1,1}};
    cout << hasNegativeCycle(0, 4, edges2) << "\n";  // 0 (no cycle)
}
```

---

## 7. SPFA — Bellman-Ford with Queue

### Problem

**Shortest Path Faster Algorithm:** Optimization of Bellman-Ford using a queue. Only re-add a node to the queue when its distance is updated. Average O(E), worst O(VE).

**Note:** SPFA can be slow in worst case (it's banned in some competitive programming because of anti-SPFA test cases). Dijkstra is preferred when weights are non-negative.

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

typedef pair<int,int> pii;

vector<int> spfa(int src, int n, vector<vector<pii>>& adj) {
    vector<int> dist(n, INT_MAX);
    vector<bool> inQueue(n, false);
    vector<int> relaxCount(n, 0);  // for negative cycle detection
    queue<int> q;

    dist[src] = 0;
    q.push(src);
    inQueue[src] = true;

    while (!q.empty()) {
        int u = q.front(); q.pop();
        inQueue[u] = false;

        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (!inQueue[v]) {
                    q.push(v);
                    inQueue[v] = true;
                    relaxCount[v]++;
                    if (relaxCount[v] >= n) {
                        // Negative cycle detected
                        return vector<int>();
                    }
                }
            }
        }
    }
    return dist;
}

int main() {
    int n = 4;
    vector<vector<pii>> adj(n);
    adj[0].push_back({1,1}); adj[1].push_back({2,-3});
    adj[2].push_back({3,2}); adj[0].push_back({3,5});

    auto dist = spfa(0, n, adj);
    for (int i = 0; i < n; i++)
        cout << "dist[" << i << "] = " << dist[i] << "\n";
    // 0:0, 1:1, 2:-2, 3:0
}
```

---

## 8. Floyd-Warshall — All Pairs

### Problem

Find shortest paths **between every pair** of vertices. Handles negative weights (not negative cycles).

**Key idea:** `dp[k][i][j]` = shortest path from `i` to `j` using only vertices `{0..k}` as intermediates.

```
if k is an intermediate node on shortest i→j path:
    dp[k][i][j] = dp[k-1][i][k] + dp[k-1][k][j]
else:
    dp[k][i][j] = dp[k-1][i][j]
```

Compressed to 2D since `dp[k]` only depends on `dp[k-1]`.

```cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

const int INF = 1e9;

// Returns dist matrix. dist[i][j] = shortest path i→j
vector<vector<int>> floydWarshall(int n, vector<vector<int>>& dist) {
    // Initialize: dist[i][j] = input edge weight, dist[i][i] = 0
    // dist[i][j] = INF if no direct edge

    // Try all intermediate nodes k
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (dist[i][k] != INF && dist[k][j] != INF)
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);

    return dist;
}

int main() {
    int n = 4;
    vector<vector<int>> dist(n, vector<int>(n, INF));
    for (int i = 0; i < n; i++) dist[i][i] = 0;

    // Add edges: {u, v, weight}
    auto addEdge = [&](int u, int v, int w) { dist[u][v] = w; };
    addEdge(0,1,3); addEdge(0,3,7); addEdge(1,0,8);
    addEdge(1,2,2); addEdge(2,0,5); addEdge(2,3,1);
    addEdge(3,0,2);

    floydWarshall(n, dist);

    cout << "All-pairs shortest distances:\n";
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++)
            cout << (dist[i][j]==INF ? -1 : dist[i][j]) << "\t";
        cout << "\n";
    }
}
```

---

## 9. Floyd-Warshall — Path Reconstruction

### Problem

Same as Floyd-Warshall but also reconstruct the actual path between any two pairs.

```cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

const int INF = 1e9;

void floydWarshallPath(int n, vector<vector<int>>& dist, vector<vector<int>>& next) {
    // Initialize next[i][j] = j if direct edge exists, else -1
    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][k] != INF && dist[k][j] != INF
                    && dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    next[i][j] = next[i][k];  // go through k first
                }
            }
        }
    }
}

vector<int> getPath(int u, int v, vector<vector<int>>& next) {
    if (next[u][v] == -1) return {};  // no path
    vector<int> path = {u};
    while (u != v) {
        u = next[u][v];
        path.push_back(u);
    }
    return path;
}

int main() {
    int n = 4;
    const int INF = 1e9;
    vector<vector<int>> dist(n, vector<int>(n, INF));
    vector<vector<int>> next(n, vector<int>(n, -1));
    for (int i = 0; i < n; i++) { dist[i][i] = 0; next[i][i] = i; }

    auto addEdge = [&](int u, int v, int w) {
        dist[u][v] = w; next[u][v] = v;
    };
    addEdge(0,1,3); addEdge(0,3,7); addEdge(1,2,2); addEdge(2,3,1); addEdge(3,0,2);

    floydWarshallPath(n, dist, next);

    auto path = getPath(0, 3, next);
    cout << "Path 0→3: ";
    for (int x : path) cout << x << " ";  // 0 1 2 3
    cout << "\nDistance: " << dist[0][3] << "\n";  // 6
}
```

---

## 10. Floyd-Warshall — Negative Cycle Detection

### Problem

After running Floyd-Warshall, check for negative cycles. A negative cycle exists if **any diagonal element** `dist[i][i] < 0`.

```cpp
#include <iostream>
#include <vector>
using namespace std;

bool hasNegativeCycleFW(int n, vector<vector<int>>& dist) {
    const int INF = 1e9;
    // Run Floyd-Warshall
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (dist[i][k] != INF && dist[k][j] != INF)
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);

    // Check diagonal: negative self-loop means negative cycle
    for (int i = 0; i < n; i++)
        if (dist[i][i] < 0) return true;
    return false;
}

int main() {
    int n = 3;
    const int INF = 1e9;
    vector<vector<int>> dist(n, vector<int>(n, INF));
    for (int i = 0; i < n; i++) dist[i][i] = 0;

    // Cycle 0→1→2→0 with negative total
    dist[0][1] = 1; dist[1][2] = -3; dist[2][0] = 1;   // total: -1

    cout << hasNegativeCycleFW(n, dist) << "\n";  // 1 (negative cycle)
}
```

---

## 11. Floyd-Warshall — Transitive Closure

### Problem

Determine if there is **any path** (ignoring weights) from vertex i to vertex j.

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<vector<bool>> transitiveClosure(int n, vector<vector<bool>>& reach) {
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                reach[i][j] = reach[i][j] || (reach[i][k] && reach[k][j]);
    return reach;
}

int main() {
    int n = 4;
    vector<vector<bool>> reach(n, vector<bool>(n, false));
    for (int i = 0; i < n; i++) reach[i][i] = true;
    reach[0][1] = reach[1][2] = reach[2][3] = true;

    transitiveClosure(n, reach);
    // Can 0 reach 3?
    cout << reach[0][3] << "\n";  // 1 (yes)
    cout << reach[3][0] << "\n";  // 0 (no)
}
```

---

## 12. A* Search

### Problem

Find the shortest path from source to target in a graph/grid using a **heuristic** to guide the search. Faster than Dijkstra when a good heuristic is available.

**Heuristic h(n):** Estimated cost from node n to target. Must be **admissible** (never overestimate).
- Grid: Manhattan distance (4-dir), Euclidean (8-dir or continuous)

**f(n) = g(n) + h(n)** where g = actual cost from source.

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <cmath>
#include <climits>
using namespace std;

// Manhattan heuristic for grid
int heuristic(int r, int c, int tr, int tc) {
    return abs(r - tr) + abs(c - tc);
}

// Returns min cost or -1 if unreachable
int aStar(vector<vector<int>>& grid, int sr, int sc, int tr, int tc) {
    int m = grid.size(), n = grid[0].size();
    vector<vector<int>> g(m, vector<int>(n, INT_MAX));  // actual cost
    // {f=g+h, g_cost, row, col}
    priority_queue<tuple<int,int,int,int>, vector<tuple<int,int,int,int>>, greater<>> pq;

    g[sr][sc] = 0;
    pq.push({heuristic(sr, sc, tr, tc), 0, sr, sc});

    int dirs[4][2] = {{0,1},{0,-1},{1,0},{-1,0}};
    while (!pq.empty()) {
        auto [f, gCost, r, c] = pq.top(); pq.pop();

        if (r == tr && c == tc) return gCost;
        if (gCost > g[r][c]) continue;  // stale entry

        for (auto& d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0||nr >= m||nc < 0||nc >= n||grid[nr][nc] == -1) continue;
            int ng = gCost + grid[nr][nc];
            if (ng < g[nr][nc]) {
                g[nr][nc] = ng;
                pq.push({ng + heuristic(nr, nc, tr, tc), ng, nr, nc});
            }
        }
    }
    return -1;
}

int main() {
    // Grid costs (all 1 = unweighted), -1 = wall
    vector<vector<int>> grid = {{1,1,1},{1,-1,1},{1,1,1}};
    cout << aStar(grid, 0, 0, 2, 2) << "\n";  // 4 (detour around wall)
}
```

---

## 13. Network Delay Time

### Problem

`n` nodes, `times[i] = {u, v, w}` (directed weighted edges). Signal sent from `k`. Find the time for **all nodes to receive** the signal, or -1 if impossible.

**= Dijkstra + check if all nodes reached.**

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

int networkDelayTime(vector<vector<int>>& times, int n, int k) {
    vector<vector<pair<int,int>>> adj(n+1);
    for (auto& t : times) adj[t[0]].push_back({t[1], t[2]});

    vector<int> dist(n+1, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    dist[k] = 0;
    pq.push({0, k});

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;
        for (auto& [v, w] : adj[u])
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
    }

    int maxDist = 0;
    for (int i = 1; i <= n; i++) {
        if (dist[i] == INT_MAX) return -1;
        maxDist = max(maxDist, dist[i]);
    }
    return maxDist;
}

int main() {
    vector<vector<int>> times = {{2,1,1},{2,3,1},{3,4,1}};
    cout << networkDelayTime(times, 4, 2) << "\n";  // 2
}
```

---

## 14. Cheapest Flights Within K Stops

### Problem

Find the cheapest price from `src` to `dst` with **at most k stops** (= k+1 edges). Return -1 if no such route.

**Best approach: Modified Bellman-Ford with exactly k+1 iterations.**

```cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    vector<int> prev(n, INT_MAX), curr(n, INT_MAX);
    prev[src] = 0;

    // Run exactly k+1 relaxation rounds (= k stops = k+1 edges)
    for (int i = 0; i <= k; i++) {
        curr = prev;  // start from previous state, don't use edges from same round
        for (auto& f : flights) {
            int u = f[0], v = f[1], w = f[2];
            if (prev[u] != INT_MAX && prev[u] + w < curr[v])
                curr[v] = prev[u] + w;
        }
        prev = curr;
    }
    return curr[dst] == INT_MAX ? -1 : curr[dst];
}

int main() {
    vector<vector<int>> f1 = {{0,1,100},{1,2,100},{0,2,500}};
    cout << findCheapestPrice(3, f1, 0, 2, 1) << "\n";  // 200 (0→1→2)
    cout << findCheapestPrice(3, f1, 0, 2, 0) << "\n";  // 500 (0→2 direct)

    vector<vector<int>> f2 = {{0,1,1},{0,2,5},{1,2,1},{1,3,5},{2,3,1}};
    cout << findCheapestPrice(4, f2, 0, 3, 1) << "\n";  // 6 (0→2→3 has 1 stop)
}
```

---

## 15. Path with Minimum Effort

### Problem

In a grid where `heights[i][j]` = height, the **effort** of a path = maximum absolute difference in heights between consecutive cells. Find the path from top-left to bottom-right with **minimum effort**.

**Approach: Dijkstra where edge weight = |height diff|, and we minimize the max weight.**

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
#include <cmath>
using namespace std;

int minimumEffortPath(vector<vector<int>>& heights) {
    int m = heights.size(), n = heights[0].size();
    vector<vector<int>> effort(m, vector<int>(n, INT_MAX));
    // {effort_so_far, row, col}
    priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, greater<>> pq;

    effort[0][0] = 0;
    pq.push({0, 0, 0});

    int dirs[4][2] = {{0,1},{0,-1},{1,0},{-1,0}};
    while (!pq.empty()) {
        auto [eff, r, c] = pq.top(); pq.pop();
        if (r == m-1 && c == n-1) return eff;
        if (eff > effort[r][c]) continue;

        for (auto& d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr < 0||nr >= m||nc < 0||nc >= n) continue;
            int newEff = max(eff, abs(heights[r][c] - heights[nr][nc]));
            if (newEff < effort[nr][nc]) {
                effort[nr][nc] = newEff;
                pq.push({newEff, nr, nc});
            }
        }
    }
    return 0;
}

// Alternative: Binary search on answer + BFS check
bool canReach(vector<vector<int>>& h, int maxEff) {
    int m = h.size(), n = h[0].size();
    vector<vector<bool>> vis(m, vector<bool>(n, false));
    queue<pair<int,int>> q;
    q.push({0,0}); vis[0][0] = true;
    int dirs[4][2] = {{0,1},{0,-1},{1,0},{-1,0}};
    while (!q.empty()) {
        auto [r,c] = q.front(); q.pop();
        if (r==m-1 && c==n-1) return true;
        for (auto& d : dirs) {
            int nr=r+d[0], nc=c+d[1];
            if (nr>=0&&nr<m&&nc>=0&&nc<n && !vis[nr][nc]
                && abs(h[r][c]-h[nr][nc]) <= maxEff) {
                vis[nr][nc] = true; q.push({nr,nc});
            }
        }
    }
    return false;
}

int minimumEffortBinSearch(vector<vector<int>>& heights) {
    int lo = 0, hi = 1e6, ans = hi;
    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (canReach(heights, mid)) { ans = mid; hi = mid-1; }
        else lo = mid+1;
    }
    return ans;
}

int main() {
    vector<vector<int>> h1 = {{1,2,2},{3,8,2},{5,3,5}};
    cout << minimumEffortPath(h1) << "\n";           // 2
    cout << minimumEffortBinSearch(h1) << "\n";      // 2

    vector<vector<int>> h2 = {{1,2,3},{3,8,4},{5,3,5}};
    cout << minimumEffortPath(h2) << "\n";           // 1
}
```

---

## 16. Longest Path in DAG

### Problem

Find the longest path in a **Directed Acyclic Graph** using topological sort + DP (relaxation in topological order instead of all pairs).

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

typedef pair<int,int> pii;

vector<int> longestPathDAG(int src, int n, vector<vector<pii>>& adj) {
    // Topological sort (Kahn's BFS)
    vector<int> indegree(n, 0);
    for (int u = 0; u < n; u++) for (auto& [v,w] : adj[u]) indegree[v]++;

    queue<int> q;
    for (int i = 0; i < n; i++) if (indegree[i] == 0) q.push(i);

    vector<int> dist(n, INT_MIN);
    dist[src] = 0;

    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (auto& [v, w] : adj[u]) {
            if (dist[u] != INT_MIN && dist[u] + w > dist[v])
                dist[v] = dist[u] + w;
            if (--indegree[v] == 0) q.push(v);
        }
    }
    return dist;
}

int main() {
    int n = 6;
    vector<vector<pii>> adj(n);
    adj[0].push_back({1,5}); adj[0].push_back({2,3});
    adj[1].push_back({3,6}); adj[1].push_back({2,2});
    adj[2].push_back({4,4}); adj[2].push_back({5,2}); adj[2].push_back({3,7});
    adj[3].push_back({5,1}); adj[3].push_back({4,-1});
    adj[4].push_back({5,-2});

    auto dist = longestPathDAG(0, n, adj);
    for (int i = 0; i < n; i++)
        cout << "dist[" << i << "] = " << (dist[i]==INT_MIN ? -1 : dist[i]) << "\n";
    // Longest path from source 0
}
```

---

## Algorithm Comparison

| | Dijkstra | Bellman-Ford | Floyd-Warshall |
|---|---|---|---|
| **Type** | Single source | Single source | All pairs |
| **Negative weights** | ✗ (breaks) | ✓ | ✓ |
| **Negative cycles** | ✗ | Detects | Detects (diagonal) |
| **Time** | O(E log V) | O(VE) | O(V³) |
| **Space** | O(V+E) | O(V+E) | O(V²) |
| **Dense graphs** | O(V²) w/ array | O(V³) worst | O(V³) |
| **Directed/undirected** | Both | Both | Both |
| **Path reconstruction** | parent[] array | parent[] array | next[][] matrix |

## Complexity Quick Reference

| Problem | Algorithm | Time | Space |
|---|---|---|---|
| Dijkstra (binary heap) | Single source | O(E log V) | O(V+E) |
| Dijkstra (Fibonacci heap) | Single source | O(E + V log V) | O(V+E) |
| Bellman-Ford | Single source | O(VE) | O(V) |
| SPFA | Single source | O(E) avg, O(VE) worst | O(V+E) |
| Floyd-Warshall | All pairs | O(V³) | O(V²) |
| A* | Single source | O(E log V) | O(V) |
| Network Delay | Dijkstra | O(E log V) | O(V+E) |
| K Stops | Bellman-Ford | O(k × E) | O(V) |
| Min Effort Path | Dijkstra/BinSearch | O(mn log mn) | O(mn) |
| Longest Path DAG | Topo+DP | O(V+E) | O(V) |
