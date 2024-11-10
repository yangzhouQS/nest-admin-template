// 方法装饰器
// ts方法装饰器介绍


function log() {

}


/**
 * 方法装饰器，用于在方法调用前后输出日志信息
 *
 * @param target 目标对象，即装饰器所应用的方法所属的类; [如果是静态成员,则是类的构造函数;如果是实例成员,则是类的院校地域性]
 * @param key 被装饰的方法名 装饰的成员名称
 * @param descriptor 方法的属性描述符，包含方法的原始值等信息
 * @returns 修改后的属性描述符，包含新的方法实现
 */
function logMethod(target: any, key: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`调用方法 ${key}，参数: ${JSON.stringify(args)}`);
    const result = originalMethod.apply(this, args);
    console.log(`方法 ${key} 返回结果: ${JSON.stringify(result)}`);
    return result;
  };
  return descriptor;
}

class Calculator {
  @logMethod
  add(params: any) {
    console.log("添加数据", params);
    return "添加成功";
  }
}

const calculator = new Calculator();
calculator.add("123");
