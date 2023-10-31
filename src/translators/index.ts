// import { translate } from "@vitalets/google-translate-api";
// const translate = require("translate-google");
// import { HttpProxyAgent } from "http-proxy-agent";
import axios from "axios";
import { koreanTexts } from "./map";

// const agent = new HttpProxyAgent("http://168.63.76.32:3128");

export const translateText = async (input: string, lang = "en") => {
  // const text =
  //   koreanTexts[input.replace(/[\s.><:]/g, "") as keyof typeof koreanTexts] ||
  //   "";
  // //TODO: If not found. return empty string instead of undefined. Using environment PRO or DEV to detect
  // return text;
  const response = await axios.get(
    "https://translate.googleapis.com/translate_a/single",
    {
      params: {
        client: "gtx",
        sl: "ko",
        tl: "en",
        dt: "t",
        q: input.replace(/[\s.><:]/g, ""),
      },
    }
  );
  return response.data?.[0]?.[0]?.[0] || "";
};
