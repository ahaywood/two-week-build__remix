import { Icon } from "./Icon/Icon";

const CopyLink = ({
  className = "",
  slug,
}: {
  className?: string;
  slug: string;
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <button
      onClick={() => copyToClipboard(slug)}
      className={`with-icon whitespace-nowrap text-neutral-600 hover:text-springBud ${className}`}
    >
      <Icon name="link" size="lg">
        Copy Link
      </Icon>
    </button>
  );
};

export { CopyLink };
