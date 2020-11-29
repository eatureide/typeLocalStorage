declare namespace TypeLocalStorage {
  export interface ItemConfig {
    /**
     * 设置缓存规则
     */
    endTime?: number | null;
    routerLimit?: string[] | null;
  }

  export interface GetItemConfig {
    /**
     * 获取缓存规则
     */
    endTime?: string;
    routerLimit?: string;
  }

  export interface setItem {
    /**
     * 设置缓存
     */
    value: any;
    type: string;
  }

  export interface getItem {
    /**
     * 获取缓存
     */
    value: string;
    type: string;
  }

  export interface LocalStorageProperty {
    setItem: (key: string, value: any, config?: ItemConfig) => void;
    getItem: (key: string) => any;
    removeItem: (key: string) => any;
    [propName: string]: any;
  }
}
