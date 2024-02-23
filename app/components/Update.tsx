import { Icon } from "./Icon/Icon";
import { StackedDate } from "./StackedDate";
import { Comment } from "./Comment";
import { CopyLink } from "./CopyLink";
import { EmojiPicker } from "./EmojiPicker";
import { EmojiCount } from "./EmojiCount";
import { Avatar } from "./Avatar";
import { ProfileDetails } from "./ProfileDetails";
import { User, Emoji, Comment as CommentType } from "~/global";
import { useState } from "react";
import { Link, useLocation } from "@remix-run/react";
import { CommentForm } from "./CommentForm";
import { AnimatePresence, motion } from "framer-motion";

interface UpdateProps {
  user: User;
  id: string;
  isBioShowing?: boolean;
  update: {
    created_at: string;
    content: string;
    emojis: Emoji[];
    comments: CommentType[];
  };
  currentUser?: Partial<User>;
}

const Update = ({
  id,
  isBioShowing = false,
  update,
  user,
  currentUser = {},
}: UpdateProps) => {
  const [isCommentFormShowing, setIsCommentFormShowing] = useState<boolean>();
  const location = useLocation();
  console.log({ location });

  // toggles visibility of the comment form
  const showCommentForm = () => {
    setIsCommentFormShowing((prevValue) => !prevValue);
  };

  return (
    <>
      <div className="col-start-2 col-span-3 mr-10 pr-10 border-r-3 border-r-codGray">
        <div className={`sticky top-5 ${isBioShowing ? "pb-20" : ""}`}>
          {update?.created_at && <StackedDate date={update.created_at} />}
        </div>
      </div>
      <div className="col-span-5 content">
        <p>{update?.content && update.content}</p>

        {/* TODO: Limit the number of comments showing at once */}
        {currentUser ? (
          <div className="pt-8 mb-16">
            {update.comments &&
              update.comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  currentUser={currentUser}
                />
              ))}

            <AnimatePresence>
              {isCommentFormShowing ? (
                <motion.div
                  key={`commentForm__${id}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <CommentForm
                    user_id={currentUser.id!}
                    update_id={id}
                    callback={showCommentForm}
                    cancel={showCommentForm}
                  />
                </motion.div>
              ) : (
                <button
                  className="button with-icon border-2 border-white text-white font-bold uppercase hover:bg-white hover:text-black"
                  onClick={showCommentForm}
                >
                  <Icon name="comment">Leave a Comment</Icon>
                </button>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="pt-8 mb-16">
            <Link to="/login">
              <em>You must be logged in to comment.</em>
            </Link>
          </div>
        )}
      </div>

      {/* emoji picker */}
      {/* TODO: Did I select one of these reactions? */}
      {/* TODO: Count similar emojis together */}
      {/* TODO: Limit the number of Emojis begin shown */}
      <div className="col-span-2 text-center">
        <div className="grid grid-cols-2 gap-3 sticky top-10">
          {update.emojis.length > 0 ? (
            <>
              {update.emojis.map((emoji) => (
                <EmojiCount key={emoji.id} number={1} emoji={emoji.emoji} />
              ))}
              <EmojiPicker updateId="" userId="" isLabelShowing={false} />
            </>
          ) : (
            <div className="col-span-2 text-left text-sm">
              <EmojiPicker updateId="" userId="" isLabelShowing={true} />
            </div>
          )}

          <div className="col-span-2 pt-3">
            <CopyLink
              className="mx-auto"
              slug={`${window.ENV.BASE_URL}/updates/${id}`}
            />
          </div>
        </div>
      </div>

      {/* TODO: Address order of content -- seems strange to have update, comment, bio
  The bio should be closer to the person who wrote the update. */}
      {isBioShowing && (
        <div className="col-span-8 col-start-3 grid grid-cols-subgrid relative -top-10">
          <div className="col-span-2">
            <a href={`/profile/selfteachme`}>
              <Avatar
                alt="A"
                size="144px"
                src="https://picsum.photos/seed/1706285540310/300/300"
              />
            </a>
          </div>
          <div className="col-span-6 pt-5">
            <div className="font-6 font-sans font-bold mb-4 text-2xl">
              <a
                href={`/profile/selfteachme`}
                className="text-springBud hover:text-white"
              >
                Amy Dutton
              </a>
            </div>
            <ProfileDetails user={user} />
          </div>
        </div>
      )}
    </>
  );
};

export { Update };
