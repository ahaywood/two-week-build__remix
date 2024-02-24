import { useState } from "react";

const EmojiCount = ({
  defaultSelected = false,
  emoji,
  number,
}: {
  defaultSelected?: boolean;
  emoji: string;
  number: number;
}) => {
  const [isSelected, setIsSelected] = useState(defaultSelected);
  console.log({ emoji });

  const toggle = () => {
    // toggle the state of the button
    setIsSelected((prev) => !prev);

    // TODO: update the emoji count within Supabase
  };

  return (
    <button
      className={`text-lg  font-mono font-bold h-8 center border-2 rounded-3xl px-3 py-2 gap-2 hover:bg-codGray ${
        isSelected
          ? "border-springBud text-springBud"
          : "border-codGray text-white"
      }`}
      onClick={toggle}
    >
      <span className="font-xl font-emoji">{emoji}</span>
      {number}
    </button>
  );
};

export { EmojiCount };
