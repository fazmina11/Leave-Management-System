const colorMap = {
  green: {
    iconBg: 'bg-green-100',
    iconText: 'text-green-600',
    trendText: 'text-green-600',
  },
  yellow: {
    iconBg: 'bg-yellow-100',
    iconText: 'text-yellow-600',
    trendText: 'text-yellow-600',
  },
  red: {
    iconBg: 'bg-red-100',
    iconText: 'text-red-600',
    trendText: 'text-red-600',
  },
  blue: {
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    trendText: 'text-blue-600',
  },
  indigo: {
    iconBg: 'bg-indigo-100',
    iconText: 'text-indigo-600',
    trendText: 'text-indigo-600',
  },
};

const StatCard = ({ label, value, icon: Icon, color = 'indigo', trendLabel }) => {
  const colors = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        {/* Left — Label & Value */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">{label}</span>
          <span className="text-3xl font-extrabold text-gray-900 mt-1">{value}</span>
          {trendLabel && (
            <span className={`text-xs font-medium mt-1.5 ${colors.trendText}`}>
              {trendLabel}
            </span>
          )}
        </div>

        {/* Right — Icon */}
        {Icon && (
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.iconBg}`}
          >
            <Icon className={`w-6 h-6 ${colors.iconText}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
