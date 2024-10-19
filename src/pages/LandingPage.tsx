import Post, { PostType } from "@/components/Post";
import Loader from "@/components/ui/Loader";
import { useAuthenticated } from "@/hooks/useAuthenticated";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useCallback, useEffect, useState } from "react";
import { IoMdCreate } from "react-icons/io";
import { IoExitOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LandingPage = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const { loading } = useAuthenticated();

  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.log("Error getting posts: ", error);
      return;
    }
    setPosts(data);
    setLoadingPosts(false);
  }, [supabase]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLogOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const handleRepostSuccess = () => {
    fetchPosts();
  };

  if (loading || loadingPosts) {
    return <Loader />;
  }
  return (
    <div className="px-2">
      <div className="grid gap-4 max-w-[500px] mx-auto py-4">
        {posts.map((post) => (
          <Post
            {...post}
            handleRepostSuccess={handleRepostSuccess}
            key={post.id}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4 fixed bottom-4 right-4 text-black">
        <button
          title="Write Post"
          className="rounded-full size-10 md:size-12 bg-slate-300 flex justify-center items-center"
          onClick={() => navigate("/create")}
        >
          <IoMdCreate className="size-5 md:size-6" />
        </button>
        <button
          title="Log Out"
          className="rounded-full size-10 md:size-12 bg-slate-300 flex justify-center items-center"
          onClick={() => handleLogOut()}
        >
          <IoExitOutline className="size-5 md:size-6" />
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
