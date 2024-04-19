import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
interface CreateFormData {
  title: string;
  description: string;
}
export const CreateForm = () => {
  const [user] = useAuthState(auth);

  const schema = yup.object().shape({
    title: yup.string().required("You must add title"),
    description: yup.string().required("You must add description"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const postRef = collection(db, "posts");
  const onCreatePost = async (data: CreateFormData) => {
    await addDoc(postRef, {
      title: data.title,
      description: data.description,
      username: user?.displayName,
      id: user?.uid,
    });
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onCreatePost)}>
        <input placeholder="title" {...register("title")} />
        <span style={{ color: "red" }}>{errors.title?.message}</span>
        <textarea placeholder="description" {...register("description")} />
        <span style={{ color: "red" }}>{errors.description?.message}</span>
        <input type="submit" />
      </form>
    </div>
  );
};
