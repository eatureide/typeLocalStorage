import React from 'react';
import TypeLocalStorage from '../typeLocalStorage';
import styles from './index.less';

window.TypeLocalStorage = new TypeLocalStorage(window.localStorage);

export default () => {
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
    </div>
  );
};
