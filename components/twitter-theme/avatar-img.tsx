import { Image } from "expo-image";

type AvatarImgProps = {
  source: string;
  alt: string;
  width: number;
  height: number;
};

export const AvatarImg = ({ source, alt, width, height }: AvatarImgProps) => (
  <Image source={{ uri: source }} alt={alt} style={{ width, height }} />
);
