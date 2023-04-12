import { IconLink, iconsData } from "./icon-link";
import styles from "../../pages/dashboard/dashboard.module.css";

export function IconsContainer() {
  return (
    <div className={styles.container}>
      {" "}
      {iconsData.map((iconData) => (
        <IconLink key={iconData.title} {...iconData} />
      ))}
    </div>
  );
}
