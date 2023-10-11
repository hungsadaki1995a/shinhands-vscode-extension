export const isKoreanString = (input: string): boolean => {
  return new RegExp(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/).test(input);
};
