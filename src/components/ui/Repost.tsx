import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { IoMdShareAlt } from "react-icons/io";

import { useAuthenticated } from "@/hooks/useAuthenticated";
interface RepostProps {
  postId: string;
  title: string;
  content: string;
  image_url?: string;
  repostCount: number;
  handleRepostSuccess: () => void;
}

const Repost = ({
  postId,
  title,
  content,
  image_url,
  repostCount,
  handleRepostSuccess,
}: RepostProps) => {
  const [showRepostModal, setShowRepostModal] = useState<boolean>(false);
  const [repostTitle, setRepostTitle] = useState<string>("");
  const [newRepostCount, setNewRepostCount] = useState<number>(repostCount);
  const supabase = useSupabaseClient();
  const { user } = useAuthenticated();

  const createRepost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      alert("Please sign in to repost.");
      return;
    }

    const newTitle = `Original Post Title: ${title}\nRepost Title: ${repostTitle}`;
    const { error } = await supabase.from("posts").insert({
      title: newTitle,
      content,
      image_url,
      like_count: 0,
      repost_count: 0,
      user_id: user.id,
    });

    if (error) {
      console.error(`Error in repost: ${error.message}`);
      alert(`Failed to repost: ${error.message}`);
    } else {
      alert("Post has been reposted successfully.");
      setShowRepostModal(false);
      handleRepostSuccess();
      setNewRepostCount((prev) => prev + 1);
      const { error: updatePostCountError } = await supabase
        .from("posts")
        .update({
          repost_count: repostCount + 1,
        })
        .eq("id", postId);
      if (updatePostCountError)
        console.log(`Error: ${updatePostCountError.message}`);
      setRepostTitle("");
    }
  };
  return (
    <>
      {showRepostModal && (
        <div className="fixed top-0 left-0 h-screen w-full flex justify-center items-center backdrop-blur-sm z-10">
          <div className="bg-neutral-900 max-w-[450px] w-full  rounded-lg px-6 py-10 grid shadow-md shadow-neutral-600">
            <form onSubmit={createRepost} className="space-y-6">
              <div>
                <h2 className="font-semibold text-lg text-center mb-8">
                  Repost
                </h2>
                <label htmlFor="repostTitle" className="block mb-4">
                  Repost Title
                </label>
                <input
                  type="text"
                  id="repostTitle"
                  value={repostTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setRepostTitle(e.currentTarget.value);
                  }}
                  required
                />
              </div>

              <div className="flex justify-center items-center gap-6">
                <button type="button" className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Repost
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <button
        title="repost"
        className=""
        onClick={() => {
          setShowRepostModal(!showRepostModal);
        }}
      >
        <IoMdShareAlt className="size-5 inline mr-2" />
        <span className="text-sm">{newRepostCount} reposts</span>
      </button>
    </>
  );
};

export default Repost;
