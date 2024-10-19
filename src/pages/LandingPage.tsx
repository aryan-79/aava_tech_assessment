import Post, { PostType } from "@/components/Post";
import Loader from "@/components/ui/Loader";
import { useAuthenticated } from "@/hooks/useAuthenticated";
import { cn } from "@/lib/utils";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useCallback, useEffect, useState } from "react";
import { IoMdCreate } from "react-icons/io";
import { IoExitOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LandingPage = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<boolean>(false);
  const { user, loading } = useAuthenticated();
  const avatar_url = user?.user_metadata.avatar_url;

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

      <div className="fixed bottom-10 right-4 text-black bg-slate-400 p-2 rounded-full z-10">
        <div
          className={cn(
            "overflow-hidden grid grid-rows-[0,auto] transition-all duration-100 ease-out",
            expanded && "gap-2 grid-rows-[auto,auto]"
          )}
          aria-expanded={expanded}
        >
          <div className="flex flex-col gap-2 items-center">
            <button
              title="Create Post"
              className=""
              onClick={() => navigate("/create")}
              aria-label="create post"
            >
              <IoMdCreate className="size-8" />
            </button>
            <button
              title="Log Out"
              className=""
              onClick={() => handleLogOut()}
              aria-label="log out"
            >
              <IoExitOutline className="size-8" />
            </button>
          </div>
          <button
            className="size-10"
            onClick={() => setExpanded(!expanded)}
            aria-label="actions"
          >
            <img
              src={avatar_url}
              alt="avatar"
              className="size-10 rounded-full"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
