/**
 * Feature
 * 赋值前的类型检查
 * 设置缓存过期时间
 */

export default class LocalStorage {
  localStorage: any;

  constructor(props: any) {
    this.localStorage = props;
  }

  private checkValueTime = (endTime: number): boolean => {
    /**
     * 检查当前值是否过期
     */
    const currTime: number = new Date().valueOf();
    return currTime >= endTime;
  };

  private transferItemConfig = (key: string): TypeLocalStorage.ItemConfig => {
    /**
     * 解析缓存设置的规则
     */
    const itemConfig = JSON.parse(
      this.localStorage.getItem(`${key}_config`) || '{}',
    );
    const result = {
      endTime: itemConfig.endTime ? Number(itemConfig.endTime) : undefined,
    };

    return result;
  };

  private transferItem = (key: string): TypeLocalStorage.setItem => {
    /**
     * 解析缓存
     */
    const item = JSON.parse(this.localStorage.getItem(key) || '{}');
    return item;
  };

  setItem(key: string, value: any, config?: TypeLocalStorage.ItemConfig) {
    /**
     * 设置缓存
     */
    const item: TypeLocalStorage.setItem = this.transferItem(key);
    const type = Object.prototype.toString.call(value);
    const space = type.indexOf(' ') + 1;

    const transferValue: TypeLocalStorage.setItem = {
      value,
      type: type.slice(space, -1).toLocaleLowerCase(),
    };

    if (item.value && item.type && item.type !== transferValue.type) {
      /**
       * 当前缓存的类型与设置的类型不相同时则警告
       */
      console.warn(
        `赋值的类型与目标值的类型不一致，原值类型是${item.type}，但赋值类型是${transferValue.type}，此操作可能会令项目后续运行崩溃`,
      );
    }

    if (config) {
      const { endTime } = config;
      if (endTime) {
        if (!Number(endTime)) {
          throw Error(`${endTime}不是数字类型`);
        }
        config.endTime = new Date().valueOf() + endTime;
      }
      this.localStorage.setItem(`${key}_config`, JSON.stringify({ ...config }));
    }

    this.localStorage.setItem(key, JSON.stringify(transferValue));
  }

  getItem(key: string): any {
    /**
     * 获取缓存
     */
    const item: TypeLocalStorage.setItem = this.transferItem(key);
    const itemConfig = this.transferItemConfig(key);

    if (itemConfig.endTime) {
      /**
       * 检查当前缓存是否过期
       */
      const isExpired = this.checkValueTime(itemConfig.endTime);
      if (isExpired) {
        console.warn(`${key}已过期`);
        this.removeItem(key);
        this.removeItem(`${key}_config`);
      }
      return isExpired ? null : item.value;
    }

    return item.value;
  }

  removeItem(key: string) {
    /**
     * 移除缓存
     */
    this.localStorage.removeItem(key);
  }
}
