---
layout: page
title: Junior Software Engineer Assessment Prep
permalink: /junior-swe-prep/
---

# 💼 Junior Software Engineer Written Assessment Prep

> Complete preparation guide for entry-level software engineering assessments

[⬅️ Back to Home]({{ '/' | relative_url }})

---

## 📋 Table of Contents

1. [Assessment Overview](#assessment-overview)
2. [Core Data Structures](#core-data-structures)
3. [Essential Algorithms](#essential-algorithms)
4. [Problem-Solving Patterns](#problem-solving-patterns)
5. [Time & Space Complexity](#time--space-complexity)
6. [Common Question Types](#common-question-types)
7. [Coding Best Practices](#coding-best-practices)
8. [System Design Basics](#system-design-basics)
9. [Behavioral Questions](#behavioral-questions)
10. [Practice Resources](#practice-resources)

---

## 🎯 Assessment Overview

### What to Expect

Typical junior SWE assessments include:

- **Coding Problems** (60-70%): 2-4 problems, 60-90 minutes
- **Multiple Choice** (20-30%): DS&A concepts, complexity analysis
- **Short Answer** (10-20%): Explain algorithms, debugging

### Time Management

| Section | Time | Strategy |
|---------|------|----------|
| Problem 1 (Easy) | 15-20 min | Build confidence, ensure correctness |
| Problem 2 (Medium) | 25-30 min | Most critical, balance speed & quality |
| Problem 3 (Medium-Hard) | 20-25 min | Partial credit better than nothing |
| Review | 10 min | Test edge cases, check syntax |

### Scoring Tips

✅ **DO:**
- Write clean, readable code
- Handle edge cases
- Add comments for complex logic
- Test with examples
- Explain your approach

❌ **DON'T:**
- Skip easy problems
- Spend too long on one problem
- Leave problems blank (partial credit!)
- Forget to compile/test
- Use unclear variable names

---

## 🗂️ Core Data Structures

### 1. Arrays & Strings

**Key Concepts:**
- Indexing, iteration
- Two-pointer technique
- Sliding window
- Prefix sums

**Common Operations:**
```cpp
// Reverse array
void reverse(vector<int>& arr) {
    int l = 0, r = arr.size() - 1;
    while(l < r) {
        swap(arr[l++], arr[r--]);
    }
}

// Check palindrome
bool isPalindrome(string s) {
    int l = 0, r = s.length() - 1;
    while(l < r) {
        if(s[l++] != s[r--]) return false;
    }
    return true;
}

// Sliding window max sum
int maxSum(vector<int>& arr, int k) {
    int sum = 0, maxSum = 0;
    for(int i = 0; i < arr.size(); i++) {
        sum += arr[i];
        if(i >= k-1) {
            maxSum = max(maxSum, sum);
            sum -= arr[i-k+1];
        }
    }
    return maxSum;
}
```

**Must-Know Problems:**
- Two Sum / Three Sum
- Remove Duplicates
- Rotate Array
- Maximum Subarray (Kadane's)
- Longest Substring Without Repeating Characters

---

### 2. Linked Lists

**Key Concepts:**
- Traversal
- Fast & slow pointers
- Reversal
- Cycle detection

**Common Operations:**
```cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// Reverse linked list
ListNode* reverse(ListNode* head) {
    ListNode *prev = nullptr, *curr = head;
    while(curr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}

// Detect cycle (Floyd's)
bool hasCycle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while(fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if(slow == fast) return true;
    }
    return false;
}

// Find middle
ListNode* findMiddle(ListNode* head) {
    ListNode *slow = head, *fast = head;
    while(fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}
```

**Must-Know Problems:**
- Reverse Linked List
- Merge Two Sorted Lists
- Remove Nth Node From End
- Detect Cycle
- Intersection of Two Lists

---

### 3. Stacks & Queues

**Key Concepts:**
- LIFO (Stack) vs FIFO (Queue)
- Expression evaluation
- Monotonic stack/queue

**Common Operations:**
```cpp
// Valid parentheses
bool isValid(string s) {
    stack<char> st;
    for(char c : s) {
        if(c == '(' || c == '{' || c == '[') {
            st.push(c);
        } else {
            if(st.empty()) return false;
            char top = st.top();
            st.pop();
            if((c == ')' && top != '(') ||
               (c == '}' && top != '{') ||
               (c == ']' && top != '[')) {
                return false;
            }
        }
    }
    return st.empty();
}

// Next greater element
vector<int> nextGreater(vector<int>& arr) {
    int n = arr.size();
    vector<int> result(n, -1);
    stack<int> st;
    
    for(int i = 0; i < n; i++) {
        while(!st.empty() && arr[st.top()] < arr[i]) {
            result[st.top()] = arr[i];
            st.pop();
        }
        st.push(i);
    }
    return result;
}
```

**Must-Know Problems:**
- Valid Parentheses
- Min Stack
- Daily Temperatures
- Evaluate Reverse Polish Notation

---

### 4. Trees & Binary Trees

**Key Concepts:**
- Traversals (inorder, preorder, postorder, level-order)
- Recursion
- Height/depth
- Path problems

**Common Operations:**
```cpp
struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// Inorder traversal (recursive)
void inorder(TreeNode* root, vector<int>& result) {
    if(!root) return;
    inorder(root->left, result);
    result.push_back(root->val);
    inorder(root->right, result);
}

// Max depth
int maxDepth(TreeNode* root) {
    if(!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}

// Level order traversal (BFS)
vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if(!root) return result;
    
    queue<TreeNode*> q;
    q.push(root);
    
    while(!q.empty()) {
        int size = q.size();
        vector<int> level;
        
        for(int i = 0; i < size; i++) {
            TreeNode* node = q.front();
            q.pop();
            level.push_back(node->val);
            
            if(node->left) q.push(node->left);
            if(node->right) q.push(node->right);
        }
        result.push_back(level);
    }
    return result;
}

// Validate BST
bool isValidBST(TreeNode* root, long min_val = LONG_MIN, long max_val = LONG_MAX) {
    if(!root) return true;
    if(root->val <= min_val || root->val >= max_val) return false;
    return isValidBST(root->left, min_val, root->val) &&
           isValidBST(root->right, root->val, max_val);
}
```

**Must-Know Problems:**
- Maximum Depth
- Invert Binary Tree
- Validate BST
- Lowest Common Ancestor
- Path Sum

---

### 5. Hash Tables

**Key Concepts:**
- O(1) average lookup
- Collision handling
- Frequency counting
- Anagram detection

**Common Patterns:**
```cpp
// Two Sum
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for(int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if(seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}

// Group Anagrams
vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> groups;
    
    for(string& s : strs) {
        string key = s;
        sort(key.begin(), key.end());
        groups[key].push_back(s);
    }
    
    vector<vector<string>> result;
    for(auto& [key, group] : groups) {
        result.push_back(group);
    }
    return result;
}

// First Non-Repeating Character
char firstUnique(string s) {
    unordered_map<char, int> freq;
    for(char c : s) freq[c]++;
    
    for(char c : s) {
        if(freq[c] == 1) return c;
    }
    return '_';
}
```

**Must-Know Problems:**
- Two Sum
- Group Anagrams
- Contains Duplicate
- Longest Consecutive Sequence

---

### 6. Heaps (Priority Queues)

**Key Concepts:**
- Min/Max heap properties
- Kth largest/smallest
- Merge K sorted

**Common Operations:**
```cpp
// Kth Largest Element
int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap;
    
    for(int num : nums) {
        minHeap.push(num);
        if(minHeap.size() > k) {
            minHeap.pop();
        }
    }
    return minHeap.top();
}

// Top K Frequent Elements
vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> freq;
    for(int num : nums) freq[num]++;
    
    priority_queue<pair<int,int>> maxHeap;
    for(auto& [num, count] : freq) {
        maxHeap.push({count, num});
    }
    
    vector<int> result;
    for(int i = 0; i < k; i++) {
        result.push_back(maxHeap.top().second);
        maxHeap.pop();
    }
    return result;
}
```

**Must-Know Problems:**
- Kth Largest Element
- Top K Frequent Elements
- Merge K Sorted Lists

---

## ⚙️ Essential Algorithms

### 1. Searching

#### Binary Search
```cpp
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    
    while(left <= right) {
        int mid = left + (right - left) / 2;
        
        if(arr[mid] == target) return mid;
        else if(arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

// Search in rotated sorted array
int searchRotated(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    
    while(left <= right) {
        int mid = left + (right - left) / 2;
        
        if(nums[mid] == target) return mid;
        
        // Left half sorted
        if(nums[left] <= nums[mid]) {
            if(nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        // Right half sorted
        else {
            if(nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
}
```

---

### 2. Sorting

**Time Complexities:**

| Algorithm | Best | Average | Worst | Space | Stable |
|-----------|------|---------|-------|-------|--------|
| Bubble Sort | O(N) | O(N²) | O(N²) | O(1) | ✅ |
| Selection Sort | O(N²) | O(N²) | O(N²) | O(1) | ❌ |
| Insertion Sort | O(N) | O(N²) | O(N²) | O(1) | ✅ |
| Merge Sort | O(N log N) | O(N log N) | O(N log N) | O(N) | ✅ |
| Quick Sort | O(N log N) | O(N log N) | O(N²) | O(log N) | ❌ |

**Quick Sort Implementation:**
```cpp
int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for(int j = low; j < high; j++) {
        if(arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i+1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if(low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
```

---

### 3. Graph Algorithms

#### BFS (Breadth-First Search)
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

#### DFS (Depth-First Search)
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

#### Cycle Detection
```cpp
bool hasCycleDFS(vector<vector<int>>& graph, int node, 
                 vector<bool>& visited, vector<bool>& recStack) {
    visited[node] = true;
    recStack[node] = true;
    
    for(int neighbor : graph[node]) {
        if(!visited[neighbor]) {
            if(hasCycleDFS(graph, neighbor, visited, recStack)) {
                return true;
            }
        } else if(recStack[neighbor]) {
            return true;
        }
    }
    
    recStack[node] = false;
    return false;
}
```

---

### 4. Dynamic Programming Basics

**Pattern Recognition:**
- Optimal substructure
- Overlapping subproblems
- Memoization vs Tabulation

**Common Problems:**

#### Fibonacci
```cpp
// Memoization (Top-Down)
int fibMemo(int n, vector<int>& memo) {
    if(n <= 1) return n;
    if(memo[n] != -1) return memo[n];
    memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo);
    return memo[n];
}

// Tabulation (Bottom-Up)
int fibTab(int n) {
    if(n <= 1) return n;
    vector<int> dp(n+1);
    dp[0] = 0;
    dp[1] = 1;
    for(int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    return dp[n];
}
```

#### Climbing Stairs
```cpp
int climbStairs(int n) {
    if(n <= 2) return n;
    int prev2 = 1, prev1 = 2;
    for(int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

#### Coin Change
```cpp
int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    
    for(int i = 1; i <= amount; i++) {
        for(int coin : coins) {
            if(coin <= i) {
                dp[i] = min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
```

---

## 🎯 Problem-Solving Patterns

### 1. Two Pointers
**When to use:** Sorted arrays, palindromes, pair finding

```cpp
// Container With Most Water
int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int maxArea = 0;
    
    while(left < right) {
        int area = min(height[left], height[right]) * (right - left);
        maxArea = max(maxArea, area);
        
        if(height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return maxArea;
}
```

---

### 2. Sliding Window
**When to use:** Subarray/substring problems with size constraints

```cpp
// Longest Substring Without Repeating Characters
int lengthOfLongestSubstring(string s) {
    unordered_set<char> window;
    int left = 0, maxLen = 0;
    
    for(int right = 0; right < s.length(); right++) {
        while(window.count(s[right])) {
            window.erase(s[left]);
            left++;
        }
        window.insert(s[right]);
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}
```

---

### 3. Fast & Slow Pointers
**When to use:** Cycle detection, finding middle

```cpp
// Happy Number
bool isHappy(int n) {
    auto sumSquares = [](int num) {
        int sum = 0;
        while(num > 0) {
            int digit = num % 10;
            sum += digit * digit;
            num /= 10;
        }
        return sum;
    };
    
    int slow = n, fast = n;
    do {
        slow = sumSquares(slow);
        fast = sumSquares(sumSquares(fast));
    } while(slow != fast);
    
    return slow == 1;
}
```

---

### 4. Merge Intervals
**When to use:** Overlapping intervals, scheduling

```cpp
vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged;
    
    for(auto& interval : intervals) {
        if(merged.empty() || merged.back()[1] < interval[0]) {
            merged.push_back(interval);
        } else {
            merged.back()[1] = max(merged.back()[1], interval[1]);
        }
    }
    return merged;
}
```

---

### 5. Recursion & Backtracking
**When to use:** Combinations, permutations, subsets

```cpp
// Subsets
void backtrack(vector<int>& nums, int start, vector<int>& curr, 
               vector<vector<int>>& result) {
    result.push_back(curr);
    
    for(int i = start; i < nums.size(); i++) {
        curr.push_back(nums[i]);
        backtrack(nums, i + 1, curr, result);
        curr.pop_back();
    }
}

vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> result;
    vector<int> curr;
    backtrack(nums, 0, curr, result);
    return result;
}
```

---

## ⏱️ Time & Space Complexity

### Big O Notation

**Common Complexities (Best to Worst):**

| Notation | Name | Example |
|----------|------|---------|
| O(1) | Constant | Array access, hash lookup |
| O(log N) | Logarithmic | Binary search |
| O(N) | Linear | Array traversal |
| O(N log N) | Linearithmic | Merge sort, quick sort |
| O(N²) | Quadratic | Nested loops |
| O(2^N) | Exponential | Recursive Fibonacci |
| O(N!) | Factorial | Permutations |

### Analysis Tips

```cpp
// O(N) - Single loop
for(int i = 0; i < n; i++) { /* ... */ }

// O(N²) - Nested loops
for(int i = 0; i < n; i++) {
    for(int j = 0; j < n; j++) { /* ... */ }
}

// O(log N) - Divide and conquer
while(n > 0) {
    n /= 2;
}

// O(N log N) - Sorting
sort(arr.begin(), arr.end());
```

### Space Complexity
- **O(1)**: Few variables
- **O(N)**: Array/hash table
- **O(N²)**: 2D matrix
- **O(log N)**: Recursion stack (balanced tree)

---

## 📝 Common Question Types

### Type 1: Array Manipulation
- **Example:** "Rotate array by k positions"
- **Approach:** Three reversals
- **Complexity:** O(N) time, O(1) space

### Type 2: String Processing
- **Example:** "Check if string is valid palindrome"
- **Approach:** Two pointers
- **Complexity:** O(N) time, O(1) space

### Type 3: Linked List Operations
- **Example:** "Reverse linked list in groups of k"
- **Approach:** Iterative reversal with counting
- **Complexity:** O(N) time, O(1) space

### Type 4: Tree Traversal
- **Example:** "Find all paths with target sum"
- **Approach:** DFS with backtracking
- **Complexity:** O(N) time, O(H) space

### Type 5: Dynamic Programming
- **Example:** "Longest increasing subsequence"
- **Approach:** DP table
- **Complexity:** O(N²) time, O(N) space

---

## ✅ Coding Best Practices

### 1. Code Structure
```cpp
// ✅ GOOD: Clear, modular
class Solution {
public:
    int solve(vector<int>& nums) {
        if(nums.empty()) return 0;
        
        int result = helper(nums);
        return result;
    }
    
private:
    int helper(vector<int>& nums) {
        // Implementation
        return 0;
    }
};

// ❌ BAD: Everything in one function
int solve(vector<int>& nums) {
    // 100 lines of messy code...
}
```

### 2. Variable Naming
```cpp
// ✅ GOOD: Descriptive names
int maxProfit = 0;
int leftPointer = 0;
string userName = "Alice";

// ❌ BAD: Single letters, unclear
int mp = 0;
int lp = 0;
string un = "Alice";
```

### 3. Edge Cases
```cpp
// Always check:
if(nums.empty()) return 0;              // Empty input
if(nums.size() == 1) return nums[0];    // Single element
if(k == 0) return 0;                    // Zero parameter
if(target < 0) return -1;               // Invalid range
```

### 4. Comments
```cpp
// ✅ GOOD: Explain complex logic
// Use two pointers to find pairs that sum to target
int left = 0, right = n - 1;
while(left < right) {
    // Binary search to narrow down range
    int mid = left + (right - left) / 2;
}

// ❌ BAD: Obvious comments
int i = 0;  // Initialize i to 0
i++;        // Increment i
```

---

## 🏗️ System Design Basics

### For Junior Roles

**Topics to Know:**
1. **Client-Server Architecture**
   - Request/response cycle
   - HTTP methods (GET, POST, PUT, DELETE)
   - RESTful APIs

2. **Databases**
   - Relational (SQL) vs NoSQL
   - CRUD operations
   - Basic queries

3. **Caching**
   - Why cache? (Performance)
   - Where to cache? (Client, CDN, Server)
   - Cache invalidation

4. **Scalability Concepts**
   - Vertical vs horizontal scaling
   - Load balancing
   - Stateless vs stateful

### Sample Question
> "Design a URL shortener like bit.ly"

**Approach:**
1. **Requirements:** Shorten long URLs, redirect, track clicks
2. **API:**
   - `POST /shorten` - Create short URL
   - `GET /{shortCode}` - Redirect to original
3. **Database:** Store mapping (shortCode → originalURL)
4. **Algorithm:** Generate unique short code (hash or base62)
5. **Scale:** Cache popular URLs, distribute with load balancer

---

## 🗣️ Behavioral Questions

### STAR Method
**S**ituation → **T**ask → **A**ction → **R**esult

### Common Questions

1. **"Tell me about a challenging project"**
   - Describe technical challenge
   - Your specific role
   - How you solved it
   - Outcome/learnings

2. **"How do you handle tight deadlines?"**
   - Prioritization strategy
   - Communication with team
   - Example from experience

3. **"Describe a time you debugged a difficult bug"**
   - Problem description
   - Debugging process
   - Tools used
   - Resolution

### Tips
- ✅ Be specific with examples
- ✅ Show initiative and learning
- ✅ Demonstrate teamwork
- ❌ Don't blame others
- ❌ Don't be vague
- ❌ Don't ramble

---

## 📚 Practice Resources

### Online Platforms
1. **LeetCode** - [leetcode.com](https://leetcode.com)
   - Focus on "Easy" and "Medium"
   - Complete "Top Interview Questions"
   - Do daily challenges

2. **HackerRank** - [hackerrank.com](https://hackerrank.com)
   - Interview Preparation Kit
   - Company-specific tests

3. **CodeSignal** - [codesignal.com](https://codesignal.com)
   - Similar to actual assessments
   - Time-limited practice

### Study Plan (4 Weeks)

**Week 1: Arrays & Strings**
- Day 1-2: Two Sum, Valid Palindrome, Reverse String
- Day 3-4: Best Time to Buy/Sell Stock, Longest Substring
- Day 5-7: Merge Intervals, Product Except Self

**Week 2: Linked Lists & Trees**
- Day 1-2: Reverse List, Merge Lists, Remove Nth Node
- Day 3-4: Max Depth, Validate BST, Level Order
- Day 5-7: LCA, Path Sum, Invert Tree

**Week 3: Stacks, Queues & Hash Tables**
- Day 1-2: Valid Parentheses, Min Stack
- Day 3-4: Two Sum, Group Anagrams
- Day 5-7: Top K Frequent, LRU Cache

**Week 4: Sorting, Searching & DP**
- Day 1-2: Binary Search, Search Rotated Array
- Day 3-4: Merge Sort, Quick Sort implementation
- Day 5-7: Climbing Stairs, Coin Change, House Robber

---

##💡 Last-Minute Tips

### Day Before Assessment
- ✅ Review common patterns (2-pointer, sliding window)
- ✅ Practice 2-3 easy problems for confidence
- ✅ Test your setup (compiler, internet)
- ✅ Get good sleep!

### During Assessment
1. **Read all problems first** (5 min)
2. **Start with easiest** (build momentum)
3. **Write pseudocode** before coding
4. **Test with examples** before submitting
5. **Don't get stuck** - move on if needed

### Common Mistakes to Avoid
- ❌ Off-by-one errors (`<=` vs `<`)
- ❌ Integer overflow (use `long` if needed)
- ❌ Not handling null/empty inputs
- ❌ Forgetting to return value
- ❌ Wrong loop bounds

---

## 🎯 Quick Reference Card

```cpp
// Common Patterns Cheat Sheet

// 1. Two Pointers
int l = 0, r = n-1;
while(l < r) { /* ... */ }

// 2. Sliding Window
int l = 0;
for(int r = 0; r < n; r++) {
    // Add r to window
    while(/* invalid */) {
        // Remove l from window
        l++;
    }
}

// 3. Fast & Slow
slow = slow->next;
fast = fast->next->next;

// 4. Binary Search
while(l <= r) {
    int mid = l + (r - l) / 2;
    if(/* found */) return mid;
    else if(/* go left */) r = mid - 1;
    else l = mid + 1;
}

// 5. DFS
void dfs(node) {
    if(!node) return;
    // Process
    dfs(node->left);
    dfs(node->right);
}

// 6. BFS
queue<Node*> q;
q.push(start);
while(!q.empty()) {
    Node* curr = q.front();
    q.pop();
    // Process neighbors
}

// 7. Backtracking
void backtrack(curr, result) {
    if(/* base case */) {
        result.push_back(curr);
        return;
    }
    for(/* choices */) {
        // Choose
        backtrack(curr, result);
        // Undo
    }
}
```

---

## 🏆 Final Checklist

Before submitting:
- [ ] Handles empty input
- [ ] Handles single element
- [ ] No array out of bounds
- [ ] No null pointer dereference
- [ ] Correct return type
- [ ] Variables initialized
- [ ] No infinite loops
- [ ] Tested with sample inputs
- [ ] Code compiles
- [ ] Comments added for complex parts

---

[⬆️ Back to Top](#-junior-software-engineer-written-assessment-prep) | [🏠 Home](/)

**Good luck with your assessment! 🚀**

*Remember: Practice, not perfection. Show your problem-solving process even if you don't finish everything.*
