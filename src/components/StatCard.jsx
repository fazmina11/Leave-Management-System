export default function StatCard({ label, value, icon: Icon, color, trend, trendLabel }) {
  const colors = {
    green: { bg: 'bg-green-100', text: 'text-green-600', trend: 'text-green-500' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', trend: 'text-yellow-500' },
    red: { bg: 'bg-red-100', text: 'text-red-600', trend: 'text-red-500' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', trend: 'text-blue-500' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', trend: 'text-indigo-500' },
  };
  const c = colors[color] || colors.indigo;
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-start justify-between border border-gray-100 hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-3xl font-extrabold text-gray-900 mt-2 leading-none">{value}</p>
        {trendLabel && <p className={`text-xs mt-2 font-medium ${c.trend}`}>{trendLabel}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.bg}`}>
        <Icon className={`w-6 h-6 ${c.text}`} />
      </div>
    </div>
  );
}