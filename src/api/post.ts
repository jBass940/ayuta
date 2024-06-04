import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { Post } from "../types";

const create = async (
  userId: string,
  data: Record<string, string | boolean>
) => {
  const collectionRef = collection(db, "users", userId, "posts");

  return await addDoc(collectionRef, {
    createdAt: Date.now(),
    imageSrc: data["imageSrc"] || "",
    imageId: data["imageId"] || "",
    title: data["title"] || "",
    text: data["text"] || "",
    isBlog: data["isBlog"] || false,
  }).then(() => true);
};

const get = async (userId: string, postId: string) => {
  const postRef = doc(db, "users", userId, "posts", postId);

  const docSnap = await getDoc(postRef);

  if (docSnap.exists()) {
    const post = docSnap.data() as Post;
    return post;
  }

  return false;
};

const getUserPosts = async (userId: string) => {
  const subColRef = collection(db, "users", userId, "posts");
  const querySnapshot = await getDocs(subColRef);
  const posts: any[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    posts.push({
      postId: doc.id,
      ...data,
    });
  });
  return posts.filter((post) => post.isBlog).reverse() as Post[];
};

export default Object.assign({
  create,
  get,
  getUserPosts,
});
