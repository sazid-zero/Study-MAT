---
layout: docs
title: Graph Algorithms - BFS & DFS
permalink: /graph-traversal/
---

[⬅️ Back to Home]({{ '/' | relative_url }})

---
{% raw %}
# Graph Algorithms — Traversal: BFS & DFS

## Graph Representations

```cpp
// ---- Adjacency List (most common) ----
int n = 6;
vector<vector<int>> adj(n);         // unweighted
adj[0].push_back(1);
adj[1].push_back(0);

vector<vector<pair<int,int>>> wadj(n); // weighted: {neighbor, weight}
wadj[0].push_back({1, 5});

// ---- Adjacency Matrix ----
int mat[6][6] = {};   // mat[u][v] = weight (0 = no edge)

// ---- Edge List ----
struct Edge { int u, v, w; };
vector<Edge> edges;

// ---- Build from edge list ----
void buildAdj(int n, vector<Edge>& edges, bool directed = false) {
    vector<vector<pair<int,int>>> adj(n);
    for (auto& e : edges) {
        adj[e.u].push_back({e.v, e.w});
        if (!directed) adj[e.v].push_back({e.u, e.w});
    }
}
```

---


## Table of Contents

1. [BFS — Standard Graph Traversal](#1-bfs--standard-graph-traversal)
2. [BFS — Shortest Path in Unweighted Graph](#2-bfs--shortest-path-in-unweighted-graph)
3. [BFS — Multi-Source BFS](#3-bfs--multi-source-bfs)
4. [BFS — 0-1 BFS (Deque)](#4-bfs--0-1-bfs-deque)
5. [DFS — Recursive and Iterative](#5-dfs--recursive-and-iterative)
6. [DFS — Cycle Detection (Undirected)](#6-dfs--cycle-detection-undirected)
7. [DFS — Cycle Detection (Directed)](#7-dfs--cycle-detection-directed)
8. [DFS — Connected Components](#8-dfs--connected-components)
9. [DFS — Bipartite Check (2-Coloring)](#9-dfs--bipartite-check-2-coloring)
10. [DFS — Bridges and Articulation Points](#10-dfs--bridges-and-articulation-points)
11. [Kosaraju's Algorithm — Strongly Connected Components](#11-kosarajus-algorithm--strongly-connected-components)
12. [Tarjan's Algorithm — SCC + Bridges](#12-tarjans-algorithm--scc--bridges)
13. [Word Ladder — BFS Application](#13-word-ladder--bfs-application)
14. [Rotting Oranges — Multi-Source BFS](#14-rotting-oranges--multi-source-bfs)
15. [Number of Islands — DFS/BFS](#15-number-of-islands--dfsbfs)
16. [Flood Fill](#16-flood-fill)

---

## 1. BFS — Standard Graph Traversal

### Problem

Visit all nodes reachable from source in **level-by-level** order (FIFO queue).

**Key properties:**
- Visits nodes in order of distance from source
- Finds shortest path in unweighted graphs
- Time: O(V + E)

```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

// BFS from source; returns visited order
vector<int> bfs(int src, vector<vector<int>>& adj) {
    int n = adj.size();
    vector<bool> visited(n, false);
    queue<int> q;
    vector<int> order;

    visited[src] = true;
    q.push(src);

    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);

        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
    return order;
}

// BFS with level tracking
void bfsLevels(int src, vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> dist(n, -1);
    queue<int> q;
    dist[src] = 0;
    q.push(src);

    while (!q.empty()) {
        int u = q.front(); q.pop();
        cout << "Node " << u << " at level " << dist[u] << "\n";
        for (int v : adj[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                q.push(v);
            }
        }
    }
}

int main() {
    int n = 6;
    vector<vector<int>> adj(n);
    // 0-1-2-3, 0-4-5
    for (auto& [u,v] : vector<pair<int,int>>{{0,1},{1,2},{2,3},{0,4},{4,5}}) {
        adj[u].push_back(v); adj[v].push_back(u);
    }
    auto order = bfs(0, adj);
    for (int x : order) cout << x << " ";  // 0 1 4 2 5 3
    cout << "\n";
    bfsLevels(0, adj);
}
```

---

## 2. BFS — Shortest Path in Unweighted Graph

### Problem

Find the **shortest path** (minimum edges) from source to all other nodes. Also reconstruct the actual path.

```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <stack>
using namespace std;

// Returns {dist[], parent[]}
pair<vector<int>, vector<int>> shortestPath(int src, vector<vector<int>>& adj) {
    int n = adj.size();
    vector<int> dist(n, -1), parent(n, -1);
    queue<int> q;
    dist[src] = 0;
    q.push(src);

    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                parent[v] = u;
                q.push(v);
            }
        }
    }
    return {dist, parent};
}

// Reconstruct path from src to dst
vector<int> getPath(int src, int dst, vector<int>& parent) {
    if (parent[dst] == -1 && dst != src) return {};  // unreachable
    vector<int> path;
    for (int v = dst; v != -1; v = parent[v]) path.push_back(v);
    reverse(path.begin(), path.end());
    return path;
}

int main() {
    int n = 6;
    vector<vector<int>> adj(n);
    for (auto& [u,v] : vector<pair<int,int>>{{0,1},{1,2},{2,3},{0,4},{4,5},{5,3}}) {
        adj[u].push_back(v); adj[v].push_back(u);
    }
    auto [dist, parent] = shortestPath(0, adj);
    for (int i = 0; i < n; i++) cout << "dist[" << i << "] = " << dist[i] << "\n";

    auto path = getPath(0, 3, parent);
    for (int x : path) cout << x << " ";  // 0 4 5 3 (shorter than 0 1 2 3)
    cout << "\n";
}
```

---

## 3. BFS — Multi-Source BFS

### Problem

Start BFS simultaneously from **multiple sources**. Used when you need distance from the nearest source.

**Classic problems:** Rotting Oranges, walls-and-gates, distance to nearest 0.

```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

// Distance from each cell to nearest '1' source
vector<vector<int>> multiSourceBFS(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<vector<int>> dist(m, vector<int>(n, INT_MAX));
    queue<pair<int,int>> q;

    // Enqueue ALL sources simultaneously
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            if (grid[i][j] == 1) { dist[i][j] = 0; q.push({i,j}); }

    int dirs[4][2] = {{0,1},{0,-1},{1,0},{-1,0}};
    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        for (auto& d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < m && nc >= 0 && nc < n
                && dist[nr][nc] == INT_MAX) {
                dist[nr][nc] = dist[r][c] + 1;
                q.push({nr, nc});
            }
        }
    }
    return dist;
}

int main() {
    vector<vector<int>> g = {{0,0,0},{0,1,0},{0,0,0}};
    auto d = multiSourceBFS(g);
    for (auto& row : d) { for (int x : row) cout << x << " "; cout << "\n"; }
    // 2 1 2
    // 1 0 1
    // 2 1 2
}
```

---

## 4. BFS — 0-1 BFS (Deque)

### Problem

Shortest path in a graph where edge weights are either **0 or 1**. Use a deque: weight-0 edges push to front, weight-1 edges push to back. O(V + E) — better than Dijkstra's O(E log V) for this case.

```cpp
#include <iostream>
#include <vector>
#include <deque>
#include <climits>
using namespace std;

// adj: list of {neighbor, weight (0 or 1)}
vector<int> zeroOneBFS(int src, vector<vector<pair<int,int>>>& adj) {
    int n = adj.size();
    vector<int> dist(n, INT_MAX);
    deque<int> dq;

    dist[src] = 0;
    dq.push_back(src);

    while (!dq.empty()) {
        int u = dq.front(); dq.pop_front();
        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (w == 0) dq.push_front(v);   // weight-0: high priority
                else        dq.push_back(v);    // weight-1: normal priority
            }
        }
    }
    return dist;
}

int main() {
    int n = 4;
    vector<vector<pair<int,int>>> adj(n);
    // 0→1 (w=1), 1→2 (w=0), 0→3 (w=0), 3→2 (w=1)
    adj[0].push_back({1, 1}); adj[0].push_back({3, 0});
    adj[1].push_back({2, 0}); adj[3].push_back({2, 1});

    auto dist = zeroOneBFS(0, adj);
    for (int i = 0; i < n; i++) cout << "dist[" << i << "] = " << dist[i] << "\n";
    // 0→0=0, 0→1=1, 0→2=1 (via 0→3→1→2? or 0→3→2=1), 0→3=0
}
```

---

## 5. DFS — Recursive and Iterative

### Problem

Visit all reachable nodes by going as **deep as possible** before backtracking.

```cpp
#include <iostream>
#include <vector>
#include <stack>
using namespace std;

// Recursive DFS
void dfsRec(int u, vector<vector<int>>& adj, vector<bool>& visited,
            vector<int>& order) {
    visited[u] = true;
    order.push_back(u);
    for (int v : adj[u])
        if (!visited[v]) dfsRec(v, adj, visited, order);
}

vector<int> dfsRecursive(int src, vector<vector<int>>& adj) {
    int n = adj.size();
    vector<bool> visited(n, false);
    vector<int> order;
    dfsRec(src, adj, visited, order);
    return order;
}

// Iterative DFS (explicit stack)
// Note: iterative DFS visits in different order than recursive (right-to-left)
vector<int> dfsIterative(int src, vector<vector<int>>& adj) {
    int n = adj.size();
    vector<bool> visited(n, false);
    vector<int> order;
    stack<int> st;

    st.push(src);
    while (!st.empty()) {
        int u = st.top(); st.pop();
        if (visited[u]) continue;
        visited[u] = true;
        order.push_back(u);
        // Push in reverse so leftmost neighbor is processed first
        for (int i = adj[u].size()-1; i >= 0; i--)
            if (!visited[adj[u][i]]) st.push(adj[u][i]);
    }
    return order;
}

// DFS with timestamps (discovery/finish time) — useful for topo sort
vector<int> finish_order;
void dfsTimestamp(int u, vector<vector<int>>& adj, vector<bool>& visited) {
    visited[u] = true;
    for (int v : adj[u])
        if (!visited[v]) dfsTimestamp(v, adj, visited);
    finish_order.push_back(u);  // post-order
}

int main() {
    int n = 6;
    vector<vector<int>> adj(n);
    for (auto& [u,v] : vector<pair<int,int>>{{0,1},{1,2},{2,3},{0,4},{4,5}}) {
        adj[u].push_back(v); adj[v].push_back(u);
    }
    auto order = dfsRecursive(0, adj);
    for (int x : order) cout << x << " ";  // 0 1 2 3 4 5
    cout << "\n";
}
```

---

## 6. DFS — Cycle Detection (Undirected)

### Problem

Determine if an **undirected** graph contains a cycle.

**Method:** During DFS, if we reach an already-visited node that is **not the parent**, a cycle exists.

```cpp
#include <iostream>
#include <vector>
using namespace std;

bool hasCycleUndirected(int u, int parent, vector<vector<int>>& adj,
                         vector<bool>& visited) {
    visited[u] = true;
    for (int v : adj[u]) {
        if (!visited[v]) {
            if (hasCycleUndirected(v, u, adj, visited)) return true;
        } else if (v != parent) {
            return true;  // back edge found
        }
    }
    return false;
}

bool detectCycleUndirected(int n, vector<vector<int>>& adj) {
    vector<bool> visited(n, false);
    for (int i = 0; i < n; i++)
        if (!visited[i])
            if (hasCycleUndirected(i, -1, adj, visited)) return true;
    return false;
}

// BFS version with parent tracking
bool detectCycleBFS(int n, vector<vector<int>>& adj) {
    vector<bool> visited(n, false);
    for (int start = 0; start < n; start++) {
        if (visited[start]) continue;
        queue<pair<int,int>> q;  // {node, parent}
        q.push({start, -1});
        visited[start] = true;
        while (!q.empty()) {
            auto [u, par] = q.front(); q.pop();
            for (int v : adj[u]) {
                if (!visited[v]) { visited[v] = true; q.push({v, u}); }
                else if (v != par) return true;
            }
        }
    }
    return false;
}

int main() {
    int n = 4;
    vector<vector<int>> adj(n);
    // No cycle: 0-1-2-3
    for (auto& [u,v] : vector<pair<int,int>>{{0,1},{1,2},{2,3}}) {
        adj[u].push_back(v); adj[v].push_back(u);
    }
    cout << detectCycleUndirected(n, adj) << "\n";  // 0 (no cycle)

    adj[0].push_back(3); adj[3].push_back(0);  // add edge 0-3
    cout << detectCycleUndirected(n, adj) << "\n";  // 1 (cycle)
}
```

---

## 7. DFS — Cycle Detection (Directed)

### Problem

Detect a cycle in a **directed** graph.

**Method:** Track three states: unvisited (0), in current DFS stack (1), fully processed (2). A back edge (to a node currently in the stack) = cycle.

```cpp
#include <iostream>
#include <vector>
using namespace std;

// color: 0=white(unvisited), 1=gray(in stack), 2=black(done)
bool dfsCycleDirected(int u, vector<vector<int>>& adj, vector<int>& color) {
    color[u] = 1;  // gray: currently in DFS path
    for (int v : adj[u]) {
        if (color[v] == 1) return true;   // back edge → cycle
        if (color[v] == 0 && dfsCycleDirected(v, adj, color)) return true;
    }
    color[u] = 2;  // black: finished
    return false;
}

bool detectCycleDirected(int n, vector<vector<int>>& adj) {
    vector<int> color(n, 0);
    for (int i = 0; i < n; i++)
        if (color[i] == 0)
            if (dfsCycleDirected(i, adj, color)) return true;
    return false;
}

int main() {
    int n = 4;
    vector<vector<int>> adj(n);
    adj[0].push_back(1); adj[1].push_back(2);
    adj[2].push_back(3); adj[3].push_back(1);  // cycle: 1→2→3→1
    cout << detectCycleDirected(n, adj) << "\n";  // 1

    vector<vector<int>> adj2(4);
    adj2[0].push_back(1); adj2[0].push_back(2);
    adj2[1].push_back(3); adj2[2].push_back(3);
    cout << detectCycleDirected(4, adj2) << "\n";  // 0 (DAG)
}
```

---

## 8. DFS — Connected Components

### Problem

Find the number of **connected components** and the component each node belongs to.

```cpp
#include <iostream>
#include <vector>
using namespace std;

void dfsComponent(int u, int comp, vector<vector<int>>& adj,
                  vector<int>& component) {
    component[u] = comp;
    for (int v : adj[u])
        if (component[v] == -1) dfsComponent(v, comp, adj, component);
}

int connectedComponents(int n, vector<vector<int>>& adj, vector<int>& component) {
    component.assign(n, -1);
    int numComp = 0;
    for (int i = 0; i < n; i++)
        if (component[i] == -1) { dfsComponent(i, numComp++, adj, component); }
    return numComp;
}

int main() {
    int n = 7;
    vector<vector<int>> adj(n);
    // Component 0: 0-1-2,  Component 1: 3-4,  Component 2: 5-6
    for (auto& [u,v] : vector<pair<int,int>>{{0,1},{1,2},{3,4},{5,6}}) {
        adj[u].push_back(v); adj[v].push_back(u);
    }
    vector<int> comp;
    cout << connectedComponents(n, adj, comp) << "\n";  // 3
    for (int i = 0; i < n; i++) cout << "node " << i << " → comp " << comp[i] << "\n";
}
```

---

## 9. DFS — Bipartite Check (2-Coloring)

### Problem

Check if a graph is **bipartite**: nodes can be colored with 2 colors so no two adjacent nodes share a color. Equivalent to: no odd-length cycle.

```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

// BFS 2-coloring
bool isBipartiteBFS(int n, vector<vector<int>>& adj) {
    vector<int> color(n, -1);
    for (int start = 0; start < n; start++) {
        if (color[start] != -1) continue;
        queue<int> q;
        q.push(start);
        color[start] = 0;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : adj[u]) {
                if (color[v] == -1) {
                    color[v] = 1 - color[u];  // alternate color
                    q.push(v);
                } else if (color[v] == color[u]) {
                    return false;   // same color adjacent → not bipartite
                }
            }
        }
    }
    return true;
}

// DFS version
bool dfsBipartite(int u, int c, vector<vector<int>>& adj, vector<int>& color) {
    color[u] = c;
    for (int v : adj[u]) {
        if (color[v] == -1) {
            if (!dfsBipartite(v, 1-c, adj, color)) return false;
        } else if (color[v] == c) return false;
    }
    return true;
}

bool isBipartiteDFS(int n, vector<vector<int>>& adj) {
    vector<int> color(n, -1);
    for (int i = 0; i < n; i++)
        if (color[i] == -1 && !dfsBipartite(i, 0, adj, color)) return false;
    return true;
}

int main() {
    // Even cycle: bipartite
    vector<vector<int>> adj1(4);
    for (auto& [u,v] : vector<pair<int,int>>{{0,1},{1,2},{2,3},{3,0}}) {
        adj1[u].push_back(v); adj1[v].push_back(u);
    }
    cout << isBipartiteBFS(4, adj1) << "\n";  // 1 (bipartite)

    // Odd cycle: not bipartite
    vector<vector<int>> adj2(3);
    for (auto& [u,v] : vector<pair<int,int>>{{0,1},{1,2},{2,0}}) {
        adj2[u].push_back(v); adj2[v].push_back(u);
    }
    cout << isBipartiteBFS(3, adj2) << "\n";  // 0 (not bipartite)
}
```

---

## 10. DFS — Bridges and Articulation Points

### Problem

- **Bridge:** An edge whose removal increases the number of connected components.
- **Articulation Point:** A vertex whose removal increases the number of connected components.

**Method (Tarjan's low-link):** Track `disc[u]` (discovery time) and `low[u]` (lowest disc reachable via subtree + one back edge).
- **Bridge:** edge `(u,v)` is a bridge if `low[v] > disc[u]`
- **Articulation Point:** vertex `u` is AP if `low[v] >= disc[u]` for any child `v` (and root has 2+ children)

```cpp
#include <iostream>
#include <vector>
using namespace std;

int timer_g = 0;

void dfs(int u, int parent, vector<vector<int>>& adj,
         vector<int>& disc, vector<int>& low,
         vector<bool>& isAP, vector<pair<int,int>>& bridges) {
    disc[u] = low[u] = timer_g++;
    int children = 0;

    for (int v : adj[u]) {
        if (disc[v] == -1) {  // tree edge
            children++;
            dfs(v, u, adj, disc, low, isAP, bridges);
            low[u] = min(low[u], low[v]);

            // Bridge condition
            if (low[v] > disc[u]) bridges.push_back({u, v});

            // Articulation point condition
            if (parent == -1 && children > 1) isAP[u] = true;
            if (parent != -1 && low[v] >= disc[u]) isAP[u] = true;

        } else if (v != parent) {  // back edge
            low[u] = min(low[u], disc[v]);
        }
    }
}

void findBridgesAndAPs(int n, vector<vector<int>>& adj) {
    vector<int> disc(n, -1), low(n);
    vector<bool> isAP(n, false);
    vector<pair<int,int>> bridges;
    timer_g = 0;

    for (int i = 0; i < n; i++)
        if (disc[i] == -1) dfs(i, -1, adj, disc, low, isAP, bridges);

    cout << "Bridges: ";
    for (auto& [u,v] : bridges) cout << u << "-" << v << " ";
    cout << "\nArticulation Points: ";
    for (int i = 0; i < n; i++) if (isAP[i]) cout << i << " ";
    cout << "\n";
}

int main() {
    int n = 5;
    vector<vector<int>> adj(n);
    for (auto& [u,v] : vector<pair<int,int>>{{0,1},{1,2},{2,0},{1,3},{3,4}}) {
        adj[u].push_back(v); adj[v].push_back(u);
    }
    findBridgesAndAPs(n, adj);
    // Bridges: 1-3 3-4
    // Articulation Points: 1 3
}
```

---

## 11. Kosaraju's Algorithm — Strongly Connected Components

### Problem

Find all **Strongly Connected Components** (SCC) in a directed graph. SCC = maximal set of vertices so every vertex is reachable from every other.

**Steps:**
1. Run DFS on original graph, push nodes to stack in finish order
2. Transpose the graph (reverse all edges)
3. Pop from stack, run DFS on transposed graph — each DFS tree = one SCC

```cpp
#include <iostream>
#include <vector>
#include <stack>
using namespace std;

void dfs1(int u, vector<vector<int>>& adj, vector<bool>& vis, stack<int>& st) {
    vis[u] = true;
    for (int v : adj[u]) if (!vis[v]) dfs1(v, adj, vis, st);
    st.push(u);
}

void dfs2(int u, int comp, vector<vector<int>>& radj, vector<bool>& vis, vector<int>& scc) {
    vis[u] = true; scc[u] = comp;
    for (int v : radj[u]) if (!vis[v]) dfs2(v, comp, radj, vis, scc);
}

int kosaraju(int n, vector<vector<int>>& adj, vector<int>& scc) {
    // Step 1: DFS and fill stack by finish time
    vector<bool> vis(n, false);
    stack<int> st;
    for (int i = 0; i < n; i++) if (!vis[i]) dfs1(i, adj, vis, st);

    // Step 2: Build reversed graph
    vector<vector<int>> radj(n);
    for (int u = 0; u < n; u++) for (int v : adj[u]) radj[v].push_back(u);

    // Step 3: DFS on reversed graph in finish-time order
    fill(vis.begin(), vis.end(), false);
    scc.assign(n, -1);
    int numSCC = 0;
    while (!st.empty()) {
        int u = st.top(); st.pop();
        if (!vis[u]) dfs2(u, numSCC++, radj, vis, scc);
    }
    return numSCC;
}

int main() {
    int n = 5;
    vector<vector<int>> adj(n);
    adj[0].push_back(1); adj[1].push_back(2);
    adj[2].push_back(0); adj[1].push_back(3);
    adj[3].push_back(4);
    // SCC: {0,1,2}, {3}, {4}

    vector<int> scc;
    cout << kosaraju(n, adj, scc) << " SCCs\n";  // 3
    for (int i = 0; i < n; i++) cout << "node " << i << " → SCC " << scc[i] << "\n";
}
```

---

## 12. Tarjan's Algorithm — SCC + Bridges

### Problem

Single-pass DFS algorithm to find all SCCs. Uses a stack and low-link values.

**When to use Tarjan's vs Kosaraju's:**
- Tarjan: single DFS pass, slightly more complex
- Kosaraju: two DFS passes, simpler to implement and remember

```cpp
#include <iostream>
#include <vector>
#include <stack>
using namespace std;

int tarjan_timer = 0;

void tarjanDFS(int u, vector<vector<int>>& adj, vector<int>& disc, vector<int>& low,
               vector<bool>& onStack, stack<int>& st, vector<int>& scc, int& numSCC) {
    disc[u] = low[u] = tarjan_timer++;
    st.push(u); onStack[u] = true;

    for (int v : adj[u]) {
        if (disc[v] == -1) {
            tarjanDFS(v, adj, disc, low, onStack, st, scc, numSCC);
            low[u] = min(low[u], low[v]);
        } else if (onStack[v]) {
            low[u] = min(low[u], disc[v]);  // back edge within SCC
        }
    }

    // Root of SCC: pop the entire SCC from stack
    if (low[u] == disc[u]) {
        while (true) {
            int v = st.top(); st.pop();
            onStack[v] = false;
            scc[v] = numSCC;
            if (v == u) break;
        }
        numSCC++;
    }
}

int tarjanSCC(int n, vector<vector<int>>& adj, vector<int>& scc) {
    vector<int> disc(n, -1), low(n);
    vector<bool> onStack(n, false);
    stack<int> st;
    scc.assign(n, -1);
    int numSCC = 0;
    tarjan_timer = 0;

    for (int i = 0; i < n; i++)
        if (disc[i] == -1) tarjanDFS(i, adj, disc, low, onStack, st, scc, numSCC);
    return numSCC;
}

int main() {
    int n = 5;
    vector<vector<int>> adj(n);
    adj[0].push_back(1); adj[1].push_back(2);
    adj[2].push_back(0); adj[1].push_back(3); adj[3].push_back(4);

    vector<int> scc;
    cout << tarjanSCC(n, adj, scc) << " SCCs\n";  // 3
    for (int i = 0; i < n; i++) cout << "node " << i << " → SCC " << scc[i] << "\n";
}
```

---

## 13. Word Ladder — BFS Application

### Problem

Given `beginWord`, `endWord`, and `wordList`, find the **length of the shortest transformation sequence** (each step changes one letter, each intermediate word must be in the dictionary).

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <unordered_set>
#include <queue>
using namespace std;

int ladderLength(string begin, string end, vector<string>& wordList) {
    unordered_set<string> wordSet(wordList.begin(), wordList.end());
    if (!wordSet.count(end)) return 0;

    queue<string> q;
    q.push(begin);
    wordSet.erase(begin);
    int level = 1;

    while (!q.empty()) {
        int sz = q.size();
        level++;
        while (sz--) {
            string word = q.front(); q.pop();
            for (int i = 0; i < (int)word.size(); i++) {
                char orig = word[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    if (c == orig) continue;
                    word[i] = c;
                    if (word == end) return level;
                    if (wordSet.count(word)) {
                        wordSet.erase(word);
                        q.push(word);
                    }
                    word[i] = orig;
                }
            }
        }
    }
    return 0;
}

// Bidirectional BFS — significantly faster in practice
int ladderLengthBi(string begin, string end, vector<string>& wordList) {
    unordered_set<string> wordSet(wordList.begin(), wordList.end());
    if (!wordSet.count(end)) return 0;

    unordered_set<string> front = {begin}, back = {end};
    int level = 1;

    while (!front.empty() && !back.empty()) {
        // Always expand the smaller set
        if (front.size() > back.size()) swap(front, back);
        unordered_set<string> next;
        level++;
        for (string word : front) {
            for (int i = 0; i < (int)word.size(); i++) {
                char orig = word[i];
                for (char c = 'a'; c <= 'z'; c++) {
                    word[i] = c;
                    if (back.count(word)) return level;
                    if (wordSet.count(word)) {
                        wordSet.erase(word);
                        next.insert(word);
                    }
                    word[i] = orig;
                }
            }
        }
        front = next;
    }
    return 0;
}

int main() {
    vector<string> wl = {"hot","dot","dog","lot","log","cog"};
    cout << ladderLength("hit", "cog", wl) << "\n";    // 5
    cout << ladderLengthBi("hit", "cog", wl) << "\n";  // 5
}
```

---

## 14. Rotting Oranges — Multi-Source BFS

### Problem

A grid has fresh (1), rotten (2), or empty (0) oranges. Every minute, rotten oranges infect adjacent fresh ones. Return minutes until no fresh orange remains, or -1 if impossible.

```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

int orangesRotting(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    queue<pair<int,int>> q;
    int fresh = 0;

    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == 2) q.push({i, j});  // source
            else if (grid[i][j] == 1) fresh++;
        }

    if (fresh == 0) return 0;

    int dirs[4][2] = {{0,1},{0,-1},{1,0},{-1,0}};
    int time = 0;

    while (!q.empty() && fresh > 0) {
        int sz = q.size();
        time++;
        while (sz--) {
            auto [r, c] = q.front(); q.pop();
            for (auto& d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == 1) {
                    grid[nr][nc] = 2;
                    fresh--;
                    q.push({nr, nc});
                }
            }
        }
    }
    return fresh == 0 ? time : -1;
}

int main() {
    vector<vector<int>> g1 = {{2,1,1},{1,1,0},{0,1,1}};
    cout << orangesRotting(g1) << "\n";  // 4

    vector<vector<int>> g2 = {{2,1,1},{0,1,1},{1,0,1}};
    cout << orangesRotting(g2) << "\n";  // -1 (bottom-left isolated)
}
```

---

## 15. Number of Islands — DFS/BFS

### Problem

Count connected components of `'1'` cells in a binary grid.

```cpp
#include <iostream>
#include <vector>
using namespace std;

void dfsIsland(vector<vector<char>>& grid, int i, int j) {
    int m = grid.size(), n = grid[0].size();
    if (i<0||i>=m||j<0||j>=n||grid[i][j]!='1') return;
    grid[i][j] = '0';  // mark visited
    dfsIsland(grid, i+1, j); dfsIsland(grid, i-1, j);
    dfsIsland(grid, i, j+1); dfsIsland(grid, i, j-1);
}

int numIslands(vector<vector<char>>& grid) {
    int count = 0;
    for (int i = 0; i < (int)grid.size(); i++)
        for (int j = 0; j < (int)grid[0].size(); j++)
            if (grid[i][j] == '1') { dfsIsland(grid, i, j); count++; }
    return count;
}

int main() {
    vector<vector<char>> g = {{'1','1','0','0'},{'1','1','0','0'},
                               {'0','0','1','0'},{'0','0','0','1'}};
    cout << numIslands(g) << "\n";  // 3
}
```

---

## 16. Flood Fill

### Problem

Starting from pixel `(sr, sc)`, replace all connected pixels of the same color with a new color (4-directional).

```cpp
#include <iostream>
#include <vector>
using namespace std;

void fill(vector<vector<int>>& img, int r, int c, int orig, int newColor) {
    if (r<0||r>=(int)img.size()||c<0||c>=(int)img[0].size()) return;
    if (img[r][c] != orig || img[r][c] == newColor) return;
    img[r][c] = newColor;
    fill(img, r+1, c, orig, newColor); fill(img, r-1, c, orig, newColor);
    fill(img, r, c+1, orig, newColor); fill(img, r, c-1, orig, newColor);
}

vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
    int orig = image[sr][sc];
    if (orig != color) fill(image, sr, sc, orig, color);
    return image;
}

int main() {
    vector<vector<int>> img = {{1,1,1},{1,1,0},{1,0,1}};
    auto res = floodFill(img, 1, 1, 2);
    for (auto& row : res) { for (int x : row) cout << x << " "; cout << "\n"; }
    // 2 2 2
    // 2 2 0
    // 2 0 1
}
```

---

## BFS vs DFS — Decision Guide

| Scenario | Algorithm | Reason |
|---|---|---|
| Shortest path (unweighted) | BFS | Level-by-level expansion |
| Detect cycle (undirected) | DFS or BFS | Back edge check |
| Detect cycle (directed) | DFS (3-color) | Back edge in current path |
| Connected components | DFS | Simple recursive flood |
| Topological sort | DFS (finish order) or BFS (Kahn's) | Both work |
| SCCs in directed graph | Kosaraju or Tarjan | DFS-based |
| Bipartite check | BFS (2-color) | Level-by-level coloring |
| Bridges/Articulation Points | DFS (Tarjan's low-link) | Discovery + low time |
| All paths (exploration) | DFS | Backtracking |
| Maze solving (shortest) | BFS | Level = steps |
| 0-1 weighted path | 0-1 BFS (deque) | O(V+E) vs O(E log V) |

## Complexity Quick Reference

| Algorithm | Time | Space | Notes |
|---|---|---|---|
| BFS | O(V+E) | O(V) | Queue + visited |
| DFS | O(V+E) | O(V) | Stack (recursion) |
| 0-1 BFS | O(V+E) | O(V) | Deque |
| Multi-source BFS | O(V+E) | O(V) | All sources enqueued initially |
| Bridges/APs | O(V+E) | O(V) | Tarjan low-link |
| Kosaraju SCC | O(V+E) | O(V) | 2 DFS passes |
| Tarjan SCC | O(V+E) | O(V) | 1 DFS pass |
| Word Ladder BFS | O(N × L²) | O(N × L) | N=words, L=word length |

{% endraw %}
