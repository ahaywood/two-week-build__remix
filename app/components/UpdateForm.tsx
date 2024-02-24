import { useEffect, ChangeEvent, useRef, useState } from "react";
import { Link, useFetcher } from "@remix-run/react";
import { Icon } from "./Icon/Icon";
import { useAutosizeTextArea } from "~/hooks/useTextareaAutosize";
import type { Update as UpdateType } from "~/global";

interface UpdateFormProps {
  projectId: string;
  defaultUpdate?: UpdateType;
  callback?: () => void;
}

const UpdateForm = ({
  projectId,
  defaultUpdate = {} as UpdateType,
  callback = () => {},
}: UpdateFormProps) => {
  const [markdownText, setMarkdownText] = useState("");
  const updateForm = useFetcher<{ ok: boolean; error: string }>();
  const textareaRef = useRef(null);

  useAutosizeTextArea(textareaRef.current, markdownText);

  const handleMarkdownChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownText(e.target.value);
  };

  useEffect(() => {
    if (updateForm.state === "loading") {
      callback();
    }
  }, [updateForm.state, callback]);

  return (
    <updateForm.Form method="post" action="/api/updates?index">
      {!defaultUpdate.id ? (
        <div className="flex px-7 justify-between items-end">
          <h2 className="text-2xl text-springBud uppercase">Add an Update</h2>
          <div className="text-battleshipGray text-sm mb-2">
            Markdown supported
          </div>
        </div>
      ) : (
        <>
          <input type="hidden" name="id" value={defaultUpdate.id} />
          <input
            type="hidden"
            name="project_id"
            value={defaultUpdate.project_id}
          />
        </>
      )}
      <textarea
        name="content"
        className="min-h-[200px]"
        ref={textareaRef}
        onChange={handleMarkdownChange}
        defaultValue={defaultUpdate.content}
      />
      <input type="hidden" name="project_id" value={projectId} />
      <div className="px-7 flex justify-between items-center">
        {defaultUpdate.id ? (
          <>
            <button onClick={() => callback()} className="text-springBud">
              Cancel
            </button>
            <button className="inline-form" name="_action" value="update">
              <Icon name="check" size="lg">
                Update
              </Icon>
            </button>
          </>
        ) : (
          <>
            <Link to="/me" className="hover:text-springBud">
              Cancel
            </Link>
            <button className="inline-form" name="_action" value="create">
              <Icon name="check" size="lg">
                Submit
              </Icon>
            </button>
          </>
        )}
      </div>
    </updateForm.Form>
  );
};

export { UpdateForm };
