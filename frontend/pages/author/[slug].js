import React from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import RightSection from "../../components/RightSection";
// import AuthorLatestBlogs from "../../components/AuthorLatestBlogs";
import Link from "next/link";
import EachBlog from "../../components/EachBlog";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState, useEffect } from "react";

const Slug = ({
  navCategories,
  blogData,
  authorDetails,
  moreBlogs,
  popular1,
  popular2,
  mangaFeatured,
  numberofBlogs,
  headers,
}) => {
  const router = useRouter();
  const { slug } = router.query;

  // console.log(authorDetails);

  const [posts, setPosts] = useState(blogData);

  const [hasMore, setHasMore] = useState(true);

  const getMorePosts = async () => {
    const res = await fetch(
      `http://localhost:1337/api/blog-posts?pagination[start]=${posts.length}&pagination[limit]=5&sort=createdAt%3Adesc&populate=blogImg&populate=author&populate=categories&filters[author][slug]=${slug}`,
      {
        headers: headers,
      }
    );

    const dataPosts = await res.json();

    const newPosts = dataPosts.data;

    setTimeout(() => {
      setPosts((posts) => [...posts, ...newPosts]);
    }, 2000);
  };

  useEffect(() => {
    setHasMore(numberofBlogs > posts.length ? true : false);
  }, [posts]);

  return (
    <div>
      <Head>
        <title>{authorDetails[0].attributes.authorName.toUpperCase()}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-8 sm:p-8">
        <section className={styles.home_grid}>
          <div>
            <div className="author my-8">
              <div className="flex flex-col items-center justify-center md:items-start md:justify-start">
                <Image
                  src={`http://localhost:1337${authorDetails[0].attributes.authorImg.data.attributes.url}`}
                  // src="/manga.jpg"
                  width={120}
                  height={120}
                  className="rounded-full"
                />
                <div className="mt-8">
                  <h3 className="font-bangers text-3xl tracking-wider text-center md:text-left">
                    {authorDetails[0].attributes.authorName}
                    {/* Sayan Munshi */}
                  </h3>
                  <p className="font-montserrat text-center sm:text-left">
                    {authorDetails[0].attributes.authorDesc}
                    {/* Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quod, totam sequi. Soluta dolores maiores nemo, ipsam quam
                    iure? Ipsam perspiciatis at fugit sed perferendis officia
                    facere saepe velit consequatur id? */}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bangers text-neutral-content border-b-4 border-error w-fit tracking-wider mb-4">
                Latest Blogs By {authorDetails[0].attributes.authorName}
              </h2>
              {/* <AuthorLatestBlogs
                blogData={blogData}
                checkAuthorSlug={authorDetails[0].attributes.slug}
              /> */}
              <section className="my-8">
                <InfiniteScroll
                  dataLength={posts.length}
                  next={getMorePosts}
                  hasMore={hasMore}
                  loader={<h4>Loading...</h4>}
                  endMessage={
                    <p className="text-center">
                      <b>Yay! You have seen it all</b>
                    </p>
                  }
                >
                  {posts.map(
                    (eachBlog) =>
                      authorDetails[0].attributes.slug ===
                        eachBlog.attributes.author.data.attributes.slug && (
                        <Link
                          href={`/blogpost/${eachBlog.attributes.slug}`}
                          key={eachBlog.id}
                        >
                          <div className="w-5/6 mx-auto lg:w-full">
                            <EachBlog key={eachBlog.id} eachBlog={eachBlog} />
                          </div>
                        </Link>
                      )
                  )}
                </InfiniteScroll>
              </section>
            </div>
          </div>
          <RightSection
            moreBlogs={moreBlogs}
            popular1={popular1}
            popular2={popular2}
            mangaFeatured={mangaFeatured}
          />
        </section>
      </main>
    </div>
  );
};

export async function getServerSideProps(context) {
  let navCategories;
  let blogData;
  let authorDetails;
  let moreBlogs;
  let popular1;
  let popular2;
  let mangaFeatured;
  let numberofBlogs;
  let headers = {
    Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
  };

  try {
    const [res1, res2, res3, res4, res5, res6, res7] = await Promise.all([
      fetch("http://localhost:1337/api/categories", {
        headers: headers,
      }),
      fetch(
        `http://localhost:1337/api/blog-posts?pagination[limit]=17&sort=createdAt%3Adesc&populate=blogImg&populate=author&populate=categories&filters[author][slug]=${context.query.slug}`,
        {
          headers: headers,
        }
      ),
      fetch(
        `http://localhost:1337/api/authors?filters[slug]=${context.query.slug}&populate=*`,
        {
          headers: headers,
        }
      ),
      fetch(
        "http://localhost:1337/api/blog-posts?sort=createdAt%3Adesc&pagination[limit]=3&populate=blogImg&populate=author&populate=categories&filters[moreBlogs]=true",
        {
          headers: headers,
        }
      ),
      fetch(
        "http://localhost:1337/api/blog-posts?sort=createdAt%3Adesc&pagination[limit]=3&populate=blogImg&populate=author&populate=categories&filters[popular1]=true",
        {
          headers: headers,
        }
      ),
      fetch(
        "http://localhost:1337/api/blog-posts?sort=createdAt%3Adesc&pagination[limit]=3&populate=blogImg&populate=author&populate=categories&filters[popular2]=true",
        {
          headers: headers,
        }
      ),
      fetch(
        "http://localhost:1337/api/blog-posts?pagination[limit]=10&sort=createdAt%3Adesc&populate=blogImg&populate=author&populate=categories&filters[mangaFeatured]=true",
        {
          headers: headers,
        }
      ),
    ]);
    const [json1, json2, json3, json4, json5, json6, json7] = await Promise.all(
      [
        res1.json(),
        res2.json(),
        res3.json(),
        res4.json(),
        res5.json(),
        res6.json(),
        res7.json(),
      ]
    );
    navCategories = json1.data;
    blogData = json2.data;
    authorDetails = json3.data;
    numberofBlogs = json2.meta.pagination.total;
    moreBlogs = json4.data;
    popular1 = json5.data;
    popular2 = json6.data;
    mangaFeatured = json7.data;
  } catch (error) {
    throw new Error(error);
  }

  return {
    props: {
      navCategories,
      blogData,
      authorDetails,
      moreBlogs,
      popular1,
      popular2,
      mangaFeatured,
      numberofBlogs,
      headers,
    }, // will be passed to the page component as props
  };
}

export default Slug;