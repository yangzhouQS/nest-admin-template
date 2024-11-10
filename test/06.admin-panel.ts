// 在方法调用前检查用户权限,决定是否可以调用方法, 使用ts装饰器实现
function checkPermission(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value; // 保存原始方法
  descriptor.value = function(...args: any[]) {
    if (!this.hasPermission()) {
      throw new Error("No permission.");
    } else {
      return originalMethod.apply(this, args);
    }
  };
}

@checkPermission
class AdminPanel {
  deleteUser(userId: string) {
    console.log(`User ${userId} deleted.`);
  }
}

const adminPanel = new AdminPanel();
adminPanel.deleteUser("123456");
