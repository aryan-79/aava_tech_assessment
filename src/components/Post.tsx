import ExpandableText from "./ui/ExpandableText";
import { LikeButton } from "./ui/LikeButton";
import Repost from "./ui/Repost";

export interface PostType {
  id: string;
  title: string;
  image_url?: string;
  content: string;
  like_count: number;
  repost_count: number;
  created_at: string;
  user_id: string;
}

interface PostProps extends PostType {
  handleRepostSuccess: () => void;
}

export default function Post({
  id,
  title,
  content,
  like_count,
  repost_count,
  image_url,
  handleRepostSuccess,
}: PostProps) {
  return (
    <div
      className="w-full border border-neutral-500 rounded-lg p-4 shadow-xl space-y-6"
      key={id}
    >
      <div>
        <pre className="">{title}</pre>
      </div>
      {image_url && (
        <div className="w-full aspect-square rounded-lg overflow-hidden">
          <img
            src={image_url}
            alt="post image"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <ExpandableText text={content} />
      <div className="flex gap-2 items-center">
        <LikeButton post_id={id} like_count={like_count} />
        <Repost
          postId={id}
          title={title}
          content={content}
          image_url={image_url}
          repostCount={repost_count}
          handleRepostSuccess={handleRepostSuccess}
        />
      </div>
    </div>
  );
}
