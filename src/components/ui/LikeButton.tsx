import { cn } from "@/lib/utils";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa6";

interface LikeButtonProps {
  post_id: string;
  like_count: number;
}
export const LikeButton = ({ post_id, like_count }: LikeButtonProps) => {
  const supabase = useSupabaseClient();
  const liker_id = useUser()?.id;
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(like_count);

  useEffect(() => {
    const checkLikedStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("likes")
          .select()
          .eq("post_id", post_id)
          .eq("user_id", liker_id)
          .maybeSingle();

        if (error && error.code !== "PGRST116") {
          throw error.message;
        }

        setIsLiked(!!data);
      } catch (error) {
        console.error(`Error checking like status: ${error}`);
      }
    };

    checkLikedStatus();
  }, []);

  const updateLikeCount = async (count: number) => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ like_count: count })
        .eq("id", post_id);
      if (error) throw error.message;
    } catch (error) {
      console.error(`Error updating like count: ${error}`);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", post_id)
          .eq("user_id", liker_id);
        console.log("deleting like");
        if (error) throw error.message;

        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
        await updateLikeCount(likeCount - 1);
      } else {
        const { error } = await supabase
          .from("likes")
          .insert({ user_id: liker_id, post_id });

        if (error) throw error.message;

        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
        await updateLikeCount(likeCount + 1);
      }
    } catch (error) {
      console.error(`Error handling like: ${error}`);
    }
  };

  return (
    <button
      className="flex gap-2 items-center w-10"
      onClick={handleLike}
      aria-label="like"
    >
      <FaThumbsUp className={cn("size-4", isLiked && "text-blue-800")} />
      <span>{likeCount}</span>
    </button>
  );
};
