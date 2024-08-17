import { useQuery } from "@tanstack/react-query";

const fetchImageUri = async (imageUri: string | null | undefined) => {
  if (!imageUri) return "";
  const image = 
  return data;
};

export const usePost = (imageUri: string | null | undefined) => {
  return useQuery<Post | null, Error>({
    queryKey: ["image", imageUri],
    queryFn: () => fetchImageUri(imageUri),
  });
};
