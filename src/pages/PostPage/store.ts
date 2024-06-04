import { makeAutoObservable, toJS } from "mobx";

import { addDoc, collection, doc, getDoc, getDocs, query, where, documentId } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import Api from "./../../api";
import rootStore, { RootStore } from "../../store";
import { User } from "../../api/user";

export type Comment = {
  userId: string;
  text: string;
  createdAt: number;
  authorAvatar?: string;
  authorName?: string;
  user: User;
};

class PostPageStore {
  rootStore: RootStore;

  post: any;
  comments: Comment[] = [];
  commentText = "";

  isSubmittingComment = false;

  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  setIsLoading = (value: boolean) => {
    this.isLoading = value;
  };

  setCommentText = (newText: string) => {
    this.commentText = newText;
  };

  async getPost(userId: string, postId: string) {
    const post = await Api.post.get(userId, postId);

    if (!post) return;

    this.post = post;
  }

  async getComments(userId: string, postId: string) {
    this.setIsLoading(true);

    const postCommentsRef = collection(db, "users", userId, "posts", postId, "comments");

    const commentsSnapshot = await getDocs(postCommentsRef);

    const rawComments: Comment[] = [];
    commentsSnapshot.forEach((doc) => {
      const comment = doc.data() as Comment;
      rawComments.push(comment);
    });

    this.comments = rawComments;

    this.comments = this.comments.sort((a: any, b: any) => Number(a.createdAt) - Number(b.createdAt));

    // getUserAvatars
    // const userIds = this.comments.map((comment) => comment.userId);

    // console.log("userIds >>> ", userIds);

    // const uniqIds: string[] = [];
    this.comments.forEach(async (comment, index) => {
      await Api.user.get(comment.userId).then((user: User) => {
        this.comments[index] = {
          ...this.comments[index],
          user: user,
        };
      });

      this.setIsLoading(false);

      // if (!uniqIds.includes(id)) {
      //   uniqIds.push(id);
      // }
    });
    // console.log("uniqIds >>>", uniqIds);

    // const

    // const userCollectionRef = collection(db, "users");

    // const q = query(userCollectionRef, where(documentId(), "in", uniqIds));

    // console.log("q->", q);

    // const usersSnapshot = await getDocs(q);

    // const userMap: Record<string, any> = {};
    // usersSnapshot.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.data());
    //   userMap[doc.id] = doc.data();
    // });

    // console.log("userMap >>> ", userMap);

    // this.comments.forEach((comment) => {
    //   comment.authorAvatar = userMap[comment.userId].avatar.src;
    //   comment.authorName =
    //     userMap[comment.userId].name + " " + userMap[comment.userId].surname;
    // });
  }

  clearPost() {
    this.post = undefined;
    this.setCommentText("");
    this.comments = [];
  }

  async sendPost(authorId: string, userId: string, postId: string) {
    this.isSubmittingComment = true;

    const ref = doc(db, "users", userId, "posts", postId);

    const commentCollectionRef = collection(ref, "comments");

    addDoc(commentCollectionRef, {
      userId: authorId,
      text: this.commentText,
      createdAt: Date.now(),
    })
      .then(() => {
        this.setCommentText("");
        this.getComments(userId, postId);
      })
      .finally(() => {
        this.isSubmittingComment = false;
      });
  }

  checkDeleteletePostIcon = async () => {
    // берём id поста и id пользователя -> проверяем наличие документа в коллекции
  };
}

const postPageStore = new PostPageStore();
export default postPageStore;
