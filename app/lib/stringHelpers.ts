// removes the slash at the beginning of a string
export const removeFrontSlash = (myString: string) => {
  return myString.replace(/^\//, '');
}