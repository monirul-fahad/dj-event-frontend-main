import { parseCookies } from "@/helpers/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import styles from "@/styles/Form.module.css";
import { useFormik } from "formik";

export default function AddEventPage({ token }) {
  let router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: "",
      performers: "",
      venue: "",
      address: "",
      date: "",
      time: "",
      description: "",
    },

    onSubmit: async (values) => {
      const formData = new FormData();
      const data = {
        name: values.name,
        performers: values.performers,
        venue: values.venue,
        address: values.address,
        date: values.date,
        time: values.time,
        description: values.description,
      };
      // Validation
      const hasEmptyFields = Object.values(values).some(
        (element) => element === ""
      );

      if (hasEmptyFields) {
        toast.error("Please fill in all fields");
      }
      formData.append("data", JSON.stringify(data));

      //image-file
      formData.append("files.image", values.imageFile);

      //for upload page
      const uploadData = new FormData();
      uploadData.append("files", values.imageFile);

      // simple create new collection with JSON
      const res = await fetch("http://localhost:1337/api/events", {
        method: "POST",
        body: formData,
        headers: {},
      });

      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          toast.error("No token included");
          return;
        }
        toast.error("Something Went Wrong");
      } else {
        const evt = await res.json();
        router.push(`/events/${evt.data.attributes.slug}`);
      }

      //upload file to uploads
      const uploadFile = await fetch("http://localhost:1337/api/upload", {
        method: "POST",
        body: uploadData,
        headers: {},
      });;
    },
  });

  const imageUpload = (e) => {
    const file = e.target.files;
    formik.setFieldValue("imageFile", file[0]);
  };

  return (
    <Layout name="Add New Event">
      <Link href="/events">Go Back</Link>
      <h1>Add Event</h1>
      <ToastContainer />
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor="name">Event Name</label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </div>
          <div>
            <label htmlFor="performers">Performers</label>
            <input
              type="text"
              name="performers"
              id="performers"
              onChange={formik.handleChange}
              value={formik.values.performers}
            />
          </div>
          <div>
            <label htmlFor="venue">Venue</label>
            <input
              type="text"
              name="venue"
              id="venue"
              onChange={formik.handleChange}
              value={formik.values.venue}
            />
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              onChange={formik.handleChange}
              value={formik.values.address}
            />
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              onChange={formik.handleChange}
              value={formik.values.date}
            />
          </div>
          <div>
            <label htmlFor="time">Time</label>
            <input
              type="text"
              name="time"
              id="time"
              onChange={formik.handleChange}
              value={formik.values.time}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description">Event Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            onChange={formik.handleChange}
            value={formik.values.description}
          ></textarea>
        </div>
        <div>
          <label htmlFor="email">image-file-upload</label>
          <input
            id="file"
            name="file"
            type="file"
            onChange={imageUpload}
            value={formik.values.email}
          />
        </div>
        <button className="btn" type="submit">
          Add Event
        </button>
      </form>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const { token } = parseCookies(req);

  return {
    props: {
      token,
    },
  };
}
