import { Form } from "@remix-run/react";
import Banner from "~/components/Banner";
import { Icon } from "~/components/Icon";

export default function Index() {
  return (
    <div>
      <Banner>
        <h1>New Project</h1>
      </Banner>

      <Form method="post">
        <div className="field">
          <label htmlFor="name">Project Title</label>
          <input type="text" name="name" placeholder="" />
        </div>

        <div className="field">
          <label htmlFor="description">Project Description</label>
          <textarea name="description"></textarea>
        </div>

        <div className="field">
          <button type="submit">
            <Icon name="arrow">Submit</Icon>
          </button>
        </div>
      </Form>
    </div>
  );
}
