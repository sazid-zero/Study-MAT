---
layout: page
title: "Database Fundamentals"
permalink: /database-fundamentals/
---

# Database Fundamentals

A comprehensive guide to database concepts, SQL, and design principles essential for software engineering roles.

---

## Table of Contents

- [Introduction to Databases](#introduction-to-databases)
- [DBMS Concepts](#dbms-concepts)
- [Relational Database Design](#relational-database-design)
- [SQL Basics](#sql-basics)
- [Advanced SQL](#advanced-sql)
- [Normalization](#normalization)
- [Transactions & ACID](#transactions--acid)
- [Indexing](#indexing)
- [Database Design](#database-design)
- [Common Interview Questions](#common-interview-questions)

---

## Introduction to Databases

### What is a Database?

A **database** is an organized collection of structured data stored electronically, designed for efficient retrieval, management, and updating.

### Types of Databases

**1. Relational Databases (SQL)**
- Data stored in tables with rows and columns
- Relationships between tables
- Examples: MySQL, PostgreSQL, Oracle, SQL Server

**2. NoSQL Databases**
- Flexible schema
- Types: Document (MongoDB), Key-Value (Redis), Column (Cassandra), Graph (Neo4j)

**3. In-Memory Databases**
- Data stored in RAM for faster access
- Examples: Redis, Memcached

### Why Databases?

✅ **Data Persistence** - Data survives program termination  
✅ **Concurrent Access** - Multiple users can access simultaneously  
✅ **Data Integrity** - Constraints ensure data validity  
✅ **Security** - Access control and authentication  
✅ **Efficient Querying** - Fast data retrieval with indexing  
✅ **Backup & Recovery** - Data protection mechanisms

---

## DBMS Concepts

### What is a DBMS?

**Database Management System** - Software for creating, managing, and interacting with databases.

### DBMS Architecture

**Three-Level Architecture:**

```
┌─────────────────────────────┐
│      External Level         │  ← User Views
│  (View 1, View 2, ...)      │
├─────────────────────────────┤
│      Conceptual Level       │  ← Logical Structure
│  (Tables, Relationships)    │
├─────────────────────────────┤
│      Internal Level         │  ← Physical Storage
│  (Files, Indexes)           │
└─────────────────────────────┘
```

### Data Independence

**Logical Data Independence:**
- Ability to change conceptual schema without affecting external schemas
- Example: Adding new column doesn't affect existing views

**Physical Data Independence:**
- Ability to change internal schema without affecting conceptual schema
- Example: Changing storage structure doesn't affect queries

### Database Models

**1. Hierarchical Model**
- Tree structure
- Parent-child relationships
- Example: File systems

**2. Network Model**
- Graph structure
- Many-to-many relationships

**3. Relational Model** (Most Common)
- Data in tables (relations)
- Relationships via keys

**4. Object-Oriented Model**
- Data as objects
- Combines OOP with database features

---

## Relational Database Design

### Key Concepts

**Table (Relation):**
- Collection of related data in rows and columns
- Example: `Students` table

**Row (Tuple/Record):**
- Single data entry
- Example: One student's information

**Column (Attribute/Field):**
- Data field representing a property
- Example: `student_name`, `age`

**Domain:**
- Set of allowed values for an attribute
- Example: Age domain: 0-150

### Keys

**1. Primary Key (PK)**
- Uniquely identifies each row
- Cannot be NULL
- Only one per table

```sql
CREATE TABLE Students (
    student_id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);
```

**2. Foreign Key (FK)**
- References primary key of another table
- Establishes relationships
- Can be NULL

```sql
CREATE TABLE Enrollments (
    enrollment_id INT PRIMARY KEY,
    student_id INT,
    course_id INT,
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);
```

**3. Composite Key**
- Primary key made of multiple columns

```sql
CREATE TABLE CourseInstructor (
    course_id INT,
    instructor_id INT,
    PRIMARY KEY (course_id, instructor_id)
);
```

**4. Candidate Key**
- Columns that could serve as primary key
- Example: `email` and `student_id` both unique

**5. Super Key**
- Set of attributes that uniquely identifies rows
- Example: `{student_id, name}` is a super key

**6. Alternate Key**
- Candidate keys not chosen as primary key

### Relationships

**1. One-to-One (1:1)**
```
Student ──────── Passport
   1                 1
```

```sql
CREATE TABLE Students (
    student_id INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE Passports (
    passport_id INT PRIMARY KEY,
    student_id INT UNIQUE,
    passport_number VARCHAR(20),
    FOREIGN KEY (student_id) REFERENCES Students(student_id)
);
```

**2. One-to-Many (1:N)**
```
Department ──────── Employee
     1                  N
```

```sql
CREATE TABLE Departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(100)
);

CREATE TABLE Employees (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100),
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES Departments(dept_id)
);
```

**3. Many-to-Many (M:N)**
```
Student ──────── Course
   M                N
```

Requires junction/bridge table:

```sql
CREATE TABLE Students (
    student_id INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE Courses (
    course_id INT PRIMARY KEY,
    course_name VARCHAR(100)
);

-- Junction table
CREATE TABLE Enrollments (
    student_id INT,
    course_id INT,
    enrollment_date DATE,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);
```

---

## SQL Basics

### Data Definition Language (DDL)

**CREATE TABLE:**
```sql
CREATE TABLE Employees (
    emp_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    salary DECIMAL(10, 2),
    hire_date DATE,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES Departments(dept_id)
);
```

**ALTER TABLE:**
```sql
-- Add column
ALTER TABLE Employees ADD COLUMN phone VARCHAR(15);

-- Modify column
ALTER TABLE Employees MODIFY COLUMN salary DECIMAL(12, 2);

-- Drop column
ALTER TABLE Employees DROP COLUMN phone;

-- Add constraint
ALTER TABLE Employees ADD CONSTRAINT chk_salary CHECK (salary > 0);
```

**DROP TABLE:**
```sql
DROP TABLE Employees;
```

**TRUNCATE TABLE:**
```sql
TRUNCATE TABLE Employees;  -- Deletes all rows, keeps structure
```

### Data Manipulation Language (DML)

**INSERT:**
```sql
-- Single row
INSERT INTO Employees (first_name, last_name, email, salary, hire_date)
VALUES ('John', 'Doe', 'john@example.com', 50000.00, '2024-01-15');

-- Multiple rows
INSERT INTO Employees (first_name, last_name, email, salary)
VALUES 
    ('Jane', 'Smith', 'jane@example.com', 55000.00),
    ('Bob', 'Johnson', 'bob@example.com', 48000.00);
```

**SELECT:**
```sql
-- All columns
SELECT * FROM Employees;

-- Specific columns
SELECT first_name, last_name, salary FROM Employees;

-- With conditions
SELECT * FROM Employees WHERE salary > 50000;

-- With sorting
SELECT * FROM Employees ORDER BY salary DESC;

-- With limit
SELECT * FROM Employees LIMIT 10;
```

**UPDATE:**
```sql
UPDATE Employees 
SET salary = 55000.00, dept_id = 2 
WHERE emp_id = 1;

-- Update with calculation
UPDATE Employees 
SET salary = salary * 1.10 
WHERE dept_id = 1;
```

**DELETE:**
```sql
DELETE FROM Employees WHERE emp_id = 1;

-- Delete all rows (use with caution!)
DELETE FROM Employees;
```

### WHERE Clause Operators

```sql
-- Comparison operators
SELECT * FROM Employees WHERE salary >= 50000;
SELECT * FROM Employees WHERE dept_id = 1;
SELECT * FROM Employees WHERE first_name != 'John';

-- BETWEEN
SELECT * FROM Employees WHERE salary BETWEEN 40000 AND 60000;

-- IN
SELECT * FROM Employees WHERE dept_id IN (1, 2, 3);

-- LIKE (pattern matching)
SELECT * FROM Employees WHERE first_name LIKE 'J%';     -- Starts with J
SELECT * FROM Employees WHERE email LIKE '%@gmail.com'; -- Ends with
SELECT * FROM Employees WHERE last_name LIKE '_o%';     -- Second char is 'o'

-- IS NULL / IS NOT NULL
SELECT * FROM Employees WHERE dept_id IS NULL;
SELECT * FROM Employees WHERE email IS NOT NULL;

-- Logical operators
SELECT * FROM Employees 
WHERE salary > 50000 AND dept_id = 1;

SELECT * FROM Employees 
WHERE dept_id = 1 OR dept_id = 2;

SELECT * FROM Employees 
WHERE NOT (salary < 40000);
```

---

## Advanced SQL

### Aggregate Functions

```sql
-- COUNT
SELECT COUNT(*) FROM Employees;
SELECT COUNT(DISTINCT dept_id) FROM Employees;

-- SUM
SELECT SUM(salary) FROM Employees;

-- AVG
SELECT AVG(salary) FROM Employees;

-- MIN / MAX
SELECT MIN(salary), MAX(salary) FROM Employees;
```

### GROUP BY & HAVING

```sql
-- Group by department
SELECT dept_id, COUNT(*) as emp_count, AVG(salary) as avg_salary
FROM Employees
GROUP BY dept_id;

-- HAVING (filter groups)
SELECT dept_id, AVG(salary) as avg_salary
FROM Employees
GROUP BY dept_id
HAVING AVG(salary) > 50000;

-- Multiple grouping
SELECT dept_id, YEAR(hire_date) as year, COUNT(*) as count
FROM Employees
GROUP BY dept_id, YEAR(hire_date)
ORDER BY dept_id, year;
```

### Joins

**INNER JOIN:**
```sql
SELECT e.first_name, e.last_name, d.dept_name
FROM Employees e
INNER JOIN Departments d ON e.dept_id = d.dept_id;
```

**LEFT JOIN (LEFT OUTER JOIN):**
```sql
-- All employees, even without department
SELECT e.first_name, e.last_name, d.dept_name
FROM Employees e
LEFT JOIN Departments d ON e.dept_id = d.dept_id;
```

**RIGHT JOIN (RIGHT OUTER JOIN):**
```sql
-- All departments, even without employees
SELECT e.first_name, d.dept_name
FROM Employees e
RIGHT JOIN Departments d ON e.dept_id = d.dept_id;
```

**FULL OUTER JOIN:**
```sql
-- All employees and all departments
SELECT e.first_name, d.dept_name
FROM Employees e
FULL OUTER JOIN Departments d ON e.dept_id = d.dept_id;
```

**CROSS JOIN:**
```sql
-- Cartesian product
SELECT e.first_name, d.dept_name
FROM Employees e
CROSS JOIN Departments d;
```

**SELF JOIN:**
```sql
-- Find employees with same salary
SELECT e1.first_name, e2.first_name, e1.salary
FROM Employees e1
JOIN Employees e2 ON e1.salary = e2.salary AND e1.emp_id != e2.emp_id;
```

### Subqueries

**Single-row subquery:**
```sql
SELECT * FROM Employees
WHERE salary > (SELECT AVG(salary) FROM Employees);
```

**Multi-row subquery:**
```sql
SELECT * FROM Employees
WHERE dept_id IN (
    SELECT dept_id FROM Departments WHERE location = 'New York'
);
```

**Correlated subquery:**
```sql
SELECT e1.first_name, e1.salary
FROM Employees e1
WHERE e1.salary > (
    SELECT AVG(e2.salary)
    FROM Employees e2
    WHERE e2.dept_id = e1.dept_id
);
```

**EXISTS:**
```sql
SELECT d.dept_name
FROM Departments d
WHERE EXISTS (
    SELECT 1 FROM Employees e WHERE e.dept_id = d.dept_id
);
```

### String Functions

```sql
-- CONCAT
SELECT CONCAT(first_name, ' ', last_name) as full_name FROM Employees;

-- UPPER / LOWER
SELECT UPPER(first_name), LOWER(last_name) FROM Employees;

-- LENGTH
SELECT first_name, LENGTH(first_name) as name_length FROM Employees;

-- SUBSTRING
SELECT SUBSTRING(email, 1, 5) FROM Employees;

-- TRIM
SELECT TRIM('  hello  ');  -- 'hello'

-- REPLACE
SELECT REPLACE(email, '@gmail.com', '@company.com') FROM Employees;
```

### Date Functions

```sql
-- Current date/time
SELECT NOW(), CURDATE(), CURTIME();

-- Extract parts
SELECT YEAR(hire_date), MONTH(hire_date), DAY(hire_date) FROM Employees;

-- Date arithmetic
SELECT hire_date, DATE_ADD(hire_date, INTERVAL 1 YEAR) FROM Employees;
SELECT DATEDIFF(NOW(), hire_date) as days_employed FROM Employees;

-- Formatting
SELECT DATE_FORMAT(hire_date, '%M %d, %Y') FROM Employees;
```

### Window Functions

```sql
-- ROW_NUMBER
SELECT first_name, salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) as row_num
FROM Employees;

-- RANK (with gaps for ties)
SELECT first_name, salary,
    RANK() OVER (ORDER BY salary DESC) as rank
FROM Employees;

-- DENSE_RANK (no gaps)
SELECT first_name, salary,
    DENSE_RANK() OVER (ORDER BY salary DESC) as dense_rank
FROM Employees;

-- Partition by
SELECT first_name, dept_id, salary,
    ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) as dept_rank
FROM Employees;
```

---

## Normalization

Process of organizing data to reduce redundancy and improve integrity.

### Normal Forms

**1NF (First Normal Form):**
- Atomic values (no multi-valued attributes)
- Each row is unique

❌ **Violates 1NF:**
```
| student_id | name  | courses          |
|------------|-------|------------------|
| 1          | John  | Math, Physics    |
```

✅ **Follows 1NF:**
```
| student_id | name  | course   |
|------------|-------|----------|
| 1          | John  | Math     |
| 1          | John  | Physics  |
```

**2NF (Second Normal Form):**
- Must be in 1NF
- No partial dependencies (non-key attributes depend on entire primary key)

❌ **Violates 2NF:**
```
| student_id | course_id | student_name | course_name |
|------------|-----------|--------------|-------------|
| 1          | 101       | John         | Math        |
```
(student_name depends only on student_id, not the entire composite key)

✅ **Follows 2NF:**
```
Students:
| student_id | student_name |
|------------|--------------|
| 1          | John         |

Courses:
| course_id | course_name |
|-----------|-------------|
| 101       | Math        |

Enrollments:
| student_id | course_id |
|------------|-----------|
| 1          | 101       |
```

**3NF (Third Normal Form):**
- Must be in 2NF
- No transitive dependencies (non-key attributes depend only on primary key)

❌ **Violates 3NF:**
```
| emp_id | name  | dept_id | dept_name |
|--------|-------|---------|-----------|
| 1      | John  | 10      | Sales     |
```
(dept_name depends on dept_id, not directly on emp_id)

✅ **Follows 3NF:**
```
Employees:
| emp_id | name  | dept_id |
|--------|-------|---------|
| 1      | John  | 10      |

Departments:
| dept_id | dept_name |
|---------|-----------|
| 10      | Sales     |
```

**BCNF (Boyce-Codd Normal Form):**
- Stronger version of 3NF
- For every functional dependency X → Y, X must be a super key

**4NF (Fourth Normal Form):**
- Must be in BCNF
- No multi-valued dependencies

### Benefits of Normalization

✅ Reduces data redundancy  
✅ Improves data integrity  
✅ Easier maintenance  
✅ Better query performance (for updates)

### Denormalization

Intentionally adding redundancy for performance:
- Faster read queries (fewer joins)
- Used in data warehouses, reporting systems

---

## Transactions & ACID

### Transaction

A **transaction** is a logical unit of work containing one or more SQL operations.

```sql
START TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;

COMMIT;  -- or ROLLBACK; if error
```

### ACID Properties

**A - Atomicity:**
- All operations succeed or all fail
- No partial transactions

```sql
BEGIN TRANSACTION;
-- Transfer money
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
-- If any fails, ROLLBACK entire transaction
COMMIT;
```

**C - Consistency:**
- Database remains in valid state
- Constraints are enforced
- Example: Balance cannot be negative

**I - Isolation:**
- Concurrent transactions don't interfere
- Intermediate states not visible to others

**Isolation Levels:**
1. **READ UNCOMMITTED** - Dirty reads possible
2. **READ COMMITTED** - No dirty reads
3. **REPEATABLE READ** - Same data on re-read
4. **SERIALIZABLE** - Highest isolation

**D - Durability:**
- Committed changes persist
- Survive system crashes

### Transaction Commands

```sql
-- Start transaction
START TRANSACTION;
BEGIN;

-- Save changes
COMMIT;

-- Undo changes
ROLLBACK;

-- Savepoint
SAVEPOINT sp1;
ROLLBACK TO sp1;
```

---

## Indexing

### What is an Index?

Data structure that improves query performance by providing quick lookups.

**Analogy:** Like a book index - quickly find pages without reading entire book.

### Types of Indexes

**1. Primary Index:**
- Automatically created on primary key
- Unique, clustered

**2. Secondary Index:**
- Created on non-primary key columns
- Non-clustered

**3. Unique Index:**
```sql
CREATE UNIQUE INDEX idx_email ON Employees(email);
```

**4. Composite Index:**
```sql
CREATE INDEX idx_name ON Employees(first_name, last_name);
```

**5. Full-Text Index:**
```sql
CREATE FULLTEXT INDEX idx_description ON Products(description);
```

### Creating Indexes

```sql
-- Single column
CREATE INDEX idx_salary ON Employees(salary);

-- Multiple columns
CREATE INDEX idx_dept_salary ON Employees(dept_id, salary);

-- Unique index
CREATE UNIQUE INDEX idx_email ON Employees(email);

-- Drop index
DROP INDEX idx_salary ON Employees;
```

### When to Use Indexes

✅ **Use indexes when:**
- Column frequently used in WHERE clause
- Column used in JOIN conditions
- Column used in ORDER BY
- Large tables with many rows
- Read-heavy workloads

❌ **Avoid indexes when:**
- Small tables
- Frequently updated columns
- Low cardinality columns (few distinct values)
- Write-heavy workloads

### Index Performance

**Benefits:**
- Faster SELECT queries
- Faster JOIN operations
- Faster sorting

**Costs:**
- Slower INSERT/UPDATE/DELETE
- Requires storage space
- Maintenance overhead

---

## 🎨 Database Design

### Design Process

1. **Requirements Analysis**
   - Understand data needs
   - Identify entities and attributes

2. **Conceptual Design (ER Diagram)**
   - Create Entity-Relationship diagram
   - Define relationships

3. **Logical Design**
   - Convert ER to tables
   - Apply normalization

4. **Physical Design**
   - Choose data types
   - Create indexes
   - Optimize for performance

### ER Diagram Components

**Entities:** Objects with attributes
```
┌─────────────┐
│   Student   │
├─────────────┤
│ student_id  │
│ name        │
│ email       │
└─────────────┘
```

**Relationships:** Associations between entities
```
Student ──[enrolls in]── Course
```

**Attributes:** Properties of entities
- **Simple:** Cannot be divided (age)
- **Composite:** Can be divided (full_name → first_name + last_name)
- **Derived:** Calculated (age from date_of_birth)
- **Multi-valued:** Multiple values (phone_numbers)

### Example: University Database

**Entities:**
- Students (student_id, name, email, dob)
- Courses (course_id, course_name, credits)
- Instructors (instructor_id, name, department)
- Enrollments (enrollment_id, student_id, course_id, grade)

**Relationships:**
- Students enroll in Courses (M:N)
- Instructors teach Courses (1:N)

**Tables:**
```sql
CREATE TABLE Students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    date_of_birth DATE
);

CREATE TABLE Courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(10) UNIQUE,
    course_name VARCHAR(100),
    credits INT,
    instructor_id INT,
    FOREIGN KEY (instructor_id) REFERENCES Instructors(instructor_id)
);

CREATE TABLE Instructors (
    instructor_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    department VARCHAR(50),
    email VARCHAR(100) UNIQUE
);

CREATE TABLE Enrollments (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    enrollment_date DATE,
    grade VARCHAR(2),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id),
    UNIQUE(student_id, course_id)
);
```

---

## ❓ Common Interview Questions

### Theory Questions

**1. What is a database?**
- Organized collection of structured data
- Stored electronically for efficient access and management

**2. What is DBMS?**
- Database Management System
- Software to create, manage, and query databases

**3. Difference between SQL and NoSQL?**
- SQL: Structured, fixed schema, ACID, relational
- NoSQL: Flexible schema, eventual consistency, various models

**4. What is normalization?**
- Process to organize data and reduce redundancy
- Improves data integrity
- Normal forms: 1NF, 2NF, 3NF, BCNF

**5. What are ACID properties?**
- Atomicity: All or nothing
- Consistency: Valid state
- Isolation: Concurrent transactions don't interfere
- Durability: Changes persist

**6. Primary key vs Foreign key?**
- Primary: Uniquely identifies row, cannot be NULL
- Foreign: References primary key of another table, establishes relationship

**7. What is an index?**
- Data structure for faster query performance
- Trade-off: Faster reads, slower writes

**8. Types of joins?**
- INNER: Matching rows from both tables
- LEFT: All from left + matching from right
- RIGHT: All from right + matching from left
- FULL OUTER: All rows from both tables
- CROSS: Cartesian product

**9. What is a transaction?**
- Logical unit of work
- All operations succeed or all fail
- Ensures data consistency

**10. Clustered vs Non-clustered index?**
- Clustered: Physical order matches index order, one per table
- Non-clustered: Separate structure with pointers, multiple per table

### SQL Query Questions

**1. Find second highest salary:**
```sql
SELECT MAX(salary) 
FROM Employees 
WHERE salary < (SELECT MAX(salary) FROM Employees);

-- OR using LIMIT
SELECT salary 
FROM Employees 
ORDER BY salary DESC 
LIMIT 1 OFFSET 1;

-- OR using DENSE_RANK
SELECT salary 
FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank 
    FROM Employees
) temp 
WHERE rank = 2;
```

**2. Find duplicate records:**
```sql
SELECT email, COUNT(*) 
FROM Users 
GROUP BY email 
HAVING COUNT(*) > 1;
```

**3. Delete duplicate rows keeping one:**
```sql
DELETE FROM Users 
WHERE id NOT IN (
    SELECT MIN(id) 
    FROM Users 
    GROUP BY email
);
```

**4. Find employees earning more than their manager:**
```sql
SELECT e1.name 
FROM Employees e1 
JOIN Employees e2 ON e1.manager_id = e2.emp_id 
WHERE e1.salary > e2.salary;
```

**5. Find departments with no employees:**
```sql
SELECT d.dept_name 
FROM Departments d 
LEFT JOIN Employees e ON d.dept_id = e.dept_id 
WHERE e.emp_id IS NULL;
```

**6. Nth highest salary using subquery:**
```sql
SELECT salary 
FROM Employees e1 
WHERE (N-1) = (
    SELECT COUNT(DISTINCT salary) 
    FROM Employees e2 
    WHERE e2.salary > e1.salary
);
```

**7. Running total:**
```sql
SELECT date, amount, 
    SUM(amount) OVER (ORDER BY date) as running_total 
FROM Sales;
```

**8. Pivot table:**
```sql
SELECT 
    student_name,
    SUM(CASE WHEN subject = 'Math' THEN score ELSE 0 END) as Math,
    SUM(CASE WHEN subject = 'English' THEN score ELSE 0 END) as English
FROM Scores 
GROUP BY student_name;
```

---

## 🎓 Key Takeaways

✅ **Understand relational model** - Tables, keys, relationships  
✅ **Master SQL basics** - SELECT, INSERT, UPDATE, DELETE, JOIN  
✅ **Know normalization** - Reduce redundancy, improve integrity  
✅ **Understand ACID** - Critical for transaction management  
✅ **Learn indexing** - When and how to use indexes  
✅ **Practice SQL queries** - Write queries for common scenarios  
✅ **Design databases** - ER diagrams to table structures

---

## 📚 Study Tips

1. **Practice SQL queries** - Use online platforms (SQLZoo, LeetCode)
2. **Draw ER diagrams** - Visualize database structure
3. **Normalize tables** - Practice converting to 3NF
4. **Write complex queries** - Joins, subqueries, aggregations
5. **Understand trade-offs** - Normalization vs performance
6. **Learn optimization** - Indexes, query execution plans

---

*Master these concepts and you'll be well-prepared for database interviews!* 🚀
