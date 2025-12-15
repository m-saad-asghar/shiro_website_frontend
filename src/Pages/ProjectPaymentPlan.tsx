"use client";

import React from "react";

type PaymentPlanItem = {
  title: string; // e.g. "10%"
  value: string; // e.g. "On booking"
};

type ProjectPaymentPlanProps = {
  payment_plans?: PaymentPlanItem[];
};

export default function ProjectPaymentPlan({
  payment_plans = [],
}: ProjectPaymentPlanProps) {
  if (!payment_plans || payment_plans.length === 0) return null;

  return (
    <section id="paymentPlans" className="paymentplan-wrapper">
      <div className="paymentplan-grid">
        {payment_plans.map((item, i) => (
          <div key={`${item.title}-${item.value}-${i}`} className="plan-card">
            <div className="font-semibold text-4xl text-[#9f8151]">{item.title}</div>
            <div className="down_styling para_styling">{item.value}</div>
          </div>
        ))}
      </div>

      <style>{`
        .paymentplan-wrapper{
          width: 100%;
        }

        .paymentplan-title{
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #0B2B1C;
          letter-spacing: 0.5px;
        }

        /* ✅ 2 columns desktop/tablet */
        .paymentplan-grid{
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .plan-card{
          border: 1px solid #eee;
          border-radius: 10px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 18px;
          background: #fff;
        }

        .plan-left{
          font-size: 44px;
          font-weight: 800;
          color: #0B2B1C;
          line-height: 1;
          min-width: 90px;
        }

        .plan-right{
          font-size: 14px;
          color: #555;
          line-height: 1.4;
        }

        /* Tablet */
        @media (max-width: 1024px){
          .paymentplan-title{
            font-size: 34px;
          }
          .plan-left{
            font-size: 40px;
          }
        }

        /* ✅ Mobile: 1 column */
        @media (max-width: 640px){
          .paymentplan-grid{
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
          .paymentplan-title{
            font-size: 28px;
          }
          .plan-left{
            font-size: 38px;
            min-width: 80px;
          }
        }
      `}</style>
    </section>
  );
}