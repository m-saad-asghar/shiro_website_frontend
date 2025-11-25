import { useMemo } from "react";
import Icons from "../../../Constants/Icons";
import type { FooterSocialMediaType } from "../../../Types";

const FooterSocialMedia = () => {
  const data: FooterSocialMediaType[] = useMemo(
    () => [
      {
        id: 1,
        icons: <Icons.FaFacebook size={18} color="#ffff" />,
        link: "https://www.facebook.com/shiroestate",
      },
      {
        id: 2,
        icons: <Icons.FaInstagram size={18} color="#ffff" />,
        link: "https://www.instagram.com/shiro.estate/",
      },
      {
        id: 3,
        icons: <Icons.FaLinkedin size={18} color="#ffff" />,
        link: "https://www.linkedin.com/company/shiro-estate/",
      },
      {
        id: 4,
        icons: <Icons.FaTiktok size={18} color="#ffff" />,
        link: "https://www.tiktok.com/@shiroestate",
      },
      {
        id: 5,
        icons: <Icons.FaSnapchatGhost size={18} color="#ffff" />,
        link: "https://www.snapchat.com/@shiro.estate",
      },
      {
        id: 6,
        icons: <Icons.FaXTwitter size={18} color="#ffff" />,
        link: "https://x.com/shiroestate",
      },
    ],
    []
  );
  return data;
};

export default FooterSocialMedia;
