export function safeRequire<T = any>(path: string, loader?: () => T): T | null {
  try {
    // 尝试加载模块。如果提供了loader函数，则调用loader函数；否则，使用require加载path指定的模块。
    // istanbul ignore next 注释是为了告诉代码覆盖率工具（如Istanbul）忽略接下来的代码块，
    // 通常用于那些难以或无需测试的代码，如动态require。
    /* istanbul ignore next */
    const pack = loader ? loader() : require(path);
    // 如果成功加载模块，返回加载的模块。
    return pack;
  } catch (_) {
    // 如果在加载模块过程中发生错误（如模块不存在），则捕获异常。
    // istanbul ignore next 同样用于告诉代码覆盖率工具忽略这个catch块。
    /* istanbul ignore next */
    return null;
    // 返回null，表示加载失败。
  }
}
