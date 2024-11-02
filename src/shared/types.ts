export type ObjectLiteral = Record<string, any>;
export type ClassType<T> = {
  new (...args: any[]): T;
};
