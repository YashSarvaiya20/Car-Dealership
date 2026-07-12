export default function Statistics() {
  const stats = [
    { value: '1,000+', label: 'Cars Sold' },
    { value: '500+', label: 'Happy Customers' },
    { value: '100+', label: 'Verified Dealers' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <section className="py-16 bg-transparent border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <h3 className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">
                {stat.value}
              </h3>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
