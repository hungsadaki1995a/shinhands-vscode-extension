// import { translate } from "@vitalets/google-translate-api";
// const translate = require("translate-google");
// import { HttpProxyAgent } from "http-proxy-agent";
import { koreanTexts } from "./map";

// const agent = new HttpProxyAgent("http://168.63.76.32:3128");

export const translateText = (input: string, lang = "en") => {
  const text =
    koreanTexts[input.replace(/[\s.><:]/g, "") as keyof typeof koreanTexts] ||
    "";
  //TODO: If not found. return empty string instead of undefined. Using environment PRO or DEV to detect
  return text;
  // const response = await translate(input, {
  //   to: lang,
  //   fetchOptions: { agent },
  // });
  // return response;
};
