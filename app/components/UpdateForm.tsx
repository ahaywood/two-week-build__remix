import { Link, useFetcher } from "@remix-run/react";
import { Icon } from "./Icon/Icon";
import { ChangeEvent, useRef, useState } from "react";
import { useAutosizeTextArea } from "~/hooks/useTextareaAutosize";

interface UpdateFormProps {
  projectId: string;
}

const UpdateForm = ({ projectId }: UpdateFormProps) => {
  const [markdownText, setMarkdownText] = useState("");
  const updateForm = useFetcher<{ ok: boolean; error: string }>();
  const textareaRef = useRef(null);

  useAutosizeTextArea(textareaRef.current, markdownText);

  const handleMarkdownChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownText(e.target.value);
  };

  return (
    <updateForm.Form method="post" action="/api/updates?index">
      <div className="flex px-7 justify-between items-end">
        <h2 className="text-2xl text-springBud uppercase">Add an Update</h2>
        <div className="text-battleshipGray text-sm mb-2">
          Markdown supported
        </div>
      </div>
      <textarea
        name="content"
        className="min-h-[200px]"
        ref={textareaRef}
        onChange={handleMarkdownChange}
      />
      <input type="hidden" name="project_id" value={projectId} />
      <div className="px-7 flex justify-between items-center">
        <Link to="/me" className="hover:text-springBud">
          Cancel
        </Link>
        <button className="inline-form" name="_action" value="create">
          <Icon name="check" size="lg">
            Submit
          </Icon>
        </button>
      </div>
    </updateForm.Form>
  );
};

export { UpdateForm };
