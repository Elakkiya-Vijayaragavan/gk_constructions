const stats = [
  { value: "48+", label: "Projects Completed" },
  { value: "12", label: "Ongoing Projects" },
  { value: "90+", label: "Happy Clients" },
  { value: "150+", label: "Design Concepts" },
];

function Stats() {
  return (
    <section className="stats-band">
      <div className="container stats-grid">
        {stats.map((item) => (
          <div className="stat-card" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;
