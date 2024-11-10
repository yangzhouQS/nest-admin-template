// 还可以替换类的构建函数
// 可能通过返回一个新的构造函数来替换原有的构造函数

/**
 * 替换构造函数以在实例化时执行额外操作
 *
 * @param constructor 要被替换的构造函数，该构造函数必须返回一个对象
 * @returns 返回一个新的构造函数，该构造函数在实例化时会打印一条消息，并且会调用原始构造函数的逻辑
 * @template T 被替换构造函数的类型，它必须是一个构造函数，其构造函数的参数是任意的，返回的对象类型是对象
 */
function replaceConstructor<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      console.log('instance create');
    }
  };
}


@replaceConstructor
class User {
  constructor(name, age) {
    console.log(name, age);
  }
}

new User("John", 30);
