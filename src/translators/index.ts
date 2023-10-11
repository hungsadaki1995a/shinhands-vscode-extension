// import { translate } from "@vitalets/google-translate-api";
// const translate = require("translate-google");
// import { HttpProxyAgent } from "http-proxy-agent";
import { koreanTexts } from "./map";

// const agent = new HttpProxyAgent("http://168.63.76.32:3128");

export const translateText = (input: string, lang = "en") => {
  return koreanTexts[input as keyof typeof koreanTexts] || "Not found";
  // const response = await translate(input, {
  //   to: lang,
  //   fetchOptions: { agent },
  // });
  // return response;
};
