"use client";

import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ProjectImagesUrl from "@/helpers/projectImagesURL";

export type FloorPlanItem = {
  title: string;
  value: string;
};

type ProjectFloorPlanProps = {
  floorplans?: FloorPlanItem[];
  resolveImageUrl?: (path: string) => string;
  onDownload?: () => void;
  downloadLabel?: string;
};

export default function ProjectFloorPlan({
  floorplans = [],
  resolveImageUrl,
  onDownload,
  downloadLabel,
}: ProjectFloorPlanProps) {
  const { t } = useTranslation();

  const plans = useMemo(() => floorplans || [], [floorplans]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const safeIndex = Math.min(activeIndex, Math.max(plans.length - 1, 0));
  const activePlan = plans[safeIndex];

  const imgSrc = useMemo(() => {
    const raw = activePlan?.value || "";
    if (!raw) return "";
    return resolveImageUrl ? resolveImageUrl(raw) : raw;
  }, [activePlan?.value, resolveImageUrl]);

  if (!plans || plans.length === 0) return null;

  return (
    <section className="floorplan-wrap" id="floorPlans">
      <div className="floorplan-inner">
        {/* Left */}
        <div className="floorplan-left">
          <div className="floorplan-list" role="tablist" aria-label="Floorplans">
            {plans.map((p, i) => {
              const isActive = i === safeIndex;

              return (
                <button
                  key={`${p.title}-${i}`}
                  type="button"
                  className={`floorplan-item ${isActive ? "active" : ""}`}
                  onClick={() => setActiveIndex(i)}
                  role="tab"
                  aria-selected={isActive}
                >
                  <div className="floorplan-item-left">
                    <div className="floorplan-title">{p.title}</div>
                  </div>

                  <div className="floorplan-arrow" aria-hidden="true">
                    →
                  </div>
                </button>
              );
            })}
          </div>

          {/* Download button intentionally commented as per your code */}
          {/* <div className="floorplan-btnWrap">
            <button
              type="button"
              className="floorplan-btn"
              onClick={onDownload}
              disabled={!onDownload}
              title={!onDownload ? "No action provided" : undefined}
            >
              {downloadLabel || t("Download Floorplans")}
            </button>
          </div> */}
        </div>

        {/* Right */}
        <div className="floorplan-right">
          <div className="floorplan-imageCard">
            {imgSrc ? (
              <img
                src={ProjectImagesUrl(imgSrc)}
                alt={activePlan?.title || "Floorplan"}
                className="floorplan-image"
                loading="lazy"
              />
            ) : (
              <div className="floorplan-imageEmpty">
                {t("No floorplan image")}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .floorplan-wrap{
          width: 100%;
          background: #fff;
        }

        .floorplan-inner{
          margin: 0 auto;
          display: grid;
          grid-template-columns: 620px 1fr;
          gap: 120px;
          align-items: start;
        }

        .floorplan-list{
          display: flex;
          flex-direction: column;
          border-top: 1px solid #e6eaf0;
        }

        .floorplan-item{
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 18px 6px;
          background: transparent;
          border: none;
          border-bottom: 1px solid #e6eaf0;
          text-align: left;
          cursor: pointer;
          transition: color .2s ease, transform .2s ease;
        }

        .floorplan-item-left{
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
        }

        .floorplan-title{
          font-size: 18px;
          font-weight: 700;
          color: #094834;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .floorplan-arrow{
          font-size: 18px;
          color: #0B2B1C;
          opacity: 0.6;
          transition: opacity .2s ease, transform .2s ease, color .2s ease;
        }

        .floorplan-item:hover{
          transform: translateY(-1px);
        }

        .floorplan-item:hover .floorplan-arrow{
          opacity: 1;
          transform: translateX(4px);
        }

        .floorplan-item.active .floorplan-title{
          color: #9f8151;
        }

        .floorplan-item.active .floorplan-arrow{
          color: #9f8151;
          opacity: 1;
        }

        /* ✅ ONLY FIX: make image closer to container edges equally (LEFT/RIGHT ONLY) */
        .floorplan-imageCard{
          width: 100%;
          background: #fff;
          border: 1px solid #eef1f5;
          border-radius: 8px;
          overflow: hidden;
          padding: 0;              /* keep container tight */
          display: flex;
          align-items: center;
          justify-content: center;

          /* control horizontal bleed */
          --bleed-x: 120px;        /* desktop */
        }

        .floorplan-image{
          height: 80vh;
          max-height: 1500px;
          object-fit: contain;
          object-position: center;
          display: block;

          /* pull image closer from LEFT/RIGHT equally */
          width: calc(100% + var(--bleed-x));
          margin: 0 calc(var(--bleed-x) * -0.5);  /* top/bottom unchanged */
        }

        /* fine-tune bleed per width so it stays equal on smaller screens */
        @media (max-width: 1496px){
          .floorplan-imageCard{ --bleed-x: 90px; }
        }

        @media (max-width: 1024px){
          .floorplan-inner{
            grid-template-columns: 1fr;
            gap: 60px;
          }
          .floorplan-imageCard{ --bleed-x: 70px; }
        }

        @media (max-width: 640px){
          .floorplan-inner{
            padding: 10px 14px;
          }
          .floorplan-title{
            font-size: 16px;
          }
          .floorplan-imageCard{ --bleed-x: 34px; }
        }

        .floorplan-imageEmpty{
          width: 100%;
          height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          background: #fafafa;
          border-radius: 8px;
          border: 1px dashed #e5e7eb;
          font-size: 14px;
          font-weight: 600;
        }
      `}</style>
    </section>
  );
}
