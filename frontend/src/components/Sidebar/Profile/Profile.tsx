import NoUserImage from "../../NoUserImage/NoUserImage";
import ImageSkeleton from "../../ImageSkeleton/ImageSkeleton";
import { User2 } from "lucide-react";
import Skeleton from "react-loading-skeleton";

import styles from "./Profile.module.scss";

interface Profile {
  className?: string;
  imgSrc?: string;
  name?: string;
  email?: string;

  isLoading: boolean;
}

export default function Profile({ className, imgSrc, name, email, isLoading }: Profile) {
  
  const renderImage = () => {
    if (imgSrc) {
      return <img className={styles.profileImg} src={imgSrc}></img>;
    }
    if (!imgSrc && !isLoading) {
      return <NoUserImage size={"60%"} />;
    }
    if (isLoading) {
      return <ImageSkeleton Icon={User2} size={"60%"} />;
    }
  }

  return (
    <div className={`${styles.profile} ${className}`}>
      <div className={styles.profileImgWrapper}>
        {renderImage()}
      </div>

      <div className={styles.profileInfo}>
        <span className={styles.profileName}>
          {!isLoading && name}
          {isLoading && <Skeleton />}
        </span>
        <span className={styles.profileEmail}>
          {!isLoading && email}
          {isLoading && <Skeleton />}
        </span>
      </div>
    </div>
  );
}