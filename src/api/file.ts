import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// import { CustomSlideImage } from "../components/LightboxGallery";
import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { Image } from "./../types";
import { toJS } from "mobx";

const uploadImage = async (userId: string, file: File | undefined) => {
  // console.debug("File: ", toJS(File));

  console.debug("2: ", toJS(file));

  if (!file) return;

  const storage = getStorage();

  const metadata = {
    contentType: file.type,
  };

  const fileName = new Date().getTime().toString();

  const storageRef = ref(storage, `/users/${userId}/posts/${fileName}`);

  const uploadedFile = await uploadBytes(storageRef, file, metadata).then((snapshot) => {
    console.log("Uploaded a blob or file! ", snapshot);

    return snapshot;
  });

  if (!uploadedFile) return;

  const fileUrl = await getDownloadURL(uploadedFile.ref).then((downloadURL) => {
    console.log("File available at", downloadURL);

    return downloadURL;
  });

  return {
    imageId: fileName,
    imageSrc: fileUrl,
  } as Image;
};

const deleteImage = async (userId: string, fileId: string) => {
  const storage = getStorage();

  const subColRef = collection(db, "users", userId, "posts");

  const querySnapshot = await getDocs(subColRef);
  querySnapshot.forEach((doc) => {
    const data = doc.data();

    if (data.imageId === fileId) {
      deleteDoc(doc.ref);
    }
  });

  //   // Create a reference to the file to delete
  const desertRef = ref(storage, `/users/${userId}/posts/${fileId}`);

  //   // Delete the file
  return await deleteObject(desertRef)
    .then(() => {
      console.log("File deleted successfully");
      return true;
    })
    .catch((error) => {
      console.log("Uh-oh, an error occurred! ", error);
    });
};

export default Object.assign({
  uploadImage,
  deleteImage,
});
