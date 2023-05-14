TypeScript 常用知识点总结

> [TypeScript 中文手册](https://typescript.bootcss.com/basic-types.html)
>
> [TypeScript－系统入门到项目实战](https://coding.imooc.com/class/412.html)

<!-- truncate -->

## 什么是 TypeScript

TypeScript 是 JavaScript 的一个超集，在 JavaScript 的基础上增加了可选的**静态类型**和基于类的面向对象编程。它可以编译成纯 JavaScript，未编译的 ts 代码无法在浏览器执行。我们可以把它和 JavaScript 的关系理解成 css 和 less、sass 的关系。

## TypeScript 好在哪里

- TS 可以进行动态类型检测，可以检测出一些潜在的 bug（例如拼写错误、参数缺失、undefined 等），提升代码健壮性
- 使用 vscode 进行开发可以很好的提示代码，提高开发效率
- 代码可读性好

## 创建第一个 TypeScript 文件

首先安装 TypeScript

```
npm install -g typescript
```

安装后看是否成功

```
tsc --version
```

我安装后出现了以下问题：
![image-20200614175730166](https://raw.githubusercontent.com/3Alan/images/master/img/image-20200614175730166.png)
这种情况只需要以管理员的身份打开命令行运行以下命令：

```
set-ExecutionPolicy RemoteSigned
```

创建第一个 ts 文件`Hello.ts`

```tsx
function sayHello(name: String) {
  console.log(`Hello ${name}`);
}
let person = 'Alan';
sayHello(person);
```

我们发现 ts 代码和普通的 js 代码在 `sayHello` 函数的参数上有所不同。
`sayHello(name: String)`
大致的意思就是 `sayHello` 传入一个名为 name 的参数，该参数的类型必须是 `String` ，不然无法通过 ts 的编译。
代码写好后用 tsc 编译上面的 `Hello.ts` 文件

```
tsc Hello.ts
```

编译成功后在同级目录下生成一个 `Hello.js` 文件，可以看到生成的 js 文件只是将 es6 语法转化成了 es5 语法，并没有改变其他代码。

```js
function sayHello(name) {
  console.log('Hello ' + name);
}
var person = 'Alan';
sayHello(person);
```

如果把`Hello.ts`文件改写一下

```tsx
function sayHello(name: String) {
  const text = 3 + name;
  console.log(`Hello ${name}`);
}
let person = 123;
sayHello(person);
```

再次编译发现会报错但是仍然能生成 js 文件：
![image-20200614180440953](https://raw.githubusercontent.com/3Alan/images/master/img/image-20200614180440953.png)

上面错误的具体意思是

- 由于声明了函数形参 `name` 为静态类型 `string` ，而在调用时传入得是 `number` 类型 `123` ，与前面的 `string` 不符。
- 在 `sayHello` 函数中将 `name(string)` 和 `3(number)` 两种不同类型得值进行了相加。

我们发现每次都要通过 tsc 来编译 ts 文件能得到 js 文件后再去运行 js 文件，过于麻烦。可以使用插件 `ts-node` 来直接运行 ts 文件。

```
npm i ts-node -g
```

```
ts-node Hello.ts
```

:::info

ts 能够尝试分析变量类型（类型推断），ts 无法分析出的变量最好显式声明变量类型（类型注解）

:::

## 基础类型

变量的声明：`let [变量名] : [类型] = 值`

例如： `let age: number = 21`

TypeScript 支持与 JavaScript 几乎相同的数据类型

- boolean(布尔值)
- number(数值)
- string(字符串)
- []/Array<元素类型>(数组)
- 元组 Tuple
- enum(枚举)
- any(任何值)
- void(空值)
- null
- undefined
- never

## 数组

有 2 种方式定义数组

```tsx
let arr: number[] = [1, 2, 3]; // 元素类型后接上`[]`
let arr: Array<number> = [1, 2, 3]; // 数组泛型
let arr: (number | string)[] = [1, '2', '4']; // 元素类型可以是number或string（类似元组）
```

## 元组 tuple

表示一个数组（各个元素的类型不必相同）

```tsx
let list: [string, number]; //第一个元素为string类型，第二个为number类型
a = ['abc', 123]; //合格
b = [123, 'abc']; //不合格
```

## 枚举

其实有点类似对象
看例子吧

```tsx
enum lan {js, ts, css};
console.log(lan.js); // 0   js对应的下标，第一个默认下标为0

enum lan {
  js = 3,
  ts,
  css,
}
console.log(lan.js); // 3
console.log(lan.ts); // 4
console.log(lan.css); // 5

enum lan {
  js,
  ts = 3,
  css,
}
console.log(lan.js); // 0
console.log(lan.ts); // 3
console.log(lan.css); // 4
console.log(lan[4]); // css
console.log(lan[1]); // undefined
// 第一个默认下标为0，css接着ts的值+1

enum lan {js = 'good', ts = 'nice', css = 'well'};
console.log(lan.js); // good

// const枚举，为了避免在额外生成的代码上的开销和额外的非直接的对枚举成员的访问。
const enum People {
  name: 'Alan',
  age: 23
}

// 编译时会自动转化成常量值，不会保留其他代码
console.log(People.name); // Alan

```

## any

顾名思义，任意值，当我们想为还不清楚类型的变量指定一个类型时， `any` 就是最好的选择 🤭

```tsx
let a: any = 4;
a = '123'; //合格

let arr: any[] = [1, '123', true]; // 和元组很像
arr[1] = 'good';
```

## void

常用于无返回值的函数声明

```tsx
function func(): void {
  console.log('learning typescript...');
}
func(); //合格

function func(): void {
  return 1;
}
func(); // 不合格：Type '1' is not assignable to type 'void'
```

## null 和 undefined

用处不大，默认情况下是所有类型的子类型，例如下面代码是没有问题的：

```tsx
let a: string;
a = undefined;
a = null;
```

**但是**，当指定`--strictNullChecks`标记时，null 和 undefined 只能赋值给 void 和他们自己本身。

## never

表示永不存在的值的类型
never 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型；
变量也可能是 never 类型，当它们被永不为真的类型保护所约束时。

never 类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是 never 的子类型或可以赋值给 never 类型（除了 never 本身之外）。 即使 any 也不可以赋值给 never。

```tsx
function error(message: string): never {
  throw new Error(message);
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
  while (true) {}
}
```

## 结构赋值的写法

```tsx
function sayAge({ name, age }: { name: string | number; age: number }): void {
  console.log(`${name} is ${age} years old`);
}
sayAge({ name: 'Alan', age: 22 });
sayAge({ name: 2, age: 22 });
```

## 联合类型

用 `|` 来表示取值存在多种可能

```tsx
let a: string | number;
a = 1;
a = 'A';
```

## 类型断言

可以自己指定一个值的类型
格式如下
`<类型>值`
`值 as 类型`

```tsx
interface student {
  isStudent: boolean;
  education: number;
}
interface worker {
  isStudent: boolean;
  seniority: number;
}
function Recruit(candidate: worker | student): void {
  if (candidate.isStudent) {
    console.log(`your education is ${(candidate as student).education}`);
  } else {
    console.log(`your seniority is ${(candidate as worker).seniority}`);
  }
}

const a: student = { isStudent: true, education: 4 };
const b: worker = { isStudent: false, seniority: 2 };
Recruit(a);
Recruit(b);
```

由于 `candidate` 使用了联合类型，所以 ts 无法判断 `candidate` 究竟是属于 `student` 还是 `worker` ，所以要使用类型断言来显式告诉 ts。

当然还有其他方式来实现

```tsx
interface student {
  isStudent: boolean;
  education: number;
}
interface worker {
  isStudent: boolean;
  seniority: number;
}
function Recruit(candidate: worker | student): void {
  'education' in candidate && console.log(`your education is ${candidate.education}`);
  'seniority' in candidate && console.log(`your seniority is ${candidate.seniority}`);
}

const a: student = { isStudent: true, education: 4 };
const b: worker = { isStudent: false, seniority: 2 };
Recruit(a);
Recruit(b);
```

- typeof
- instanceof

## 非空断言

`!.` 对应 `--strictNullChecks`

```ts
interface person {
  name: string;
}
function work(personObj?: person) {
  // 由于 personObj 可能不传，所以 personObj 可能为 undefined，使用 !. 可以断言 personObj 不为空
  console.log(personObj!.name);
}
```

## 接口 interface

先看一个接口的例子

```tsx
interface person {
  name: string;
}
function work(personObj: person) {
  console.log(personObj.name);
}
let person1 = { name: 'Alan', age: 21 };
work(person1);
let person2 = { age: 21 };
work(person2);
```

![image-20200615180720618](https://raw.githubusercontent.com/3Alan/images/master/img/image-20200615180720618.png)

定义接口的关键字是 `interface`
这个例子需要传入 work 的参数必须是一个带有 name(string)的对象，可以理解为我要招聘一个有名字的员工，没有名字的都不需要。当然我们的 person1 中还多了一个`age`属性，这并不会报错。可是当我们直接传递参数时是会出错的。

```js
work({ name: 'Alan', age: 21 });
```

那如果我不确定要招聘的员工除了有姓名外还需要其他什么属性时，可以像下面一样重新定义接口就可以解决上面的问题了。

```tsx
interface person {
  name: string;
  [propName: string]: any;
}
```

### 可选属性

那如果我的招聘条件是最好懂 typescript 的，这个时候 typescript 就是可有可无的（最好懂，嘿嘿 😜），那我们就要用到**可选属性**了
`可选属性`在可选属性名后面加上一个`?`

```tsx
interface person {
  name: string;
  ts?: boolean;
}
function Recruit(personObj: person): string {
  if (personObj.ts) {
    return `congratulations!${personObj.name}`;
  } else {
    return `sorry,${personObj.name}, we need a employee who know ts!`;
  }
}
let person1 = { name: 'Alan', age: 21, ts: true };
console.log(Recruit(person1));
let person2 = { name: 'Bob', age: 21 };
console.log(Recruit(person2));
```

### 只读属性

我们都知道人的名字都是不可以改变的（一般情况下），这个时候我们对 person 接口里面的 name 属性稍作修改，在属性名 name 前加上`readonly`。

:::tip

当然也可以使用 setter/getter 来实现

:::

```tsx
interface person {
  readonly name: string;
  ts?: boolean;
}
let person1: person = { name: 'Alan' };
person1.name = 'Bob'; // Cannot assign to 'name' because it is a read-only property.
```

**我们发现 readonly 和 const 的作用好像有点相似，那我们什么时候使用 readonly 什么时候使用 const 呢？**
变量---->const
属性---->readonly

### 函数类型的接口

接口除了可以描述带有属性的对象外，还可以描述函数类型
这里创建一个函数来检查你有没有打卡 😁

```tsx
interface attendanceFunc {
  (name: string, startTime: number, endTime: number): boolean;
}
let checkAttendance: attendanceFunc;
checkAttendance = function (name: string, startTime: number, endTime: number): boolean {
  let result = startTime < 9 && endTime > 18;
  return result;
};
console.log(checkAttendance('Alan', 10, 19)); // false
```

看一下接口的声明：

```tsx
interface attendanceFunc {
  (name: string, startTime: number, endTime: number): boolean;
}
```

`name,startTime,endTime` 放在 `()` 中代表函数的参数
`:boolean` 表示函数的返回值类型
当然上面例子中的`checkAttendance`的形参以及函数的返回值来说可以不指定类型，因为 `checkAttendance` 复制给了 `attendanceFunc` 变量，类型检查器会自动(按照接口中参数的顺序)推断出参数以及返回值的类型，也就是说写成下面这样也是可以的。**函数中的参数名可以不和接口中的相同**

```tsx
interface attendanceFunc {
  (name: string, startTime: number, endTime: number): boolean;
}
let checkAttendance: attendanceFunc;
checkAttendance = function (n, startTime, endTime) {
  let result = startTime < 9 && endTime > 18;
  return result;
};
console.log(checkAttendance('Alan', 10, 19)); // false
```

### 接口的继承

一个接口可以继承 1 个或者多个接口：
继承使用关键词`extends`

```tsx
interface person {
  name: string;
}
interface student {
  studentId: number;
}
interface seniorStudent extends person, student {
  grade: string;
}
let student1: seniorStudent = { name: 'Alan', studentId: 1, grade: 'one' };
console.log(student1);
```

## 类 class

TS 中的类和 ES6 中的类很相似，这里只介绍不同的地方

### 变量修饰符

- public（默认）
- private（私有，不能在声明它的类的外部访问）
- protected（和 private 类似，不同的是 protected 声明的变量可以在派生类（即子类）中访问）

### 静态属性 static

```tsx
class Person {
  static fingerNum = 5;
}

// 只能通过类来访问
console.log(Person.fingerNum);
// 不能通过实例访问
console.log(new Person().fingerNum);
```

```tsx
// 单例模式创建唯一的实例
class singleClass {
  private static instance: singleClass;
  private constructor(public name: string) {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new singleClass('Alan');
    }
    return this.instance;
  }
}

const class1 = singleClass.getInstance();
const class2 = singleClass.getInstance();
console.log(class1.name); // Alan
console.log(class1 === class2); // true
```

### 构造函数

```tsx
class Person {
  constructor(name, mobile, sex) {
    this.name = name;
    this.mobile = mobile;
    this.sex = sex;
  }
  public name: string;
  private mobile: string;
  protected sex: string;
}
```

上面的代码可以简写成下面这样

```tsx
class Person {
  constructor(name: string, private mobile: string, protected sex: string) {}
}
```

### 抽象类

- 不能被实例化
- 要使用的话要声明其派生类，并且重写其中的抽象方法

```tsx
abstract class Animal {
  constructor(public name: string) {}
  sayHello() {
    console.log('hello');
  }
  // 声明抽象方法
  abstract action(): void;
}

class Bird extends Animal {
  constructor(name) {
    super(name);
  }
  action() {
    console.log('jijiji');
  }
}

const bird = new Bird('qc');
console.log(bird);
// Bird { name: 'qc' }
```

## 泛型

> 泛型（Generics）是指在定义函数、接口或类的时候，**不预先指定**具体的类型，而在**使用的时候**再指定类型的一种特性。

### 函数用法：<泛型名>

```tsx
function Recruit<T>(name: string, props: T) {
  return name + props;
}
// 显式指定为T为number类型
console.log(Recruit<number>('Alan', 123)); // Alan123
// TS自动推断为number类型，和上面效果一样
console.log(Recruit('Alan', 123)); // Alan123
console.log(Recruit('Alan', [1, 2, 3])); // Alan1,2,3
```

也可以使用多个泛型名，下面的例子结合了接口来完成

```tsx
interface Contact {
  mobile: string;
}

interface Address {
  province: string;
}

function Recruit<C extends Contact, A extends Address>(name: string, contact: C, address: A) {
  return `${name}'s mobile is ${contact.mobile}, live in ${address.province}`;
}

console.log(Recruit('Alan', { mobile: '666' }, { province: 'Shanghai' }));
// Alan's mobile is 666, live in Shanghai
```

### 类用法

```tsx
interface employee {
  name: string;
  age: number;
}

class RecruitManager<T extends employee> {
  constructor(private data: Array<T>) {}
  select(age: number): T {
    return this.data.find((item) => item.age > age);
  }
}

const result = new RecruitManager([
  {
    name: 'Alan',
    age: 22
  },
  {
    name: 'Bob',
    age: 18
  }
]);
console.log(result.select(20));
```

### 泛型约束

使用 extends 约束泛型

```tsx
interface info {
  mobile: string;
}

// T泛型必须满足info
function Recruit<T extends info>(name: string, props: T) {
  return name + props.mobile;
}

console.log(Recruit('Alan', { mobile: '1232910830' })); // Alan1232910830
```

## React 相关

### class 组件动态设置 state

```ts
this.setState({
  [name]: value
} as Pick<CompontentState, keyof CompontentState>);
```
