import type { FC, ReactNode } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { twMerge, type ClassNameValue } from "tailwind-merge";
import { useTranslation } from "react-i18next";

type HoverCardBoxProps = {
  title: string;
  children: ReactNode;
  onScroll: boolean;
  className?: ClassNameValue;
  onClick: () => void;
  content: any;
  href?: string;
  ariaLabel?: string;
};

const HoverCardBox: FC<HoverCardBoxProps> = ({
  title,
  children,
  onScroll,
  className,
  onClick,
  href,
  ariaLabel,
  // content,
}) => {
  const { t } = useTranslation();
  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger
        className={twMerge(
          `${
            onScroll == true ? "text-dark" : "text-light"
          } text-[16px] px-4 py-2 font-[500] cursor-pointer rounded-lg transition-all duration-200 hover:bg-primary/10 relative group`,
          className
        )}
        onClick={onClick}
        asChild={!!href}
      >
        {href ? (
          <a href={href} className="block" aria-label={ariaLabel || title}>
            <span className="relative z-10">{title}</span>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </a>
        ) : (
          <>
            <span className="relative z-10" aria-label={ariaLabel || title}>
              {title}
            </span>
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </>
        )}
      </HoverCardTrigger>
      {(title == t("More Options") ||
        title == t("Buy") ||
        title == t("Rent") ||
        title == t("Projects")) && (
        <HoverCardContent
          className={
            title == t("More Options")
              ? "w-[440px] bg-white/95 backdrop-blur-md rounded-xl border border-gray-200/50 shadow-xl p-6"
              : "bg-white/95 backdrop-blur-md rounded-xl border border-gray-200/50 shadow-xl p-6"
          }
          sideOffset={8}
        >
          {children}
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default HoverCardBox;
