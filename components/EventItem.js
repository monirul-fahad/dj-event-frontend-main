import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/EventItem.module.css";

export default function EventItem({ evt }) {
  const { attributes } = evt;
  const { image, name, date, time, slug } = attributes;

  return (
    <div className={styles.event}>
      <div className={styles.img}>
        <Image
          src={
            image.data !== null
              ? image.data?.attributes.url
              : "/images/event-default.png"
          }
          width={170}
          height={100}
          alt=""
        />
      </div>

      <div className={styles.info}>
        <span>
          {new Date(date).toLocaleDateString("en-US")} at {time}
        </span>
        <h3>{name}</h3>
      </div>

      <div className={styles.link}>
        <Link className="btn" href={`/events/${slug}`}>
          Details
        </Link>
      </div>
    </div>
  );
}
