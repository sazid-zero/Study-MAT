---
layout: docs
title: Math & Number Theory
permalink: /math-number-theory/
---

[⬅️ Back to Home]({{ '/' | relative_url }})

---
{% raw %}
# Math & Number Theory

## At a Glance

| Topic | Key Result | Time |
|---|---|---|
| Sieve of Eratosthenes | All primes ≤ n | O(n log log n) |
| GCD (Euclidean) | gcd(a,b) | O(log min(a,b)) |
| Extended GCD | ax+by=gcd(a,b) | O(log min(a,b)) |
| Fast Exponentiation | a^b mod m | O(log b) |
| Matrix Exponentiation | Fibonacci in O(log n) | O(k³ log n) |
| Modular Inverse (Fermat) | a^(p-2) mod p | O(log p) |
| Euler's Totient | φ(n) | O(√n) |
| Miller-Rabin | Primality test (probabilistic) | O(k log² n) |
| nCr mod p | Combinatorics | O(n) preprocess |

---


## Table of Contents

1. [Sieve of Eratosthenes](#1-sieve-of-eratosthenes)
2. [Linear Sieve (O(n) primes + smallest prime factor)](#2-linear-sieve)
3. [Segmented Sieve (large ranges)](#3-segmented-sieve)
4. [GCD and LCM](#4-gcd-and-lcm)
5. [Extended GCD (ax + by = gcd)](#5-extended-gcd)
6. [Modular Arithmetic — Add, Subtract, Multiply, Divide](#6-modular-arithmetic)
7. [Fast Exponentiation (Binary Exponentiation)](#7-fast-exponentiation)
8. [Modular Inverse — Fermat's Little Theorem](#8-modular-inverse--fermats-little-theorem)
9. [Modular Inverse — Extended GCD method](#9-modular-inverse--extended-gcd-method)
10. [Matrix Exponentiation (Fibonacci in O(log n))](#10-matrix-exponentiation)
11. [nCr mod p — Pascal's Triangle](#11-ncr-mod-p--pascals-triangle)
12. [nCr mod p — Factorial + Inverse Factorial](#12-ncr-mod-p--factorial--inverse-factorial)
13. [nCr mod p — Lucas' Theorem (large n, prime p)](#13-ncr-mod-p--lucas-theorem)
14. [Euler's Totient Function](#14-eulers-totient-function)
15. [Euler's Totient — Sieve Variant](#15-eulers-totient--sieve-variant)
16. [Chinese Remainder Theorem (CRT)](#16-chinese-remainder-theorem)
17. [Primality Test — Trial Division](#17-primality-test--trial-division)
18. [Primality Test — Miller-Rabin (Deterministic)](#18-primality-test--miller-rabin)
19. [Integer Factorization — Pollard's Rho](#19-integer-factorization--pollards-rho)
20. [Geometric Series, Sum Formulas, Combinatorial Identities](#20-formulas-reference)

---

## 1. Sieve of Eratosthenes

### Problem

Find all prime numbers ≤ n.

**Algorithm:** Mark all multiples of each prime as composite. Start from 2, mark 2², 3×2, … Then next unmarked is prime (3), mark 3², etc.

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> sieve(int n) {
    vector<bool> is_prime(n+1, true);
    is_prime[0] = is_prime[1] = false;
    for (int i = 2; (long long)i*i <= n; i++) {
        if (is_prime[i]) {
            for (int j = i*i; j <= n; j += i)  // start at i² (smaller multiples already marked)
                is_prime[j] = false;
        }
    }
    vector<int> primes;
    for (int i = 2; i <= n; i++) if (is_prime[i]) primes.push_back(i);
    return primes;
}

int main() {
    auto primes = sieve(50);
    for (int p : primes) cout << p << " ";  // 2 3 5 7 11 13 17 19 23 29 31 37 41 43 47
    cout << "\n";
    cout << "Count of primes ≤ 50: " << primes.size() << "\n";  // 15
}
```

---

## 2. Linear Sieve

Build primes AND smallest prime factor (SPF) array simultaneously in O(n).
Useful for fast factorization: `while n>1: factor = spf[n]; n/=factor`.

```cpp
#include <vector>
using namespace std;

// Returns spf[i] = smallest prime factor of i
// Also collects all primes in order
vector<int> linearSieve(int n) {
    vector<int> spf(n+1, 0), primes;
    for (int i = 2; i <= n; i++) {
        if (!spf[i]) { spf[i] = i; primes.push_back(i); }  // i is prime
        for (int j = 0; j < (int)primes.size() && primes[j] <= spf[i] && (long long)i*primes[j] <= n; j++) {
            spf[i * primes[j]] = primes[j];
        }
    }
    return spf;
}

// Factorize n in O(log n) using SPF
vector<pair<int,int>> factorize(int n, const vector<int>& spf) {
    vector<pair<int,int>> factors;
    while (n > 1) {
        int p = spf[n], cnt = 0;
        while (n % p == 0) { n /= p; cnt++; }
        factors.push_back({p, cnt});
    }
    return factors;
}
```

---

## 3. Segmented Sieve

Find all primes in range [lo, hi] where hi can be up to 10^12 (too large for regular sieve).

```cpp
#include <vector>
#include <cmath>
using namespace std;

// Find all primes in [lo, hi]
vector<long long> segmentedSieve(long long lo, long long hi) {
    int sqrtHi = sqrt((double)hi) + 1;
    // Step 1: sieve small primes up to sqrt(hi)
    vector<bool> smallSieve(sqrtHi+1, true);
    smallSieve[0] = smallSieve[1] = false;
    for (int i = 2; (long long)i*i <= sqrtHi; i++)
        if (smallSieve[i])
            for (int j = i*i; j <= sqrtHi; j += i) smallSieve[j] = false;

    vector<int> smallPrimes;
    for (int i = 2; i <= sqrtHi; i++) if (smallSieve[i]) smallPrimes.push_back(i);

    // Step 2: sieve range [lo, hi]
    int sz = hi - lo + 1;
    vector<bool> seg(sz, true);
    if (lo == 1) seg[0] = false;
    if (lo == 0) { seg[0] = false; if (sz > 1) seg[1] = false; }

    for (int p : smallPrimes) {
        long long start = max((long long)p*p, ((lo + p - 1) / p) * p);
        for (long long j = start; j <= hi; j += p)
            seg[j - lo] = false;
    }

    vector<long long> primes;
    for (long long i = 0; i < sz; i++)
        if (seg[i]) primes.push_back(lo + i);
    return primes;
}

int main() {
    auto primes = segmentedSieve(10, 50);
    for (long long p : primes) cout << p << " ";  // 11 13 17 19 23 29 31 37 41 43 47
    cout << "\n";
}
```

---

## 4. GCD and LCM

```cpp
#include <iostream>
#include <vector>
#include <numeric>  // gcd, lcm in C++17
using namespace std;

// Euclidean GCD: gcd(a, b) = gcd(b, a mod b), base: gcd(a, 0) = a
long long gcd(long long a, long long b) {
    while (b) { a %= b; swap(a, b); }
    return a;
}

long long lcm(long long a, long long b) {
    return a / gcd(a, b) * b;  // divide first to prevent overflow
}

// GCD of array
long long gcdArray(vector<int>& arr) {
    long long g = arr[0];
    for (int x : arr) g = gcd(g, x);
    return g;
}

// LCM of array (careful: result can be huge)
long long lcmArray(vector<int>& arr) {
    long long l = arr[0];
    for (int x : arr) l = lcm(l, x);
    return l;
}

int main() {
    cout << gcd(48, 18) << "\n";   // 6
    cout << lcm(4, 6)  << "\n";   // 12
    // C++17: std::gcd(48, 18), std::lcm(4, 6)
}
```

---

## 5. Extended GCD

### Problem

Find integers x, y such that `ax + by = gcd(a, b)`.

Used for: modular inverse, solving linear Diophantine equations.

```cpp
#include <iostream>
using namespace std;

// Returns gcd(a,b), sets x and y such that a*x + b*y = gcd(a,b)
long long extGCD(long long a, long long b, long long& x, long long& y) {
    if (b == 0) { x = 1; y = 0; return a; }
    long long x1, y1;
    long long g = extGCD(b, a%b, x1, y1);
    x = y1;
    y = x1 - (a/b) * y1;
    return g;
}

// Check if ax + by = c has solution: iff gcd(a,b) | c
// Particular solution: x0 = x * c/g, y0 = y * c/g
// General solution:    x = x0 + (b/g)*t, y = y0 - (a/g)*t for integer t

int main() {
    long long x, y;
    long long g = extGCD(3, 11, x, y);
    cout << "gcd=" << g << " x=" << x << " y=" << y << "\n";
    // 3*4 + 11*(-1) = 1: gcd=1, x=4, y=-1 (verify: 3*4 + 11*(-1) = 12-11 = 1)
    cout << 3*x + 11*y << "\n";  // 1
}
```

---

## 6. Modular Arithmetic

```cpp
const long long MOD = 1e9 + 7;

// Always add MOD before mod to handle negatives
long long addMod(long long a, long long b, long long mod = MOD) {
    return (a + b) % mod;
}
long long subMod(long long a, long long b, long long mod = MOD) {
    return ((a - b) % mod + mod) % mod;  // +mod handles negative
}
long long mulMod(long long a, long long b, long long mod = MOD) {
    return (__int128)a * b % mod;  // use __int128 to avoid overflow before mod
}
// Division: mulMod(a, modInverse(b, mod), mod)

// Safe modular multiply without __int128 (Russian peasant / binary method)
long long mulSafe(long long a, long long b, long long mod) {
    long long res = 0;
    a %= mod;
    while (b > 0) {
        if (b & 1) res = (res + a) % mod;
        a = (a * 2) % mod;
        b >>= 1;
    }
    return res;
}
```

---

## 7. Fast Exponentiation

### Problem

Compute `a^b mod m` in O(log b).

**Key:** `a^b = a^(b/2) * a^(b/2) * (a if b odd)`. Halve exponent each step.

```cpp
#include <iostream>
using namespace std;

long long power(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;  // if bit is set, multiply
        base = base * base % mod;                    // square
        exp >>= 1;
    }
    return result;
}

// Non-modular version (for small numbers)
long long power(long long base, long long exp) {
    long long result = 1;
    while (exp > 0) {
        if (exp & 1) result *= base;
        base *= base;
        exp >>= 1;
    }
    return result;
}

int main() {
    cout << power(2, 10, 1e9+7) << "\n";    // 1024
    cout << power(3, 1000000000LL, 1e9+7) << "\n";  // fast
}
```

---

## 8. Modular Inverse — Fermat's Little Theorem

**Only works when mod is prime.**  
By Fermat: `a^(p-1) ≡ 1 (mod p)` → `a^(-1) ≡ a^(p-2) (mod p)`

```cpp
// Modular inverse of a mod p (p must be prime, gcd(a,p)=1)
long long modInverse(long long a, long long p) {
    return power(a, p-2, p);  // Fermat's little theorem
}

// Division: a/b mod p = a * b^(-1) mod p
long long divMod(long long a, long long b, long long p) {
    return a % p * modInverse(b, p) % p;
}

int main() {
    long long p = 1e9+7;
    cout << modInverse(3, p) << "\n";             // 333333336
    cout << 3 * modInverse(3, p) % (long long)p << "\n";  // 1 (verify)
}
```

---

## 9. Modular Inverse — Extended GCD method

**Works for any modulus m** (not just prime), as long as gcd(a, m) = 1.

```cpp
// Using Extended GCD: find x such that a*x ≡ 1 (mod m)
long long modInverseExt(long long a, long long m) {
    long long x, y;
    long long g = extGCD(a, m, x, y);
    if (g != 1) return -1;  // inverse doesn't exist
    return (x % m + m) % m;
}

// Precompute inverse of all numbers 1..n mod p in O(n)
// Uses recurrence: inv[i] = -(p/i) * inv[p%i] mod p
vector<long long> computeInverses(int n, long long p) {
    vector<long long> inv(n+1);
    inv[1] = 1;
    for (int i = 2; i <= n; i++)
        inv[i] = (p - (p/i) * inv[p%i] % p) % p;
    return inv;
}
```

---

## 10. Matrix Exponentiation

### Problem

Compute Fibonacci(n) in O(log n) using matrix exponentiation.

**Key identity:**
$$\begin{pmatrix} F(n+1) \\ F(n) \end{pmatrix} = \begin{pmatrix} 1 & 1 \\ 1 & 0 \end{pmatrix}^n \begin{pmatrix} 1 \\ 0 \end{pmatrix}$$

```cpp
#include <vector>
#include <iostream>
using namespace std;

const long long MOD = 1e9+7;
typedef vector<vector<long long>> Matrix;

Matrix multiply(const Matrix& A, const Matrix& B) {
    int n = A.size();
    Matrix C(n, vector<long long>(n, 0));
    for (int i = 0; i < n; i++)
        for (int k = 0; k < n; k++) if (A[i][k])
            for (int j = 0; j < n; j++)
                C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % MOD;
    return C;
}

Matrix matpow(Matrix M, long long p) {
    int n = M.size();
    // Identity matrix
    Matrix result(n, vector<long long>(n, 0));
    for (int i = 0; i < n; i++) result[i][i] = 1;
    while (p) {
        if (p & 1) result = multiply(result, M);
        M = multiply(M, M);
        p >>= 1;
    }
    return result;
}

// Fibonacci: F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2)
long long fibonacci(long long n) {
    if (n <= 1) return n;
    Matrix M = {{1, 1}, {1, 0}};
    Matrix R = matpow(M, n-1);
    return R[0][0];  // F(n)
}

// General linear recurrence: f(n) = c1*f(n-1) + c2*f(n-2) + ... + ck*f(n-k)
// Build k×k companion matrix, raise to power n-k, multiply by initial state

int main() {
    for (int i = 0; i <= 10; i++) cout << fibonacci(i) << " ";
    // 0 1 1 2 3 5 8 13 21 34 55
    cout << "\n";
    cout << fibonacci(1000000000LL) % (long long)(1e9+7) << "\n";
}
```

---

## 11. nCr mod p — Pascal's Triangle

**Works for small n** (n ≤ ~2000). Build Pascal's triangle row by row.

```cpp
#include <vector>
using namespace std;

const long long MOD = 1e9+7;

// Precompute C[n][k] for all 0<=k<=n up to maxN
vector<vector<long long>> binomTable(int maxN) {
    vector<vector<long long>> C(maxN+1, vector<long long>(maxN+1, 0));
    for (int i = 0; i <= maxN; i++) {
        C[i][0] = 1;
        for (int j = 1; j <= i; j++)
            C[i][j] = (C[i-1][j-1] + C[i-1][j]) % MOD;
    }
    return C;
}

// Single row of Pascal's triangle — space O(n)
vector<long long> binomRow(int n) {
    vector<long long> row(n+1, 0);
    row[0] = 1;
    for (int i = 1; i <= n; i++)
        for (int j = i; j >= 1; j--)
            row[j] = (row[j] + row[j-1]) % MOD;
    return row;
}
```

---

## 12. nCr mod p — Factorial + Inverse Factorial

**Works for large n** with prime modulus p > n. Precompute factorials and inverse factorials.

```cpp
#include <vector>
using namespace std;

const long long MOD = 1e9+7;
const int MAXN = 2e6+5;

long long fact[MAXN], inv_fact[MAXN];

long long power(long long b, long long e, long long m) {
    long long r = 1; b %= m;
    while (e > 0) { if (e&1) r = r*b%m; b = b*b%m; e >>= 1; }
    return r;
}

void precompute(int n = MAXN-1) {
    fact[0] = 1;
    for (int i = 1; i <= n; i++) fact[i] = fact[i-1] * i % MOD;
    inv_fact[n] = power(fact[n], MOD-2, MOD);  // Fermat
    for (int i = n-1; i >= 0; i--) inv_fact[i] = inv_fact[i+1] * (i+1) % MOD;
}

// nCr = n! / (r! * (n-r)!)
long long C(int n, int r) {
    if (r < 0 || r > n) return 0;
    return fact[n] * inv_fact[r] % MOD * inv_fact[n-r] % MOD;
}

// nPr = n! / (n-r)!
long long P(int n, int r) {
    if (r < 0 || r > n) return 0;
    return fact[n] * inv_fact[n-r] % MOD;
}

int main() {
    precompute();
    cout << C(10, 3) << "\n";   // 120
    cout << C(20, 10) << "\n";  // 184756
}
```

---

## 13. nCr mod p — Lucas' Theorem

**For prime p where n ≥ p.** Lucas: `C(n,r) mod p = C(n div p, r div p) * C(n mod p, r mod p) mod p`

```cpp
#include <vector>
using namespace std;

long long lucasC(long long n, long long r, long long p) {
    if (r == 0) return 1;
    if (r > n) return 0;
    // Precompute table for 0..p-1
    vector<vector<long long>> C(p, vector<long long>(p, 0));
    for (int i = 0; i < p; i++) {
        C[i][0] = 1;
        for (int j = 1; j <= i; j++) C[i][j] = (C[i-1][j-1] + C[i-1][j]) % p;
    }
    // Lucas recurse
    return C[n % p][r % p] * lucasC(n / p, r / p, p) % p;
}

int main() {
    // C(10, 3) mod 7 = 120 mod 7 = 1
    cout << lucasC(10, 3, 7) << "\n";  // 1
    // C(1000000000, 500000000) mod 5 (large numbers, small prime)
    cout << lucasC(1000000000LL, 500000000LL, 5) << "\n";
}
```

---

## 14. Euler's Totient Function

**φ(n)** = count of integers in [1, n] coprime with n.

- Prime p: φ(p) = p-1
- Prime power: φ(p^k) = p^k - p^(k-1)
- Multiplicative: φ(mn) = φ(m)φ(n) if gcd(m,n)=1
- Formula: φ(n) = n × ∏(1 - 1/p) for each distinct prime p | n

```cpp
#include <iostream>
using namespace std;

// φ(n) — single computation in O(√n)
int phi(int n) {
    int result = n;
    for (int p = 2; (long long)p*p <= n; p++) {
        if (n % p == 0) {
            while (n % p == 0) n /= p;
            result -= result / p;  // multiply by (1 - 1/p)
        }
    }
    if (n > 1) result -= result / n;  // n itself is prime
    return result;
}

// Sum of all φ(1..n) using Euler's product formula:
// ∑_{d|n} φ(d) = n

int main() {
    cout << phi(1) << "\n";   // 1
    cout << phi(12) << "\n";  // 4 (1,5,7,11)
    cout << phi(36) << "\n";  // 12
}
```

---

## 15. Euler's Totient — Sieve Variant

**Compute φ(i) for all i in [1..n] in O(n log log n).**

```cpp
#include <vector>
using namespace std;

vector<int> phiSieve(int n) {
    vector<int> phi(n+1);
    iota(phi.begin(), phi.end(), 0);  // phi[i] = i initially
    for (int i = 2; i <= n; i++) {
        if (phi[i] == i) {  // i is prime (not modified yet)
            for (int j = i; j <= n; j += i)
                phi[j] -= phi[j] / i;
        }
    }
    return phi;
}

// Alternative: sieve with clear prime tracking
vector<int> phiSieve2(int n) {
    vector<int> phi(n+1);
    iota(phi.begin(), phi.end(), 0);
    for (int i = 2; i <= n; i++) {
        if (phi[i] == i) {  // prime
            for (int j = i; j <= n; j += i) phi[j] -= phi[j]/i;
        }
    }
    return phi;
}
```

---

## 16. Chinese Remainder Theorem

### Problem

Given `x ≡ r1 (mod m1)`, `x ≡ r2 (mod m2)`, ..., find x (unique mod LCM if pairwise coprime).

```cpp
#include <iostream>
#include <vector>
using namespace std;

long long extGCD(long long a, long long b, long long& x, long long& y) {
    if (b == 0) { x = 1; y = 0; return a; }
    long long x1, y1, g = extGCD(b, a%b, x1, y1);
    x = y1; y = x1 - (a/b)*y1; return g;
}

// CRT for two congruences: x ≡ r1 (m1), x ≡ r2 (m2)
// Returns {remainder, modulus} where modulus = lcm(m1,m2) or -1 if no solution
pair<long long,long long> crt2(long long r1, long long m1, long long r2, long long m2) {
    long long p, q;
    long long g = extGCD(m1, m2, p, q);
    if ((r2 - r1) % g != 0) return {-1, -1};  // no solution
    long long lcm = m1 / g * m2;
    long long x = (r1 + m1 * ((r2-r1)/g % (m2/g) * p % (m2/g))) % lcm;
    return {(x + lcm) % lcm, lcm};
}

// Generalized CRT: solve system of n congruences
long long crt(vector<long long>& r, vector<long long>& m) {
    long long rem = r[0], mod = m[0];
    for (int i = 1; i < (int)r.size(); i++) {
        auto [nr, nm] = crt2(rem, mod, r[i], m[i]);
        if (nr == -1) return -1;
        rem = nr; mod = nm;
    }
    return rem;
}

int main() {
    // x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7) → x = 23
    vector<long long> r = {2, 3, 2}, m = {3, 5, 7};
    cout << crt(r, m) << "\n";  // 23
}
```

---

## 17. Primality Test — Trial Division

```cpp
#include <cmath>
using namespace std;

bool isPrime(long long n) {
    if (n < 2) return false;
    if (n == 2 || n == 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (long long i = 5; i * i <= n; i += 6)
        if (n % i == 0 || n % (i+2) == 0) return false;
    return true;
}

int main() {
    cout << isPrime(97)        << "\n";  // 1
    cout << isPrime(100)       << "\n";  // 0
    cout << isPrime(999999937) << "\n";  // 1 (prime)
}
```

---

## 18. Primality Test — Miller-Rabin

**Deterministic for n < 3.3×10^24** using specific witness sets.

```cpp
#include <iostream>
using namespace std;

// Modular multiplication safe for large numbers
__int128 mulmod(__int128 a, __int128 b, __int128 m) { return a * b % m; }

long long powmod(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = (__int128)result * base % mod;
        base = (__int128)base * base % mod;
        exp >>= 1;
    }
    return result;
}

// Miller-Rabin with witness a
bool millerTest(long long n, long long a) {
    if (n % a == 0) return n == a;
    long long d = n-1; int r = 0;
    while (d % 2 == 0) { d /= 2; r++; }
    long long x = powmod(a, d, n);
    if (x == 1 || x == n-1) return true;
    for (int i = 0; i < r-1; i++) {
        x = (__int128)x * x % n;
        if (x == n-1) return true;
    }
    return false;
}

// Deterministic for n < 3,215,031,751: witnesses {2,3,5,7}
// Deterministic for n < 3,317,044,064,679,887,385,961,981: {2,3,5,7,11,13,17,19,23,29,31,37}
bool isPrimeMR(long long n) {
    if (n < 2) return false;
    for (long long a : {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37}) {
        if (n == a) return true;
        if (!millerTest(n, a)) return false;
    }
    return true;
}

int main() {
    cout << isPrimeMR(999999999999999877LL) << "\n";  // 1 (prime)
    cout << isPrimeMR(999999999999999878LL) << "\n";  // 0
}
```

---

## 19. Integer Factorization — Pollard's Rho

**Factorize large numbers** (up to ~10^18) quickly. Average O(n^(1/4)).

```cpp
#include <iostream>
#include <numeric>
#include <cstdlib>
using namespace std;

long long gcd(long long a, long long b) { while(b) { a%=b; swap(a,b); } return a; }

// f(x) = (x² + c) mod n
long long f(long long x, long long c, long long n) {
    return ((__int128)x * x + c) % n;
}

// Pollard's rho: find a non-trivial factor of n
long long pollardRho(long long n) {
    if (n % 2 == 0) return 2;
    long long x = rand() % (n-2) + 2;
    long long y = x, c = rand() % (n-1) + 1, d = 1;
    while (d == 1) {
        x = f(x, c, n);
        y = f(f(y, c, n), c, n);
        d = gcd(abs(x-y), n);
    }
    return (d == n) ? -1 : d;  // -1: retry with different c
}

// Fully factorize n (returns prime factors with multiplicity)
void factorize(long long n, vector<long long>& factors) {
    if (n == 1) return;
    if (isPrimeMR(n)) { factors.push_back(n); return; }
    long long d = -1;
    while (d == -1) d = pollardRho(n);
    factorize(d, factors);
    factorize(n/d, factors);
}

int main() {
    vector<long long> factors;
    factorize(600851475143LL, factors);
    sort(factors.begin(), factors.end());
    for (long long f : factors) cout << f << " ";  // 71 839 1471 6857
    cout << "\n";
}
```

---

## 20. Formulas Reference

### Common Sums

| Formula | Result |
|---|---|
| $\sum_{i=1}^{n} i$ | $n(n+1)/2$ |
| $\sum_{i=1}^{n} i^2$ | $n(n+1)(2n+1)/6$ |
| $\sum_{i=1}^{n} i^3$ | $[n(n+1)/2]^2$ |
| $\sum_{i=0}^{n} r^i$ | $(r^{n+1}-1)/(r-1)$ |
| $\sum_{i=0}^{\infty} r^i$ (|r|<1) | $1/(1-r)$ |

### Combinatorial Identities

| Identity | Formula |
|---|---|
| Pascal's identity | $C(n,k) = C(n-1,k-1) + C(n-1,k)$ |
| Vandermonde | $C(m+n,r) = \sum C(m,k)C(n,r-k)$ |
| Hockey stick | $\sum_{i=r}^{n} C(i,r) = C(n+1,r+1)$ |
| Binomial theorem | $(x+y)^n = \sum C(n,k) x^k y^{n-k}$ |
| Stars and bars | Distribute n identical items into k bins: $C(n+k-1, k-1)$ |
| Catalan number | $C_n = C(2n,n)/(n+1)$ |

### Number Theory Quick Reference

| Theorem | Statement |
|---|---|
| Fermat's little | $a^p \equiv a \pmod{p}$ when p is prime |
| Euler's theorem | $a^{\phi(n)} \equiv 1 \pmod{n}$ when gcd(a,n)=1 |
| Wilson's theorem | $(p-1)! \equiv -1 \pmod{p}$ for prime p |
| Chinese Remainder | System $x\equiv r_i \pmod{m_i}$ has unique solution mod $\text{lcm}(m_i)$ if $m_i$ pairwise coprime |

---

## Complexity Quick Reference

| Algorithm | Time | Space |
|---|---|---|
| Sieve of Eratosthenes | O(n log log n) | O(n) |
| Linear sieve | O(n) | O(n) |
| Segmented sieve | O((hi-lo) log log hi) | O(√hi) |
| GCD (Euclidean) | O(log min(a,b)) | O(1) |
| Extended GCD | O(log min(a,b)) | O(1) |
| Fast exponentiation | O(log b) | O(1) |
| Matrix exponentiation k×k | O(k³ log n) | O(k²) |
| Modular inverse (Fermat) | O(log p) | O(1) |
| nCr (precomputed factorials) | O(n) preprocess, O(1) query | O(n) |
| Euler's totient φ(n) | O(√n) | O(1) |
| Euler's totient sieve | O(n log log n) | O(n) |
| Trial division primality | O(√n) | O(1) |
| Miller-Rabin | O(k log² n) | O(1) |
| Pollard's Rho | O(n^(1/4) polylog) | O(1) |

{% endraw %}
