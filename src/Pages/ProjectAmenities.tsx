"use client";

import React from "react";

export default function ProjectAmenities({ amenities = [] }) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <section id="amenities">
      <div className="amenities-grid">
        {amenities.map((name, i) => (
          <div key={`${name}-${i}`} className="amenity-item">
            <span className="amenity-icon">✓</span>
            <span className="down_styling para_styling">{name}</span>
          </div>
        ))}
      </div>

      <style>{`
        .amenities-title{
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #0B2B1C;
          letter-spacing: 0.5px;
        }

        .amenities-grid{
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          column-gap: 80px;
          row-gap: 14px;
          align-items: start;
        }

        .amenity-item{
          display: flex;
          align-items: center;
          gap: 10px;
          color: #2b2b2b;
          font-size: 14px;
          line-height: 1.4;
          white-space: nowrap;
        }

        .amenity-icon{
          width: 20px;
          height: 20px;
          border-radius: 999px;
          border: 1px solid #9f8151;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: #9f8151;
          flex: 0 0 auto;
        }

        .amenity-text{
          font-size: 14px;
          color: #444;
        }

        /* Tablet */
        @media (max-width: 1024px){
          .amenities-grid{
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: 40px;
          }
          .amenities-title{
            font-size: 34px;
          }
        }

        /* Mobile */
        @media (max-width: 640px){
          .amenities-grid{
            grid-template-columns: repeat(1, minmax(0, 1fr));
            column-gap: 0px;
          }
          .amenity-item{
            white-space: normal;
          }
          .amenities-title{
            font-size: 28px;
          }
        }
      `}</style>
    </section>
  );
}
