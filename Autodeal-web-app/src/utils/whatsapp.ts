import { formatPrice } from "./formatter";
import type { Language } from "../i18n/translations";

const WHATSAPP_NUMBER = "918982883521";

export function buildWhatsAppUrl(
  title: string,
  year: number,
  price: number,
  language: Language = "en",
) {
  const message =
    language === "hi"
      ? `नमस्ते, मैं श्री गणेश ऑटोडील पर सूचीबद्ध ${title} (${year}) में रुचि रखता हूँ, जिसका मूल्य ${formatPrice(
          price,
        )} है। क्या यह उपलब्ध है?`
      : `Hi, I'm interested in the ${title} (${year}) listed for ${formatPrice(
          price,
        )} on Shree Ganesh Autodeal. Is it still available?`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}