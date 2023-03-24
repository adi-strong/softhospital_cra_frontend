export const limitStrTo = (maxLength: number, str: string) => {
  return str.length <= maxLength ? str : str.substring(0, maxLength)+'...'
}

export const encodeUtf8Str = (str: string) => {
  return decodeURI(decodeURIComponent(str))
}
