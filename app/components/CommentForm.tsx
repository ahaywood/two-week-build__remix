import { useFetcher } from "@remix-run/react";
import { Icon } from "./Icon/Icon";
import { Comment } from "~/global";
import { useEffect } from "react";
import { useEscapeKey } from "~/hooks/useEscapeKey";

interface CommentFormProps {
  user_id: string;
  update_id: string;
  defaultComment?: Comment;
  callback?: () => void;
  cancel?: () => void;
  isLabelShowing?: boolean;
}

const CommentForm = ({
  user_id,
  update_id,
  defaultComment = {} as Comment,
  isLabelShowing = true,
  callback = () => {},
  cancel = () => {},
}: CommentFormProps) => {
  const commentForm = useFetcher<{ ok: boolean; error: string }>();

  useEscapeKey(cancel);

  useEffect(() => {
    if (commentForm.state === "idle" && commentForm.data?.ok) {
      callback();
    }
  }, [commentForm, callback]);

  return (
    <commentForm.Form
      method="post"
      action="/api/comments/?index"
      className="pt-3"
    >
      <fieldset disabled={commentForm.state === "submitting"}>
        <input type="hidden" name="update_id" value={update_id} />
        <input type="hidden" name="user_id" value={user_id} />
        {defaultComment?.id && (
          <input type="hidden" name="comment_id" value={defaultComment.id} />
        )}
        <div className="relative">
          {isLabelShowing && (
            <label htmlFor="comment" className="!left-3">
              Comment
            </label>
          )}
          <textarea name="comment">
            {defaultComment?.comment && defaultComment.comment}
          </textarea>
        </div>
        <div className="flex gap-4 justify-between px-2">
          <button onClick={cancel} className="relative hover:text-springBud">
            Cancel
          </button>
          <button
            className="inline-form"
            name="_action"
            value={defaultComment?.comment ? "update" : "create"}
          >
            <Icon name="check" size="lg">
              {defaultComment?.comment ? "Update" : "Submit"}
            </Icon>
          </button>
        </div>
      </fieldset>
    </commentForm.Form>
  );
};

export { CommentForm };
