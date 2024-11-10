/**
 * 类装饰器
 * @constructor
 */
function LogClass(target: Function) {
  console.log("create Person", target.constructor.name);
}


@LogClass
class Person {
  constructor(public name: string) {
  }
}

new Person("李四");


// 类装饰器工厂
function LogClassFactory(name: string) {
  return function(target: Function) {
    console.log("create " + name, target.constructor.name);
  };
}

@LogClassFactory("Car")
class Car {

}

