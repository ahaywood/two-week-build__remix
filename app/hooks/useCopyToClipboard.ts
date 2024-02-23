/**
 * Example Usage:
 *
 * import { useCopyToClipboard } from 'app/hooks/useCopyToClipboard';
 *
 * const myComponent = () => {
 *   const { copy } = useCopyToClipboard();
 *   const handleCopy = () => { copy('Hello World!'); };
 *
 *   return <button onClick={handleCopy}>Copy</button>
 * }
 */

export const useCopyToClipboard = () => {
  const copy = (content: string) => {
    navigator.clipboard.writeText(content)
  }
  return { copy }
}
