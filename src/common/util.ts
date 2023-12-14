export function splitStringByLength(str: string, length: number): string[] {
  const result = [];
  for (let i = 0; i < str.length; i += length) {
    result.push(str.substring(i, i + length));
  }
  return result;
}
