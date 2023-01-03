import { parseCookies } from "@/helpers/index";
import { toast, ToastContainer } from "react-toastify";
import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import styles from "@/styles/Event.module.css";
import EventMap from "@/components/EventMap";
import Link from "next/link";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/router";

export default function EventPage({ events, slug }) {
  const router = useRouter();

  const event = events.filter((evt) => evt?.attributes.slug === slug);
  const { attributes } = event[0];
  const { date, image, time, name, performers, venue, description, address } =
    attributes;

  const deleteEvent = async (e) => {
    if (confirm("Are you sure?")) {
      const res = await fetch(`${API_URL}/events/${event[0].id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
      } else {
        router.push("/events");
      }
    }
  };

  return (
    <Layout>
      <div className={styles.event}>
        <div className={styles.controls}>
          <Link href={`/events/edit/${event[0].id}`}>Edit Event</Link>
          <a href="#" className={styles.delete} onClick={deleteEvent}>
            <FaTimes /> Delete Event
          </a>
        </div>
        <span>
          {new Date(date).toLocaleDateString("en-US")} at {time}
        </span>
        <h1>{name}</h1>
        <ToastContainer />
        {image && (
          <div className={styles.image}>
            <Image
              src={
                image.data !== null
                  ? image.data?.attributes.url
                  : "/images/event-default.png"
              }
              width={960}
              height={600}
              alt={name}
            />
          </div>
        )}

        <h3>Performers:</h3>
        <p>{performers}</p>
        <h3>Description:</h3>
        <p>{description}</p>
        <h3>Venue: {venue}</h3>
        <p>{address}</p>

        <EventMap evt={attributes} />

        <Link className={styles.back} href="/events">
          {"<"} Go Back
        </Link>
      </div>
    </Layout>
  );
}


// export async function getStaticPaths() {
//   const res = await fetch(`${API_URL}/events`)
//   const events = await res.json()

//   const paths = events.map((evt) => ({
//     params: { slug: evt.slug },
//   }))

//   return {
//     paths,
//     fallback: true,
//   }
// }

// export async function getStaticProps({ params: { slug } }) {
//   const res = await fetch(`${API_URL}/events?slug=${slug}`)
//   const events = await res.json()

//   return {
//     props: {
//       evt: events[0],
//     },
//     revalidate: 1,
//   }
// }

export async function getServerSideProps({ query: { slug } }) {
  const res = await fetch(`${API_URL}/events?populate=*`);
  const allEvents = await res.json();
  const events = allEvents.data;

  return {
    props: {
      events,
      slug,
    },
  };
}
