import { Icon } from "./Icon/Icon";
import { StackedDate } from "./StackedDate";
import { Comment } from "./Comment";
import { CopyLink } from "./CopyLink";
import { EmojiPicker } from "./EmojiPicker";
import { EmojiCount } from "./EmojiCount";
import { Avatar } from "./Avatar";
import { User, Update as UpdateType } from "~/global";
import { useEffect, useState } from "react";
import { Link, useFetcher } from "@remix-run/react";
import { CommentForm } from "./CommentForm";
import { AnimatePresence, motion } from "framer-motion";
import { constants } from "~/lib/constants";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import { UpdateForm } from "./UpdateForm";

interface UpdateProps {
  user: User;
  id: string;
  isBioShowing?: boolean;
  update: UpdateType;
  currentUser?: Partial<User>;
  isStackedDateShowing?: boolean;
}

const Update = ({
  id,
  isBioShowing = false,
  update,
  user,
  currentUser = {},
  isStackedDateShowing = true,
}: UpdateProps) => {
  const [isCommentFormShowing, setIsCommentFormShowing] = useState(false);
  const [isEditUpdateFormShowing, setIsEditUpdateFormShowing] = useState(false);
  const [isConfirmDeleteShowing, setIsConfirmDeleteShowing] = useState(false);
  const deleteUpdateFetcher = useFetcher<{ ok: boolean; error: string }>();

  // toggles visibility of the comment form
  const showCommentForm = () => {
    setIsCommentFormShowing((prevValue) => !prevValue);
  };

  useEffect(() => {
    if (deleteUpdateFetcher.state === "idle") {
      setIsConfirmDeleteShowing(false);
    }
  }, [deleteUpdateFetcher.state]);

  const marked = new Marked(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    })
  );

  return (
    <>
      <div className="col-span-12 md:col-start-2 md:col-span-3 md:mr-10 md:pr-10 md:border-r-3 border-codGray border-b-1 md:border-b-0">
        <div className={`sticky top-5 ${isBioShowing ? "pb-20" : ""}`}>
          {update?.created_at && isStackedDateShowing && (
            <StackedDate date={update.created_at} />
          )}

          {/* you can't edit or delete an update unless it's yours */}
          {currentUser?.id === user?.id && (
            <div className="flex flex-col gap-2 absolute right-0 md:-right-[42px] top-0">
              {/* edit button */}
              <button
                className="square-button neutral"
                onClick={() =>
                  setIsEditUpdateFormShowing((prevValue) => !prevValue)
                }
              >
                <Icon size="md" name="edit" aria-label="Edit" />
              </button>

              {/* delete button */}
              <div className="relative">
                <button
                  className="square-button neutral"
                  onClick={() =>
                    setIsConfirmDeleteShowing((prevValue) => !prevValue)
                  }
                >
                  <Icon size="md" name="trash" aria-label="Delete" />
                </button>

                {/* confirm delete */}
                <AnimatePresence>
                  {isConfirmDeleteShowing && (
                    <motion.div
                      className="absolute -left-[132px] md:-left-[52px] -top-1 flex items-center bg-red-600 text-white pr-1 pl-3 py-1 gap-2"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                    >
                      <div>REALLY?</div>
                      {/* cancel delete */}
                      <button
                        className="square-button bg-black text-springBud"
                        onClick={() => setIsConfirmDeleteShowing(false)}
                      >
                        <Icon size="md" name="close" aria-label="Cancel" />
                      </button>
                      {/* confirm delete */}
                      <deleteUpdateFetcher.Form
                        method="post"
                        action="/api/updates?index"
                      >
                        <button
                          className="square-button bg-black text-springBud"
                          name="_action"
                          value="delete"
                        >
                          <input type="hidden" name="id" value={id} />
                          <Icon
                            size="md"
                            name="check"
                            aria-label="Confirm Delete"
                          />
                        </button>
                      </deleteUpdateFetcher.Form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="col-span-12 md:col-span-7 lg:col-span-5 content p-5 md:p-0">
        {/* BIO */}
        {isBioShowing && (
          <div className="bg-licorice p-3 mb-10 relative flex items-center gap-5">
            <Avatar alt={user?.name} size="72px" src={user?.avatar} />
            <div>
              <Link
                to={`/${user?.username}`}
                className="text-chicago text-2xl mb-1 !border-b-0 no-underline"
              >
                <strong className="text-springBud font-bold">
                  {user.name}
                </strong>{" "}
                &bull; @{user.username}
              </Link>
              <div>
                I&apos;m building{" "}
                <Link to={`/profile/${user.username}`}>
                  {update?.projects?.name}
                </Link>
                .
              </div>
            </div>
          </div>
        )}

        {/* current update */}
        {isEditUpdateFormShowing ? (
          <UpdateForm
            projectId={update.project_id}
            defaultUpdate={update}
            callback={() => {
              setIsEditUpdateFormShowing(false);
            }}
          />
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: marked.parse(update.content) as string,
            }}
          />
        )}

        {/* TODO: Limit the number of comments showing at once */}
        {currentUser ? (
          <div className="pt-8 mb-16">
            {update.comments &&
              update.comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  currentUser={currentUser}
                  update_author_id={user.id}
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
                  className="button with-icon border-2 border-battleshipGray text-battleshipGray font-bold uppercase hover:bg-white hover:border-white hover:text-black"
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
      {/* TODO: Limit the number of Emojis begin shown */}
      <div className="col-span-12 md:col-start-5 md:col-span-7 lg:col-span-2 text-center p-5 md:p-0">
        <div className="flex flex-row flex-wrap items-center lg:grid lg:grid-cols-2 gap-3 sticky top-10">
          {update.emojis.length > 0 ? (
            <>
              {update.emojis.map((emoji, index) => {
                return (
                  <EmojiCount
                    key={index}
                    number={emoji.count}
                    emoji={emoji.emoji}
                    defaultSelected={emoji.user_submitted}
                    current_user_id={currentUser.id!}
                    update_id={id}
                  />
                );
              })}
              <EmojiPicker
                updateId={id}
                userId={currentUser.id!}
                isLabelShowing={false}
              />
            </>
          ) : (
            <div className="md:col-span-2 text-left text-sm">
              <EmojiPicker
                updateId={id}
                userId={currentUser.id!}
                isLabelShowing={true}
              />
            </div>
          )}

          <div className="lg:col-span-2 lg:pt-3">
            <CopyLink
              className="mx-auto"
              slug={`${constants.BASE_URL}/updates/${id}`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export { Update };
