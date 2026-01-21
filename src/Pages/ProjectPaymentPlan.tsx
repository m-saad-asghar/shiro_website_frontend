"use client";

import React from "react";
import EnquireNowReactModal from "@/Components/Home/ContactForm/EnquireNowReactModal";
import { useTranslation } from "react-i18next";

type PaymentPlanItem = {
  title: string; // e.g. "10%"
  value: string; // e.g. "Upon Booking"
  sub_title?: string; // e.g. "Down Payment" / "7 instalments" / "Q2 2030"
};

type ProjectPaymentPlanProps = {
  heading?: string;
  buttonText?: string;
  titleName?: string;
  onButtonClick?: () => void;
  payment_plans?: PaymentPlanItem[];

  // ✅ NEW: coming from API
  project_payment_plan_description?: string;
};



export default function ProjectPaymentPlan({
  heading = "Payment Plan",
  buttonText = "GET FULL INVESTMENT DETAILS",
  titleName = "",
  onButtonClick,
  payment_plans = [],
  project_payment_plan_description = "",
}: ProjectPaymentPlanProps) {
   const { t } = useTranslation();
  if (!payment_plans?.length) return null;

  return (
    <section id="paymentPlans" className="ppx-wrap">
      <div className="ppx-inner">
        {/* Divider under title (you commented title already) */}
        <div className="ppx-top-divider" />

        {/* Two columns */}
        <div className="ppx-grid">
          {/* LEFT */}
          <div className="ppx-left">
            {!!project_payment_plan_description && (
              <div
                className="down_styling para_styling mb-8"
                // ✅ If your description is plain text, replace this with <p>{...}</p>
                dangerouslySetInnerHTML={{
                  __html: project_payment_plan_description,
                }}
              />
            )}

            <EnquireNowReactModal
  title={`${t("GET FULL INVESTMENT DETAILS")}`}
  display_name="get-full-investement-button-click-from-project-details-page"
  project_name={titleName}
  origin={`${t("Click | Get Full Investment Details Button | Project Details Page | Project: ")} ${titleName}`}
  showSuccessToast={true}
  showErrorToast={true}
  closeOnSuccess={true}
  trigger={(open) => (
    <button
      type="button"
      onClick={open}
      className="bg-[#094834] hover:bg-[#9f8151] text-white font-semibold py-4 px-6 rounded-md shadow-lg change_border transition"
    >
       {buttonText}
    </button>
  )}
/>

            {/* <button type="button" className="bg-[#094834] hover:bg-[#9f8151] text-white font-semibold py-4 px-6 rounded-md shadow-lg transition" onClick={onButtonClick}>
              {buttonText}
            </button> */}
          </div>

          {/* RIGHT */}
         <div className="ppx-right">
  <div className="ppx-timeline">
    {payment_plans.map((item, i) => {
      const isLast = i === payment_plans.length - 1;

      return (
        <div
          key={`${item.title}-${item.value}-${i}`}
          className="ppx-row"
        >
          {/* dot + line column */}
          <div className="ppx-rail" aria-hidden>
            <span className="ppx-dot" />
            {!isLast && <span className="ppx-vline" />}
          </div>

          {/* ================= DESKTOP (UNCHANGED) ================= */}
          <div className="ppx-text hidden md:block">
            <div className="font-semibold text-primary text-2xl">
              {item.value}
            </div>

            {item.sub_title && (
              <div className="down_styling para_styling">
                {item.sub_title}
              </div>
            )}
          </div>

          <div className="font-semibold text-primary text-4xl text-[#0B2B1C] hidden md:block">
            {item.title}
          </div>

          {/* ================= MOBILE ONLY ================= */}
          <div className="md:hidden flex flex-col gap-2">
            <div className="font-semibold text-primary text-lg">
              {item.value}
            </div>

            {item.sub_title && (
              <div className="down_styling para_styling text-sm">
                {item.sub_title}
              </div>
            )}

            <div className="font-semibold text-primary text-2xl text-[#0B2B1C]">
              {item.title}
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>

        </div>

        {/* bottom divider */}
        <div className="ppx-bottom-divider" />
      </div>

      <style>{`
        .ppx-wrap{
          width: 100%;
          background: #fff;
        }
        .ppx-inner{
          width: 100%;
        }

        .ppx-top-divider{
          height: 1px;
          background: #e6e6e6;
          margin-top: 18px;
        }

        .ppx-grid{
          display: grid;
          grid-template-columns: 1fr 1.35fr;
          gap: 56px;
          padding-top: 22px;
          align-items: start;
        }

        /* LEFT */
        .ppx-left{
          padding-top: 6px;
        }
        .ppx-note{
          margin: 0 0 22px;
          color: #666;
          font-size: 15px;
          line-height: 1.75;
          max-width: 520px;
        }
        .ppx-btn{
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 20px;
          border: none;
          cursor: pointer;
          background: #6b4a2d;
          color: #fff;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          border-radius: 2px;
        }
        .ppx-btn:hover{ opacity: .92; }

        /* RIGHT */
        .ppx-right{ width: 100%; }
        .ppx-timeline{ width: 100%; }

        .ppx-row{
          position: relative;
          display: grid;
          grid-template-columns: 44px 1fr auto;
          column-gap: 18px;
          padding: 18px 0;
        }

        .ppx-rail{
          position: relative;
          width: 44px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
        .ppx-dot{
          width: 26px;
          height: 26px;
          border-radius: 999px;
          background: #9f8151;
          margin-top: 4px;
        }
        .ppx-vline{
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 34px;
          bottom: -18px;
          width: 1px;
          background: #e6e6e6;
        }

        .ppx-text{
          min-width: 0;
          padding-top: 2px;
        }
        .ppx-label{
          font-size: 20px;
          font-weight: 600;
          color: #111;
          line-height: 1.2;
        }
        .ppx-sub{
          margin-top: 8px;
          font-size: 15px;
          color: #777;
          line-height: 1.3;
        }

        .ppx-percent{
          font-size: 52px;
          font-weight: 300;
          color: #111;
          line-height: 1;
          white-space: nowrap;
          padding-left: 20px;
        }

        .ppx-row-divider{
          position: absolute;
          left: 44px;
          right: 0;
          bottom: 0;
          height: 1px;
          background: #e6e6e6;
        }

        .ppx-bottom-divider{
          height: 1px;
          background: #e6e6e6;
          margin-top: 26px;
        }

        @media (max-width: 1024px){
          .ppx-grid{
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .ppx-left{ padding-top: 0; }
          .ppx-note{ max-width: 100%; }
        }

        @media (max-width: 640px){
          .ppx-wrap{ padding: 18px 0 22px; }

          .ppx-row{
            grid-template-columns: 40px 1fr;
            row-gap: 8px;
            padding: 16px 0;
          }

          .ppx-percent{
            grid-column: 2 / 3;
            justify-self: end;
            font-size: 44px;
            padding-left: 0;
          }

          .ppx-row-divider{
            left: 40px;
          }

          .ppx-dot{
            width: 22px;
            height: 22px;
          }

          .ppx-vline{
            top: 30px;
          }

          .ppx-label{ font-size: 18px; }
          .ppx-sub{ font-size: 14px; }
        }
      `}</style>
    </section>
  );
}
