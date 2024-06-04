export function setAvatar(user: any) {
  if (user?.avatar) {
    return user.avatar?.imageSrc;
  }

  if (user?.sex === "male") {
    return "https://firebasestorage.googleapis.com/v0/b/ayuta-5371d.appspot.com/o/static%2FavatarMale.svg?alt=media&token=b34c2e46-fb77-4573-80a7-1db1d3b1f616";
  }

  if (user?.sex === "female") {
    return "https://firebasestorage.googleapis.com/v0/b/ayuta-5371d.appspot.com/o/static%2FavatarFemale.svg?alt=media&token=a13ed194-e834-4e97-9b0b-0b2aa740a2fa";
  }

  return "";
}
