export default function CMEChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="no-data">No CME data available</div>;
  }

  // Group CMEs by date
  const cmeByDate = data.reduce((acc, cme) => {
    const date = new Date(cme.startTime).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const dates = Object.keys(cmeByDate);
  const counts = Object.values(cmeByDate);
  const maxCount = Math.max(...counts);

  return (
    <div className="cme-chart">
      <div className="chart-bars">
        {dates.map((date, index) => {
          const height = (counts[index] / maxCount) * 100;
          return (
            <div key={date} className="chart-bar-container">
              <div
                className="chart-bar"
                style={{
                  height: `${height}%`,
                  backgroundColor: '#00ff88',
                }}
              >
                <span className="bar-value">{counts[index]}</span>
              </div>
              <div className="chart-label">{date.split('/')[1]}/{date.split('/')[0]}</div>
            </div>
          );
        })}
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#00ff88' }}></span>
          <span>CME Events</span>
        </div>
      </div>
    </div>
  );
}
