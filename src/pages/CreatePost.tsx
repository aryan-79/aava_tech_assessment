import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from "uuid";
import { IoMdCreate } from "react-icons/io";
import Loader from "@/components/ui/Loader";
import { useAuthenticated } from "@/hooks/useAuthenticated";
import { toast } from "react-toastify";

const CreatePost = () => {
  const { user, loading } = useAuthenticated();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleImageSelect = useCallback(() => {
    inputFileRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setImage(event.target.files[0]);
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);

      try {
        if (!user) throw new Error("User not authenticated");

        let imageUrl = null;

        if (image) {
          const fileExt = image.name.split(".").pop();
          const fileName = `${uuidv4()}.${fileExt}`;
          console.log(user.id);
          const { error: uploadError } = await supabase.storage
            .from("post-images")
            .upload(fileName, image);
          if (uploadError) console.log("upload error");

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("post-images").getPublicUrl(fileName);

          imageUrl = publicUrl;
        }

        const { error: insertError } = await supabase.from("posts").insert({
          title,
          content,
          image_url: imageUrl,
          like_count: 0,
          repost_count: 0,
          user_id: user.id,
        });

        if (insertError) throw insertError;
        toast.success("Post Created");

        navigate("/");
      } catch (error) {
        console.error("Error creating post:", error);
        toast.error("Failed to Create Post");
      } finally {
        setIsSubmitting(false);
      }
    },
    [user, image, title, content, supabase, navigate]
  );

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-[450px] mx-auto p-4 h-screen grid items-center">
      <form
        onSubmit={handleSubmit}
        className="px-4 py-8 min-h-[50%] border border-neutral-500 shadow-md shadow-slate-700 rounded-md flex flex-col justify-center gap-4"
      >
        <h1 className="text-center font-medium mb-6">
          <IoMdCreate className="inline mr-2" />
          <span className="text-xl">Create Post</span>
        </h1>
        <div>
          <label htmlFor="postTitle" className="block mb-2">
            Title
          </label>
          <input
            type="text"
            name="postTitle"
            id="postTitle"
            placeholder="New Post (required)"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-800"
          />
        </div>
        <div>
          <label htmlFor="postContent" className="block mb-2">
            Content
          </label>
          <textarea
            name="postContent"
            id="postContent"
            placeholder="Write Content for the Post (required)"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-600 rounded-md bg-neutral-800 h-32"
          />
        </div>
        <div className="flex justify-between items-center">
          <label htmlFor="postImage">Upload Image (optional)</label>
          <button
            type="button"
            onClick={handleImageSelect}
            className="border border-neutral-600 rounded-md hover:border-neutral-400 hover:bg-neutral-900 px-4 h-8"
          >
            {image ? "Change Image" : "Select Image"}
          </button>
          <input
            ref={inputFileRef}
            type="file"
            name="postImage"
            id="postImage"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        {image && <p className="text-sm text-neutral-400">{image.name}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md px-4 h-10 bg-blue-800 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
