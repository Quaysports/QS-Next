import styles from './layout-styles.module.css'

export default function ColumnLayout({children}){
    return(
        <div className={styles["column-layout"]}>{children}</div>
    )
}