import { useFetcher } from "@remix-run/react";
import { useState } from "react";

const EmojiCount = ({
  defaultSelected = false,
  emoji,
  number,
  current_user_id,
  update_id,
}: {
  defaultSelected?: boolean;
  emoji: string;
  number: number;
  current_user_id: string;
  update_id: string;
}) => {
  const emojiFetcher = useFetcher<{ ok: boolean; error: string }>();

  return (
    <emojiFetcher.Form method="post" action="/api/emojis?index">
      <input type="hidden" name="emoji" value={emoji} />
      <input type="hidden" name="user_id" value={current_user_id} />
      <input type="hidden" name="update_id" value={update_id} />
      <button
        className={`text-lg  font-mono font-bold h-8 center border-2 rounded-3xl px-3 py-2 gap-2 hover:bg-codGray ${
          defaultSelected
            ? "border-springBud text-springBud"
            : "border-codGray text-white"
        }`}
        name="_action"
        value={defaultSelected ? "remove" : "add"}
      >
        <span className="font-xl font-emoji">{emoji}</span>
        {number}
      </button>
    </emojiFetcher.Form>
  );
};

export { EmojiCount };
