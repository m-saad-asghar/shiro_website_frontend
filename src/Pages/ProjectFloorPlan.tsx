"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ProjectImagesUrl from "@/helpers/projectImagesURL";

export type FloorPlanItem = {
  title: string;
  value: string;
};

type ProjectFloorPlanProps = {
  floorplans?: FloorPlanItem[];
  resolveImageUrl?: (path: string) => string;
};

export default function ProjectFloorPlan({
  floorplans = [],
  resolveImageUrl,
}: ProjectFloorPlanProps) {
  const { t } = useTranslation();

  const plans = useMemo(() => floorplans || [], [floorplans]);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const safeIndex = Math.min(activeIndex, Math.max(plans.length - 1, 0));
  const activePlan = plans[safeIndex];

  const resolveSrc = (raw: string) => {
    if (!raw) return "";
    const path = resolveImageUrl ? resolveImageUrl(raw) : raw;
    return ProjectImagesUrl(path);
  };

  const openViewer = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const closeViewer = () => setOpen(false);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeViewer();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Prevent background scroll when modal open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!plans || plans.length === 0) return null;

  return (
    <section className="fp-wrap" id="floorPlans">

      {/* Grid (3 per row on desktop) */}
      <div className="fp-grid">
        {plans.map((p, i) => {
          const src = resolveSrc(p.value || "");
          return (
            <button
              key={`${p.title}-${i}`}
              type="button"
              className="fp-card"
              onClick={() => openViewer(i)}
              aria-label={`Open ${p.title}`}
            >
              <div className="fp-cardTop">
                <div className="fp-cardTitle" title={p.title}>
                  {p.title}
                </div>

                <div className="fp-expand" aria-hidden="true" title="Expand">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 4H4V9M15 4H20V9M9 20H4V15M15 20H20V15"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="fp-imageCard">
                {src ? (
                  <img
                    src={src}
                    alt={p.title || "Floorplan"}
                    className="fp-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="fp-empty">{t("No floorplan image")}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {open && (
        <div
          className="fp-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Floorplan viewer"
          onMouseDown={(e) => {
            // close when clicking overlay only
            if (e.target === e.currentTarget) closeViewer();
          }}
        >
          <div className="fp-modalInner">
            <button
              type="button"
              className="fp-close"
              onClick={closeViewer}
              aria-label="Close"
              title="Close"
            >
              ×
            </button>

            <div className="fp-modalTop">
              <div className="fp-modalTitle" title={activePlan?.title}>
                {activePlan?.title || t("Floorplan")}
              </div>
            </div>

            <div className="fp-modalCard">
              {activePlan?.value ? (
                <img
                  src={resolveSrc(activePlan.value)}
                  alt={activePlan?.title || "Floorplan"}
                  className="fp-modalImg"
                />
              ) : (
                <div className="fp-empty">{t("No floorplan image")}</div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .fp-wrap{
          width: 100%;
          background: #fff;
        }

        .fp-head{
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .fp-title{
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #0B2B1C;
          margin: 0;
        }

        /* GRID */
        .fp-grid{
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .fp-card{
          width: 100%;
          border: 0;
          padding: 0;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .fp-cardTop{
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }

        .fp-cardTitle{
          font-size: 18px;
          font-weight: 700;
          color: #094834;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .fp-expand{
          color: #0B2B1C;
          opacity: 0.6;
          transition: opacity .2s ease, transform .2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .fp-card:hover .fp-expand{
          opacity: 1;
          transform: translateY(-1px);
        }

        .fp-imageCard{
          width: 100%;
          background: #fff;
          border: 1px solid #09483433;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          min-height: 280px;
          transition: transform .15s ease, box-shadow .15s ease;
        }

        .fp-card:hover .fp-imageCard{
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .fp-image{
          width: 100%;
          height: 320px;
          object-fit: contain;
          object-position: center;
          display: block;
        }

        .fp-empty{
          width: 100%;
          height: 260px;
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

        /* RESPONSIVE */
        @media (max-width: 1200px){
          .fp-grid{
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px){
          .fp-title{ font-size: 22px; }
          .fp-grid{
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .fp-image{ height: 280px; }
          .fp-imageCard{ min-height: 240px; }
        }

        /* MODAL */
        .fp-modal{
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.72);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }

        .fp-modalInner{
          position: relative;
          width: min(1200px, 96vw);
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .fp-close{
          position: absolute;
          top: -8px;
          right: -8px;
          width: 42px;
          height: 42px;
          border-radius: 999px;
          border: 0;
          background: rgba(255,255,255,0.9);
          color: #111;
          font-size: 28px;
          line-height: 42px;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        }

        .fp-modalTop{
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 4px 2px;
        }

        .fp-modalTitle{
          color: #fff;
          font-weight: 700;
          font-size: 18px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .fp-modalCard{
          width: 100%;
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
        }

        .fp-modalImg{
          width: 100%;
          height: 82vh;
          max-height: 1500px;
          object-fit: contain;
          object-position: center;
          display: block;
          background: #fff;
        }

        @media (max-width: 640px){
          .fp-modalInner{
            width: 100%;
          }
          .fp-modalImg{
            height: 78vh;
          }
          .fp-close{
            top: -12px;
            right: -6px;
          }
        }
      `}</style>
    </section>
  );
}
