import { useContext, useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/Components/ui/skeleton";
import { TypesContext } from "@/Context/TypesContext";
import Btn from "@/Components/Btn";
import { ValueContext } from "@/Context/ValueContext";
import { useNavigate, useLocation } from "react-router-dom";
import useQueryGet from "@/hooks/useQueryGet";
import PropertiesServices from "@/Services/PropertiesServices";
import Icons from "@/Constants/Icons";
import MainDropdown from "@/Components/MainDropdown";
import { DropdownMenuItem } from "@/Components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

const FilterHero = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState<undefined | string>(undefined);
  const { data: filter } = useQueryGet(["filter"], PropertiesServices.filters);
  const filterPrices = filter?.prices;
  const filterBedrooms = filter?.bedrooms;
  const { values, setValues } = useContext(ValueContext);
  const { t } = useTranslation();

  // Wrapper function to only update values on home page
  const safeSetValues = (updater: any) => {
    if (location.pathname === "/") {
      setValues(updater);
    }
  };
  useEffect(() => {}, [values]);
  const { data, status } = useContext(TypesContext);
  const renderTypes = useMemo(() => {
    return data?.types?.map((item: any) => (
      <Btn
        key={item?.id}
        text={item?.name}
        type="outLine"
        onclick={() => {
          safeSetValues((prev: any) => {
            return {
              ...prev,
              type_id: item?.id,
              type_name: item?.name == "Off-plan" ? "offPlane" : item?.name,
            };
          });
          setId(item?.id);
        }}
        conClass={`${
          item?.id == id ? "bg-primary text-light" : "text-light"
        } font-[600] border-light w-[88px] md:w-[120px]`}
      />
    ));
  }, [data, id]);
  const renderSkelton = useMemo(() => {
    return [...Array(3)].map((_, index: number) => (
      <Skeleton
        className="h-[46px] w-[88px] md:w-[120px] rounded-[8px] bg-light border border-light"
        key={index}
      />
    ));
  }, []);
  return (
    <div className="text-light flex-col gap-[20px] lg:gap-[32px] absolute bottom-[35px] md:bottom-[54px] lg:bottom-[88px]">
      <h1 className="w-full lg:w-[70%] text-[32px] md:text-[40px] lg:text-[64px]">
        {t("Find your home in Dubai")}
      </h1>
      <div className="flex gap-[10px] md:gap-[24px]">
        {status == "pending" || status == "error" ? renderSkelton : renderTypes}
      </div>
      <div className="flex gap-[10px] md:gap-[15px] lg:gap-[24px]">
        <div className="w-full md:w-[560px] lg:w-[621px] h-[46px] bg-light rounded-[8px] shadow-input relative">
          <input
            type="text"
            placeholder={t("area , project or community")}
            className="text-dark w-full h-full px-[30px] md:px-[50px] relative outline-none text-[12px] md:text-[14px] lg:text-[16px]"
            onChange={(e) => {
              safeSetValues((prev: any) => {
                return {
                  ...prev,
                  search: e.target.value,
                };
              });
            }}
          />
          <div className="absolute top-[33%] left-[2%]">
            <Icons.IoIosSearch color="black" size={18} />
          </div>
          <div className="hidden md:flex w-[35%] h-full absolute top-0 right-0  items-center gap-[4px]">
            <div className="w-[90px]">
              <MainDropdown
                title={t("Beds")}
                triggerClass="border-none text-[10px] lg:text-[14px]"
              >
                <div className="w-full p-[20px] grid grid-cols-2 gap-x-[20px]">
                  <div className="flex-col gap-y-[12px]">
                    <p className="text-[12px] text-gray font-[400]">
                      {t("Min Bedrooms")}
                    </p>
                    <MainDropdown
                      title={
                        values?.bedroom_min ? values?.bedroom_min : t("no min")
                      }
                      triggerClass="w-[140px] justify-between"
                    >
                      <DropdownMenuItem>
                        <p
                          className="cursor-pointer text-[14px] font-[400] text-primary py-[4px] px-[16px] hover:bg-primary hover:text-light duration-[.3s]"
                          onClick={() =>
                            safeSetValues(() => {
                              return {
                                bedroom_min: undefined,
                              };
                            })
                          }
                        >
                          {t("no min")}
                        </p>
                        {filterBedrooms?.minOptions?.map((item: number) => (
                          <p
                            className="cursor-pointer text-[14px] font-[400] text-primary py-[4px] px-[16px] hover:bg-primary hover:text-light duration-[.3s]"
                            onClick={() =>
                              safeSetValues((prev: any) => {
                                return {
                                  ...prev,
                                  bedroom_min: item,
                                };
                              })
                            }
                          >
                            {item}
                          </p>
                        ))}
                      </DropdownMenuItem>
                    </MainDropdown>
                  </div>
                  <div className="flex-col gap-y-[12px]">
                    <p className="text-[12px] text-gray font-[400]">
                      {t("max Bedrooms")}
                    </p>
                    <MainDropdown
                      title={
                        values?.bedroom_max ? values?.bedroom_max : t("no max")
                      }
                      triggerClass="w-[140px] justify-between"
                    >
                      <DropdownMenuItem>
                        <p
                          className="cursor-pointer text-[14px] font-[400] text-primary py-[4px] px-[16px] hover:bg-primary hover:text-light duration-[.3s]"
                          onClick={() =>
                            safeSetValues(() => {
                              return {
                                bedroom_max: undefined,
                              };
                            })
                          }
                        >
                          {t("no max")}
                        </p>
                        {filterBedrooms?.maxOptions?.map((item: number) => (
                          <p
                            className="cursor-pointer text-[14px] font-[400] text-primary py-[4px] px-[16px] hover:bg-primary hover:text-light duration-[.3s]"
                            onClick={() =>
                              safeSetValues((prev: any) => {
                                return {
                                  ...prev,
                                  bedroom_max: item,
                                };
                              })
                            }
                          >
                            {item}
                          </p>
                        ))}
                      </DropdownMenuItem>
                    </MainDropdown>
                  </div>
                </div>
              </MainDropdown>
            </div>
            <div className="w-[140px] h-full">
              <MainDropdown
                title={t("Price Range")}
                triggerClass="border-none text-[10px] lg:text-[14px]"
              >
                <div className="w-full p-[20px] grid grid-cols-2 gap-x-[20px]">
                  <div className="flex-col gap-y-[12px]">
                    <p className="text-[12px] text-gray font-[400]">
                      {t("Min Price")}
                    </p>
                    <MainDropdown
                      title={
                        values?.price_min ? values?.price_min : t("no min")
                      }
                      triggerClass="w-[220px] justify-between"
                    >
                      <DropdownMenuItem>
                        <p
                          className="cursor-pointer text-[14px] font-[400] text-primary py-[4px] px-[16px] hover:bg-primary hover:text-light duration-[.3s]"
                          onClick={() =>
                            safeSetValues(() => {
                              return {
                                price_min: undefined,
                              };
                            })
                          }
                        >
                          {t("no min")}
                        </p>
                        {filterPrices?.minOptions?.map((item: number) => (
                          <div
                            className="w-full cursor-pointer flex justify-between py-[4px] px-[16px] hover:bg-primary hover:text-light group duration-[.3s]"
                            onClick={() =>
                              safeSetValues((prev: any) => {
                                return {
                                  ...prev,
                                  price_min: item,
                                };
                              })
                            }
                          >
                            <p className=" text-[14px] font-[400] text-primary group-hover:text-light duration-[.3s]">
                              {item}
                            </p>
                            <p>{filterPrices?.currency}</p>
                          </div>
                        ))}
                      </DropdownMenuItem>
                    </MainDropdown>
                  </div>
                  <div className="flex-col gap-y-[12px]">
                    <p className="text-[12px] text-gray font-[400] ">
                      {t("max Price")}
                    </p>
                    <MainDropdown
                      title={
                        values?.price_max ? values?.price_max : t("no max")
                      }
                      triggerClass="w-[220px] justify-between"
                    >
                      <DropdownMenuItem>
                        <p
                          className="cursor-pointer text-[14px] font-[400] text-primary py-[4px] px-[16px] hover:bg-primary hover:text-light duration-[.3s]"
                          onClick={() =>
                            safeSetValues(() => {
                              return {
                                price_max: undefined,
                              };
                            })
                          }
                        >
                          {t("no max")}
                        </p>
                        {filterPrices?.maxOptions?.map((item: number) => (
                          <div
                            className="w-full cursor-pointer flex justify-between py-[4px] px-[16px] hover:bg-primary hover:text-light group duration-[.3s]"
                            onClick={() =>
                              safeSetValues((prev: any) => {
                                return {
                                  ...prev,
                                  price_max: item,
                                };
                              })
                            }
                          >
                            <p className=" text-[14px] font-[400] text-primary group-hover:text-light duration-[.3s]">
                              {item}
                            </p>
                            <p>{filterPrices?.currency}</p>
                          </div>
                        ))}
                      </DropdownMenuItem>
                    </MainDropdown>
                  </div>
                </div>
              </MainDropdown>
            </div>
          </div>
        </div>
        <div>
          <Btn
            text={t("search")}
            type="primary"
            conClass="font-[600] w-[88px] md:w-[121px] rounded-[4px]"
            onclick={() =>
              values?.type_name &&
              values?.type_id &&
              navigate(`/${values?.type_name}/${values?.type_id}`)
            }
          />
        </div>
      </div>
      <div className="flex gap-[8px]">
        <p className="text-[12px] md:text-[16px] text-light font-[400] leading-[140%] tracking-[.01rem]">
          {t("4,000 listings")} ·{" "}
        </p>
        <p className="text-[12px] md:text-[16px] text-light font-[400] leading-[140%] tracking-[.01rem]">
          {" "}
          {t("400+ agents")} ·
        </p>
        <p className="text-[12px] md:text-[16px] text-light font-[400] leading-[140%] tracking-[.01rem]">
          {t("Serving 80+ countries")}
        </p>
      </div>
    </div>
  );
};

export default FilterHero;
