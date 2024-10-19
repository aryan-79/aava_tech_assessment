import { useEffect } from "react";
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

  const handleGoogleSignin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (data) {
      console.log("logged in successfully");
    } else if (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  const handleGithubSignin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });
    if (data) {
      console.log("logged in successfully");
    } else if (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center gap-10">
        <div className="grid gap-4">
          <button
            className="btn-primary flex items-center gap-2"
            onClick={() => {
              handleGoogleSignin();
            }}
          >
            <BsGoogle />
            Continue With Google
          </button>
          <button
            className="btn-primary flex items-center gap-2"
            onClick={() => {
              handleGithubSignin();
            }}
          >
            <BsGithub />
            Continue With Github
          </button>
        </div>
        <a href="/docs" className="flex items-center gap-2">
          <FaBookOpen />
          <span className="inline">Go to Docs</span>
          <FaLongArrowAltRight />
        </a>
      </div>
    );
  }
  return null;
}
