---
layout: docs
title: Divide & Conquer
permalink: /divide-and-conquer/
---

[⬅️ Back to Home]({{ '/' | relative_url }})

---
{% raw %}
# Divide & Conquer — Complete Problem Set

**Divide & Conquer** splits a problem into smaller subproblems, solves each recursively, then combines the results. The three steps are always: **Divide → Conquer → Combine**.

**Master Theorem** (for T(n) = aT(n/b) + f(n)):
- If f(n) = O(n^c) where c < log_b(a) → T(n) = Θ(n^(log_b(a)))  
- If f(n) = Θ(n^(log_b(a))) → T(n) = Θ(n^(log_b(a)) · log n)  
- If f(n) = Ω(n^c) where c > log_b(a) → T(n) = Θ(f(n))

---


## Table of Contents

### Maximum Subarray
1. [Maximum Subarray — Divide & Conquer](#1-maximum-subarray--divide--conquer)
2. [Maximum Subarray — Kadane's Algorithm (Linear)](#2-maximum-subarray--kadanes-algorithm-linear)
3. [Maximum Subarray — Return Indices](#3-maximum-subarray--return-indices)
4. [Maximum Circular Subarray Sum](#4-maximum-circular-subarray-sum)
5. [Maximum Sum Rectangle in 2D Matrix](#5-maximum-sum-rectangle-in-2d-matrix)

### Matrix Multiplication
6. [Matrix Multiplication — Naive O(n³)](#6-matrix-multiplication--naive-on³)
7. [Strassen's Algorithm — O(n^2.81)](#7-strassens-algorithm--on281)
8. [Matrix Exponentiation — Fast Power of Matrix](#8-matrix-exponentiation--fast-power-of-matrix)

### Binary Search Variations (D&C Perspective)
9. [Classic Binary Search — Recursive D&C](#9-classic-binary-search--recursive-dc)
10. [Find Peak Element](#10-find-peak-element)
11. [Find Median of Two Sorted Arrays](#11-find-median-of-two-sorted-arrays)
12. [Kth Smallest in Two Sorted Arrays](#12-kth-smallest-in-two-sorted-arrays)
13. [Aggressive Cows — Binary Search on Answer](#13-aggressive-cows--binary-search-on-answer)

### Classic Divide & Conquer
14. [Count Inversions — Modified Merge Sort](#14-count-inversions--modified-merge-sort)
15. [Closest Pair of Points](#15-closest-pair-of-points)
16. [Tower of Hanoi](#16-tower-of-hanoi)
17. [Fast Power — Exponentiation by Squaring](#17-fast-power--exponentiation-by-squaring)
18. [Karatsuba Multiplication — Fast Large Integer Multiply](#18-karatsuba-multiplication--fast-large-integer-multiply)
19. [Find Majority Element — Boyer-Moore + D&C](#19-find-majority-element--boyer-moore--dc)
20. [Quickselect — Kth Smallest Element](#20-quickselect--kth-smallest-element)
21. [Skyline Problem](#21-skyline-problem)

---

## 1. Maximum Subarray — Divide & Conquer

### Problem

Given an integer array, find the contiguous subarray with the **maximum sum**.

**Example:**
```
Input:  nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6   →  subarray [4, -1, 2, 1]
```

### Approach — D&C

Split the array at mid. The maximum subarray is either:
1. Entirely in the **left half** → recurse left
2. Entirely in the **right half** → recurse right
3. **Crosses the midpoint** → compute greedily from mid outward

For the crossing case: scan left from `mid` to find max suffix sum; scan right from `mid+1` to find max prefix sum. Their sum is the crossing sum.

**Recurrence:** T(n) = 2T(n/2) + O(n) → **T(n) = O(n log n)** (Master Theorem Case 2)

> Note: This is slower than Kadane's O(n), but demonstrates the D&C pattern. Many exams ask you to show BOTH.

### Solution

```cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int maxCrossing(vector<int>& nums, int left, int mid, int right) {
    // Max sum starting at mid going LEFT
    int leftSum = INT_MIN, sum = 0;
    for (int i = mid; i >= left; i--) {
        sum += nums[i];
        leftSum = max(leftSum, sum);
    }

    // Max sum starting at mid+1 going RIGHT
    int rightSum = INT_MIN; sum = 0;
    for (int i = mid + 1; i <= right; i++) {
        sum += nums[i];
        rightSum = max(rightSum, sum);
    }
    return leftSum + rightSum;
}

int maxSubarrayDC(vector<int>& nums, int left, int right) {
    if (left == right) return nums[left];  // base case: single element

    int mid = left + (right - left) / 2;

    int leftMax    = maxSubarrayDC(nums, left, mid);      // best in left half
    int rightMax   = maxSubarrayDC(nums, mid + 1, right); // best in right half
    int crossMax   = maxCrossing(nums, left, mid, right); // best crossing mid

    return max({leftMax, rightMax, crossMax});
}

int main() {
    vector<int> nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    cout << maxSubarrayDC(nums, 0, nums.size() - 1) << endl;  // Output: 6
}
```

**Complexity:**
| Step | Cost |
|---|---|
| Divide | O(1) |
| Crossing subarray | O(n) |
| Recurrence | T(n) = 2T(n/2) + O(n) |
| **Total** | **O(n log n)** |

---

## 2. Maximum Subarray — Kadane's Algorithm (Linear)

### Problem

Same problem as above, but solve it in **O(n)** time using Kadane's algorithm.

### Approach — Greedy / DP

Maintain the maximum subarray sum ending at each position. At each index, decide: extend the previous subarray or start a new one?

```
currentMax = max(nums[i],  currentMax + nums[i])
globalMax  = max(globalMax, currentMax)
```

This is O(n) — much better than the D&C approach. **Know both for exams.**

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

int maxSubarrayKadane(vector<int>& nums) {
    int currentMax = nums[0], globalMax = nums[0];

    for (int i = 1; i < (int)nums.size(); i++) {
        currentMax = max(nums[i], currentMax + nums[i]);  // extend or restart
        globalMax  = max(globalMax, currentMax);
    }
    return globalMax;
}

int main() {
    vector<int> nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    cout << maxSubarrayKadane(nums) << endl;  // Output: 6

    // All negatives
    vector<int> neg = {-3, -1, -2};
    cout << maxSubarrayKadane(neg) << endl;   // Output: -1 (least negative)
}
```

**Trace for [-2, 1, -3, 4, -1, 2, 1, -5, 4]:**
```
i=0: cur=-2, global=-2
i=1: cur=max(1,-2+1)=max(1,-1)=1,  global=1
i=2: cur=max(-3,1-3)=max(-3,-2)=-2, global=1
i=3: cur=max(4,-2+4)=max(4,2)=4,   global=4
i=4: cur=max(-1,4-1)=3,             global=4
i=5: cur=max(2,3+2)=5,              global=5
i=6: cur=max(1,5+1)=6,              global=6
i=7: cur=max(-5,6-5)=1,             global=6
i=8: cur=max(4,1+4)=5,              global=6
Result: 6
```

---

## 3. Maximum Subarray — Return Indices

### Problem

Same as Kadane's but also **return the start and end indices** of the maximum subarray.

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

tuple<int,int,int> maxSubarrayWithIndices(vector<int>& nums) {
    int currentMax = nums[0], globalMax = nums[0];
    int start = 0, end = 0, tempStart = 0;

    for (int i = 1; i < (int)nums.size(); i++) {
        if (nums[i] > currentMax + nums[i]) {
            currentMax = nums[i];   // start fresh
            tempStart  = i;
        } else {
            currentMax += nums[i];  // extend
        }

        if (currentMax > globalMax) {
            globalMax = currentMax;
            start = tempStart;
            end   = i;
        }
    }
    return {globalMax, start, end};
}

int main() {
    vector<int> nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    auto [maxSum, s, e] = maxSubarrayWithIndices(nums);
    cout << "Max sum: " << maxSum << endl;   // Output: 6
    cout << "Indices: [" << s << ", " << e << "]" << endl;  // Output: [3, 6]
    // Subarray: nums[3..6] = [4,-1,2,1]
}
```

---

## 4. Maximum Circular Subarray Sum

### Problem

Find the maximum subarray sum in a **circular array** (the subarray can wrap around the end to the beginning).

**Example:**
```
Input:  nums = [1, -2, 3, -2]  →  Output: 3
Input:  nums = [5, -3, 5]      →  Output: 10  (wraps: 5+5)
Input:  nums = [-3, -2, -3]    →  Output: -2  (all negative: no wrap possible)
```

### Approach

Two cases:
1. **No wrap:** Use Kadane's normally → `maxLinear`
2. **Wrap:** The wrapping subarray = total sum − (minimum subarray in the middle). Find minimum subarray via inverted Kadane's → `totalSum - minSubarray`

Answer = `max(maxLinear, totalSum - minSubarray)`. Edge case: if all elements are negative, `minSubarray == totalSum` → return `maxLinear`.

**Time:** O(n) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

int maxCircularSubarray(vector<int>& nums) {
    int totalSum   = 0;
    int maxSum     = nums[0], minSum = nums[0];
    int currentMax = nums[0], currentMin = nums[0];

    for (int i = 1; i < (int)nums.size(); i++) {
        totalSum   += nums[i - 1];  // accumulate total (shift by 1 to handle last element)
        currentMax  = max(nums[i], currentMax + nums[i]);
        maxSum      = max(maxSum, currentMax);
        currentMin  = min(nums[i], currentMin + nums[i]);
        minSum      = min(minSum, currentMin);
    }
    totalSum += nums.back();

    // If all elements negative, circular sum would be empty — not allowed
    if (maxSum < 0) return maxSum;
    return max(maxSum, totalSum - minSum);
}

int main() {
    vector<int> n1 = {1, -2, 3, -2};
    cout << maxCircularSubarray(n1) << endl;  // Output: 3

    vector<int> n2 = {5, -3, 5};
    cout << maxCircularSubarray(n2) << endl;  // Output: 10

    vector<int> n3 = {-3, -2, -3};
    cout << maxCircularSubarray(n3) << endl;  // Output: -2
}
```

---

## 5. Maximum Sum Rectangle in 2D Matrix

### Problem

Given an `m × n` matrix of integers, find the rectangle (submatrix) with the **maximum sum**.

**Example:**
```
Input:
  matrix = [[1, 2, -1, -4, -20],
            [-8,-3,  4,  2,   1],
            [ 3, 8, 10,  1,   3],
            [-4,-1,  1,  7,  -6]]
Output: 29   →  rows 1-3, cols 1-3: [[-3,4,2],[8,10,1],[-1,1,7]]
```

### Approach

Fix left column `l` and right column `r`. Compress rows into a 1D array (sum each row between `l` and `r`). Then apply Kadane's on the 1D array to find the best row range.

**Time:** O(n² × m) | **Space:** O(m)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int kadane(vector<int>& arr) {
    int cur = arr[0], best = arr[0];
    for (int i = 1; i < (int)arr.size(); i++) {
        cur  = max(arr[i], cur + arr[i]);
        best = max(best, cur);
    }
    return best;
}

int maxSumRectangle(vector<vector<int>>& matrix) {
    int m = matrix.size(), n = matrix[0].size();
    int maxSum = INT_MIN;

    for (int l = 0; l < n; l++) {                  // fix left column
        vector<int> rowSum(m, 0);

        for (int r = l; r < n; r++) {              // extend to right column
            for (int i = 0; i < m; i++)
                rowSum[i] += matrix[i][r];         // compress columns into 1D row sums

            maxSum = max(maxSum, kadane(rowSum));   // best row range with Kadane's
        }
    }
    return maxSum;
}

int main() {
    vector<vector<int>> mat = {
        { 1,  2, -1, -4, -20},
        {-8, -3,  4,  2,   1},
        { 3,  8, 10,  1,   3},
        {-4, -1,  1,  7,  -6}
    };
    cout << maxSumRectangle(mat) << endl;  // Output: 29
}
```

---

## 6. Matrix Multiplication — Naive O(n³)

### Problem

Multiply two `n × n` matrices.

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

typedef vector<vector<long long>> Matrix;

Matrix multiply(const Matrix& A, const Matrix& B) {
    int n = A.size();
    Matrix C(n, vector<long long>(n, 0));
    for (int i = 0; i < n; i++)
        for (int k = 0; k < n; k++)           // k loop before j improves cache behavior
            for (int j = 0; j < n; j++)
                C[i][j] += A[i][k] * B[k][j];
    return C;
}

int main() {
    Matrix A = {{1,2},{3,4}};
    Matrix B = {{5,6},{7,8}};
    Matrix C = multiply(A, B);
    for (auto& row : C) { for (long long v : row) cout << v << " "; cout << "\n"; }
    // Output: 19 22
    //         43 50
}
```

**Complexity:** O(n³) time, O(n²) space.

---

## 7. Strassen's Algorithm — O(n^2.81)

### Problem

Multiply two `n × n` matrices using **Strassen's divide-and-conquer** algorithm, which uses **7 multiplications** instead of 8 (reducing exponent from 3 to log₂7 ≈ 2.807).

### Approach — D&C

Split each n×n matrix into four (n/2)×(n/2) sub-matrices. Standard D&C needs 8 recursive multiplications (same as naive). Strassen noticed 7 multiplications suffice:

```
For A = [A11 A12]   B = [B11 B12]
        [A21 A22]       [B21 B22]

M1 = (A11 + A22)(B11 + B22)
M2 = (A21 + A22)(B11)
M3 = (A11)(B12 − B22)
M4 = (A22)(B21 − B11)
M5 = (A11 + A12)(B22)
M6 = (A21 − A11)(B11 + B12)
M7 = (A12 − A22)(B21 + B22)

C11 = M1 + M4 − M5 + M7
C12 = M3 + M5
C21 = M2 + M4
C22 = M1 − M2 + M3 + M6
```

**Recurrence:** T(n) = 7T(n/2) + O(n²) → **T(n) = O(n^log₂7) ≈ O(n^2.807)** (Master Theorem Case 1)

**Time:** O(n^2.807) | **Space:** O(n² log n)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;
typedef vector<vector<long long>> Matrix;

Matrix add(const Matrix& A, const Matrix& B) {
    int n = A.size();
    Matrix C(n, vector<long long>(n));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            C[i][j] = A[i][j] + B[i][j];
    return C;
}

Matrix sub(const Matrix& A, const Matrix& B) {
    int n = A.size();
    Matrix C(n, vector<long long>(n));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            C[i][j] = A[i][j] - B[i][j];
    return C;
}

Matrix strassen(const Matrix& A, const Matrix& B) {
    int n = A.size();

    // Base case
    if (n == 1) return {{A[0][0] * B[0][0]}};

    int half = n / 2;

    // Split matrices into quadrants
    auto split = [&](const Matrix& M, int r, int c) {
        Matrix sub(half, vector<long long>(half));
        for (int i = 0; i < half; i++)
            for (int j = 0; j < half; j++)
                sub[i][j] = M[r+i][c+j];
        return sub;
    };

    Matrix A11 = split(A,0,0),    A12 = split(A,0,half);
    Matrix A21 = split(A,half,0), A22 = split(A,half,half);
    Matrix B11 = split(B,0,0),    B12 = split(B,0,half);
    Matrix B21 = split(B,half,0), B22 = split(B,half,half);

    // 7 Strassen multiplications
    Matrix M1 = strassen(add(A11,A22), add(B11,B22));
    Matrix M2 = strassen(add(A21,A22), B11);
    Matrix M3 = strassen(A11,          sub(B12,B22));
    Matrix M4 = strassen(A22,          sub(B21,B11));
    Matrix M5 = strassen(add(A11,A12), B22);
    Matrix M6 = strassen(sub(A21,A11), add(B11,B12));
    Matrix M7 = strassen(sub(A12,A22), add(B21,B22));

    // Combine into result matrix
    Matrix C(n, vector<long long>(n));
    for (int i = 0; i < half; i++) {
        for (int j = 0; j < half; j++) {
            C[i][j]               = M1[i][j]+M4[i][j]-M5[i][j]+M7[i][j]; // C11
            C[i][j+half]          = M3[i][j]+M5[i][j];                    // C12
            C[i+half][j]          = M2[i][j]+M4[i][j];                    // C21
            C[i+half][j+half]     = M1[i][j]-M2[i][j]+M3[i][j]+M6[i][j]; // C22
        }
    }
    return C;
}

int main() {
    Matrix A = {{1,2,3,4},{5,6,7,8},{9,10,11,12},{13,14,15,16}};
    Matrix B = {{1,0,0,0},{0,1,0,0},{0,0,1,0},{0,0,0,1}};  // identity
    Matrix C = strassen(A, B);
    for (auto& row : C) { for (long long v : row) cout << v << "\t"; cout << "\n"; }
    // Output: same as A (multiplying by identity)
}
```

> **Exam note — Strassen comparisons:**

| Algorithm | Multiplications | Time Complexity |
|---|---|---|
| Naive | 8 recursive × n/2 = n³ | O(n³) |
| Strassen | 7 recursive × n/2 | O(n^2.807) |
| Coppersmith-Winograd | — | O(n^2.376) (theoretical) |

---

## 8. Matrix Exponentiation — Fast Power of Matrix

### Problem

Compute `M^k` (a matrix raised to the `k`th power) efficiently. Used to solve linear recurrences (e.g., Fibonacci in O(log n)).

**Example — Fibonacci:**
```
[F(n+1)]   = [1 1]^n × [1]
[F(n)  ]     [1 0]     [0]
```

### Approach

Same as scalar fast exponentiation: if `k` is even, `M^k = (M^(k/2))²`; if odd, `M^k = M × M^(k-1)`.

**Time:** O(s³ log k) where s = matrix size | **Space:** O(s²)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;
typedef vector<vector<long long>> Matrix;
const long long MOD = 1e9 + 7;

Matrix multiply(const Matrix& A, const Matrix& B) {
    int n = A.size();
    Matrix C(n, vector<long long>(n, 0));
    for (int i = 0; i < n; i++)
        for (int k = 0; k < n; k++)
            for (int j = 0; j < n; j++)
                C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % MOD;
    return C;
}

Matrix matPow(Matrix M, long long k) {
    int n = M.size();
    Matrix result(n, vector<long long>(n, 0));
    for (int i = 0; i < n; i++) result[i][i] = 1;  // identity matrix

    while (k > 0) {
        if (k & 1) result = multiply(result, M);    // odd: multiply result by M
        M = multiply(M, M);                          // square M
        k >>= 1;
    }
    return result;
}

long long fibonacci(int n) {
    if (n <= 1) return n;
    Matrix M = {{1, 1}, {1, 0}};
    Matrix R = matPow(M, n - 1);
    return R[0][0];  // F(n)
}

int main() {
    cout << "F(10) = " << fibonacci(10) << endl;  // Output: 55
    cout << "F(50) = " << fibonacci(50) << endl;  // Output: 12586269025
}
```

---

## 9. Classic Binary Search — Recursive D&C

### Problem

Implement binary search as a pure D&C recursive function, emphasizing the divide-and-conquer structure.

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

int binarySearchDC(vector<int>& nums, int target, int left, int right) {
    if (left > right) return -1;         // base case: not found

    int mid = left + (right - left) / 2; // divide

    if (nums[mid] == target) return mid;  // found
    if (nums[mid] > target)
        return binarySearchDC(nums, target, left, mid - 1);   // conquer left
    else
        return binarySearchDC(nums, target, mid + 1, right);  // conquer right
}

int main() {
    vector<int> nums = {1, 3, 5, 7, 9, 11, 13};
    cout << binarySearchDC(nums, 7,  0, nums.size()-1) << endl;  // Output: 3
    cout << binarySearchDC(nums, 6,  0, nums.size()-1) << endl;  // Output: -1
}
```

**Recurrence:** T(n) = T(n/2) + O(1) → **T(n) = O(log n)** (Master Theorem Case 2)

---

## 10. Find Peak Element

### Problem

A peak element is one that is **strictly greater than its neighbors**. Find the index of any peak element. Do it in O(log n).

**Example:**
```
Input:  nums = [1, 2, 3, 1]  →  Output: 2  (nums[2]=3 is a peak)
Input:  nums = [1, 2, 1, 3, 5, 6, 4]  →  Output: 1 or 5
```

### Approach — D&C Binary Search

At `mid`: if `nums[mid] < nums[mid+1]`, a peak must exist in the right half (the slope is rising). Otherwise a peak exists in the left half (including `mid`). This is binary search guided by the gradient.

**Time:** O(log n) | **Space:** O(log n) recursive stack, O(1) iteratively

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

int findPeakElement(vector<int>& nums) {
    int left = 0, right = nums.size() - 1;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] < nums[mid + 1])
            left = mid + 1;   // rising slope → peak is to the right
        else
            right = mid;      // falling slope → peak is here or to the left
    }
    return left;  // left == right at the peak
}

int main() {
    vector<int> n1 = {1, 2, 3, 1};
    cout << findPeakElement(n1) << endl;  // Output: 2

    vector<int> n2 = {1, 2, 1, 3, 5, 6, 4};
    cout << findPeakElement(n2) << endl;  // Output: 5
}
```

---

## 11. Find Median of Two Sorted Arrays

### Problem

Given two sorted arrays of sizes `m` and `n`, find the **median** of the combined sorted array in O(log(min(m,n))).

**Example:**
```
Input:  nums1 = [1,3],   nums2 = [2]      →  Output: 2.0
Input:  nums1 = [1,2],   nums2 = [3,4]    →  Output: 2.5
Input:  nums1 = [0,0],   nums2 = [0,0]    →  Output: 0.0
```

### Approach — Binary Search on Partition

Binary-search on the smaller array for the correct **partition point** such that all elements in the left half ≤ all elements in the right half.

For combined size `(m+n)`, the left half has `(m+n+1)/2` elements. Try all partitions of `nums1` and check validity.

**Time:** O(log(min(m,n))) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    // Ensure nums1 is the smaller array
    if (nums1.size() > nums2.size())
        return findMedianSortedArrays(nums2, nums1);

    int m = nums1.size(), n = nums2.size();
    int half = (m + n + 1) / 2;

    int left = 0, right = m;

    while (left <= right) {
        int i = left + (right - left) / 2;  // partition in nums1
        int j = half - i;                   // partition in nums2

        int maxLeft1  = (i == 0) ? INT_MIN : nums1[i - 1];
        int minRight1 = (i == m) ? INT_MAX : nums1[i];
        int maxLeft2  = (j == 0) ? INT_MIN : nums2[j - 1];
        int minRight2 = (j == n) ? INT_MAX : nums2[j];

        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
            // Correct partition found
            if ((m + n) % 2 == 1)
                return max(maxLeft1, maxLeft2);
            else
                return (max(maxLeft1, maxLeft2) + min(minRight1, minRight2)) / 2.0;
        } else if (maxLeft1 > minRight2) {
            right = i - 1;   // too far right in nums1
        } else {
            left  = i + 1;   // too far left in nums1
        }
    }
    return 0.0;
}

int main() {
    vector<int> a = {1, 3}, b = {2};
    cout << findMedianSortedArrays(a, b) << endl;  // Output: 2

    vector<int> c = {1, 2}, d = {3, 4};
    cout << findMedianSortedArrays(c, d) << endl;  // Output: 2.5
}
```

---

## 12. Kth Smallest in Two Sorted Arrays

### Problem

Find the **k-th smallest element** in the merged result of two sorted arrays without merging them explicitly.

**Example:**
```
Input:  a = [2,3,6,7,9],  b = [1,4,8,10],  k = 5
Output: 6
```

### Approach

Recursive D&C: compare the elements at position `k/2` in each array. Eliminate the smaller half — those elements cannot contain the k-th smallest.

**Time:** O(log k) | **Space:** O(log k)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int kthSmallestTwo(vector<int>& a, vector<int>& b, int ia, int ib, int k) {
    if (ia >= (int)a.size()) return b[ib + k - 1];  // a exhausted
    if (ib >= (int)b.size()) return a[ia + k - 1];  // b exhausted
    if (k == 1) return min(a[ia], b[ib]);            // base case

    int half = k / 2;
    int midA = (ia + half - 1 < (int)a.size()) ? a[ia + half - 1] : INT_MAX;
    int midB = (ib + half - 1 < (int)b.size()) ? b[ib + half - 1] : INT_MAX;

    if (midA < midB)
        return kthSmallestTwo(a, b, ia + half, ib, k - half);  // discard first half of a
    else
        return kthSmallestTwo(a, b, ia, ib + half, k - half);  // discard first half of b
}

int main() {
    vector<int> a = {2, 3, 6, 7, 9};
    vector<int> b = {1, 4, 8, 10};
    cout << kthSmallestTwo(a, b, 0, 0, 5) << endl;  // Output: 6
}
```

---

## 13. Aggressive Cows — Binary Search on Answer

### Problem

Given `n` stall positions and `k` cows, place cows in stalls such that the **minimum distance between any two cows is maximized**.

**Example:**
```
Input:  stalls = [1, 2, 4, 8, 9],  k = 3
Output: 3   (place cows at 1, 4, 9 → min distance = 3)
```

### Approach — Binary Search on Answer

Binary search on the answer (minimum distance `d`). For each candidate `d`, greedily check if `k` cows can be placed with all pairwise distances ≥ `d`.

**Time:** O(n log n + n log(max_dist)) | **Space:** O(1)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

bool canPlace(vector<int>& stalls, int k, int minDist) {
    int count = 1, last = stalls[0];
    for (int i = 1; i < (int)stalls.size(); i++) {
        if (stalls[i] - last >= minDist) {
            count++;
            last = stalls[i];
            if (count >= k) return true;
        }
    }
    return count >= k;
}

int aggressiveCows(vector<int>& stalls, int k) {
    sort(stalls.begin(), stalls.end());
    int lo = 1, hi = stalls.back() - stalls[0], ans = 0;

    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (canPlace(stalls, k, mid)) {
            ans = mid;   // mid is achievable — try larger
            lo  = mid + 1;
        } else {
            hi  = mid - 1;
        }
    }
    return ans;
}

int main() {
    vector<int> stalls = {1, 2, 4, 8, 9};
    cout << aggressiveCows(stalls, 3) << endl;  // Output: 3
}
```

---

## 14. Count Inversions — Modified Merge Sort

### Problem

Count the number of **inversions** in an array: pairs `(i, j)` where `i < j` but `arr[i] > arr[j]`. This measures how far the array is from being sorted.

**Example:**
```
Input:  arr = [2, 4, 1, 3, 5]
Output: 3   →  pairs: (2,1), (4,1), (4,3)
```

### Approach — D&C Merge Sort

During the merge step, when an element from the right half is placed before elements remaining in the left half, it forms inversions with ALL remaining left-half elements. Count them there.

**Time:** O(n log n) | **Space:** O(n)

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

long long mergeCount(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp;
    int i = left, j = mid + 1;
    long long inversions = 0;

    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp.push_back(arr[i++]);
        } else {
            // arr[i..mid] are all inversions with arr[j] (they're all > arr[j])
            inversions += (mid - i + 1);
            temp.push_back(arr[j++]);
        }
    }
    while (i <= mid)   temp.push_back(arr[i++]);
    while (j <= right) temp.push_back(arr[j++]);

    for (int k = left; k <= right; k++)
        arr[k] = temp[k - left];

    return inversions;
}

long long countInversions(vector<int>& arr, int left, int right) {
    if (left >= right) return 0;
    int mid = left + (right - left) / 2;
    long long inv = 0;
    inv += countInversions(arr, left,    mid);
    inv += countInversions(arr, mid + 1, right);
    inv += mergeCount(arr, left, mid, right);
    return inv;
}

int main() {
    vector<int> arr = {2, 4, 1, 3, 5};
    cout << countInversions(arr, 0, arr.size()-1) << endl;  // Output: 3

    vector<int> arr2 = {5, 4, 3, 2, 1};
    cout << countInversions(arr2, 0, arr2.size()-1) << endl;  // Output: 10 (worst case)
}
```

---

## 15. Closest Pair of Points

### Problem

Given `n` points in a 2D plane, find the pair of points with the **smallest Euclidean distance**.

**Example:**
```
Input:  points = [(2,3),(12,30),(40,50),(5,1),(12,10),(3,4)]
Output: 1.414   →  points (2,3) and (3,4)
```

### Approach — D&C

1. Sort by x-coordinate. Divide at midpoint.
2. Recursively find `d = min(leftMin, rightMin)`.
3. Find the **strip** of points within distance `d` of the dividing line.
4. Check strip pairs (only need to check at most 7 points ahead per point in the strip — proven bound).

**Time:** O(n log² n) (simple) or O(n log n) with pre-sorted y | **Space:** O(n)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <float.h>
using namespace std;

struct Point { double x, y; };

double dist(const Point& a, const Point& b) {
    return sqrt((a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y));
}

double stripClosest(vector<Point>& strip, double d) {
    // Sort strip by y-coordinate
    sort(strip.begin(), strip.end(), [](const Point& a, const Point& b){
        return a.y < b.y;
    });
    double minD = d;
    for (int i = 0; i < (int)strip.size(); i++)
        for (int j = i+1; j < (int)strip.size() && (strip[j].y - strip[i].y) < minD; j++)
            minD = min(minD, dist(strip[i], strip[j]));
    return minD;
}

double closestPairRec(vector<Point>& pts, int left, int right) {
    if (right - left <= 2) {  // base case: brute force
        double d = DBL_MAX;
        for (int i = left; i < right; i++)
            for (int j = i+1; j <= right; j++)
                d = min(d, dist(pts[i], pts[j]));
        sort(pts.begin()+left, pts.begin()+right+1, [](const Point& a, const Point& b){
            return a.y < b.y;
        });
        return d;
    }
    int mid = left + (right - left) / 2;
    double midX = pts[mid].x;

    double dl = closestPairRec(pts, left, mid);
    double dr = closestPairRec(pts, mid+1, right);
    double d  = min(dl, dr);

    // Build strip
    vector<Point> strip;
    for (int i = left; i <= right; i++)
        if (abs(pts[i].x - midX) < d)
            strip.push_back(pts[i]);

    return min(d, stripClosest(strip, d));
}

double closestPair(vector<Point> pts) {
    sort(pts.begin(), pts.end(), [](const Point& a, const Point& b){ return a.x < b.x; });
    return closestPairRec(pts, 0, pts.size()-1);
}

int main() {
    vector<Point> pts = {{2,3},{12,30},{40,50},{5,1},{12,10},{3,4}};
    cout << "Min distance: " << closestPair(pts) << endl;  // Output: ~1.414
}
```

---

## 16. Tower of Hanoi

### Problem

Move `n` disks from source peg to destination peg using an auxiliary peg, following the rules: (1) only one disk at a time, (2) never place a larger disk on a smaller one.

**Example:**
```
n = 3  →  Minimum 7 moves
```

### Approach — Pure D&C

```
Move(n, from, to, aux):
  1. Move(n-1, from, aux, to)  — move top n-1 to auxiliary
  2. Move disk n from → to    — move largest disk
  3. Move(n-1, aux, to, from) — move n-1 from auxiliary to destination
```

**Recurrence:** T(n) = 2T(n-1) + 1 → **T(n) = O(2ⁿ)**

This is optimal — 2ⁿ - 1 moves are required (provably).

### Solution

```cpp
#include <iostream>
using namespace std;

int moveCount = 0;

void hanoi(int n, char from, char to, char aux) {
    if (n == 0) return;
    hanoi(n-1, from, aux, to);             // move n-1 disks to aux
    cout << "Move disk " << n << ": " << from << " → " << to << "\n";
    moveCount++;
    hanoi(n-1, aux, to, from);             // move n-1 disks from aux to destination
}

int main() {
    int n = 3;
    hanoi(n, 'A', 'C', 'B');
    cout << "Total moves: " << moveCount << endl;  // Output: 7 (= 2^3 - 1)

    // Formula verification
    cout << "Formula 2^n - 1 = " << ((1 << n) - 1) << endl;
}
```

---

## 17. Fast Power — Exponentiation by Squaring

### Problem

Compute `base^exp % mod` efficiently.

**Example:**
```
2^10 = 1024
2^10 % 1000 = 24
```

### Approach — D&C

If exp is even: `base^exp = (base^(exp/2))²`  
If exp is odd: `base^exp = base × base^(exp-1)`

**Recurrence:** T(n) = T(n/2) + O(1) → **T(n) = O(log n)**

### Solution

```cpp
#include <iostream>
using namespace std;

long long fastPow(long long base, long long exp, long long mod) {
    if (exp == 0) return 1;
    if (exp % 2 == 0) {
        long long half = fastPow(base, exp / 2, mod);
        return (half * half) % mod;           // square the result
    }
    return (base % mod * fastPow(base, exp - 1, mod)) % mod;  // multiply by base once more
}

// Iterative version (preferred — no stack overhead)
long long fastPowIter(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;  // odd: multiply by base
        base = base * base % mod;                    // square
        exp >>= 1;
    }
    return result;
}

int main() {
    cout << fastPow(2, 10, 1000) << endl;      // Output: 24
    cout << fastPowIter(2, 10, 1000) << endl;  // Output: 24
    cout << fastPowIter(2, 31, 1000000007) << endl;  // 2147483648 % MOD
}
```

---

## 18. Karatsuba Multiplication — Fast Large Integer Multiply

### Problem

Multiply two large `n`-digit numbers faster than the naive O(n²) grade-school method.

### Approach — D&C

Split each number at the midpoint: `x = x1 × 10^m + x0`, `y = y1 × 10^m + y0`.

Naive needs 4 multiplications. Karatsuba uses **3**:
```
z0 = x0 × y0
z2 = x1 × y1
z1 = (x0 + x1)(y0 + y1) − z0 − z2   (Karatsuba's trick!)

result = z2 × 10^(2m) + z1 × 10^m + z0
```

**Recurrence:** T(n) = 3T(n/2) + O(n) → **T(n) = O(n^log₂3) ≈ O(n^1.585)** (Master Theorem Case 1)

### Solution

```cpp
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

// Big number addition
string addStrings(string a, string b) {
    string res = "";
    int i = a.size()-1, j = b.size()-1, carry = 0;
    while (i >= 0 || j >= 0 || carry) {
        int sum = carry;
        if (i >= 0) sum += a[i--] - '0';
        if (j >= 0) sum += b[j--] - '0';
        res += (char)('0' + sum % 10);
        carry = sum / 10;
    }
    reverse(res.begin(), res.end());
    return res.empty() ? "0" : res;
}

// Big number multiplication (naive for demo; Karatsuba recurses on this)
long long karatsuba(long long x, long long y) {
    if (x < 10 || y < 10) return x * y;  // base case

    int n = max(to_string(x).size(), to_string(y).size());
    int m = n / 2;
    long long divisor = 1;
    for (int i = 0; i < m; i++) divisor *= 10;

    long long x1 = x / divisor, x0 = x % divisor;
    long long y1 = y / divisor, y0 = y % divisor;

    long long z0 = karatsuba(x0, y0);
    long long z2 = karatsuba(x1, y1);
    long long z1 = karatsuba(x0 + x1, y0 + y1) - z0 - z2;  // Karatsuba's trick

    return z2 * divisor * divisor + z1 * divisor + z0;
}

int main() {
    cout << karatsuba(1234, 5678) << endl;   // Output: 7006652
    cout << 1234LL * 5678LL << endl;         // Verify: 7006652

    cout << karatsuba(123456789, 987654321) << endl;  // Large numbers
}
```

---

## 19. Find Majority Element — Boyer-Moore + D&C

### Problem

Find the element that appears **more than n/2 times** in an array (majority element).

**Example:**
```
Input:  nums = [3, 2, 3]  →  Output: 3
Input:  nums = [2,2,1,1,1,2,2]  →  Output: 2
```

### Approach 1 — D&C

Split in half. The majority element in the full array must be the majority in at least one half. Recursively find the majority candidate in each half and verify.

**Time:** O(n log n) | **Space:** O(log n)

### Approach 2 — Boyer-Moore Voting (O(n), O(1))

Maintain a candidate and a count. Increment count if current == candidate, else decrement. When count hits 0, switch candidate. The surviving candidate is the majority.

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

// D&C approach
int countInRange(vector<int>& nums, int target, int lo, int hi) {
    int count = 0;
    for (int i = lo; i <= hi; i++) if (nums[i] == target) count++;
    return count;
}

int majorityDC(vector<int>& nums, int lo, int hi) {
    if (lo == hi) return nums[lo];

    int mid = lo + (hi - lo) / 2;
    int left  = majorityDC(nums, lo,    mid);
    int right = majorityDC(nums, mid+1, hi);

    if (left == right) return left;

    int leftCount  = countInRange(nums, left,  lo, hi);
    int rightCount = countInRange(nums, right, lo, hi);
    return leftCount > rightCount ? left : right;
}

// Boyer-Moore approach (optimal)
int majorityBoyerMoore(vector<int>& nums) {
    int candidate = nums[0], count = 1;
    for (int i = 1; i < (int)nums.size(); i++) {
        if (count == 0) { candidate = nums[i]; count = 1; }
        else if (nums[i] == candidate) count++;
        else count--;
    }
    return candidate;
}

int main() {
    vector<int> n1 = {3, 2, 3};
    cout << majorityDC(n1, 0, n1.size()-1) << endl;  // Output: 3
    cout << majorityBoyerMoore(n1) << endl;            // Output: 3

    vector<int> n2 = {2, 2, 1, 1, 1, 2, 2};
    cout << majorityBoyerMoore(n2) << endl;            // Output: 2
}
```

---

## 20. Quickselect — Kth Smallest Element

### Problem

Find the **k-th smallest element** in an unordered array in average O(n) time.

**Example:**
```
Input:  nums = [3,2,1,5,6,4],  k = 2  →  Output: 2
Input:  nums = [3,2,3,1,2,4,5,5,6], k = 4  →  Output: 3
```

### Approach — D&C Partition

Like Quick Sort, but only recurse into the half containing the k-th element. On average, each partition eliminates half the array.

**Time:** O(n) average, O(n²) worst | **Space:** O(log n) average

### Solution

```cpp
#include <iostream>
#include <vector>
using namespace std;

int partition(vector<int>& nums, int lo, int hi) {
    int pivot = nums[hi], i = lo;
    for (int j = lo; j < hi; j++)
        if (nums[j] <= pivot) swap(nums[i++], nums[j]);
    swap(nums[i], nums[hi]);
    return i;
}

int quickselect(vector<int>& nums, int lo, int hi, int k) {
    if (lo == hi) return nums[lo];

    int pivotIdx = partition(nums, lo, hi);

    if (pivotIdx == k) return nums[pivotIdx];
    if (k < pivotIdx)  return quickselect(nums, lo, pivotIdx - 1, k);
    else               return quickselect(nums, pivotIdx + 1, hi, k);
}

int findKthSmallest(vector<int>& nums, int k) {
    return quickselect(nums, 0, nums.size() - 1, k - 1);  // 0-indexed
}

int main() {
    vector<int> n1 = {3, 2, 1, 5, 6, 4};
    cout << findKthSmallest(n1, 2) << endl;  // Output: 2

    vector<int> n2 = {3,2,3,1,2,4,5,5,6};
    cout << findKthSmallest(n2, 4) << endl;  // Output: 3
}
```

---

## 21. Skyline Problem

### Problem

Given `n` buildings as `[left, right, height]`, compute the **skyline** — the outer contour of buildings when viewed from a distance. Output as a list of `[x, height]` key points where the height changes.

**Example:**
```
Input:  buildings = [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]
Output: [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]
```

### Approach — D&C Merge (like Merge Sort)

Split the list of buildings in half. Recursively get left and right skylines. **Merge** the two skylines (like merging two sorted lists), tracking the current max height from each skyline.

**Time:** O(n log n) | **Space:** O(n)

### Solution

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

typedef vector<pair<int,int>> Skyline;  // (x, height)

Skyline merge(const Skyline& L, const Skyline& R) {
    Skyline result;
    int i = 0, j = 0;
    int h1 = 0, h2 = 0;  // current height from each skyline

    while (i < (int)L.size() && j < (int)R.size()) {
        int x, maxH;
        if (L[i].first < R[j].first) {
            x = L[i].first;
            h1 = L[i].second;
            i++;
        } else if (L[i].first > R[j].first) {
            x = R[j].first;
            h2 = R[j].second;
            j++;
        } else {
            x = L[i].first;
            h1 = L[i].second;
            h2 = R[j].second;
            i++; j++;
        }
        maxH = max(h1, h2);
        if (result.empty() || result.back().second != maxH)
            result.push_back({x, maxH});
    }
    while (i < (int)L.size()) result.push_back(L[i++]);
    while (j < (int)R.size()) result.push_back(R[j++]);
    return result;
}

Skyline skylineRec(vector<vector<int>>& bldgs, int lo, int hi) {
    if (lo == hi) {  // single building
        return {{bldgs[lo][0], bldgs[lo][2]}, {bldgs[lo][1], 0}};
    }
    int mid = lo + (hi - lo) / 2;
    Skyline L = skylineRec(bldgs, lo, mid);
    Skyline R = skylineRec(bldgs, mid+1, hi);
    return merge(L, R);
}

vector<vector<int>> getSkyline(vector<vector<int>>& buildings) {
    if (buildings.empty()) return {};
    Skyline sky = skylineRec(buildings, 0, buildings.size()-1);
    vector<vector<int>> result;
    for (auto& [x, h] : sky) result.push_back({x, h});
    return result;
}

int main() {
    vector<vector<int>> bldgs = {{2,9,10},{3,7,15},{5,12,12},{15,20,10},{19,24,8}};
    auto sky = getSkyline(bldgs);
    for (auto& p : sky)
        cout << "[" << p[0] << "," << p[1] << "] ";
    cout << endl;
    // Output: [2,10] [3,15] [7,12] [12,0] [15,10] [20,8] [24,0]
}
```

---

## D&C Recurrence Summary

| Algorithm | Recurrence | Master Theorem | Time |
|---|---|---|---|
| Binary Search | T(n)=T(n/2)+O(1) | Case 2 | O(log n) |
| Merge Sort | T(n)=2T(n/2)+O(n) | Case 2 | O(n log n) |
| Max Subarray D&C | T(n)=2T(n/2)+O(n) | Case 2 | O(n log n) |
| Quick Sort (avg) | T(n)=2T(n/2)+O(n) | Case 2 | O(n log n) |
| Strassen | T(n)=7T(n/2)+O(n²) | Case 1 | O(n^2.807) |
| Karatsuba | T(n)=3T(n/2)+O(n) | Case 1 | O(n^1.585) |
| Closest Pair | T(n)=2T(n/2)+O(n log n) | — | O(n log²n) |
| Tower of Hanoi | T(n)=2T(n-1)+O(1) | — | O(2ⁿ) |
| Fast Power | T(n)=T(n/2)+O(1) | Case 2 | O(log n) |

---

## Patterns Summary

| Pattern | D&C Strategy | Combine Step |
|---|---|---|
| Sorting (merge) | Split at mid | Merge two sorted halves |
| Max Subarray | Split at mid | max(left, right, crossing) |
| Closest Pair | Split by x-coord | Check strip around dividing line |
| Skyline | Split buildings in half | Merge two skylines |
| Count Inversions | Split at mid (merge sort) | Count cross-half inversions during merge |
| Matrix Multiply | Split into quadrants | Combine 7 sub-products (Strassen) |
| Binary Search | Split at mid | Recurse into one half only |
| Quickselect | Partition around pivot | Recurse into one side only |
| Majority Element | Split at mid | Compare counts in merged range |
| Fast Power | exp /= 2 each step | Square result (or multiply by base) |

### Complexity Quick Reference

| Problem | Time | Space |
|---|---|---|
| Max Subarray D&C | O(n log n) | O(log n) |
| Kadane's Algorithm | O(n) | O(1) |
| Max Circular Subarray | O(n) | O(1) |
| Max 2D Rectangle | O(n² m) | O(m) |
| Matrix Multiply Naive | O(n³) | O(n²) |
| Strassen's Algorithm | O(n^2.807) | O(n² log n) |
| Matrix Exponentiation | O(s³ log k) | O(s²) |
| Find Peak Element | O(log n) | O(1) |
| Median of Two Arrays | O(log min(m,n)) | O(1) |
| Kth in Two Arrays | O(log k) | O(log k) |
| Count Inversions | O(n log n) | O(n) |
| Closest Pair | O(n log² n) | O(n) |
| Tower of Hanoi | O(2ⁿ) | O(n) |
| Fast Power | O(log n) | O(1) |
| Karatsuba | O(n^1.585) | O(n) |
| Majority Element D&C | O(n log n) | O(log n) |
| Boyer-Moore Majority | O(n) | O(1) |
| Quickselect | O(n) avg | O(log n) |
| Skyline Problem | O(n log n) | O(n) |

{% endraw %}
