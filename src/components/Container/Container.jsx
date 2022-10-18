import React from 'react';
import styles from './Container.module.scss'

const Container = ({children}) => {
    return (
        <div className={styles.appContainer}>
            {children}
        </div>
    );
};

export default Container;