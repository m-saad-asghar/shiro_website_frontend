import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Icons from "@/Constants/Icons";

interface MortgageCalculatorProps {
  propertyPrice: number | string;
}

const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  propertyPrice,
}) => {
  const { t } = useTranslation();

  const [downPayment, setDownPayment] = useState(20); // %
  const [loanTerm, setLoanTerm] = useState(25); // years
  const [interestRate, setInterestRate] = useState(4.5); // annual %

  // ✅ Parse and validate property price robustly
  const validPropertyPrice = useMemo(() => {
    if (propertyPrice === null || propertyPrice === undefined) return 0;

    if (typeof propertyPrice === "number") {
      return Number.isFinite(propertyPrice) ? propertyPrice : 0;
    }

    if (typeof propertyPrice === "string") {
      // remove commas first, then remove non-digit/non-dot
      const cleanPrice = propertyPrice.replace(/,/g, "").replace(/[^\d.]/g, "");
      const numPrice = parseFloat(cleanPrice);
      return Number.isFinite(numPrice) ? numPrice : 0;
    }

    return 0;
  }, [propertyPrice]);

  // ✅ Core calculations (fixed-rate amortized mortgage)
  const loanAmount = useMemo(() => {
    const dp = Math.min(Math.max(downPayment, 0), 100);
    return validPropertyPrice * (1 - dp / 100);
  }, [validPropertyPrice, downPayment]);

  const monthlyRate = useMemo(() => {
    const r = interestRate / 100;
    return r / 12;
  }, [interestRate]);

  const numberOfPayments = useMemo(() => loanTerm * 12, [loanTerm]);

  // ✅ Guard against 0% interest / invalid math
  const monthlyPayment = useMemo(() => {
    if (!Number.isFinite(loanAmount) || loanAmount <= 0) return 0;
    if (!Number.isFinite(numberOfPayments) || numberOfPayments <= 0) return 0;

    if (!Number.isFinite(monthlyRate) || monthlyRate < 0) return 0;

    if (monthlyRate === 0) {
      return loanAmount / numberOfPayments;
    }

    const pow = Math.pow(1 + monthlyRate, numberOfPayments);
    const denom = pow - 1;

    if (denom === 0) return 0;

    return (loanAmount * (monthlyRate * pow)) / denom;
  }, [loanAmount, monthlyRate, numberOfPayments]);

  const totalPayment = useMemo(() => {
    if (!Number.isFinite(monthlyPayment) || monthlyPayment <= 0) return 0;
    return monthlyPayment * numberOfPayments;
  }, [monthlyPayment, numberOfPayments]);

  const totalInterest = useMemo(() => {
    if (!Number.isFinite(totalPayment) || totalPayment <= 0) return 0;
    return totalPayment - loanAmount;
  }, [totalPayment, loanAmount]);

  // ✅ Currency formatting (safe + clean)
  const formatCurrency = (amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) return "Đ 0";
    return `Đ ${Math.round(amount).toLocaleString()}`;
  };

  return (
    <div className="bg-white change_border shadow-lg border border-gray-100 p-6 md:p-8 w-full">
      <div className="flex items-center gap-3 mb-6">
        {/* <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Icons.IoIosInformationCircleOutline className="w-5 h-5 text-primary" />
        </div> */}
        <div>
          <h3 className="font-semibold text-primary text-xl">
            {t("Calculate Your Mortgage")}
          </h3>
          <p className="text-primary text_stying text-sm">
            {t("Estimate your monthly payments")}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Down Payment */}
        <div>
          <div className="flex justify-between items-center">
            <label className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
              {t("Down Payment")}
            </label>
            <span className="text-sm font-semibold text-primary">
              {downPayment}% -{" "}
              {formatCurrency((validPropertyPrice * downPayment) / 100)}
            </span>
          </div>

          <div className="relative">
            <input
              type="range"
              min="5"
              max="50"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              style={{
                background: `linear-gradient(to right, #094834 0%, #094834 ${
                  ((downPayment - 5) / (50 - 5)) * 100
                }%, #e5e7eb ${
                  ((downPayment - 5) / (50 - 5)) * 100
                }%, #e5e7eb 100%)`,
              }}
            />
            <div className="flex justify-between font-semibold rounded-lg text-sm mt-1 transition-all duration-200 mb-1 text-[#9f8151]">
              <span>5%</span>
              <span>50%</span>
            </div>
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <div className="flex justify-between items-center">
            <label className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
              {t("Loan Term")}
            </label>
            <span className="text-sm font-semibold text-primary">
              {loanTerm} {t("Years")}
            </span>
          </div>

          <div className="relative">
            <input
              type="range"
              min="5"
              max="30"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              style={{
                background: `linear-gradient(to right, #094834 0%, #094834 ${
                  ((loanTerm - 5) / (30 - 5)) * 100
                }%, #e5e7eb ${
                  ((loanTerm - 5) / (30 - 5)) * 100
                }%, #e5e7eb 100%)`,
              }}
            />
            <div className="flex justify-between font-semibold rounded-lg text-sm mt-1 transition-all duration-200 mb-1 text-[#9f8151]">
              <span>5 {t("Years")}</span>
              <span>30 {t("Years")}</span>
            </div>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between items-center">
            <label className="font-semibold rounded-lg text-sm transition-all duration-200 mb-1 text-[#9f8151]">
              {t("Interest Rate")}
            </label>
            <span className="text-sm font-semibold text-primary">
              {interestRate}%
            </span>
          </div>

          <div className="relative">
            <input
              type="range"
              min="0"
              max="8"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              style={{
                background: `linear-gradient(to right, #094834 0%, #094834 ${
                  ((interestRate - 0) / (8 - 0)) * 100
                }%, #e5e7eb ${
                  ((interestRate - 0) / (8 - 0)) * 100
                }%, #e5e7eb 100%)`,
              }}
            />
            <div className="flex justify-between font-semibold rounded-lg text-sm mt-1 transition-all duration-200 mb-1 text-[#9f8151]">
              <span>0%</span>
              <span>8%</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold rounded-lg text-sm transition-all duration-200 text-[#9f8151]">
              {t("Loan Amount")}
            </span>
            <span className="font-bold text-lg text-primary">
              {formatCurrency(loanAmount)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold rounded-lg text-sm transition-all duration-200 text-[#9f8151]">
              {t("Monthly Payment")}
            </span>
            <span className="font-bold text-lg text-primary">
              {formatCurrency(monthlyPayment)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold rounded-lg text-sm transition-all duration-200 text-[#9f8151]">
              {t("Total Interest")}
            </span>
            <span className="font-bold text-lg text-primary">
              {formatCurrency(totalInterest)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
