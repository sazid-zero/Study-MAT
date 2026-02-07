---
layout: page
title: "OOP Fundamentals"
permalink: /oop-fundamentals/
---

# Object-Oriented Programming Fundamentals

A comprehensive guide to OOP concepts essential for software engineering interviews and development.

---

## Table of Contents

- [Introduction to OOP](#introduction-to-oop)
- [Classes and Objects](#classes-and-objects)
- [The Four Pillars of OOP](#the-four-pillars-of-oop)
  - [1. Encapsulation](#1-encapsulation)
  - [2. Inheritance](#2-inheritance)
  - [3. Polymorphism](#3-polymorphism)
  - [4. Abstraction](#4-abstraction)
- [Advanced Concepts](#advanced-concepts)
- [SOLID Principles](#solid-principles)
- [Design Patterns Overview](#design-patterns-overview)
- [Common Interview Questions](#common-interview-questions)

---

## Introduction to OOP

**Object-Oriented Programming** is a programming paradigm based on the concept of "objects" which contain data (attributes) and code (methods).

### Why OOP?

✅ **Modularity** - Code is organized into self-contained objects  
✅ **Reusability** - Inheritance allows code reuse  
✅ **Flexibility** - Polymorphism enables flexible code  
✅ **Maintainability** - Encapsulation makes code easier to maintain  
✅ **Scalability** - Good structure for large applications

### OOP vs Procedural Programming

| Aspect | OOP | Procedural |
|--------|-----|------------|
| **Focus** | Objects and data | Functions and logic |
| **Data Security** | High (encapsulation) | Low (global data) |
| **Reusability** | High (inheritance) | Moderate (functions) |
| **Complexity** | Better for large projects | Better for small projects |
| **Examples** | Java, C++, Python | C, Pascal |

---

## Classes and Objects

### Class

A **class** is a blueprint or template for creating objects. It defines attributes (data) and methods (behavior).

```java
// Class definition
public class Car {
    // Attributes (instance variables)
    private String brand;
    private String model;
    private int year;
    
    // Constructor
    public Car(String brand, String model, int year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
    
    // Methods (behavior)
    public void start() {
        System.out.println(brand + " " + model + " is starting...");
    }
    
    public String getInfo() {
        return year + " " + brand + " " + model;
    }
}
```

### Object

An **object** is an instance of a class. It has actual values for attributes defined in the class.

```java
// Creating objects
Car car1 = new Car("Toyota", "Camry", 2024);
Car car2 = new Car("Honda", "Accord", 2023);

// Using objects
car1.start();  // Output: Toyota Camry is starting...
System.out.println(car2.getInfo());  // Output: 2023 Honda Accord
```

### Key Concepts

**Constructor:**
- Special method called when object is created
- Same name as class
- No return type
- Can be overloaded

```java
public class Student {
    private String name;
    private int age;
    
    // Default constructor
    public Student() {
        this.name = "Unknown";
        this.age = 0;
    }
    
    // Parameterized constructor
    public Student(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

**this keyword:**
- Refers to current object
- Differentiates instance variables from parameters
- Can call other constructors

```java
public class Person {
    private String name;
    
    public Person(String name) {
        this.name = name;  // this.name refers to instance variable
    }
    
    public void printName() {
        System.out.println(this.name);
    }
}
```

---

## The Four Pillars of OOP

### 1. Encapsulation

**Encapsulation** is the bundling of data and methods that operate on that data within a single unit (class), and restricting direct access to some components.

#### Key Principles:
- Make instance variables **private**
- Provide **public getter and setter** methods
- Hide implementation details

```java
public class BankAccount {
    // Private data - cannot be accessed directly
    private String accountNumber;
    private double balance;
    
    // Constructor
    public BankAccount(String accountNumber, double initialBalance) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }
    
    // Public getter
    public double getBalance() {
        return balance;
    }
    
    // Public setter with validation
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    
    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }
}
```

#### Benefits:
✅ **Data Protection** - Invalid data cannot be set directly  
✅ **Flexibility** - Internal implementation can change without affecting users  
✅ **Testability** - Easier to test and debug  
✅ **Reusability** - Well-encapsulated classes are easier to reuse

#### Access Modifiers:

| Modifier | Class | Package | Subclass | World |
|----------|-------|---------|----------|-------|
| `public` | ✅ | ✅ | ✅ | ✅ |
| `protected` | ✅ | ✅ | ✅ | ❌ |
| `default` | ✅ | ✅ | ❌ | ❌ |
| `private` | ✅ | ❌ | ❌ | ❌ |

---

### 2. Inheritance

**Inheritance** allows a class to inherit properties and methods from another class, promoting code reuse.

#### Terminology:
- **Parent Class** (Base/Super class) - Class being inherited from
- **Child Class** (Derived/Sub class) - Class that inherits

```java
// Parent class
public class Animal {
    protected String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    public void eat() {
        System.out.println(name + " is eating");
    }
    
    public void sleep() {
        System.out.println(name + " is sleeping");
    }
}

// Child class
public class Dog extends Animal {
    private String breed;
    
    public Dog(String name, String breed) {
        super(name);  // Call parent constructor
        this.breed = breed;
    }
    
    // Additional method
    public void bark() {
        System.out.println(name + " is barking!");
    }
    
    // Override parent method
    @Override
    public void eat() {
        System.out.println(name + " the dog is eating dog food");
    }
}
```

```java
// Usage
Dog myDog = new Dog("Buddy", "Golden Retriever");
myDog.eat();    // Child's overridden method
myDog.sleep();  // Inherited from parent
myDog.bark();   // Dog's own method
```

#### Types of Inheritance:

**1. Single Inheritance:**
```java
class A { }
class B extends A { }
```

**2. Multilevel Inheritance:**
```java
class Animal { }
class Mammal extends Animal { }
class Dog extends Mammal { }
```

**3. Hierarchical Inheritance:**
```java
class Animal { }
class Dog extends Animal { }
class Cat extends Animal { }
```

**Note:** Java doesn't support multiple inheritance with classes (to avoid diamond problem), but supports it through interfaces.

#### super keyword:

```java
public class Vehicle {
    protected String brand;
    
    public Vehicle(String brand) {
        this.brand = brand;
    }
    
    public void display() {
        System.out.println("Brand: " + brand);
    }
}

public class Car extends Vehicle {
    private int doors;
    
    public Car(String brand, int doors) {
        super(brand);  // Call parent constructor
        this.doors = doors;
    }
    
    @Override
    public void display() {
        super.display();  // Call parent method
        System.out.println("Doors: " + doors);
    }
}
```

---

### 3. Polymorphism

**Polymorphism** means "many forms" - ability of an object to take multiple forms. Same method name behaves differently in different contexts.

#### Types:

**A. Compile-Time Polymorphism (Method Overloading)**

Same method name, different parameters in the **same class**.

```java
public class Calculator {
    // Same method name, different parameters
    
    public int add(int a, int b) {
        return a + b;
    }
    
    public double add(double a, double b) {
        return a + b;
    }
    
    public int add(int a, int b, int c) {
        return a + b + c;
    }
    
    public String add(String a, String b) {
        return a + b;
    }
}

// Usage
Calculator calc = new Calculator();
System.out.println(calc.add(5, 3));           // Output: 8
System.out.println(calc.add(5.5, 3.2));       // Output: 8.7
System.out.println(calc.add(1, 2, 3));        // Output: 6
System.out.println(calc.add("Hello", "World")); // Output: HelloWorld
```

**Rules for Method Overloading:**
- Must have different parameter lists
- Can have different return types
- Can have different access modifiers
- Can throw different exceptions

**B. Runtime Polymorphism (Method Overriding)**

Child class provides specific implementation of parent class method.

```java
public class Shape {
    public void draw() {
        System.out.println("Drawing a shape");
    }
    
    public double area() {
        return 0.0;
    }
}

public class Circle extends Shape {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public void draw() {
        System.out.println("Drawing a circle");
    }
    
    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}

public class Rectangle extends Shape {
    private double width, height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public void draw() {
        System.out.println("Drawing a rectangle");
    }
    
    @Override
    public double area() {
        return width * height;
    }
}
```

```java
// Runtime polymorphism in action
Shape shape1 = new Circle(5);
Shape shape2 = new Rectangle(4, 6);

shape1.draw();  // Output: Drawing a circle
shape2.draw();  // Output: Drawing a rectangle

System.out.println(shape1.area());  // Output: 78.54
System.out.println(shape2.area());  // Output: 24.0
```

**Rules for Method Overriding:**
- Must have same method signature (name + parameters)
- Must have same or covariant return type
- Cannot have more restrictive access modifier
- Cannot throw broader checked exceptions
- Use `@Override` annotation (recommended)

---

### 4. Abstraction

**Abstraction** means hiding implementation details and showing only essential features.

#### Abstract Classes

```java
public abstract class Employee {
    protected String name;
    protected double baseSalary;
    
    public Employee(String name, double baseSalary) {
        this.name = name;
        this.baseSalary = baseSalary;
    }
    
    // Abstract method (no implementation)
    public abstract double calculateSalary();
    
    // Concrete method
    public void displayInfo() {
        System.out.println("Employee: " + name);
        System.out.println("Salary: $" + calculateSalary());
    }
}

public class FullTimeEmployee extends Employee {
    private double bonus;
    
    public FullTimeEmployee(String name, double baseSalary, double bonus) {
        super(name, baseSalary);
        this.bonus = bonus;
    }
    
    @Override
    public double calculateSalary() {
        return baseSalary + bonus;
    }
}

public class ContractEmployee extends Employee {
    private int hoursWorked;
    private double hourlyRate;
    
    public ContractEmployee(String name, int hours, double rate) {
        super(name, 0);
        this.hoursWorked = hours;
        this.hourlyRate = rate;
    }
    
    @Override
    public double calculateSalary() {
        return hoursWorked * hourlyRate;
    }
}
```

#### Interfaces

An interface is a contract that defines what a class must do, but not how.

```java
public interface Drawable {
    // All methods are public and abstract by default
    void draw();
    void resize(double factor);
}

public interface Colorable {
    void setColor(String color);
    String getColor();
}

// A class can implement multiple interfaces
public class ColoredCircle implements Drawable, Colorable {
    private double radius;
    private String color;
    
    public ColoredCircle(double radius, String color) {
        this.radius = radius;
        this.color = color;
    }
    
    @Override
    public void draw() {
        System.out.println("Drawing a " + color + " circle");
    }
    
    @Override
    public void resize(double factor) {
        radius *= factor;
    }
    
    @Override
    public void setColor(String color) {
        this.color = color;
    }
    
    @Override
    public String getColor() {
        return color;
    }
}
```

#### Abstract Class vs Interface

| Feature | Abstract Class | Interface |
|---------|---------------|-----------|
| **Methods** | Can have abstract and concrete methods | Only abstract (Java 8+ allows default) |
| **Variables** | Can have any type of variables | Only public static final constants |
| **Multiple Inheritance** | ❌ Single inheritance only | ✅ Can implement multiple interfaces |
| **Constructor** | ✅ Can have constructors | ❌ Cannot have constructors |
| **Access Modifiers** | Can have any access modifier | Methods are public by default |
| **Usage** | When classes share common code | When classes share common behavior contract |

**When to use:**
- **Abstract Class:** When subclasses share common code and state (IS-A relationship)
- **Interface:** When unrelated classes implement same behavior (CAN-DO capability)

---

## Advanced Concepts

### Static Members

**Static Variable:**
- Shared by all instances
- Belongs to class, not objects
- Initialized once

```java
public class Counter {
    private static int count = 0;  // Shared by all objects
    private int id;
    
    public Counter() {
        count++;
        this.id = count;
    }
    
    public static int getCount() {
        return count;
    }
    
    public int getId() {
        return id;
    }
}

// Usage
Counter c1 = new Counter();
Counter c2 = new Counter();
Counter c3 = new Counter();

System.out.println(Counter.getCount());  // Output: 3
```

**Static Method:**
- Can be called without creating object
- Can only access static members
- Cannot use `this` or `super`

```java
public class MathUtils {
    public static int add(int a, int b) {
        return a + b;
    }
    
    public static double calculateCircleArea(double radius) {
        return Math.PI * radius * radius;
    }
}

// Usage - no object needed
int sum = MathUtils.add(5, 3);
double area = MathUtils.calculateCircleArea(5.0);
```

### Final Keyword

**Final Variable (Constant):**
```java
public class Constants {
    public static final double PI = 3.14159;
    public static final int MAX_USERS = 100;
}
```

**Final Method (Cannot be overridden):**
```java
public class Parent {
    public final void importantMethod() {
        // This method cannot be overridden
    }
}
```

**Final Class (Cannot be inherited):**
```java
public final class ImmutableClass {
    // This class cannot be extended
}
```

### Method Overriding Rules

```java
class Parent {
    protected Object getData() {
        return new Object();
    }
}

class Child extends Parent {
    // Covariant return type (more specific)
    @Override
    public String getData() {
        return "Data";
    }
}
```

### Constructor Chaining

```java
public class Student {
    private String name;
    private int age;
    private String course;
    
    // Constructor 1
    public Student() {
        this("Unknown", 0, "Not enrolled");
    }
    
    // Constructor 2
    public Student(String name) {
        this(name, 0, "Not enrolled");
    }
    
    // Constructor 3
    public Student(String name, int age) {
        this(name, age, "Not enrolled");
    }
    
    // Constructor 4 (master constructor)
    public Student(String name, int age, String course) {
        this.name = name;
        this.age = age;
        this.course = course;
    }
}
```

---

## SOLID Principles

Design principles for writing maintainable and scalable OOP code.

### S - Single Responsibility Principle

**A class should have only one reason to change.**

```java
// ❌ Bad - Multiple responsibilities
class User {
    public void saveToDatabase() { }
    public void sendEmail() { }
    public void generateReport() { }
}

// ✅ Good - Single responsibility
class User {
    private String name;
    private String email;
}

class UserRepository {
    public void save(User user) { }
}

class EmailService {
    public void sendEmail(User user) { }
}

class ReportGenerator {
    public void generateReport(User user) { }
}
```

### O - Open/Closed Principle

**Classes should be open for extension but closed for modification.**

```java
// ✅ Good - Using abstraction
interface PaymentProcessor {
    void processPayment(double amount);
}

class CreditCardProcessor implements PaymentProcessor {
    public void processPayment(double amount) {
        // Credit card logic
    }
}

class PayPalProcessor implements PaymentProcessor {
    public void processPayment(double amount) {
        // PayPal logic
    }
}

// New payment method - just add new class, don't modify existing
class CryptoProcessor implements PaymentProcessor {
    public void processPayment(double amount) {
        // Crypto logic
    }
}
```

### L - Liskov Substitution Principle

**Subtypes must be substitutable for their base types.**

```java
// ✅ Good
class Rectangle {
    protected int width;
    protected int height;
    
    public void setWidth(int width) {
        this.width = width;
    }
    
    public void setHeight(int height) {
        this.height = height;
    }
    
    public int getArea() {
        return width * height;
    }
}

// Square properly extends Rectangle
class Square extends Rectangle {
    @Override
    public void setWidth(int width) {
        this.width = width;
        this.height = width;
    }
    
    @Override
    public void setHeight(int height) {
        this.width = height;
        this.height = height;
    }
}
```

### I - Interface Segregation Principle

**Clients should not be forced to depend on interfaces they don't use.**

```java
// ❌ Bad - Fat interface
interface Worker {
    void work();
    void eat();
    void sleep();
}

// ✅ Good - Segregated interfaces
interface Workable {
    void work();
}

interface Eatable {
    void eat();
}

interface Sleepable {
    void sleep();
}

class HumanWorker implements Workable, Eatable, Sleepable {
    public void work() { }
    public void eat() { }
    public void sleep() { }
}

class RobotWorker implements Workable {
    public void work() { }
    // No need to implement eat() and sleep()
}
```

### D - Dependency Inversion Principle

**Depend on abstractions, not concretions.**

```java
// ✅ Good - Depend on abstraction
interface MessageService {
    void sendMessage(String message);
}

class EmailService implements MessageService {
    public void sendMessage(String message) {
        System.out.println("Email: " + message);
    }
}

class SMSService implements MessageService {
    public void sendMessage(String message) {
        System.out.println("SMS: " + message);
    }
}

class NotificationManager {
    private MessageService messageService;
    
    // Depends on abstraction, not concrete class
    public NotificationManager(MessageService messageService) {
        this.messageService = messageService;
    }
    
    public void notify(String message) {
        messageService.sendMessage(message);
    }
}

// Usage
NotificationManager emailNotifier = new NotificationManager(new EmailService());
NotificationManager smsNotifier = new NotificationManager(new SMSService());
```

---

## 🎯 Design Patterns Overview

### Creational Patterns

**Singleton** - Ensure only one instance exists
```java
public class Singleton {
    private static Singleton instance;
    
    private Singleton() { }
    
    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

**Factory** - Create objects without specifying exact class
```java
interface Shape {
    void draw();
}

class ShapeFactory {
    public static Shape createShape(String type) {
        if (type.equals("circle")) return new Circle();
        if (type.equals("square")) return new Square();
        return null;
    }
}
```

### Structural Patterns

**Adapter** - Make incompatible interfaces work together
**Decorator** - Add new functionality to objects dynamically
**Facade** - Provide simple interface to complex system

### Behavioral Patterns

**Observer** - Define one-to-many dependency between objects
**Strategy** - Define family of algorithms, make them interchangeable
**Template Method** - Define skeleton of algorithm, let subclasses override steps

---

## ❓ Common Interview Questions

### Theory Questions

**1. What is OOP?**
- Programming paradigm based on objects containing data and methods
- Key principles: Encapsulation, Inheritance, Polymorphism, Abstraction

**2. Difference between class and object?**
- Class: Blueprint/template
- Object: Instance of class with actual values

**3. What is encapsulation?**
- Bundling data and methods in a class
- Hiding internal details using access modifiers
- Providing public interface through getters/setters

**4. What is inheritance?**
- Mechanism where one class acquires properties of another
- Promotes code reuse
- Forms IS-A relationship

**5. What is polymorphism?**
- Ability to take multiple forms
- Types: Compile-time (overloading) and Runtime (overriding)

**6. Abstract class vs Interface?**
- Abstract class: Can have both abstract and concrete methods, single inheritance
- Interface: Only abstract methods (default in Java 8+), multiple inheritance

**7. What is method overloading vs overriding?**
- Overloading: Same name, different parameters, same class, compile-time
- Overriding: Same signature, different classes (parent-child), runtime

**8. Explain SOLID principles**
- S: Single Responsibility
- O: Open/Closed
- L: Liskov Substitution
- I: Interface Segregation
- D: Dependency Inversion

### Coding Questions

**1. Design a class hierarchy for a library system**
```java
abstract class LibraryItem {
    protected String title;
    protected String id;
    protected boolean isAvailable;
    
    public abstract double calculateLateFee(int daysLate);
    public abstract Display();
}

class Book extends LibraryItem {
    private String author;
    private String ISBN;
    
    @Override
    public double calculateLateFee(int daysLate) {
        return daysLate * 0.50;
    }
}

class Magazine extends LibraryItem {
    private String publisher;
    private int issueNumber;
    
    @Override
    public double calculateLateFee(int daysLate) {
        return daysLate * 0.25;
    }
}
```

**2. Implement a Shape calculator with polymorphism**
```java
interface Shape {
    double calculateArea();
    double calculatePerimeter();
}

class Circle implements Shape {
    private double radius;
    
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
    
    public double calculatePerimeter() {
        return 2 * Math.PI * radius;
    }
}

class Triangle implements Shape {
    private double a, b, c;
    
    public double calculateArea() {
        double s = (a + b + c) / 2;
        return Math.sqrt(s * (s-a) * (s-b) * (s-c));
    }
    
    public double calculatePerimeter() {
        return a + b + c;
    }
}

class ShapeCalculator {
    public void printShapeInfo(Shape shape) {
        System.out.println("Area: " + shape.calculateArea());
        System.out.println("Perimeter: " + shape.calculatePerimeter());
    }
}
```

---

## 🎓 Key Takeaways

✅ **Master the 4 pillars** - Encapsulation, Inheritance, Polymorphism, Abstraction  
✅ **Understand access modifiers** - When to use public, private, protected  
✅ **Know when to use abstract classes vs interfaces**  
✅ **Practice SOLID principles** in your code  
✅ **Understand polymorphism deeply** - It's the most asked concept  
✅ **Write clean, maintainable code** following OOP best practices

---

## 📚 Study Tips

1. **Code along** - Don't just read, implement examples
2. **Draw diagrams** - UML class diagrams help visualize relationships
3. **Explain concepts** - Teach someone else to solidify understanding
4. **Practice design questions** - Draw class hierarchies for real-world systems
5. **Review design patterns** - Understand common solutions to common problems

---

*Keep practicing! OOP mastery comes with hands-on experience.* 🚀
