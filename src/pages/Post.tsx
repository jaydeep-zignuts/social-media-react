import {
  addDoc,
  getDocs,
  collection,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Post as Ipost } from "./Main";
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

interface Props {
  post: Ipost;
}
interface Like {
  userId: string;
  likeId: string;
}
export const Post = (props: Props) => {
  const { post } = props;
  const [likes, setLikes] = useState<Like[] | null>(null);
  const likesRef = collection(db, "likes");
  const likesDoc = query(likesRef, where("postId", "==", post.id));
  const getLikes = async () => {
    const data = await getDocs(likesDoc);
    setLikes(
      data.docs.map((doc) => ({
        userId: doc.data().userId,
        likeId: doc.id,
      }))
    );
  };
  useEffect(() => {
    getLikes();
  });
  const [user] = useAuthState(auth);
  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setLikes((prev) =>
          prev
            ? [...prev, { userId: user?.uid, likeId: newDoc.id }]
            : [{ userId: user?.uid, likeId: newDoc.id }]
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const removeLike = async () => {
    try {
      const unlikeDocId = query(
        likesRef,
        where("postId", "==", post.id),
        where("userId", "==", user?.uid)
      );
      const deletdId = await getDocs(unlikeDocId);
      const likeId = deletdId.docs[0].id;
      const unlike = doc(db, "likes", deletdId.docs[0].id);
      await deleteDoc(unlike);
      if (user) {
        setLikes(
          (prev) => prev && prev.filter((like) => like.likeId !== likeId)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const likedByUser = likes?.find((like) => like.userId === user?.uid);
  return (
    <div>
      <div className="title">
        <h1>{post.title}</h1>
      </div>
      <div className="body">
        <p>{post.description}</p>
      </div>
      <div className="footer">
        <p>@{post.username}</p>
        <button onClick={likedByUser ? removeLike : addLike}>
          {likedByUser ? <>&#128078;</> : <>&#128077;</>}
        </button>
        {!likes ? "" : <p>Likes:{likes.length}</p>}
      </div>
    </div>
  );
};
