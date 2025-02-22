import defaultImg from "../img/profile.png";

export default function StorageUtils(item) {
  return item ? `${process.env.REACT_APP_IMG_URL}/${item}` : defaultImg;
}
