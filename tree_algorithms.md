---
layout: docs
title: Tree Algorithms
permalink: /tree-algorithms/
---

[⬅️ Back to Home]({{ '/' | relative_url }})

---
{% raw %}
# Tree Algorithms

## Node Definitions

```cpp
// Binary Tree Node
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

// Trie Node
struct TrieNode {
    TrieNode* children[26] = {};
    bool isEnd = false;
};
```

---


## Table of Contents

1. [Inorder Traversal (recursive + iterative + Morris)](#1-inorder-traversal)
2. [Preorder Traversal](#2-preorder-traversal)
3. [Postorder Traversal](#3-postorder-traversal)
4. [Level Order Traversal (BFS)](#4-level-order-traversal-bfs)
5. [Zigzag Level Order](#5-zigzag-level-order)
6. [Vertical Order Traversal](#6-vertical-order-traversal)
7. [LCA — Binary Tree (DFS)](#7-lca--binary-tree-dfs)
8. [LCA — Binary Search Tree](#8-lca--binary-search-tree)
9. [LCA — Binary Lifting (O(log n) queries)](#9-lca--binary-lifting-olog-n-queries)
10. [BST — Insert, Search, Delete](#10-bst--insert-search-delete)
11. [BST — Validate](#11-bst--validate)
12. [BST — Kth Smallest / Largest](#12-bst--kth-smallest--largest)
13. [BST — Floor and Ceil](#13-bst--floor-and-ceil)
14. [BST — Convert Sorted Array to BST](#14-bst--convert-sorted-array-to-bst)
15. [Segment Tree — Build, Query, Update (Point)](#15-segment-tree--build-query-update-point)
16. [Segment Tree — Range Update (Lazy Propagation)](#16-segment-tree--range-update-lazy-propagation)
17. [Fenwick Tree / BIT — Point Update, Prefix Sum](#17-fenwick-tree--bit--point-update-prefix-sum)
18. [Fenwick Tree — Range Update, Range Query](#18-fenwick-tree--range-update-range-query)
19. [Trie — Insert, Search, StartsWith](#19-trie--insert-search-startswith)
20. [Trie — Longest Common Prefix](#20-trie--longest-common-prefix)
21. [Trie — Word Search II (multiple words)](#21-trie--word-search-ii-multiple-words)
22. [Tree Diameter and Height](#22-tree-diameter-and-height)
23. [Serialize and Deserialize Binary Tree](#23-serialize-and-deserialize-binary-tree)

---

## 1. Inorder Traversal

**Inorder:** Left → Root → Right. Visits BST nodes in sorted order.

```cpp
#include <iostream>
#include <vector>
#include <stack>
using namespace std;

// Recursive
void inorderRec(TreeNode* root, vector<int>& res) {
    if (!root) return;
    inorderRec(root->left, res);
    res.push_back(root->val);
    inorderRec(root->right, res);
}

// Iterative (explicit stack)
vector<int> inorderIter(TreeNode* root) {
    vector<int> res;
    stack<TreeNode*> st;
    TreeNode* cur = root;
    while (cur || !st.empty()) {
        while (cur) { st.push(cur); cur = cur->left; }  // go left
        cur = st.top(); st.pop();
        res.push_back(cur->val);                         // visit
        cur = cur->right;                                // go right
    }
    return res;
}

// Morris Traversal — O(1) space, O(n) time
// Threads the tree: right pointer of inorder predecessor → current node
vector<int> inorderMorris(TreeNode* root) {
    vector<int> res;
    TreeNode* cur = root;
    while (cur) {
        if (!cur->left) {
            res.push_back(cur->val);
            cur = cur->right;
        } else {
            // Find inorder predecessor (rightmost in left subtree)
            TreeNode* pre = cur->left;
            while (pre->right && pre->right != cur) pre = pre->right;

            if (!pre->right) {
                pre->right = cur;   // thread: predecessor → current
                cur = cur->left;
            } else {
                pre->right = nullptr; // unthread
                res.push_back(cur->val);
                cur = cur->right;
            }
        }
    }
    return res;
}

int main() {
    // Build tree: 4-2-6-1-3-5-7
    //       4
    //      / \
    //     2   6
    //    /\  /\
    //   1  3 5  7
    TreeNode* root = new TreeNode(4);
    root->left = new TreeNode(2); root->right = new TreeNode(6);
    root->left->left = new TreeNode(1); root->left->right = new TreeNode(3);
    root->right->left = new TreeNode(5); root->right->right = new TreeNode(7);

    vector<int> r1, r2 = inorderIter(root), r3 = inorderMorris(root);
    inorderRec(root, r1);
    // All output: 1 2 3 4 5 6 7
    for (int x : r2) cout << x << " "; cout << "\n";
}
```

---

## 2. Preorder Traversal

**Preorder:** Root → Left → Right. Used to clone trees, serialize, prefix expressions.

```cpp
#include <vector>
#include <stack>
using namespace std;

// Recursive
void preorderRec(TreeNode* root, vector<int>& res) {
    if (!root) return;
    res.push_back(root->val);
    preorderRec(root->left, res);
    preorderRec(root->right, res);
}

// Iterative: push right child before left (LIFO → left processed first)
vector<int> preorderIter(TreeNode* root) {
    if (!root) return {};
    vector<int> res;
    stack<TreeNode*> st;
    st.push(root);
    while (!st.empty()) {
        TreeNode* node = st.top(); st.pop();
        res.push_back(node->val);
        if (node->right) st.push(node->right);  // right first (processed later)
        if (node->left)  st.push(node->left);   // left second (processed first)
    }
    return res;
}
```

---

## 3. Postorder Traversal

**Postorder:** Left → Right → Root. Used to delete trees, evaluate expression trees.

```cpp
#include <vector>
#include <stack>
#include <algorithm>
using namespace std;

// Recursive
void postorderRec(TreeNode* root, vector<int>& res) {
    if (!root) return;
    postorderRec(root->left, res);
    postorderRec(root->right, res);
    res.push_back(root->val);
}

// Iterative — two-stack trick: reverse of modified preorder (Root→Right→Left)
vector<int> postorderIter(TreeNode* root) {
    if (!root) return {};
    vector<int> res;
    stack<TreeNode*> st;
    st.push(root);
    while (!st.empty()) {
        TreeNode* node = st.top(); st.pop();
        res.push_back(node->val);
        if (node->left)  st.push(node->left);
        if (node->right) st.push(node->right);
    }
    reverse(res.begin(), res.end());  // reverse Root→Right→Left to get Left→Right→Root
    return res;
}

// One-stack iterative (cleaner)
vector<int> postorderOneStack(TreeNode* root) {
    vector<int> res;
    stack<TreeNode*> st;
    TreeNode* cur = root, *prev = nullptr;
    while (cur || !st.empty()) {
        while (cur) { st.push(cur); cur = cur->left; }
        cur = st.top();
        if (!cur->right || cur->right == prev) {
            res.push_back(cur->val);
            st.pop(); prev = cur; cur = nullptr;
        } else {
            cur = cur->right;
        }
    }
    return res;
}
```

---

## 4. Level Order Traversal (BFS)

**Level order:** Visit level by level left to right. Returns `vector<vector<int>>`.

```cpp
#include <vector>
#include <queue>
using namespace std;

vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) return {};
    vector<vector<int>> res;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int sz = q.size();
        vector<int> level;
        while (sz--) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left)  q.push(node->left);
            if (node->right) q.push(node->right);
        }
        res.push_back(level);
    }
    return res;
}

// Right-side view: last node of each level
vector<int> rightSideView(TreeNode* root) {
    if (!root) return {};
    vector<int> res;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int sz = q.size();
        while (sz--) {
            TreeNode* node = q.front(); q.pop();
            if (sz == 0) res.push_back(node->val);  // last in level
            if (node->left)  q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }
    return res;
}

// Bottom-up level order: reverse the result
vector<vector<int>> levelOrderBottom(TreeNode* root) {
    auto res = levelOrder(root);
    reverse(res.begin(), res.end());
    return res;
}
```

---

## 5. Zigzag Level Order

**Zigzag:** Even levels left→right, odd levels right→left.

```cpp
#include <vector>
#include <queue>
#include <deque>
using namespace std;

vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
    if (!root) return {};
    vector<vector<int>> res;
    queue<TreeNode*> q;
    q.push(root);
    bool leftToRight = true;

    while (!q.empty()) {
        int sz = q.size();
        deque<int> level;
        while (sz--) {
            TreeNode* node = q.front(); q.pop();
            if (leftToRight) level.push_back(node->val);
            else             level.push_front(node->val);  // reverse direction
            if (node->left)  q.push(node->left);
            if (node->right) q.push(node->right);
        }
        res.push_back(vector<int>(level.begin(), level.end()));
        leftToRight = !leftToRight;
    }
    return res;
}
```

---

## 6. Vertical Order Traversal

**Vertical order:** Group nodes by column index (left child: col-1, right child: col+1), then by row, then by value within same position.

```cpp
#include <vector>
#include <map>
#include <queue>
using namespace std;

vector<vector<int>> verticalOrder(TreeNode* root) {
    if (!root) return {};
    // {col → {row → sorted vals}} using map for sorted column order
    map<int, map<int, vector<int>>> colMap;
    queue<tuple<TreeNode*, int, int>> q;  // {node, row, col}
    q.push({root, 0, 0});

    while (!q.empty()) {
        auto [node, row, col] = q.front(); q.pop();
        colMap[col][row].push_back(node->val);
        if (node->left)  q.push({node->left,  row+1, col-1});
        if (node->right) q.push({node->right, row+1, col+1});
    }

    vector<vector<int>> res;
    for (auto& [col, rowMap] : colMap) {
        vector<int> colVals;
        for (auto& [row, vals] : rowMap) {
            sort(vals.begin(), vals.end());  // same row+col: sort by val
            for (int v : vals) colVals.push_back(v);
        }
        res.push_back(colVals);
    }
    return res;
}
```

---

## 7. LCA — Binary Tree (DFS)

### Problem

Find the **Lowest Common Ancestor** of two nodes in a binary tree (not necessarily BST).

**Key insight:** If the current node is p or q, return it. Recurse on both subtrees. If both return non-null, current node is LCA.

```cpp
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;

    TreeNode* left  = lowestCommonAncestor(root->left,  p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);

    if (left && right) return root;  // p in left subtree, q in right (or vice versa)
    return left ? left : right;       // both in same subtree
}
// Time: O(n), Space: O(h)
```

---

## 8. LCA — Binary Search Tree

**In BST:** If both p and q are smaller than root, go left. If both larger, go right. Otherwise, root is LCA.

```cpp
TreeNode* lcaBST(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root) return nullptr;
    if (p->val < root->val && q->val < root->val) return lcaBST(root->left,  p, q);
    if (p->val > root->val && q->val > root->val) return lcaBST(root->right, p, q);
    return root;  // split point = LCA
}

// Iterative BST LCA (O(1) space)
TreeNode* lcaBSTIter(TreeNode* root, TreeNode* p, TreeNode* q) {
    while (root) {
        if (p->val < root->val && q->val < root->val) root = root->left;
        else if (p->val > root->val && q->val > root->val) root = root->right;
        else return root;
    }
    return nullptr;
}
```

---

## 9. LCA — Binary Lifting (O(log n) queries)

**For multiple LCA queries** on a rooted tree. Precompute ancestors at power-of-2 distances.

```cpp
#include <iostream>
#include <vector>
#include <cmath>
using namespace std;

const int MAXN = 100005, LOG = 17;
int up[MAXN][LOG];   // up[v][j] = 2^j-th ancestor of v
int depth[MAXN];

void dfs(int v, int parent, int d, vector<vector<int>>& adj) {
    up[v][0] = parent;
    depth[v] = d;
    for (int j = 1; j < LOG; j++)
        up[v][j] = up[up[v][j-1]][j-1];
    for (int u : adj[v])
        if (u != parent) dfs(u, v, d+1, adj);
}

int lca(int u, int v) {
    if (depth[u] < depth[v]) swap(u, v);
    int diff = depth[u] - depth[v];

    // Bring u to same depth as v
    for (int j = 0; j < LOG; j++)
        if ((diff >> j) & 1) u = up[u][j];

    if (u == v) return u;

    // Lift both until they diverge
    for (int j = LOG-1; j >= 0; j--)
        if (up[u][j] != up[v][j]) { u = up[u][j]; v = up[v][j]; }

    return up[u][0];  // common parent
}

int main() {
    int n = 7;
    vector<vector<int>> adj(n+1);
    // Tree: 1-2-4, 1-2-5, 1-3-6, 1-3-7
    for (auto& [u,v] : vector<pair<int,int>>{{1,2},{1,3},{2,4},{2,5},{3,6},{3,7}}) {
        adj[u].push_back(v); adj[v].push_back(u);
    }
    dfs(1, 1, 0, adj);  // root=1, parent of root = itself
    cout << lca(4, 5) << "\n";  // 2
    cout << lca(4, 6) << "\n";  // 1
    cout << lca(6, 7) << "\n";  // 3
}
```

---

## 10. BST — Insert, Search, Delete

```cpp
#include <iostream>
using namespace std;

TreeNode* bstInsert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) root->left  = bstInsert(root->left,  val);
    else if (val > root->val) root->right = bstInsert(root->right, val);
    return root;  // val == root->val: already exists, no duplicate
}

bool bstSearch(TreeNode* root, int val) {
    if (!root) return false;
    if (val == root->val) return true;
    return val < root->val ? bstSearch(root->left, val) : bstSearch(root->right, val);
}

// Find minimum node (leftmost)
TreeNode* bstMin(TreeNode* root) {
    while (root->left) root = root->left;
    return root;
}

// Delete: 3 cases
// 1) No child: just remove
// 2) One child: replace with child
// 3) Two children: replace with inorder successor (min of right subtree)
TreeNode* bstDelete(TreeNode* root, int val) {
    if (!root) return nullptr;
    if (val < root->val) {
        root->left  = bstDelete(root->left,  val);
    } else if (val > root->val) {
        root->right = bstDelete(root->right, val);
    } else {
        // Case 1 and 2
        if (!root->left)  { TreeNode* r = root->right; delete root; return r; }
        if (!root->right) { TreeNode* l = root->left;  delete root; return l; }
        // Case 3: find inorder successor
        TreeNode* succ = bstMin(root->right);
        root->val = succ->val;
        root->right = bstDelete(root->right, succ->val);
    }
    return root;
}
```

---

## 11. BST — Validate

```cpp
#include <climits>
using namespace std;

bool isValidBST(TreeNode* root, long long minVal = LLONG_MIN, long long maxVal = LLONG_MAX) {
    if (!root) return true;
    if (root->val <= minVal || root->val >= maxVal) return false;
    return isValidBST(root->left,  minVal, root->val)
        && isValidBST(root->right, root->val, maxVal);
}

// Inorder traversal alternative: must produce strictly increasing sequence
bool isValidBSTInorder(TreeNode* root) {
    long long prev = LLONG_MIN;
    function<bool(TreeNode*)> check = [&](TreeNode* node) -> bool {
        if (!node) return true;
        if (!check(node->left)) return false;
        if (node->val <= prev)  return false;
        prev = node->val;
        return check(node->right);
    };
    return check(root);
}
```

---

## 12. BST — Kth Smallest / Largest

```cpp
// Kth Smallest: inorder traversal (stop at kth visit)
int kthSmallest(TreeNode* root, int k) {
    int count = 0, result = -1;
    function<void(TreeNode*)> inorder = [&](TreeNode* node) {
        if (!node || count >= k) return;
        inorder(node->left);
        if (++count == k) { result = node->val; return; }
        inorder(node->right);
    };
    inorder(root);
    return result;
}

// Kth Largest: reverse inorder (Right → Root → Left)
int kthLargest(TreeNode* root, int k) {
    int count = 0, result = -1;
    function<void(TreeNode*)> rev = [&](TreeNode* node) {
        if (!node || count >= k) return;
        rev(node->right);
        if (++count == k) { result = node->val; return; }
        rev(node->left);
    };
    rev(root);
    return result;
}
```

---

## 13. BST — Floor and Ceil

```cpp
// Floor: largest value ≤ key
int bstFloor(TreeNode* root, int key) {
    int floor = -1;
    while (root) {
        if (root->val == key) return key;
        if (root->val < key) { floor = root->val; root = root->right; }
        else                   root = root->left;
    }
    return floor;
}

// Ceil: smallest value ≥ key
int bstCeil(TreeNode* root, int key) {
    int ceil = -1;
    while (root) {
        if (root->val == key) return key;
        if (root->val > key) { ceil = root->val; root = root->left; }
        else                   root = root->right;
    }
    return ceil;
}
```

---

## 14. BST — Convert Sorted Array to BST

```cpp
#include <vector>
using namespace std;

// Always pick midpoint as root to balance the tree
TreeNode* sortedArrayToBST(vector<int>& nums, int lo, int hi) {
    if (lo > hi) return nullptr;
    int mid = lo + (hi - lo) / 2;
    TreeNode* root = new TreeNode(nums[mid]);
    root->left  = sortedArrayToBST(nums, lo, mid-1);
    root->right = sortedArrayToBST(nums, mid+1, hi);
    return root;
}

TreeNode* sortedArrayToBST(vector<int>& nums) {
    return sortedArrayToBST(nums, 0, nums.size()-1);
}
```

---

## 15. Segment Tree — Build, Query, Update (Point)

### Problem

Support two operations on an array in O(log n):
- **Point update:** change one element
- **Range query:** min/max/sum over a range [l, r]

```cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

struct SegTree {
    int n;
    vector<int> tree;  // 1-indexed, tree[1] = root (covers whole array)

    SegTree(vector<int>& arr) {
        n = arr.size();
        tree.assign(4 * n, 0);
        build(arr, 1, 0, n-1);
    }

    void build(vector<int>& arr, int node, int start, int end) {
        if (start == end) { tree[node] = arr[start]; return; }
        int mid = (start + end) / 2;
        build(arr, 2*node,   start, mid);
        build(arr, 2*node+1, mid+1, end);
        tree[node] = tree[2*node] + tree[2*node+1];  // sum; swap for min/max
    }

    // Point update: set arr[idx] = val
    void update(int node, int start, int end, int idx, int val) {
        if (start == end) { tree[node] = val; return; }
        int mid = (start + end) / 2;
        if (idx <= mid) update(2*node,   start, mid,   idx, val);
        else            update(2*node+1, mid+1, end,   idx, val);
        tree[node] = tree[2*node] + tree[2*node+1];
    }
    void update(int idx, int val) { update(1, 0, n-1, idx, val); }

    // Range sum query: [l, r]
    int query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return 0;        // completely outside
        if (l <= start && end <= r) return tree[node];  // completely inside
        int mid = (start + end) / 2;
        return query(2*node,   start, mid,   l, r)
             + query(2*node+1, mid+1, end,   l, r);
    }
    int query(int l, int r) { return query(1, 0, n-1, l, r); }
};

// Segment tree for range minimum
struct SegTreeMin {
    int n;
    vector<int> tree;
    SegTreeMin(vector<int>& arr) {
        n = arr.size(); tree.assign(4*n, INT_MAX);
        build(arr, 1, 0, n-1);
    }
    void build(vector<int>& arr, int node, int s, int e) {
        if (s == e) { tree[node] = arr[s]; return; }
        int mid = (s+e)/2;
        build(arr, 2*node, s, mid); build(arr, 2*node+1, mid+1, e);
        tree[node] = min(tree[2*node], tree[2*node+1]);
    }
    void update(int node, int s, int e, int i, int v) {
        if (s == e) { tree[node] = v; return; }
        int mid = (s+e)/2;
        if (i <= mid) update(2*node, s, mid, i, v);
        else update(2*node+1, mid+1, e, i, v);
        tree[node] = min(tree[2*node], tree[2*node+1]);
    }
    void update(int i, int v) { update(1, 0, n-1, i, v); }
    int query(int node, int s, int e, int l, int r) {
        if (r < s || e < l) return INT_MAX;
        if (l <= s && e <= r) return tree[node];
        int mid = (s+e)/2;
        return min(query(2*node, s, mid, l, r), query(2*node+1, mid+1, e, l, r));
    }
    int query(int l, int r) { return query(1, 0, n-1, l, r); }
};

int main() {
    vector<int> arr = {1, 3, 5, 7, 9, 11};
    SegTree seg(arr);
    cout << seg.query(1, 3) << "\n";  // 3+5+7 = 15
    seg.update(1, 10);                // arr[1] = 10
    cout << seg.query(1, 3) << "\n";  // 10+5+7 = 22
}
```

---

## 16. Segment Tree — Range Update (Lazy Propagation)

### Problem

Support **range updates** (add/set value to all elements in [l, r]) efficiently. Without lazy: O(n) per update. With lazy: O(log n).

```cpp
#include <iostream>
#include <vector>
using namespace std;

struct LazySegTree {
    int n;
    vector<long long> tree, lazy;

    LazySegTree(int n) : n(n), tree(4*n, 0), lazy(4*n, 0) {}
    LazySegTree(vector<int>& arr) : n(arr.size()), tree(4*arr.size(),0), lazy(4*arr.size(),0) {
        build(arr, 1, 0, n-1);
    }

    void build(vector<int>& arr, int node, int s, int e) {
        if (s == e) { tree[node] = arr[s]; return; }
        int mid = (s+e)/2;
        build(arr, 2*node, s, mid); build(arr, 2*node+1, mid+1, e);
        tree[node] = tree[2*node] + tree[2*node+1];
    }

    void pushDown(int node, int s, int e) {
        if (lazy[node] != 0) {
            int mid = (s+e)/2;
            // Propagate to children
            tree[2*node]   += lazy[node] * (mid - s + 1);
            tree[2*node+1] += lazy[node] * (e - mid);
            lazy[2*node]   += lazy[node];
            lazy[2*node+1] += lazy[node];
            lazy[node] = 0;
        }
    }

    // Range add: add val to all elements in [l, r]
    void update(int node, int s, int e, int l, int r, long long val) {
        if (r < s || e < l) return;
        if (l <= s && e <= r) {
            tree[node] += val * (e - s + 1);
            lazy[node] += val;
            return;
        }
        pushDown(node, s, e);
        int mid = (s+e)/2;
        update(2*node, s, mid, l, r, val);
        update(2*node+1, mid+1, e, l, r, val);
        tree[node] = tree[2*node] + tree[2*node+1];
    }
    void update(int l, int r, long long val) { update(1, 0, n-1, l, r, val); }

    long long query(int node, int s, int e, int l, int r) {
        if (r < s || e < l) return 0;
        if (l <= s && e <= r) return tree[node];
        pushDown(node, s, e);
        int mid = (s+e)/2;
        return query(2*node, s, mid, l, r) + query(2*node+1, mid+1, e, l, r);
    }
    long long query(int l, int r) { return query(1, 0, n-1, l, r); }
};

int main() {
    vector<int> arr = {1, 2, 3, 4, 5};
    LazySegTree seg(arr);
    cout << seg.query(1, 3) << "\n";  // 2+3+4 = 9
    seg.update(1, 3, 10);             // arr[1..3] += 10
    cout << seg.query(1, 3) << "\n";  // 12+13+14 = 39
    cout << seg.query(0, 4) << "\n";  // 1+12+13+14+5 = 45
}
```

---

## 17. Fenwick Tree / BIT — Point Update, Prefix Sum

**Fenwick Tree (Binary Indexed Tree):** Compact, fast structure for prefix sums and point updates in O(log n).

**Trick:** Node `i` stores sum of `i - lowbit(i) + 1` to `i`, where `lowbit(i) = i & (-i)`.

```cpp
#include <iostream>
#include <vector>
using namespace std;

struct BIT {
    int n;
    vector<int> bit;  // 1-indexed

    BIT(int n) : n(n), bit(n+1, 0) {}

    // Add val to position i (1-indexed)
    void update(int i, int val) {
        for (; i <= n; i += i & (-i))  // walk up: cover larger ranges
            bit[i] += val;
    }

    // Prefix sum [1..i]
    int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & (-i))   // walk down: strip lowest set bit
            sum += bit[i];
        return sum;
    }

    // Range sum [l..r]
    int query(int l, int r) { return query(r) - query(l-1); }

    // Build from array in O(n)
    void build(vector<int>& arr) {
        for (int i = 0; i < n; i++) update(i+1, arr[i]);
    }
};

int main() {
    vector<int> arr = {1, 2, 3, 4, 5, 6, 7};
    BIT bit(arr.size());
    bit.build(arr);

    cout << bit.query(1, 3) << "\n";  // 1+2+3 = 6
    cout << bit.query(3, 5) << "\n";  // 3+4+5 = 12
    bit.update(3, 5);                 // arr[3] += 5 (now 8)
    cout << bit.query(1, 3) << "\n";  // 1+2+8 = 11
}
```

---

## 18. Fenwick Tree — Range Update, Range Query

**Range update + range query** using two BITs.

```cpp
#include <vector>
using namespace std;

struct BIT2D {
    int n;
    vector<long long> B1, B2;  // Two BITs for range update + range query

    BIT2D(int n) : n(n), B1(n+2, 0), B2(n+2, 0) {}

    void _update(vector<long long>& b, int i, long long v) {
        for (; i <= n; i += i & -i) b[i] += v;
    }
    long long _query(vector<long long>& b, int i) {
        long long s = 0;
        for (; i > 0; i -= i & -i) s += b[i];
        return s;
    }

    // Range add: add v to all arr[l..r]
    void update(int l, int r, long long v) {
        _update(B1, l, v);     _update(B1, r+1, -v);
        _update(B2, l, v*(l-1)); _update(B2, r+1, -v*r);
    }

    // Prefix sum [1..i]
    long long query(int i) {
        return _query(B1, i) * i - _query(B2, i);
    }

    // Range sum [l..r]
    long long query(int l, int r) { return query(r) - query(l-1); }
};

int main() {
    BIT2D bit(6);
    bit.update(1, 6, 1);      // Add 1 to all [1..6]
    bit.update(2, 4, 2);      // Add 2 to [2..4]
    cout << bit.query(1, 6) << "\n";  // 6 + 6 = 12 (1 each + 2 for positions 2–4)
    cout << bit.query(2, 4) << "\n";  // (1+2)*3 = 9
}
```

---

## 19. Trie — Insert, Search, StartsWith

```cpp
#include <iostream>
#include <string>
using namespace std;

struct Trie {
    TrieNode* root;
    Trie() : root(new TrieNode()) {}

    void insert(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx]) node->children[idx] = new TrieNode();
            node = node->children[idx];
        }
        node->isEnd = true;
    }

    bool search(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->children[idx]) return false;
            node = node->children[idx];
        }
        return node->isEnd;
    }

    bool startsWith(const string& prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            int idx = c - 'a';
            if (!node->children[idx]) return false;
            node = node->children[idx];
        }
        return true;
    }

    // Delete a word (set isEnd=false, prune dead branches)
    bool deleteWord(TrieNode* node, const string& word, int depth) {
        if (!node) return false;
        if (depth == (int)word.size()) {
            if (!node->isEnd) return false;
            node->isEnd = false;
            // Check if this node has no children
            for (auto c : node->children) if (c) return false;
            return true;  // safe to delete this node
        }
        int idx = word[depth] - 'a';
        if (deleteWord(node->children[idx], word, depth+1)) {
            delete node->children[idx];
            node->children[idx] = nullptr;
            return !node->isEnd && [&]{ for(auto c:node->children) if(c) return false; return true; }();
        }
        return false;
    }
    void deleteWord(const string& word) { deleteWord(root, word, 0); }
};

int main() {
    Trie trie;
    trie.insert("apple"); trie.insert("app");
    cout << trie.search("apple")    << "\n";  // 1
    cout << trie.search("app")      << "\n";  // 1
    cout << trie.search("ap")       << "\n";  // 0
    cout << trie.startsWith("app")  << "\n";  // 1
    cout << trie.startsWith("xyz")  << "\n";  // 0
}
```

---

## 20. Trie — Longest Common Prefix

```cpp
#include <vector>
#include <string>
using namespace std;

string longestCommonPrefix(vector<string>& words) {
    if (words.empty()) return "";
    // Build trie
    Trie trie;
    for (auto& w : words) trie.insert(w);

    // Walk from root while exactly one child and not end of a word
    string prefix;
    TrieNode* node = trie.root;
    while (node) {
        TrieNode* next = nullptr;
        int childCount = 0;
        for (int i = 0; i < 26; i++) {
            if (node->children[i]) { next = node->children[i]; childCount++; prefix += ('a'+i); }
        }
        if (childCount != 1 || node->isEnd) {
            if (childCount != 1 || node->isEnd) { if (!prefix.empty() && childCount != 1) prefix.pop_back(); break; }
        }
        node = next;
    }
    // Simpler approach:
    string lcp = words[0];
    for (int i = 1; i < (int)words.size(); i++) {
        while (words[i].find(lcp) != 0) lcp.pop_back();
        if (lcp.empty()) return "";
    }
    return lcp;
}

int main() {
    vector<string> w1 = {"flower","flow","flight"};
    cout << longestCommonPrefix(w1) << "\n";  // "fl"
    vector<string> w2 = {"dog","racecar","car"};
    cout << longestCommonPrefix(w2) << "\n";  // ""
}
```

---

## 21. Trie — Word Search II (multiple words)

```cpp
#include <vector>
#include <string>
#include <unordered_set>
using namespace std;

// Extended TrieNode with word storage
struct TrieNodeEx {
    TrieNodeEx* children[26] = {};
    string word;  // non-empty at end of a word
};

void dfs(vector<vector<char>>& board, TrieNodeEx* node, int r, int c,
         vector<string>& result) {
    char ch = board[r][c];
    if (ch == '#' || !node->children[ch-'a']) return;
    TrieNodeEx* next = node->children[ch-'a'];
    if (!next->word.empty()) {
        result.push_back(next->word);
        next->word = "";  // deduplicate
    }
    board[r][c] = '#';  // mark visited
    int dirs[4][2] = {{0,1},{0,-1},{1,0},{-1,0}};
    int m = board.size(), n = board[0].size();
    for (auto& d : dirs) {
        int nr = r+d[0], nc = c+d[1];
        if (nr>=0&&nr<m&&nc>=0&&nc<n) dfs(board, next, nr, nc, result);
    }
    board[r][c] = ch;  // restore
}

vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
    // Build trie of all words
    TrieNodeEx* root = new TrieNodeEx();
    for (auto& w : words) {
        TrieNodeEx* node = root;
        for (char c : w) {
            if (!node->children[c-'a']) node->children[c-'a'] = new TrieNodeEx();
            node = node->children[c-'a'];
        }
        node->word = w;
    }

    int m = board.size(), n = board[0].size();
    vector<string> result;
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            dfs(board, root, i, j, result);
    return result;
}
```

---

## 22. Tree Diameter and Height

```cpp
// Height of tree
int height(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(height(root->left), height(root->right));
}

// Diameter: longest path between any two nodes
int diameterOfBinaryTree(TreeNode* root) {
    int maxDiam = 0;
    function<int(TreeNode*)> dfs = [&](TreeNode* node) -> int {
        if (!node) return 0;
        int left = dfs(node->left), right = dfs(node->right);
        maxDiam = max(maxDiam, left + right);  // path through this node
        return 1 + max(left, right);           // height
    };
    dfs(root);
    return maxDiam;
}

// Check if balanced (height difference ≤ 1)
bool isBalanced(TreeNode* root) {
    function<int(TreeNode*)> dfs = [&](TreeNode* node) -> int {
        if (!node) return 0;
        int left = dfs(node->left);
        if (left == -1) return -1;
        int right = dfs(node->right);
        if (right == -1) return -1;
        if (abs(left - right) > 1) return -1;
        return 1 + max(left, right);
    };
    return dfs(root) != -1;
}
```

---

## 23. Serialize and Deserialize Binary Tree

```cpp
#include <string>
#include <sstream>
#include <queue>
using namespace std;

// BFS-based serialization
string serialize(TreeNode* root) {
    if (!root) return "";
    string res;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front(); q.pop();
        if (node) {
            res += to_string(node->val) + ",";
            q.push(node->left); q.push(node->right);
        } else {
            res += "null,";
        }
    }
    return res;
}

TreeNode* deserialize(string data) {
    if (data.empty()) return nullptr;
    stringstream ss(data);
    string token;
    getline(ss, token, ',');
    TreeNode* root = new TreeNode(stoi(token));
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front(); q.pop();
        if (getline(ss, token, ',') && token != "null") {
            node->left = new TreeNode(stoi(token));
            q.push(node->left);
        }
        if (getline(ss, token, ',') && token != "null") {
            node->right = new TreeNode(stoi(token));
            q.push(node->right);
        }
    }
    return root;
}
```

---

## Complexity Quick Reference

| Operation | Segment Tree | Fenwick Tree | Trie |
|---|---|---|---|
| Build | O(n) | O(n log n) | O(total chars) |
| Point Update | O(log n) | O(log n) | — |
| Range Update | O(log n) lazy | O(log n) 2-BIT | — |
| Range Query | O(log n) | O(log n) | — |
| Insert | — | — | O(L) |
| Search | — | — | O(L) |
| Space | O(4n) | O(n) | O(26 × total) |

| BST Operation | BST (balanced) | BST (worst) |
|---|---|---|
| Insert/Search/Delete | O(log n) | O(n) |
| Inorder Traversal | O(n) | O(n) |
| Morris Traversal | O(n), O(1) space | O(n), O(1) space |

| LCA | Preprocessing | Query |
|---|---|---|
| Naive DFS | O(n) | O(n) |
| Binary Lifting | O(n log n) | O(log n) |
| Euler Tour + RMQ | O(n log n) | O(1) |

{% endraw %}
