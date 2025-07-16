import React, { ReactNode, useEffect, useState } from 'react';
import { get } from './util/http';
import BlogPosts, { BlogPost } from './components/BlogPosts';
import fetchingImg from "./assets/data-fetching.png"
import ErrorMessage from './components/ErrorMessage';

type RawDataBlogPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[] | undefined>();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setIsFetching(true);
      try {
        const data = (await get("https://jsonplaceholder.typicode.com/posts")) as RawDataBlogPost[];
        const blogPosts: BlogPost[] = data.map((rawPost) => ({
          id: rawPost.id,
          title: rawPost.title,
          text: rawPost.body,
        }));
        setFetchedPosts(blogPosts);
      } catch (error) {
        setError(`Failed to fetch posts: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error(error);
      }

      setIsFetching(false);
    }
    fetchPosts();
  }, []);

  let content: ReactNode;
  if (error) { content = <ErrorMessage text={error} />;
}

  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />;
  } 
  if (isFetching) {
    content = <p id= "loading-fallback">Loading...</p>;
  } 

  return  <main>
    <h1>Data Fetching!</h1>
    <img src={fetchingImg} alt="Data fetching illustration" />
    {content}
  </main>;
}

export default App;
