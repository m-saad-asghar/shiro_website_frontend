import { useState } from "react";
import { useTranslation } from "react-i18next";
import Icons from "@/Constants/Icons";

interface MortgageCalculatorProps {
  propertyPrice: number | string;
}

const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  propertyPrice,
}) => {
  const { t } = useTranslation();
  const [downPayment, setDownPayment] = useState(20);
  const [loanTerm, setLoanTerm] = useState(25);
  const [interestRate, setInterestRate] = useState(4.5);

  // Ensure property price is valid
  const validPropertyPrice = (() => {
    if (!propertyPrice) return 0;

    if (typeof propertyPrice === "string") {
      const cleanPrice = propertyPrice.replace(/[^\d.]/g, "");
      const numPrice = parseFloat(cleanPrice);
      return isNaN(numPrice) ? 0 : numPrice;
    }

    if (typeof propertyPrice === "number") {
      return isNaN(propertyPrice) ? 0 : propertyPrice;
    }

    return 0;
  })();

  // Calculate loan
  const loanAmount = validPropertyPrice * (1 - downPayment / 100);
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  const monthlyPayment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - loanAmount;

  // Format numbers
  const formatCurrency = (amount: number) => {
    if (isNaN(amount) || amount === 0) return "$0";
    return `$${amount.toLocaleString()}`;
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
              min="2"
              max="8"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              style={{
                background: `linear-gradient(to right, #094834 0%, #094834 ${
                  ((interestRate - 2) / (8 - 2)) * 100
                }%, #e5e7eb ${
                  ((interestRate - 2) / (8 - 2)) * 100
                }%, #e5e7eb 100%)`,
              }}
            />
            <div className="flex justify-between font-semibold rounded-lg text-sm mt-1 transition-all duration-200 mb-1 text-[#9f8151]">
              <span>2%</span>
              <span>8%</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold rounded-lg text-sm transition-all duration-200 text-[#9f8151]">{t("Loan Amount")}</span>
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
          {/* <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{t("Total Interest")}</span>
            <span>{formatCurrency(totalInterest)}</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
