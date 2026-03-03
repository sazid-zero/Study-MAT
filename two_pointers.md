---
layout: docs
title: Two-Pointer Technique
permalink: /two-pointers/
---

[⬅️ Back to Home]({{ '/' | relative_url }})

---
{% raw %}
# Two-Pointer Technique — Problem Set

The **two-pointer** technique uses two indices to traverse a data structure (array, string, or two arrays simultaneously). Instead of a nested loop O(n²), you move the pointers intelligently to achieve **O(n)** time complexity.

---


## Table of Contents

1. [Pair Sum in Sorted Array](#1-pair-sum-in-sorted-array)
2. [Remove Duplicates from Sorted Array](#2-remove-duplicates-from-sorted-array)
3. [Reverse a String / Array](#3-reverse-a-string--array)
4. [Valid Palindrome](#4-valid-palindrome)
5. [Merge Two Sorted Arrays](#5-merge-two-sorted-arrays)
6. [Container With Most Water](#6-container-with-most-water)
7. [Move Zeroes to End](#7-move-zeroes-to-end)
8. [Three Sum](#8-three-sum)
9. [Trapping Rain Water](#9-trapping-rain-water)
10. [Dutch National Flag / Sort Colors](#10-dutch-national-flag--sort-colors)
11. [Linked List — Detect a Cycle](#11-linked-list--detect-a-cycle)
12. [Linked List — Find the Middle Node](#12-linked-list--find-the-middle-node)
13. [Linked List — Nth Node from the End](#13-linked-list--nth-node-from-the-end)
14. [Squares of a Sorted Array](#14-squares-of-a-sorted-array)
15. [Sliding Window — Longest Substring Without Repeating Characters](#15-sliding-window--longest-substring-without-repeating-characters)
16. [Sliding Window — Minimum Window Substring](#16-sliding-window--minimum-window-substring)
17. [Remove Element In-Place](#17-remove-element-in-place)
18. [Intersection of Two Sorted Arrays](#18-intersection-of-two-sorted-arrays)

---

## 1. Pair Sum in Sorted Array

### Problem

Given a **sorted** array of integers and a `target` value, determine whether any two distinct elements in the array add up to `target`.

**Example:**
```
Input:  arr = [1, 2, 4, 7, 11, 15], target = 15
Output: Found   (because 4 + 11 = 15)
```

### Approach

Place one pointer at the **leftmost** (smallest) element and one at the **rightmost** (largest) element. Compute their sum:

- `sum == target` → pair found, return `true`.
- `sum < target` → need a larger value, advance `left++`.
- `sum > target` → need a smaller value, retreat `right--`.

This works because the array is sorted, so moving the left pointer up always increases the sum and moving the right pointer down always decreases it.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

bool hasPairSum(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;

    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return true;
        else if (sum < target) left++;   // need bigger sum
        else right--;                    // need smaller sum
    }
    return false;
}

int main() {
    vector<int> arr = {1, 2, 4, 7, 11, 15};
    int target = 15;
    cout << (hasPairSum(arr, target) ? "Found" : "Not Found") << endl;
    // Output: Found
}
```

---

## 2. Remove Duplicates from Sorted Array

### Problem

Given a **sorted** array, remove duplicate elements **in-place** so that each unique element appears only once. Return the new length of the deduplicated portion.

**Example:**
```
Input:  arr = [1, 1, 2, 3, 3, 4]
Output: 4   →   arr becomes [1, 2, 3, 4, ...]
```

### Approach

Use a **slow pointer** (`left`) that tracks the last confirmed unique position, and a **fast pointer** (`right`) that scans ahead. Whenever `arr[right]` differs from `arr[left]`, a new unique element is found — advance `left` and overwrite `arr[left]` with `arr[right]`.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

int removeDuplicates(vector<int>& arr) {
    int n = arr.size();
    if (n == 0) return 0;

    int left = 0;   // last position of a unique element
    for (int right = 1; right < n; right++) {
        if (arr[right] != arr[left]) {  // new unique element found
            left++;
            arr[left] = arr[right];     // place it right after the previous unique
        }
    }
    return left + 1;  // length of deduplicated array
}

int main() {
    vector<int> arr = {1, 1, 2, 3, 3, 4};
    int newLen = removeDuplicates(arr);

    cout << "New length: " << newLen << endl;
    cout << "Array: ";
    for (int i = 0; i < newLen; i++) cout << arr[i] << " ";
    cout << endl;
    // Output: New length: 4
    //         Array: 1 2 3 4
}
```

---

## 3. Reverse a String / Array

### Problem

Reverse a string (or array) **in-place** without using extra memory.

**Example:**
```
Input:  s = "hello"
Output: s = "olleh"
```

### Approach

Place `left` at the start and `right` at the end. Swap the characters at both pointers, then move them toward each other. Stop when they meet in the middle.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <string>
using namespace std;

void reverseString(string& s) {
    int left = 0, right = s.size() - 1;

    while (left < right) {
        swap(s[left], s[right]);
        left++;
        right--;
    }
}

int main() {
    string s = "hello";
    reverseString(s);
    cout << s << endl;  // Output: olleh
}
```

> **Note:** The same logic works for `vector<int>` — just replace `string` with `vector<int>`.

---

## 4. Valid Palindrome

### Problem

Given a string, determine if it is a **palindrome** after removing all non-alphanumeric characters and ignoring case differences.

**Example:**
```
Input:  s = "A man, a plan, a canal: Panama"
Output: true   (reads the same forwards and backwards)

Input:  s = "race a car"
Output: false
```

### Approach

Use two pointers starting from opposite ends. Skip any character that is not a letter or digit using `isalnum()`. Then compare the characters at both pointers (case-insensitive using `tolower()`). If all comparisons pass, the string is a palindrome.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <string>
#include <cctype>
using namespace std;

bool isPalindrome(string s) {
    int left = 0, right = s.size() - 1;

    while (left < right) {
        // Skip non-alphanumeric characters from the left
        while (left < right && !isalnum(s[left]))  left++;
        // Skip non-alphanumeric characters from the right
        while (left < right && !isalnum(s[right])) right--;

        if (tolower(s[left]) != tolower(s[right])) return false;
        left++;
        right--;
    }
    return true;
}

int main() {
    cout << isPalindrome("A man, a plan, a canal: Panama") << endl; // 1 (true)
    cout << isPalindrome("race a car") << endl;                     // 0 (false)
}
```

---

## 5. Merge Two Sorted Arrays

### Problem

Given two **sorted** arrays `a` and `b`, merge them into a single sorted array.

**Example:**
```
Input:  a = [1, 3, 5],  b = [2, 4, 6]
Output: [1, 2, 3, 4, 5, 6]
```

### Approach

This is the classic **merge step** of Merge Sort. Two pointers (`i` on `a`, `j` on `b`) advance through their arrays. At each step, the smaller of the two current elements is appended to the result. After one array is exhausted, append the remaining elements of the other.

**Time:** O(n + m) | **Space:** O(n + m)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> mergeArrays(vector<int>& a, vector<int>& b) {
    int i = 0, j = 0;
    vector<int> merged;

    // Compare elements from both arrays and pick the smaller one
    while (i < (int)a.size() && j < (int)b.size()) {
        if (a[i] < b[j]) merged.push_back(a[i++]);
        else              merged.push_back(b[j++]);
    }

    // Append any remaining elements
    while (i < (int)a.size()) merged.push_back(a[i++]);
    while (j < (int)b.size()) merged.push_back(b[j++]);

    return merged;
}

int main() {
    vector<int> a = {1, 3, 5};
    vector<int> b = {2, 4, 6};
    vector<int> result = mergeArrays(a, b);

    for (int x : result) cout << x << " ";
    cout << endl;
    // Output: 1 2 3 4 5 6
}
```

---

## 6. Container With Most Water

### Problem

Given an array `height` where `height[i]` represents the height of a vertical line at position `i`, find two lines that together with the x-axis form a container that holds the **most water**.

**Example:**
```
Input:  height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
Output: 49   (lines at index 1 and 8: min(8,7) * (8-1) = 49)
```

### Approach

Start with the widest possible container (`left = 0`, `right = n-1`). The area is `min(height[left], height[right]) * (right - left)`. To potentially find a larger area, always move the pointer pointing to the **shorter** line inward — moving the taller one can only decrease or maintain the height while the width decreases, so it can never improve the result.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int maxA = 0;

    while (left < right) {
        // Area = width * min height of the two walls
        int area = min(height[left], height[right]) * (right - left);
        maxA = max(maxA, area);

        // Move the shorter wall inward — it's the only way to potentially improve
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxA;
}

int main() {
    vector<int> height = {1, 8, 6, 2, 5, 4, 8, 3, 7};
    cout << maxArea(height) << endl;  // Output: 49
}
```

---

## 7. Move Zeroes to End

### Problem

Given an array of integers, move all `0`s to the **end** while preserving the relative order of non-zero elements. Do it **in-place**.

**Example:**
```
Input:  nums = [0, 1, 0, 3, 12]
Output: nums = [1, 3, 12, 0, 0]
```

### Approach

Use a **slow pointer** (`left`) that marks the next position for a non-zero element. The **fast pointer** (`right`) scans the entire array. Whenever a non-zero element is found, swap it with the element at `left` and advance `left`. This naturally pushes all zeroes toward the end.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

void moveZeroes(vector<int>& nums) {
    int left = 0;  // next position to place a non-zero element

    for (int right = 0; right < (int)nums.size(); right++) {
        if (nums[right] != 0) {
            swap(nums[left], nums[right]);
            left++;
        }
    }
}

int main() {
    vector<int> nums = {0, 1, 0, 3, 12};
    moveZeroes(nums);

    for (int x : nums) cout << x << " ";
    cout << endl;
    // Output: 1 3 12 0 0
}
```

---

## 8. Three Sum

### Problem

Given an array of integers, find **all unique triplets** that sum to zero. The solution must not contain duplicate triplets.

**Example:**
```
Input:  nums = [-1, 0, 1, 2, -1, -4]
Output: [[-1, -1, 2], [-1, 0, 1]]
```

### Approach

Sort the array first. Fix one element `nums[i]` with a loop, then run a classic pair-sum two-pointer scan (`left = i+1`, `right = n-1`) looking for pairs that sum to `-nums[i]`. Skip duplicate values at every pointer to avoid returning the same triplet twice.

**Time:** O(n²) | **Space:** O(1) excluding output

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> result;
    int n = nums.size();

    for (int i = 0; i < n - 2; i++) {
        // Skip duplicates for the fixed element
        if (i > 0 && nums[i] == nums[i - 1]) continue;

        int left = i + 1, right = n - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) {
                result.push_back({nums[i], nums[left], nums[right]});
                // Skip duplicates for left and right
                while (left < right && nums[left]  == nums[left + 1])  left++;
                while (left < right && nums[right] == nums[right - 1]) right--;
                left++; right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    return result;
}

int main() {
    vector<int> nums = {-1, 0, 1, 2, -1, -4};
    auto res = threeSum(nums);
    for (auto& t : res)
        cout << "[" << t[0] << ", " << t[1] << ", " << t[2] << "]\n";
    // Output:
    // [-1, -1, 2]
    // [-1, 0, 1]
}
```

---

## 9. Trapping Rain Water

### Problem

Given an array where each element represents the height of a bar, compute how much rainwater can be **trapped** between the bars after it rains.

**Example:**
```
Input:  height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
Output: 6
```

### Approach

> This is **different** from Container With Most Water. Here water fills gaps between many bars, not just two.

Use two pointers at opposite ends, tracking `leftMax` and `rightMax` (the tallest bar seen so far from each side). At each step, process the side with the shorter max. Water trapped at a position = `max - current height` on that side. Move inward.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

int trap(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int leftMax = 0, rightMax = 0;
    int water = 0;

    while (left < right) {
        if (height[left] < height[right]) {
            // Process left side
            if (height[left] >= leftMax)
                leftMax = height[left];     // update max, no water trapped here
            else
                water += leftMax - height[left];  // water = room above current bar
            left++;
        } else {
            // Process right side
            if (height[right] >= rightMax)
                rightMax = height[right];
            else
                water += rightMax - height[right];
            right--;
        }
    }
    return water;
}

int main() {
    vector<int> height = {0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1};
    cout << trap(height) << endl;  // Output: 6
}
```

---

## 10. Dutch National Flag / Sort Colors

### Problem

Given an array containing only `0`s, `1`s, and `2`s, sort it **in-place in a single pass** without using a sort function.

**Example:**
```
Input:  nums = [2, 0, 2, 1, 1, 0]
Output: nums = [0, 0, 1, 1, 2, 2]
```

### Approach

Use **three pointers** — this is the Dutch National Flag algorithm by Dijkstra:
- `low`: everything before `low` is `0`
- `mid`: current element being examined
- `high`: everything after `high` is `2`

When `nums[mid] == 0`: swap with `low`, advance both `low` and `mid`.
When `nums[mid] == 1`: it's in the right region, just advance `mid`.
When `nums[mid] == 2`: swap with `high`, retreat `high` only (the swapped element needs re-examination).

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size() - 1;

    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums[low], nums[mid]);
            low++; mid++;           // swapped element is definitely 1, safe to move mid
        } else if (nums[mid] == 1) {
            mid++;                  // already in the right place
        } else {                    // nums[mid] == 2
            swap(nums[mid], nums[high]);
            high--;                 // don't advance mid — need to re-check swapped value
        }
    }
}

int main() {
    vector<int> nums = {2, 0, 2, 1, 1, 0};
    sortColors(nums);
    for (int x : nums) cout << x << " ";
    cout << endl;  // Output: 0 0 1 1 2 2
}
```

---

## 11. Linked List — Detect a Cycle

### Problem

Given the head of a linked list, determine if it contains a **cycle** (i.e., some node's `next` pointer points back to a previous node).

**Example:**
```
1 -> 2 -> 3 -> 4
          ^         |
          |_________| (4 points back to 3)
Output: true
```

### Approach

**Floyd's Cycle Detection (tortoise and hare):** Use a `slow` pointer that moves one step at a time and a `fast` pointer that moves two steps at a time. If there is a cycle, `fast` will eventually lap `slow` and they will point to the same node. If `fast` reaches `nullptr`, there is no cycle.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

bool hasCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;

    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;          // move 1 step
        fast = fast->next->next;    // move 2 steps
        if (slow == fast) return true;  // they met — cycle exists
    }
    return false;  // fast hit end — no cycle
}

int main() {
    // Build: 1 -> 2 -> 3 -> 4 -> (back to node 2)
    ListNode* n1 = new ListNode(1);
    ListNode* n2 = new ListNode(2);
    ListNode* n3 = new ListNode(3);
    ListNode* n4 = new ListNode(4);
    n1->next = n2; n2->next = n3; n3->next = n4; n4->next = n2; // cycle

    cout << (hasCycle(n1) ? "Cycle detected" : "No cycle") << endl;
    // Output: Cycle detected
}
```

---

## 12. Linked List — Find the Middle Node

### Problem

Given the head of a linked list, return the **middle node**. If the list has two middle nodes (even length), return the second one.

**Example:**
```
Input:  1 -> 2 -> 3 -> 4 -> 5
Output: node with value 3

Input:  1 -> 2 -> 3 -> 4
Output: node with value 3  (second middle)
```

### Approach

Slow/fast pointers. `slow` moves one step, `fast` moves two steps. When `fast` reaches the end, `slow` is at the middle. This works because `fast` covers twice the distance, so when it finishes the list `slow` is exactly halfway.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* middleNode(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;

    while (fast != nullptr && fast->next != nullptr) {
        slow = slow->next;        // 1 step
        fast = fast->next->next;  // 2 steps
    }
    return slow;  // slow is at the middle
}

int main() {
    // Build: 1 -> 2 -> 3 -> 4 -> 5
    ListNode* head = new ListNode(1);
    head->next = new ListNode(2);
    head->next->next = new ListNode(3);
    head->next->next->next = new ListNode(4);
    head->next->next->next->next = new ListNode(5);

    cout << middleNode(head)->val << endl;  // Output: 3
}
```

---

## 13. Linked List — Nth Node from the End

### Problem

Given a linked list, return the value of the **Nth node from the end** without knowing the list's length in advance.

**Example:**
```
Input:  1 -> 2 -> 3 -> 4 -> 5,  N = 2
Output: 4   (2nd from the end)
```

### Approach

Advance `fast` by N steps first, then move both `slow` and `fast` together one step at a time. When `fast` reaches the end, `slow` is exactly N nodes behind — pointing at the target node.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

int nthFromEnd(ListNode* head, int n) {
    ListNode* fast = head;
    ListNode* slow = head;

    // Move fast n steps ahead
    for (int i = 0; i < n; i++)
        fast = fast->next;

    // Move both until fast hits the end
    while (fast != nullptr) {
        slow = slow->next;
        fast = fast->next;
    }
    return slow->val;  // slow is now at the Nth node from end
}

int main() {
    // Build: 1 -> 2 -> 3 -> 4 -> 5
    ListNode* head = new ListNode(1);
    head->next = new ListNode(2);
    head->next->next = new ListNode(3);
    head->next->next->next = new ListNode(4);
    head->next->next->next->next = new ListNode(5);

    cout << nthFromEnd(head, 2) << endl;  // Output: 4
}
```

---

## 14. Squares of a Sorted Array

### Problem

Given an array sorted in non-decreasing order (may contain negatives), return an array of the **squares of each number**, also in non-decreasing order.

**Example:**
```
Input:  nums = [-4, -1, 0, 3, 10]
Output: [0, 1, 9, 16, 100]
```

### Approach

The largest squares come from either end (most negative or most positive values). Use opposite-end pointers and **fill the result array from the back** — compare the absolute values at `left` and `right`, place the larger square at the current back position, and advance that pointer inward.

**Time:** O(n) | **Space:** O(n)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> sortedSquares(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n);
    int left = 0, right = n - 1;
    int pos = n - 1;  // fill result from the back

    while (left <= right) {
        int lSq = nums[left]  * nums[left];
        int rSq = nums[right] * nums[right];
        if (lSq > rSq) {
            result[pos--] = lSq;
            left++;
        } else {
            result[pos--] = rSq;
            right--;
        }
    }
    return result;
}

int main() {
    vector<int> nums = {-4, -1, 0, 3, 10};
    auto res = sortedSquares(nums);
    for (int x : res) cout << x << " ";
    cout << endl;  // Output: 0 1 9 16 100
}
```

---

## 15. Sliding Window — Longest Substring Without Repeating Characters

### Problem

Given a string, find the length of the **longest substring** that contains no repeating characters.

**Example:**
```
Input:  s = "abcabcbb"
Output: 3   (substring "abc")

Input:  s = "pwwkew"
Output: 3   (substring "wke")
```

### Approach

This uses a **sliding window** — a two-pointer extension where `left` and `right` define a window. Expand `right` one character at a time. If the character at `right` is already in the window's character set, shrink the window from the left until there are no duplicates. Track the maximum window size throughout.

**Time:** O(n) | **Space:** O(min(n, charset))

### Solution

```cpp
#include <iostream>
#include <string>
#include <unordered_set>
using namespace std;

int lengthOfLongestSubstring(string s) {
    unordered_set<char> window;  // characters currently in the window
    int left = 0, maxLen = 0;

    for (int right = 0; right < (int)s.size(); right++) {
        // Shrink window from the left until no duplicate
        while (window.count(s[right])) {
            window.erase(s[left]);
            left++;
        }
        window.insert(s[right]);
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}

int main() {
    cout << lengthOfLongestSubstring("abcabcbb") << endl;  // Output: 3
    cout << lengthOfLongestSubstring("pwwkew")   << endl;  // Output: 3
    cout << lengthOfLongestSubstring("bbbbb")    << endl;  // Output: 1
}
```

---

## 16. Sliding Window — Minimum Window Substring

### Problem

Given strings `s` and `t`, find the **minimum length substring** of `s` that contains all characters of `t` (including duplicates). Return `""` if no such window exists.

**Example:**
```
Input:  s = "ADOBECODEBANC",  t = "ABC"
Output: "BANC"
```

### Approach

Expand `right` to include characters from `t` until all are covered (`formed == required`). Then shrink `left` to minimize the window while still covering all of `t`. Record the smallest valid window. Repeat.

**Time:** O(n + m) | **Space:** O(n + m)

### Solution

```cpp
#include <iostream>
#include <string>
#include <unordered_map>
using namespace std;

string minWindow(string s, string t) {
    unordered_map<char, int> need, window;
    for (char c : t) need[c]++;

    int left = 0, right = 0;
    int formed = 0;                        // how many chars of t are satisfied
    int required = need.size();            // how many distinct chars we need
    int minLen = INT_MAX, minLeft = 0;

    while (right < (int)s.size()) {
        char c = s[right++];
        window[c]++;
        // Check if this character's frequency in window meets the need
        if (need.count(c) && window[c] == need[c])
            formed++;

        // Try to shrink the window from the left
        while (formed == required) {
            if (right - left < minLen) {   // update best window
                minLen  = right - left;
                minLeft = left;
            }
            char lc = s[left++];
            window[lc]--;
            if (need.count(lc) && window[lc] < need[lc])
                formed--;                  // window no longer covers t
        }
    }
    return minLen == INT_MAX ? "" : s.substr(minLeft, minLen);
}

int main() {
    cout << minWindow("ADOBECODEBANC", "ABC") << endl;  // Output: BANC
    cout << minWindow("a", "aa")               << endl;  // Output: (empty)
}
```

---

## 17. Remove Element In-Place

### Problem

Given an array and a value `val`, remove **all occurrences of `val`** in-place and return the new length. Order of remaining elements does not need to be preserved.

**Example:**
```
Input:  nums = [3, 2, 2, 3],  val = 3
Output: 2   →   nums = [2, 2, ...]
```

### Approach

Slow/fast pointer pattern. `left` marks the next safe write position. `right` scans the array. Whenever `nums[right] != val`, copy it to `nums[left]` and advance `left`. Elements equal to `val` are simply skipped by `right`.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

int removeElement(vector<int>& nums, int val) {
    int left = 0;  // write position

    for (int right = 0; right < (int)nums.size(); right++) {
        if (nums[right] != val) {   // keep this element
            nums[left] = nums[right];
            left++;
        }
        // if nums[right] == val, skip it (right advances, left stays)
    }
    return left;  // new length
}

int main() {
    vector<int> nums = {3, 2, 2, 3};
    int newLen = removeElement(nums, 3);

    cout << "New length: " << newLen << endl;
    for (int i = 0; i < newLen; i++) cout << nums[i] << " ";
    cout << endl;
    // Output: New length: 2
    //         2 2
}
```

---

## 18. Intersection of Two Sorted Arrays

### Problem

Given two **sorted** arrays, return an array containing their **common elements** (intersection). Each element in the result should appear as many times as it appears in both arrays.

**Example:**
```
Input:  a = [1, 2, 2, 3, 4],  b = [2, 2, 4, 5]
Output: [2, 2, 4]
```

### Approach

Merge-style two pointers. Compare `a[i]` and `b[j]`:
- Equal → both are common, add to result, advance both.
- `a[i] < b[j]` → advance `i` to catch up.
- `a[i] > b[j]` → advance `j` to catch up.

**Time:** O(n + m) | **Space:** O(1) excluding output

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> intersection(vector<int>& a, vector<int>& b) {
    int i = 0, j = 0;
    vector<int> result;

    while (i < (int)a.size() && j < (int)b.size()) {
        if (a[i] == b[j]) {
            result.push_back(a[i]);  // common element
            i++; j++;
        } else if (a[i] < b[j]) {
            i++;  // a is behind, advance it
        } else {
            j++;  // b is behind, advance it
        }
    }
    return result;
}

int main() {
    vector<int> a = {1, 2, 2, 3, 4};
    vector<int> b = {2, 2, 4, 5};
    auto res = intersection(a, b);
    for (int x : res) cout << x << " ";
    cout << endl;  // Output: 2 2 4
}
```

---

## Patterns Summary

| Pattern | Pointer Setup | Best For |
|---|---|---|
| **Opposite ends** | `left = 0`, `right = n-1` | Pair sum, palindrome, max area, reverse, squares of sorted array |
| **Slow / Fast (same direction)** | Both start at 0, fast moves ahead | Remove duplicates, remove element, move zeroes |
| **Slow / Fast — Linked List** | Both start at head, fast moves 2x | Cycle detection, find middle, Nth from end |
| **Three pointers** | `low=0`, `mid=0`, `high=n-1` | Dutch National Flag (sort 0s, 1s, 2s) |
| **Merge style** | One pointer per array | Merging, intersection, union of sorted arrays |
| **Sliding Window** | `left` shrinks, `right` expands | Longest/minimum substring, subarray conditions |
| **Fix + two pointer** | Outer loop fixes one, inner uses L/R | Three Sum, Four Sum |

### When to Use Two Pointers

- The input is **sorted** (or can be sorted without breaking constraints).
- You need to find a **pair**, **triplet**, or **subarray** satisfying a condition.
- You need to **partition** or **compact** an array in-place.
- The problem involves a **linked list** with distance or cycle properties.
- A naïve O(n²) nested loop solution exists — two pointers is often the O(n) upgrade.
- You need a **dynamic window** over a sequence (sliding window variant).

### Complexity Quick Reference

| Problem | Time | Space |
|---|---|---|
| Pair Sum | O(n) | O(1) |
| Remove Duplicates / Remove Element | O(n) | O(1) |
| Reverse String | O(n) | O(1) |
| Valid Palindrome | O(n) | O(1) |
| Merge Two Sorted Arrays | O(n+m) | O(n+m) |
| Container With Most Water | O(n) | O(1) |
| Move Zeroes | O(n) | O(1) |
| Three Sum | O(n²) | O(1) |
| Trapping Rain Water | O(n) | O(1) |
| Dutch National Flag | O(n) | O(1) |
| Linked List Cycle | O(n) | O(1) |
| Linked List Middle | O(n) | O(1) |
| Nth from End | O(n) | O(1) |
| Squares of Sorted Array | O(n) | O(n) |
| Longest Substring No Repeat | O(n) | O(n) |
| Minimum Window Substring | O(n+m) | O(n+m) |
| Intersection of Sorted Arrays | O(n+m) | O(1) |

{% endraw %}
