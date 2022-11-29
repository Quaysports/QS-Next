import CategoriesSelect from "./categories-select";
import styles from "../../item-database.module.css"
import BulletPointInput from "./bullet-point-input";
import SearchTermInput from "./search-term-input";

export default function AmazonPropsRibbon() {

    return (
        <div className={styles["amazon-props-container"]}>
            <div className={styles["amazon-props-titles"]}>Bullet Points:</div>
            <div className={styles["bullet-points"]}>
                <BulletPointInput index={1}/>
                <BulletPointInput index={2}/>
                <BulletPointInput index={3}/>
                <BulletPointInput index={4}/>
                <BulletPointInput index={5}/>
            </div>
            <div className={styles["amazon-props-titles"]}>Search Terms:</div>
            <div className={styles["search-terms-container"]}>
                <SearchTermInput index={1}/>
                <SearchTermInput index={2}/>
                <SearchTermInput index={3}/>
                <SearchTermInput index={4}/>
                <SearchTermInput index={5}/>
            </div>
            <div className={styles["amazon-props-titles"]}>Categories:</div>
            <div className={styles["amazon-categories"]}>
                <CategoriesSelect id={1}/>
                <CategoriesSelect id={2}/>
            </div>
        </div>
    )
}