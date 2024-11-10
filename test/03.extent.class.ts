/**
 * 给目标类添加时间戳属性
 *
 * @param target 目标类
 * @returns 返回一个新的类，该类继承自目标类，并新增一个名为 timestamp 的属性，其值为当前日期的本地化字符串表示
 * @template T 目标类的类型，要求是一个构造函数，其构造函数的参数是任意的，返回的对象类型是对象
 */
function addTimeStamp<T extends { new(...args: any[]): {} }>(target: T) {
  return class extends target {
    timestamp = new Date().toLocaleDateString();
  };
}

@addTimeStamp
class Document2 {
  constructor(public title: string) {
  }
}

const doc = new Document2("test");
console.log(doc.timestamp);
console.log(doc);
