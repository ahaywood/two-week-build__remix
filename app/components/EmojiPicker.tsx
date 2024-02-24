import React, { useEffect, useRef, useState } from "react";
import { emojis } from "../lib/emojis";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "~/hooks/useClickOutside";
import { useEscapeKey } from "~/hooks/useEscapeKey";
import { useFetcher } from "@remix-run/react";

interface EmojiPickerProps {
  updateId: string;
  userId: string;
  isLabelShowing?: boolean;
}

const EmojiPicker = ({
  updateId,
  userId,
  isLabelShowing = false,
}: EmojiPickerProps) => {
  const [isEmojiMenuShowing, setIsEmojiMenuShowing] = useState(false);
  const [emojiList, setEmojiList] = useState(emojis);
  const [inputDefaultValue, setInputDefaultValue] = useState("");
  const searchEmojisInput = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef(null);
  const triggerButton = useRef(null);
  const emojiPickerForm = useFetcher<{ ok: boolean; error: string }>();

  // if the user starts to scroll, close the emoji menu
  useEffect(() => {
    const handleScroll = () => {
      setIsEmojiMenuShowing(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // focus on the search emojis input field when the menu opens
  useEffect(() => {
    if (isEmojiMenuShowing) {
      searchEmojisInput.current!.focus();
    }
  }, [isEmojiMenuShowing]);

  // handle the escape key
  // if there is text in the input,then clear the input and filter
  // if there isn't text in the input, then close the menu
  const handleEscape = () => {
    // if there's text in the input, clear it
    if (searchEmojisInput.current!.value !== "") {
      searchEmojisInput.current!.value = "";
      setEmojiList(emojis);
    }
    // if there's no text, then hide the menu
    else {
      setIsEmojiMenuShowing(false);
    }
  };
  useEscapeKey(handleEscape);

  // toggle the emoji menu open and closed
  const toggleEmojiMenu = () => {
    setIsEmojiMenuShowing((prevValue) => !prevValue);
    reset();
  };

  // close the emoji menu when the user clicks outside of it
  useOutsideClick(() => {
    setIsEmojiMenuShowing(false);
    reset();
  }, emojiPickerRef);

  /**
   * Reset the menu by clearing the input and setting the emoji list back to the default
   */
  const reset = () => {
    setInputDefaultValue("");
    setEmojiList(emojis);
  };

  // filter the emojis in the list as the user starts typing
  const filterEmoji = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    const filtered = emojis.filter((emoji) => {
      return emoji.aliases.some((alias) => alias.includes(event.target.value));
    });
    setEmojiList(filtered);
  };

  return (
    <div className="relative z-emojiPicker">
      <button
        onClick={toggleEmojiMenu}
        className={`text-xl text-white font-mono font-bold h-8 center border-2 rounded-3xl px-3 py-2 gap-2 hover:bg-codGray border-codGray w-full ${
          isEmojiMenuShowing && "border-springBud bg-codGray"
        }`}
        ref={triggerButton}
      >
        +{isLabelShowing && <span className="text-sm"> Reaction</span>}
      </button>

      <AnimatePresence>
        {isEmojiMenuShowing && (
          <motion.div
            className="emoji-picker bg-codGray w-[300px] h-[400px] absolute right-0 top-[50px] p-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 100 }}
            exit={{ y: -20, opacity: 0 }}
            ref={emojiPickerRef}
          >
            <div className="w-full">
              <input
                type="text"
                name="search_emojis"
                className="short"
                placeholder="Search..."
                onChange={(e) => {
                  filterEmoji(e);
                }}
                defaultValue={inputDefaultValue}
                ref={searchEmojisInput}
              />
            </div>

            <emojiPickerForm.Form className="w-[284px] h-[350px] overflow-scroll grid content-start grid-cols-9 gap-1 p-2">
              {emojiList.map((emoji, index) => (
                <>
                  <button
                    key={index}
                    className="text-xl border-2 border-transparent hover:border-springBud cursor-pointer leading-none p-[2px] font-emoji"
                    onClick={(e) => {
                      e.preventDefault(); // prevent the form from submitting normally
                      toggleEmojiMenu(); // close the emoji menu
                      // I'm handling the form submission so I can send over the selected emoji
                      emojiPickerForm.submit(
                        {
                          user_id: userId,
                          update_id: updateId,
                          emoji: emoji.emoji,
                          _action: "add",
                        },
                        { method: "POST", action: "/api/reactions?index" }
                      );
                    }}
                  >
                    {emoji.emoji}
                  </button>
                </>
              ))}
            </emojiPickerForm.Form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { EmojiPicker };
