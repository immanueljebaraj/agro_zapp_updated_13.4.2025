import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GisAnalysis.css";

const GisAnalysis = () => {
  const navigate = useNavigate();

  // Map data with titles, image paths, and statistics
  const mapData = [
    {
      id: 1,
      title: "Agricultural Land Cover",
      image: "/maps/agri_colorised.jpg",
      coords: "Lat: 17.3850° N, Long: 78.4867° E",
      stats: [
        "Cultivated Area: 62%",
        "Forest Cover: 18%",
        "Urban Area: 12%",
        "Water Bodies: 8%",
        "Productivity Index: 0.78",
      ],
    },
    {
      id: 2,
      title: "Geology",
      image: "/maps/geology.jpg",
      coords: "Lat: 17.3850° N, Long: 78.4867° E",
      stats: [
        "Granite Formations: 45%",
        "Sedimentary Rock: 32%",
        "Alluvial Deposits: 15%",
        "Volcanic Rock: 8%",
        "Soil pH Avg: 6.8",
      ],
    },
    {
      id: 3,
      title: "Vegetation Health",
      image: "/maps/ndvi_colorised.jpg",
      coords: "Lat: 17.3850° N, Long: 78.4867° E",
      stats: [
        "Healthy Vegetation: 68%",
        "Moderate Stress: 22%",
        "Severe Stress: 8%",
        "Barren Land: 2%",
        "NDVI Avg: 0.65",
      ],
    },
    {
      id: 4,
      title: "NDMI ANALYSIS",
      image: "/maps/ndmi.jpg",
      coords: "Lat: 17.3850° N, Long: 78.4867° E",
      stats: [
        "Optimal Moisture: 58%",
        "Moderate Moisture: 25%",
        "Low Moisture: 12%",
        "Dry Areas: 5%",
        "Moisture Index: 0.42",
      ],
    },
    {
      id: 5,
      title: "Topology Map",
      image: "/maps/us_topology.jpg",
      coords: "Lat: 17.3850° N, Long: 78.4867° E",
      stats: [
        "Elevation Range: 400-850m",
        "Slope <5°: 42%",
        "Slope 5-15°: 38%",
        "Slope >15°: 20%",
        "Drainage Density: 1.2 km/km²",
      ],
    },
    {
      id: 6,
      title: "IR Cover Map",
      image: "/maps/ir_colorised.jpg",
      coords: "Lat: 17.3850° N, Long: 78.4867° E",
      stats: [
        "Healthy Crop Signature: 72%",
        "Water Stress Signs: 15%",
        "Disease Indicators: 8%",
        "Nutrient Deficiency: 5%",
        "Thermal Anomalies: 3%",
      ],
    },
  ];

  // Initialize state for zoom levels
  const [zoomLevels, setZoomLevels] = useState(mapData.map(() => 1));

  const handleZoom = (index, direction) => {
    const newZoomLevels = [...zoomLevels];
    if (direction === "in") {
      newZoomLevels[index] = Math.min(newZoomLevels[index] + 0.2, 3);
    } else {
      newZoomLevels[index] = Math.max(newZoomLevels[index] - 0.2, 1);
    }
    setZoomLevels(newZoomLevels);
  };

  return (
    <div className="gis-image-scope-app">
      {/* Header */}
      <header className="gis-app-header">
        <h1>Geographic Information System Analysis</h1>
        <p>Interactive map visualization and spatial data analysis</p>
      </header>

      {/* Main Content */}
      <main className="gis-app-main">
        <div className="gis-content-grid">
          {mapData.map((map, index) => (
            <div key={map.id} className="gis-map-container">
              <div className="gis-map-viewer">
                <div className="gis-image-container pop-up">
                  <img
                    src={map.image}
                    alt={map.title}
                    className="gis-main-image map-image"
                    style={{
                      transform: `scale(${zoomLevels[index]})`,
                      transformOrigin: "center center",
                    }}
                  />
                  <div className="gis-simple-zoom-controls">
                    <button
                      className="gis-zoom-btn plus"
                      onClick={() => handleZoom(index, "in")}
                      aria-label="Zoom in"
                    >
                      +
                    </button>
                    <button
                      className="gis-zoom-btn minus"
                      onClick={() => handleZoom(index, "out")}
                      aria-label="Zoom out"
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
              <div className="gis-map-info">
                <h3>{map.title}</h3>
                <p>{map.coords}</p>
                <div className="gis-map-stats">
                  {map.stats.map((stat, i) => (
                    <p key={i}>{stat}</p>
                  ))}
                </div>
                <p className="gis-zoom-level">
                  Zoom: {(zoomLevels[index] * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Back Button */}
      <div
        className="gis-action-buttons"
        style={{
          padding: "0 2rem 2rem",
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <button className="gis-upload-btn" onClick={() => navigate(-1)}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default GisAnalysis;
