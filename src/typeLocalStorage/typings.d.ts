declare namespace TypeLocalStorage {
  export interface Init {
    value: any;
  }

  export interface ItemConfig {
    /**
     * 设置缓存规则
     */
    endTime?: number;
    protect?: boolean;
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
}
