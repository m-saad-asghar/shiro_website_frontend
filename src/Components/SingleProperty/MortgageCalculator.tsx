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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Icons.IoIosInformationCircleOutline className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {t("Calculate Your Mortgage")}
          </h3>
          <p className="text-sm text-gray-600">
            {t("Estimate your monthly payments")}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Down Payment */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-gray-700">
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
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>5%</span>
              <span>50%</span>
            </div>
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-gray-700">
              {t("Loan Term")}
            </label>
            <span className="text-sm font-semibold text-primary">
              {loanTerm} {t("years")}
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
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>5 {t("years")}</span>
              <span>30 {t("years")}</span>
            </div>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-gray-700">
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
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>2%</span>
              <span>8%</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t("Loan Amount")}</span>
            <span className="font-bold text-lg text-primary">
              {formatCurrency(loanAmount)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {t("Monthly Payment")}
            </span>
            <span className="font-bold text-xl text-primary">
              {formatCurrency(monthlyPayment)}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{t("Total Interest")}</span>
            <span>{formatCurrency(totalInterest)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
