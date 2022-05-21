import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import RightSection from "../../components/RightSection";
import BlogBody from "../../components/BlogBody";
import ReadMore from "../../components/ReadMore";
import styles from "../../styles/Home.module.css";

const Slug = ({ navCategories, blogData, clickedBlog }) => {
  const router = useRouter();
  const { slug } = router.query;

  // console.log(clickedBlogCategories);

  // console.log(clickedBlog);

  return (
    <>
      <Head>
        <title>{clickedBlog.attributes.title}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto p-8 flex flex-col items-center justify-center">
        <div className="ad bg-secondary w-3/4 h-36 mb-8">Ad</div>
        <section
          className={`${styles.home_grid} border-b-2 border-b-gray-700 mb-8`}
        >
          <BlogBody clickedBlog={clickedBlog} />
          <RightSection blogData={blogData} />
        </section>
        <div className="ReadNext w-full mb-8">
          <h2 className="text-3xl font-bangers text-neutral-content border-b-4 border-error w-fit tracking-wider mb-4">
            Read More
          </h2>
          <ReadMore blogData={blogData} />
        </div>
        <div className="ad bg-secondary w-3/4 h-36 mb-8">Ad</div>
      </main>
    </>
  );
};

export async function getServerSideProps(context) {
  let navCategories;
  let blogData;
  let clickedBlog;
  let headers = {
    Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
  };

  try {
    const [res1, res2, res3] = await Promise.all([
      fetch("http://localhost:1337/api/categories", {
        headers: headers,
      }),
      fetch(
        "http://localhost:1337/api/blog-posts?populate=*&sort=createdAt%3Adesc",
        {
          headers: headers,
        }
      ),
      fetch(
        `http://localhost:1337/api/blog-posts?filters[slug]=${context.query.slug}&populate=*`,
        {
          headers: headers,
        }
      ),
    ]);
    const [json1, json2, json3] = await Promise.all([
      res1.json(),
      res2.json(),
      res3.json(),
    ]);
    navCategories = json1.data;
    blogData = json2.data;
    clickedBlog = json3.data[0];
  } catch (error) {
    throw new Error(error);
  }

  return {
    props: { navCategories, blogData, clickedBlog }, // will be passed to the page component as props
  };
}

export default Slug;
