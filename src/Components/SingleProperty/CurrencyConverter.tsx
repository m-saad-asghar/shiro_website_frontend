import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Icons from "@/Constants/Icons";

interface CurrencyConverterProps {
  propertyPrice: number | string;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  propertyPrice,
}) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState("AED");
  const [toCurrency, setToCurrency] = useState("USD");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Available currencies
  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "SAR", name: "Saudi Riyal", symbol: "ر.س" },
    { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك" },
    { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق" },
    { code: "BHD", name: "Bahraini Dinar", symbol: "د.ب" },
    { code: "OMR", name: "Omani Rial", symbol: "ر.ع" },
    { code: "JOD", name: "Jordanian Dinar", symbol: "د.ا" },
  ];

  // Convert property price to number
  const getValidPropertyPrice = () => {
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
  };

  // Convert currency
  const convertCurrency = async () => {
    setLoading(true);
    setError("");

    try {
      // Use API directly
      const response = await fetch(
        `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_ZzEu5xyXYFfdPNSsMSaZ8to8EETZjLwOfeUnYuQn&base_currency=${fromCurrency}&currencies=${toCurrency}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate");
      }

      const data = await response.json();

      if (data.data && data.data[toCurrency]) {
        const rate = data.data[toCurrency];
        setExchangeRate(rate);
        setConvertedAmount(amount * rate);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError("Failed to convert currency. Please try again.");
      setConvertedAmount(0);
      setExchangeRate(0);
    } finally {
      setLoading(false);
    }
  };

  // Convert property price when currency changes
  const convertPropertyPrice = async () => {
    const validPrice = getValidPropertyPrice();
    if (validPrice > 0) {
      setAmount(validPrice);
      await convertCurrency();
    }
  };

  // Convert when currencies or amount change
  useEffect(() => {
    if (amount > 0) {
      convertCurrency();
    }
  }, [fromCurrency, toCurrency, amount]);

  // Convert property price when component loads
  useEffect(() => {
    const validPrice = getValidPropertyPrice();
    if (validPrice > 0) {
      setAmount(validPrice);
    }
  }, [propertyPrice]);

  // Format numbers
  const formatCurrency = (amount: number, currencyCode: string) => {
    if (isNaN(amount) || amount === 0) return "0";

    const currency = currencies.find((c) => c.code === currencyCode);
    const symbol = currency?.symbol || currencyCode;

    return `${symbol}${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Icons.IoIosInformationCircleOutline className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {t("Currency Converter")}
          </h3>
          <p className="text-sm text-gray-600">
            {t("Convert property price to different currencies")}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Amount")}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter amount"
          />
        </div>

        {/* Source currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("From")}
          </label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              setFromCurrency(toCurrency);
              setToCurrency(fromCurrency);
            }}
            className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors duration-200"
            aria-label="Swap currencies"
          >
            <Icons.IoIosArrowBack className="w-5 h-5 rotate-90" />
          </button>
        </div>

        {/* Target currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("To")}
          </label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} - {currency.name}
              </option>
            ))}
          </select>
        </div>

        {/* Result */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {t("Converted Amount")}
            </span>
            <span className="font-bold text-xl text-primary">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  {t("Converting...")}
                </div>
              ) : (
                formatCurrency(convertedAmount, toCurrency)
              )}
            </span>
          </div>

          {exchangeRate > 0 && (
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{t("Exchange Rate")}</span>
              <span>
                1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
              </span>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
        </div>

        {/* Convert property price button */}
        {getValidPropertyPrice() > 0 && (
          <button
            onClick={convertPropertyPrice}
            className="w-full bg-primary text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-200"
            aria-label="Convert property price to selected currency"
          >
            {t("Convert Property Price")}
          </button>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
