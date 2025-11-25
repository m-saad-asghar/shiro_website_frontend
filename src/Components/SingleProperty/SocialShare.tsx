import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icons from "@/Constants/Icons";

interface SocialShareProps {
  property: any;
}

const SocialShare: React.FC<SocialShareProps> = ({ property }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareData = {
    title: property?.title || "Property for Sale",
    text: property?.description || "Check out this amazing property!",
    url: window.location.href,
  };

  const shareLinks = [
    {
      name: "Facebook",
      icon: Icons.FaFacebook,
      color: "bg-blue-600 hover:bg-blue-700",
      onClick: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            window.location.href
          )}`,
          "_blank"
        ),
    },
    {
      name: "X (Twitter)",
      icon: Icons.FaTwitter,
      color: "bg-black hover:bg-gray-800",
      onClick: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            shareData.text
          )}&url=${encodeURIComponent(window.location.href)}`,
          "_blank"
        ),
    },
    {
      name: "LinkedIn",
      icon: Icons.FaLinkedin,
      color: "bg-blue-700 hover:bg-blue-800",
      onClick: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            window.location.href
          )}`,
          "_blank"
        ),
    },
    {
      name: "WhatsApp",
      icon: Icons.FaWhatsapp,
      color: "bg-green-500 hover:bg-green-600",
      onClick: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(
            shareData.text + " " + window.location.href
          )}`,
          "_blank"
        ),
    },
    {
      name: "Copy Link",
      icon: Icons.FaLink,
      color: "bg-gray-600 hover:bg-gray-700",
      onClick: async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          // Failed to copy
        }
      },
    },
  ];

  return (
    <div className="relative">
      {/* Main share button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors duration-200"
        aria-label="Share property"
      >
        <Icons.FaShareAlt className="w-4 h-4" />
        <span className="text-sm font-medium">{t("Share")}</span>
      </button>

      {/* Share menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50 min-w-[200px]">
          <div className="space-y-2">
            {shareLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  link.onClick();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white text-sm font-medium transition-colors duration-200 ${link.color}`}
                aria-label={`Share on ${link.name}`}
              >
                <link.icon className="w-4 h-4" />
                <span>
                  {link.name === "Copy Link" && copied ? "Copied!" : link.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Close menu when clicking outside */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default SocialShare;
