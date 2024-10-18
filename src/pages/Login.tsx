import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { BsGithub, BsGoogle } from "react-icons/bs";

export default function Login() {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const user = useUser();
  console.log({ user });
  useEffect(() => {
    if (user) {
      navigate("/");
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
    }
  };

  if (!user) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <div className="grid gap-4">
          <button
            className="w-full border flex items-center gap-2 py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-500"
            onClick={() => {
              handleGoogleSignin();
            }}
          >
            <BsGoogle />
            Continue With Google
          </button>
          <button
            className="w-full border flex items-center gap-2 py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-500"
            onClick={() => {
              handleGithubSignin();
            }}
          >
            <BsGithub />
            Continue With Github
          </button>
        </div>
      </div>
    );
  }
  return null;
}

{
  /* <Auth
  supabaseClient={supabase}
  appearance={{ theme: ThemeSupa }}
  providers={["google", "github"]}
  showLinks={false}
  onlyThirdPartyProviders
/>; */
}
