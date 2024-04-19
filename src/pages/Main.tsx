import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { Post } from "./Post";
export interface Post {
  id: string;
  title: string;
  username: string;
  description: string;
}
export const Main = () => {
  const [postsList, setPostsList] = useState<Post[] | null>(null);
  const postsRef = collection(db, "posts");
  const getPosts = async () => {
    const data = await getDocs(postsRef);
    setPostsList(
      data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Post[]
    );
  };
  useEffect(() => {
    getPosts();
  }, []);
  return (
    <div>
      {postsList?.map((post) => (
        // <div className="card">
        //   <h5>{d.id}</h5>
        //   <h5>{d.username}</h5>
        //   <h5>{d.title}</h5>
        //   <h5>{d.description}</h5>
        // </div>
        <Post post={post} />
      ))}
    </div>
  );
};
