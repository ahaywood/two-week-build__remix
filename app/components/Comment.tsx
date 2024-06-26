import { MouseEvent, useMemo, useState } from "react";
import { Link, useFetcher } from "@remix-run/react";
import { Avatar } from "./Avatar";
import { Comment as CommentType, User } from "~/global";
import { relativeTime } from "~/lib/dateHelpers";
import { Icon } from "./Icon/Icon";
import { AnimatePresence, motion } from "framer-motion";
import { CommentForm } from "./CommentForm";

interface CommentProps {
  comment: CommentType;
  currentUser?: Partial<User>;
  update_author_id?: string;
}

const Comment = ({
  comment,
  currentUser = {},
  update_author_id = "",
}: CommentProps) => {
  const [isConfirmDeleteShowing, setIsConfirmDeleteShowing] = useState(false);
  const [isEditCommentShowing, setIsEditCommentShowing] = useState(false);
  const deleteCommentForm = useFetcher<{ ok: boolean; error: string }>();

  const toggleConfirmDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsConfirmDeleteShowing((prev) => !prev);
  };

  const isUpdateAuthor = useMemo(() => {
    return update_author_id === comment.user_id;
  }, [update_author_id, comment.user_id]);

  return (
    <div className="pl-[90px] md:pl-0">
      <div
        className={`relative comment bg-licorice ${
          isUpdateAuthor ? "is-author" : ""
        }`}
      >
        <div className="absolute -left-[90px] -top-2">
          <Avatar
            src={comment?.users?.avatar}
            size="56px"
            alt={comment?.users?.name as string}
          />
        </div>
        <div>
          <div
            className={`px-6 border-b-1 ${
              isUpdateAuthor ? "border-b-springBud" : "border-b-codGray"
            } text-sm py-3 byline`}
          >
            <strong>
              <Link to={`/${comment.users?.username}`}>
                {comment.users?.name}
              </Link>
            </strong>{" "}
            {isUpdateAuthor && (
              <span className="text-mountainMist">(Author)</span>
            )}{" "}
            &bull; commented {relativeTime(comment.created_at)}
            <br />
            {/* if the logged in user wrote this comment, then allow them to edit or delete it */}
            {currentUser.id === comment.users?.id && (
              <deleteCommentForm.Form
                method="post"
                action="/api/comments?index"
                className="absolute right-2 top-2 flex gap-2 items-center"
              >
                <input type="hidden" name="comment_id" value={comment.id} />

                {/* edit button */}
                <button
                  aria-label="edit"
                  className="p-[6px] bg-black center text-springBud"
                  title="Edit"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditCommentShowing((prevValue) => !prevValue);
                  }}
                >
                  <Icon name="edit" aria-label="Edit" />
                </button>

                <AnimatePresence mode="wait">
                  {!isConfirmDeleteShowing ? (
                    // DELETE BUTTON
                    <button
                      value="confirmDelete"
                      className="p-[6px] bg-black center text-springBud"
                      title="Delete"
                      onClick={(e) => toggleConfirmDelete(e)}
                    >
                      <Icon name="trash" aria-label="delete" />
                    </button>
                  ) : (
                    // CONFIRM DELETE
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "auto" }}
                      exit={{ width: 0 }}
                      className="overflow-hidden relative -top-1"
                      key={`confirm__${comment.id}`}
                    >
                      <fieldset
                        className="bg-red-600 inline-flex gap-2 items-center pl-3 pr-1 py-1"
                        disabled={deleteCommentForm.state === "submitting"}
                      >
                        <div>Delete?</div>
                        <button
                          onClick={(e) => toggleConfirmDelete(e)}
                          className="p-[6px] bg-black center text-springBud"
                          title="Cancel"
                        >
                          <Icon name="close" aria-label="Cancel" />
                        </button>
                        <button
                          name="_action"
                          value="delete"
                          className="p-[6px] bg-black center text-springBud"
                          title="Delete"
                        >
                          <Icon name="check" aria-label="Confirm" />
                        </button>
                      </fieldset>
                    </motion.div>
                  )}
                </AnimatePresence>
              </deleteCommentForm.Form>
            )}
          </div>
          <div className="px-6 py-5">
            <AnimatePresence>
              {!isEditCommentShowing ? (
                <div>{comment.comment}</div>
              ) : (
                <motion.div
                  key={`edit__${comment.id}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <CommentForm
                    user_id={currentUser.id!}
                    update_id={comment.update_id}
                    defaultComment={comment}
                    isLabelShowing={false}
                    callback={() => setIsEditCommentShowing(false)}
                    cancel={() => setIsEditCommentShowing(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Comment };
