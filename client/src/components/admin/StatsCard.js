import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const StatsCard = ({
  title,
  value,
  icon,
  color = "primary",
  change,
  changeType,
  description,
}) => {
  const colorClasses = {
    primary: "from-blue-500 to-blue-600",
    gold: "from-yellow-500 to-yellow-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    blue: "from-sky-500 to-sky-600",
    purple: "from-purple-500 to-purple-600",
  };

  const bgClass = colorClasses[color] || colorClasses.primary;

  return (
    <div
      className={`relative bg-gradient-to-r ${bgClass} rounded-xl p-6 text-white shadow-md hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between">
        <div>
          {/* Title */}
          <p className="text-white/90 text-sm font-medium tracking-wide">
            {title}
          </p>

          {/* Value */}
          <p className="text-3xl font-bold mt-1">
            {typeof value === "number"
              ? value.toLocaleString()
              : value || "—"}
          </p>

          {/* Change indicator */}
          {change && (
            <div className="flex items-center mt-2 text-sm">
              {changeType === "positive" ? (
                <FaArrowUp className="w-3 h-3 text-green-200 mr-1" />
              ) : (
                <FaArrowDown className="w-3 h-3 text-red-200 mr-1" />
              )}
              <span
                className={`font-medium ${
                  changeType === "positive"
                    ? "text-green-100"
                    : "text-red-100"
                }`}
              >
                {change}
              </span>
              <span className="ml-1 text-white/80 text-xs">
                {changeType === "positive" ? "since last month" : "decrease"}
              </span>
            </div>
          )}

          {/* Optional description */}
          {description && (
            <p className="mt-2 text-xs text-white/80">{description}</p>
          )}
        </div>

        {/* Icon */}
        <div className="opacity-80 bg-white/10 p-3 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

