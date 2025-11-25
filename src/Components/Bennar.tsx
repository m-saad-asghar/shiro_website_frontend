import { useTranslation } from "react-i18next";
import { fadeIn } from "@/Utils/Motions/motion";
import { motion } from "framer-motion";
import { type FC, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type BennarProps = {
  children?: ReactNode;
  pathName: string;
  title: string;
  desc: string;
  conClassName?: string;
  titleClassName?: string;
  hideBreadcrumb?: boolean;
};

const Bennar: FC<BennarProps> = ({
  children,
  pathName,
  title,
  desc,
  conClassName,
  titleClassName,
  hideBreadcrumb = false,
}) => {
  const { t } = useTranslation();

  return (
    <section className="w-full py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          {!hideBreadcrumb && (
            <div className="mb-8">
              <nav className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="hover:text-[#094834] transition-colors duration-200 cursor-pointer">
                  {t("Home")}
                </span>
                <span className="text-gray-400">/</span>
                <span className="text-[#094834] font-medium">
                  {t(pathName)}
                </span>
              </nav>
            </div>
          )}

          {/* Content */}
          <motion.div
            variants={fadeIn}
            initial="initial"
            whileInView="animate"
            transition={{
              duration: 0.7,
            }}
            className={twMerge("text-center space-y-6", conClassName)}
          >
            <h1
              className={twMerge(
                "text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#094834] leading-tight",
                titleClassName
              )}
            >
              {t(title)}
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {t(desc)}
            </p>

            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Bennar;
