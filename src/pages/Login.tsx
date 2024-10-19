import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { FaBookOpen, FaLongArrowAltRight } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const user = useUser();
  console.log({ user });
  useEffect(() => {
    if (user) {
      navigate("/");
      toast.success(`Logged in as ${user.user_metadata.name}`);
    }
  }, [user, navigate]);

  const handleOAuthSignIn = useCallback(
    async (provider: "google" | "github") => {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) {
        console.error(error);
        toast.error(error.message);
      }
    },
    [supabase]
  );

  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center gap-10">
        <div className="grid gap-4">
          <button
            className="btn-primary flex items-center gap-2"
            onClick={() => {
              handleOAuthSignIn("google");
            }}
          >
            <BsGoogle />
            Continue With Google
          </button>
          <button
            className="btn-primary flex items-center gap-2"
            onClick={() => {
              handleOAuthSignIn("github");
            }}
          >
            <BsGithub />
            Continue With Github
          </button>
        </div>
        <button
          className="flex items-center text-blue-600 gap-2"
          onClick={() => navigate("/docs")}
        >
          <FaBookOpen />
          <span className="inline">Go to Docs</span>
          <FaLongArrowAltRight />
        </button>
      </div>
    );
  }
  return null;
}
