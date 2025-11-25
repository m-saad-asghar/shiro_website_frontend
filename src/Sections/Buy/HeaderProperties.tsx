import Icons from "@/Constants/Icons";
import { useEffect, useState, type FC } from "react";
import { MainDropdown } from "@/Components";
import { DropdownMenuItem } from "@/Components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

type HeaderPropertiesProps = {
  values: any;
  setValues: any;
  location: string;
  title: string;
  desc: string;
  listings: string;
};

const HeaderProperties: FC<HeaderPropertiesProps> = ({
  values,
  setValues,
  location,
  title,
  desc,
  listings,
}) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const handelShowInfo = () => {
    setShow(!show);
  };
  useEffect(() => {}, [values]);
  return (
    <div className="container py-[16px]">
      <div className="flex gap-x-[8px] text-[14px] font-[300] text-primary mb-[15px] md:mb-[30px]">
        <p>{t("Home")}</p>
        <p>/</p>
        <p>{location}</p>
      </div>
      <div className="flex-col md:flex-row md:items-center justify-between gap-[10px] md:gap-0">
        <div>
          <div className="flex items-center md:justify-start gap-[10px]">
            <p className="text-[16px] font-[800] text-primary">{title}</p>
            <div
              className="text-secandry cursor-pointer"
              onClick={handelShowInfo}
            >
              <Icons.IoIosInformationCircleOutline size={20} />
            </div>
          </div>
          <div
            className={`${
              show == true ? " block" : "hidden"
            } w-[474px] my-[10px]`}
          >
            <p className="text-[12px] text-dark font-[300]">{desc}</p>
          </div>
          <div>
            <p className="text-[14px] font-[300] text-dark">
              {listings} {t("listings")}
            </p>
          </div>
        </div>
        {/*  */}
        <div className="flex items-center gap-[16px]">
          <p className="text-[14px] font-[600] text-primary capitalize">
            {t("Sort")} :
          </p>
          <MainDropdown
            title={values?.sort_name ? values?.sort_name : t("Most Recent")}
            triggerClass="w-full md:w-fit"
          >
            <DropdownMenuItem>
              <p
                className="cursor-pointer text-[14px] font-[400] text-primary py-[4px] px-[16px] hover:bg-primary hover:text-light duration-[.3s]"
                onClick={() =>
                  setValues((prev: any) => {
                    return {
                      ...prev,
                      type_id: id,
                      sort_name: "most recent",
                      sort: undefined,
                    };
                  })
                }
              >
                {t("Most Recent")}
              </p>
              <p
                onClick={() =>
                  setValues((prev: any) => {
                    return {
                      ...prev,
                      type_id: id,
                      sort_name: "Highest price",
                      sort: "max",
                    };
                  })
                }
                className="cursor-pointer text-[14px] font-[400] text-primary py-[4px] px-[16px] hover:bg-primary hover:text-light duration-[.3s]"
              >
                {t("Highest price")}
              </p>
              <p
                onClick={() =>
                  setValues((prev: any) => {
                    return {
                      ...prev,
                      type_id: id,
                      sort_name: "Lowest price",
                      sort: "min",
                    };
                  })
                }
                className="cursor-pointer text-[14px] font-[400] text-primary py-[4px] px-[16px] hover:bg-primary hover:text-light duration-[.3s]"
              >
                {t("Lowest price")}
              </p>
            </DropdownMenuItem>
          </MainDropdown>
        </div>
      </div>
    </div>
  );
};

export default HeaderProperties;
