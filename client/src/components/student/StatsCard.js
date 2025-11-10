// src/components/student/StatsCard.js
import React from "react";

const StatsCard = ({ title, value, icon, color = "primary", description }) => {
  const colorClasses = {
    primary: "from-primary-500 to-primary-600",
    gold: "from-yellow-500 to-yellow-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
  };

  const bgClass = colorClasses[color] || colorClasses.primary;

  return (
    <div
      role="status"
      aria-label={`${title}: ${value}`}
      className={`bg-gradient-to-r ${bgClass} rounded-xl p-6 text-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium tracking-wide uppercase">
            {title}
          </p>
          <p className="text-3xl font-extrabold mt-2">{value}</p>
          {description && (
            <p className="text-white/70 text-xs mt-1">{description}</p>
          )}
        </div>
        <div className="opacity-90 bg-white/20 p-3 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
