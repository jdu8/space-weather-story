export default function SolarFlareList({ flares }) {
  if (!flares || flares.length === 0) {
    return <div className="no-data">No solar flare data available</div>;
  }

  const getFlareClassColor = (classType) => {
    if (!classType) return '#888';
    const firstChar = classType.charAt(0);
    switch (firstChar) {
      case 'X':
        return '#ff4757'; // Red for X-class (most intense)
      case 'M':
        return '#ff6b35'; // Orange for M-class
      case 'C':
        return '#ffd700'; // Yellow for C-class
      case 'B':
        return '#00d9ff'; // Blue for B-class
      default:
        return '#888';
    }
  };

  return (
    <div className="flare-list">
      {flares.map((flare, index) => (
        <div key={index} className="flare-item">
          <div className="flare-header">
            <span
              className="flare-class"
              style={{ backgroundColor: getFlareClassColor(flare.classType) }}
            >
              {flare.classType || 'Unknown'}
            </span>
            <span className="flare-date">
              {new Date(flare.beginTime).toLocaleString()}
            </span>
          </div>
          <div className="flare-location">
            {flare.sourceLocation || 'Location unknown'}
          </div>
          {flare.peakTime && (
            <div className="flare-peak">
              Peak: {new Date(flare.peakTime).toLocaleTimeString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
