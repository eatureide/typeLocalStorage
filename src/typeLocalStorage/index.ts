/**
 * Feature
 * 赋值前的类型检查
 * 设置缓存过期时间
 * 设置允许获取缓存的页面
 */

// 根据平台封装不同的类

export default class LocalStorage {
  localStorage: any;

  constructor(props: TypeLocalStorage.Init) {
    /**
     * this.localStorage改成构造函数传入
     */
    this.localStorage = props;
  }

  private checkRouterLimit = (router: string[]): any => {
    /**
     * 检查结果是否符合目标值的路由规则
     */
    const resultRouterLimit = router;
    return resultRouterLimit.includes(window.location.pathname);
  };

  private checkValueTime = (endTime: number) => {
    /**
     * 检查当前值是否过期
     */
    const currTime: number = new Date().valueOf();
    return endTime && currTime >= endTime;
  };

  private transferItemConfig = (key: string): TypeLocalStorage.ItemConfig => {
    /**
     * 解析缓存设置的规则
     */
    const itemConfig = JSON.parse(
      this.localStorage.getItem(`${key}_config`) || '{}',
    );
    const result = {
      endTime: itemConfig.endTime ? Number(itemConfig.endTime) : null,
      routerLimit: itemConfig.routerLimit || null,
    };

    return result;
  };

  private transferItem = (key: string): TypeLocalStorage.setItem => {
    /**
     * 解析缓存
     * 返回的value也需要解析
     */
    const item = JSON.parse(this.localStorage.getItem(key) || '{}');
    return item;
  };

  setItem(key: string, value: any, config?: TypeLocalStorage.ItemConfig) {
    /**
     * 设置缓存
     */
    /**
     * 通过参数去控制是否可以赋值，默认可以赋值，如果类型不同，则改为警告
     */
    const item: TypeLocalStorage.setItem = this.transferItem(key);
    const itemConfig = this.transferItemConfig(key);

    const transferValue: TypeLocalStorage.setItem = {
      value,
      type: Object.prototype.toString.call(value),
    };

    if (itemConfig.routerLimit) {
      /**
       * 检查当前路由是否在合缓存设置的路由名单内
       * 如果当前路由不在名单内则不允许赋值
       */
      const isLegitimate = this.checkRouterLimit(itemConfig.routerLimit);
      if (!isLegitimate) {
        console.warn(
          `当前路由（${window.location.pathname}）不在${key}的routerLimit名单内，不允许赋值`
        )
      }
    }

    if (item.value && item.type && item.type !== transferValue.type) {
      const index = item.type.indexOf(' ') + 1;
      const itemType = item.type.slice(index, -1);
      const transferValueType = transferValue.type.slice(index, -1);
      console.warn(
        `赋值的类型与目标值的类型不一致，原值类型是${itemType}，但赋值类型是${transferValueType}，此操作可能会令项目后续报错`
      );
    }

    if ((config && itemConfig.endTime) || (config && itemConfig.routerLimit)) {
      throw Error(`缓存规则不允许修改`);
    }

    if (config) {
      this.localStorage.setItem(`${key}_config`, JSON.stringify({ ...config }));
    }

    this.localStorage.setItem(key, JSON.stringify(transferValue));
  }

  getItem(key: string): string {
    /**
     * 获取缓存
     */
    const item: TypeLocalStorage.setItem = this.transferItem(key);
    const itemConfig = this.transferItemConfig(key);

    if (itemConfig.routerLimit) {
      /**
       * 检查当前路由是否在合缓存设置的路由名单内
       * 如果当前路由不在名单内则不允许获取
       */
      const isLegitimate = this.checkRouterLimit(itemConfig.routerLimit);
      if (!isLegitimate) {
        throw Error(
          `当前路由（${window.location.pathname}）不在${key}的routerLimit名单内，不允许获取`,
        );
      }
    }

    if (itemConfig.endTime) {
      /**
       * 检查当前缓存是否过期
       */
      const isExpired = this.checkValueTime(itemConfig.endTime);
      if (isExpired) {
        this.removeItem(key);
        this.removeItem(`${key}_config`);
      }
      return isExpired ? item.value : null;
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
