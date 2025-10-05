import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CMEChart from './CMEChart';
import SolarFlareList from './SolarFlareList';
import LiveStats from './LiveStats';
import './Dashboard.css';

/**
 * Data Dashboard showing real-time CME and solar weather data from NASA DONKI API
 */
export default function Dashboard() {
  const [cmeData, setCmeData] = useState([]);
  const [solarFlares, setSolarFlares] = useState([]);
  const [geoStorms, setGeoStorms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNASAData();
  }, []);

  const fetchNASAData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Calculate date range (last 30 days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const formatDate = (date) => date.toISOString().split('T')[0];

      const baseURL = 'https://api.nasa.gov/DONKI';
      const apiKey = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

      // Fetch CME data
      const cmeResponse = await fetch(
        `${baseURL}/CME?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}&api_key=${apiKey}`
      );
      const cmeJson = await cmeResponse.json();
      setCmeData(cmeJson.slice(0, 10)); // Latest 10 CMEs

      
      // Fetch Solar Flare data
      const flareResponse = await fetch(
        `${baseURL}/FLR?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}&api_key=${apiKey}`
      );
      const flareJson = await flareResponse.json();
      setSolarFlares(flareJson.slice(0, 10)); // Latest 10 flares

      // Fetch Geomagnetic Storm data
      const gstResponse = await fetch(
        `${baseURL}/GST?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}&api_key=${apiKey}`
      );
      const gstJson = await gstResponse.json();
      setGeoStorms(gstJson.slice(0, 5)); // Latest 5 storms

      setLoading(false);
    } catch (err) {
      console.error('Error fetching NASA data:', err);
      setError('Failed to load space weather data. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="dashboard-header"
      >
        <h1 className="dashboard-title">
          <span className="title-icon">☀️</span>
          Space Weather Dashboard
        </h1>
        <p className="dashboard-subtitle">
          Real-time data from NASA's DONKI System
        </p>
      </motion.div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading space weather data...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={fetchNASAData} className="retry-button">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="dashboard-grid">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="dashboard-card stats-card"
          >
            <LiveStats
              cmeCount={cmeData.length}
              flareCount={solarFlares.length}
              stormCount={geoStorms.length}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="dashboard-card chart-card"
          >
            <h2 className="card-title">
              <span className="title-icon">📊</span>
              CME Activity (Last 30 Days)
            </h2>
            <p className="card-description">
              Coronal Mass Ejections (CMEs) are massive bursts of solar plasma - just like Fiery from our story! This chart shows when they occurred.
            </p>
            <CMEChart data={cmeData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="dashboard-card list-card"
          >
            <h2 className="card-title">
              <span className="title-icon">🔥</span>
              Recent Solar Flares
            </h2>
            <p className="card-description">
              Solar flares are intense bursts of radiation. X-class (red) are the most powerful, followed by M-class (orange), C-class (yellow), and B-class (blue).
            </p>
            <SolarFlareList flares={solarFlares} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="dashboard-card storm-card"
          >
            <h2 className="card-title">
              <span className="title-icon">⚡</span>
              Geomagnetic Storms
            </h2>
            <p className="card-description">
              When CMEs reach Earth, they can cause geomagnetic storms. The Kp index measures their intensity (0-9, where 5+ creates auroras visible at lower latitudes).
            </p>
            <div className="storm-list">
              {geoStorms.length > 0 ? (
                geoStorms.map((storm, index) => (
                  <div key={index} className="storm-item">
                    <div className="storm-date">
                      {new Date(storm.startTime).toLocaleDateString()}
                    </div>
                    <div className="storm-kp">
                      Kp Index: {storm.allKpIndex?.[0]?.kpIndex || 'N/A'}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No recent geomagnetic storms</p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      <div className="dashboard-footer">
        <p>
          Data provided by{' '}
          <a
            href="https://ccmc.gsfc.nasa.gov/tools/DONKI/"
            target="_blank"
            rel="noopener noreferrer"
          >
            NASA DONKI
          </a>
          {' | '}
          <span className="disclaimer">For research purposes only</span>
        </p>
        <button onClick={fetchNASAData} className="refresh-button">
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
}
