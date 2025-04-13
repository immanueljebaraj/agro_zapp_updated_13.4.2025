import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./Dashboard.css";
import user_icon from "../assets/profile.svg";
import silt from "../assets/silt-soil-vector.png";
import ph_scale from "../assets/ph-scale.png";
import moisture from "../assets/moisture.png";
import temperature from "../assets/temperature.png";
import gis_data from "../geo_data.json";
import GenerateReport from "./GenerateReport";
import Chatbot from "./ChatBot";

const getNPKStatus = (value, type) => {
  if (type === "Nitrogen") {
    if (value >= 40) return "Good 🟢";
    if (value >= 20) return "Average 🟠";
    return "Bad 🔴";
  } else if (type === "Phosphorous") {
    if (value >= 25) return "Good 🟢";
    if (value >= 15) return "Average 🟠";
    return "Bad 🔴";
  } else if (type === "Potassium") {
    if (value >= 20) return "Good 🟢";
    if (value >= 10) return "Average 🟠";
    return "Bad 🔴";
  }
  return "Unknown";
};

const Predictor = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [weatherPrediction, setWeatherPrediction] = useState("");
  const [fertilizerSuggestion, setFertilizerSuggestion] = useState("");

  const API_KEY = "92abd0d592ed4d91a7212745252303";
  const API_URL = "https://api.weatherapi.com/v1/forecast.json";

  const handleDateSubmit = async () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    try {
      const response = await axios.get(API_URL, {
        params: {
          key: API_KEY,
          q: "Hyderabad",
          dt: selectedDate,
        },
      });

      const weatherData = response.data.forecast.forecastday[0].day;
      const weatherDescription = weatherData.condition.text;
      const rain = weatherData.daily_will_it_rain === 1;

      setWeatherPrediction(`Weather on ${selectedDate}: ${weatherDescription}`);
      setFertilizerSuggestion(
        rain
          ? "Rain detected. Avoid using fertilizers and pesticides today."
          : "No rain detected. You can use fertilizers and pesticides."
      );
    } catch (error) {
      console.error(
        "Error fetching weather data:",
        error.response?.data || error.message
      );
      setWeatherPrediction("Failed to fetch weather data. Please try again.");
      setFertilizerSuggestion("");
    }
  };

  return (
    <div className="o-card div7 prediction-container">
      <h3>Predictor:</h3>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
      <button onClick={handleDateSubmit}>Enter</button>
      <textarea
        className="weather-prediction"
        readOnly
        value={weatherPrediction}
        placeholder="Weather prediction will appear here..."
      ></textarea>
      <textarea
        className="weather-suggestion"
        readOnly
        value={fertilizerSuggestion}
        placeholder="Fertilizer suggestion will appear here..."
      ></textarea>
    </div>
  );
};

export default function Dashboard() {
  // State declarations
  const [coordinates, setCoordinates] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [diseaseImagePreview, setDiseaseImagePreview] = useState(null);
  const [prediction, setPrediction] = useState("No result yet.");
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [insectFile, setInsectFile] = useState(null);
  const [insectImagePreview, setInsectImagePreview] = useState(null);
  const [insectPrediction, setInsectPrediction] = useState("No result yet.");
  const [insectUploadStatus, setInsectUploadStatus] = useState("");
  const [insectUploadProgress, setInsectUploadProgress] = useState(0);
  const [data, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pid, setPid] = useState("");
  const [plotIndex, setPlotIndex] = useState(-1);
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [insectInfo, setInsectInfo] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [diseaseName, setDiseaseName] = useState("");
  const [insectName, setInsectName] = useState("");

  const navigate = useNavigate();

  // GIS Data Handling
  const defaultPlot = {
    plot_id: "",
    gis_data: { type: "Point", coordinates: [0, 0] },
    soil_type: "---",
    weather: "---",
    npk_levels: { N: "---", P: "---", K: "---" },
    moisture: "---",
    temperature: "---",
    ph_value: "---",
    vegetation: { NDVI: "---", NDMI: "---" },
    ideal_crops: ["---"],
  };

  const plot = pid
    ? gis_data.find((plot) => plot.plot_id === pid)
    : defaultPlot;

  // Handler Functions
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus("Ready to upload");
      setUploadProgress(0);

      const reader = new FileReader();
      reader.onloadend = () => {
        setDiseaseImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsectFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setInsectFile(file);
      setInsectUploadStatus("Ready to upload");
      setInsectUploadProgress(0);

      const reader = new FileReader();
      reader.onloadend = () => {
        setInsectImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates(`${latitude}, ${longitude}`);
        setError("");
      },
      (err) => {
        setError("Failed to get location: " + err.message);
      }
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a location");
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json`
      );

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setCoordinates(`${lat}, ${lon}`);
        setError("");
      } else {
        setError("Location not found");
      }
    } catch (err) {
      setError("Search failed");
      console.error("Search error:", err);
    }
  };

  const handleStartClick = () => {
    handleSearch();
    const plotIds = gis_data
      .map((plot) => plot.plot_id)
      .filter((id) => id !== "");
    const nextIndex = (plotIndex + 1) % plotIds.length;
    setPid(plotIds[nextIndex]);
    setPlotIndex(nextIndex);
  };

  const imageScope = () => {
    navigate("/image-scope");
  };

  const handleGisAnalysisClick = () => {
    navigate("/gis-analysis");
  };

  // API Functions
  const fetchDiseaseInfo = async (disease) => {
    try {
      setLoadingResults(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/ollama/ask-groq/",
        {
          question: `Our tomato is predicted to have ${disease} in plants now give a short structured report for the result.give not more than 100 words`,
        }
      );
      setDiseaseInfo(response.data.response);
      setDiseaseName(disease);
      return response.data.response;
    } catch (error) {
      console.error("Error fetching disease info:", error);
      setDiseaseInfo(`Could not fetch information about ${disease}.`);
      return `Could not fetch information about ${disease}.`;
    } finally {
      setLoadingResults(false);
    }
  };

  const fetchInsectInfo = async (insect) => {
    try {
      setLoadingResults(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/ollama/ask-groq/",
        {
          question: `Our tomato is predicted to have ${insect} in plants now give a short structured report for the result.give not more than 100 words`,
        }
      );
      setInsectInfo(response.data.response);
      setInsectName(insect);
      return response.data.response;
    } catch (error) {
      console.error("Error fetching insect info:", error);
      setInsectInfo(`Could not fetch information about ${insect}.`);
      return `Could not fetch information about ${insect}.`;
    } finally {
      setLoadingResults(false);
    }
  };

  const fetchSuggestions = async (disease, insect) => {
    try {
      setLoadingResults(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/ollama/ask-groq/",
        {
          question: `Provide specific fertilizer and pesticide suggestions for ${disease} disease and ${insect} pest in tomato plants. Make it a short , concise, sttructured feedback. It sould have only around 200-250 words.`,
        }
      );
      setSuggestions(response.data.response);
      return response.data.response;
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions("Could not fetch suggestions at this time.");
      return "Could not fetch suggestions at this time.";
    } finally {
      setLoadingResults(false);
    }
  };

  // Prediction Handlers
  const handlePredict = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setUploadStatus("Uploading...");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/plant/predict/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
            setUploadStatus(`Uploading: ${percentCompleted}%`);
          },
        }
      );

      setPrediction(response.data.prediction);
      setUploadStatus("Uploaded successfully!");
      fetchDiseaseInfo(response.data.prediction);

      if (insectPrediction !== "No result yet.") {
        fetchSuggestions(response.data.prediction, insectPrediction);
      }
    } catch (error) {
      console.error("Error predicting disease:", error);
      setPrediction("Error predicting disease.");
      setUploadStatus("Upload failed. Please try again.");
    }
  };

  const handleInsectPredict = async () => {
    if (!insectFile) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", insectFile);

    try {
      setInsectUploadStatus("Uploading...");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/insect/predict/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setInsectUploadProgress(percentCompleted);
            setInsectUploadStatus(`Uploading: ${percentCompleted}%`);
          },
        }
      );

      setInsectPrediction(response.data.class);
      setInsectUploadStatus("Uploaded successfully!");
      fetchInsectInfo(response.data.class);

      if (prediction !== "No result yet.") {
        fetchSuggestions(prediction, response.data.class);
      }
    } catch (error) {
      console.error("Error classifying insect:", error);
      setInsectPrediction("Error classifying insect.");
      setInsectUploadStatus("Upload failed. Please try again.");
    }
  };

  // Effects
  useEffect(() => {
    if (plot) {
      const graphFriendlyData = [
        {
          name: plot.plot_id,
          Potassium: plot.npk_levels.K,
          Phosphorous: plot.npk_levels.P,
          Nitrogen: plot.npk_levels.N,
        },
      ];
      setGraphData(graphFriendlyData);
    }
    setLoading(false);
  }, [pid]);

  // Render
  return (
    <>
      <div className="user-profile">
        <p>Admin</p>
        <img src={user_icon} alt="User icon" />
      </div>

      <div className="gis">
        <button id="gis-btn" onClick={handleLocationClick}>
          <i className="fa-solid fa-location-dot"></i>
        </button>
        <input
          type="text"
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <button id="gis-start-btn" onClick={handleStartClick}>
          START
        </button>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div id="dashboard-content">
        <div className="gis-data gis">
          {coordinates ? (
            (() => {
              try {
                const [lat, lon] = coordinates.split(",").map(parseFloat);
                if (
                  isNaN(lat) ||
                  isNaN(lon) ||
                  Math.abs(lat) > 90 ||
                  Math.abs(lon) > 180
                ) {
                  throw new Error("Invalid coordinates");
                }

                const markerSymbol = encodeURIComponent(
                  JSON.stringify({
                    angle: 0,
                    xoffset: 0,
                    yoffset: 12,
                    type: "esriPMS",
                    url: "https://static.arcgis.com/images/Symbols/Basic/GreenPinLarge.png",
                    contentType: "image/png",
                    width: 60,
                    height: 60,
                  })
                );

                return (
                  <iframe
                    width="100%"
                    height="400"
                    src={`https://www.arcgis.com/apps/Embed/index.html?webmap=c8ea84aa917b46c996e79cb1f5680055&center=${lon},${lat}&level=16&marker=${lon},${lat}&markerSymbol=${markerSymbol}`}
                    frameBorder="0"
                    title="Agricultural Location Map"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      width: "100%",
                      maxWidth: "600px",
                    }}
                  />
                );
              } catch (error) {
                return (
                  <div className="map-placeholder">
                    <p style={{ color: "red", fontStyle: "italic" }}>
                      Error: {error.message}
                    </p>
                  </div>
                );
              }
            })()
          ) : (
            <div className="map-placeholder">
              <p style={{ color: "#666", fontStyle: "italic" }}>
                {error || "Map will load when location is available"}
              </p>
            </div>
          )}
          <div className="gis-details">
            <h3>GIS & Location Details</h3>
            <p>
              <strong>Plot ID:</strong> {plot.plot_id} <br />
              <strong>Location:</strong> {plot.name}
              <br />
              <strong>Latitude:</strong> {plot.gis_data.coordinates[1]} <br />
              <strong>Longitude:</strong> {plot.gis_data.coordinates[0]} <br />
              <strong>NDVI:</strong> {plot.vegetation.NDVI} <br />
              <strong>NDMI:</strong> {plot.vegetation.NDMI} <br />
              <strong>Remarks:</strong>{" "}
              {plot.remarks ? plot.remarks : "No additional remarks"} <br />
            </p>
          </div>
        </div>

        <div className="dashboard">
          <div className="f-card div1 soil-type">
            <p>SOIL TYPE</p>
            <img src={silt} alt="Soil Type" />
            <p className="card-value">{plot.soil_type}</p>
          </div>
          <div className="f-card div2 ph-scale">
            <p>PH VALUE</p>
            <img src={ph_scale} alt="PH Scale" />
            <p className="card-value">{plot.ph_value}</p>
          </div>
          <div className="f-card div3 moisture">
            <p>MOISTURE</p>
            <img src={moisture} alt="Moisture" />
            <p className="card-value">{plot.moisture}</p>
          </div>
          <div className="f-card div4 temperature">
            <p>TEMPERATURE</p>
            <img src={temperature} alt="Temperature" />
            <p className="card-value">{plot.temperature}</p>
          </div>
          <div className="t-card div5 npk-chart">
            <label className="npk">NPK Values of Soil</label>
            {loading ? (
              <p>Loading chart data...</p>
            ) : data.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Phosphorous" fill="#8884d8" />
                  <Bar dataKey="Potassium" fill="#82ca9d" />
                  <Bar dataKey="Nitrogen" fill="#FF0000" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No data available for the chart.</p>
            )}
          </div>
          <div className="t-card div6">
            <h3>Details - NPK Values</h3>
            <div className="npk-details">
              <div className="npk-item">
                <h4>Nitrogen (N)</h4>
                <p>Value: {plot.npk_levels.N}</p>
                <p>Status: {getNPKStatus(plot.npk_levels.N, "Nitrogen")}</p>
                <p>
                  {getNPKStatus(plot.npk_levels.N, "Nitrogen") === "Good"
                    ? "Nitrogen levels are optimal for plant growth."
                    : getNPKStatus(plot.npk_levels.N, "Nitrogen") === "Average"
                    ? "Nitrogen levels are moderate. Consider adding organic compost."
                    : "Nitrogen levels are low. Add nitrogen-rich fertilizers."}
                </p>
              </div>
              <div className="npk-item">
                <h4>Phosphorous (P)</h4>
                <p>Value: {plot.npk_levels.P}</p>
                <p>Status: {getNPKStatus(plot.npk_levels.P, "Phosphorous")}</p>
                <p>
                  {getNPKStatus(plot.npk_levels.P, "Phosphorous") === "Good"
                    ? "Phosphorous levels are optimal for root development."
                    : getNPKStatus(plot.npk_levels.P, "Phosphorous") ===
                      "Average"
                    ? "Phosphorous levels are moderate. Consider adding bone meal."
                    : "Phosphorous levels are low. Add phosphorous-rich fertilizers."}
                </p>
              </div>
              <div className="npk-item">
                <h4>Potassium (K)</h4>
                <p>Value: {plot.npk_levels.K}</p>
                <p>Status: {getNPKStatus(plot.npk_levels.K, "Potassium")}</p>
                <p>
                  {getNPKStatus(plot.npk_levels.K, "Potassium") === "Good"
                    ? "Potassium levels are optimal for overall plant health."
                    : getNPKStatus(plot.npk_levels.K, "Potassium") === "Average"
                    ? "Potassium levels are moderate. Consider adding wood ash."
                    : "Potassium levels are low. Add potassium-rich fertilizers."}
                </p>
              </div>
            </div>
          </div>

          {/* <div className="t-card div10 disease-prediction">
            <h3>Disease Prediction</h3>
            <div className="input-container">
              <input
                type="file"
                accept="image/*"
                id="disease-image"
                onChange={handleFileChange}
              />
              <label htmlFor="disease-image" className="upload-label">
                <i className="fa-solid fa-upload"></i> Upload Image
              </label>
            </div>
            {diseaseImagePreview && (
              <div className="image-preview">
                <img src={diseaseImagePreview} alt="Disease Preview" />
              </div>
            )}
            <button className="predict-button" onClick={handlePredict}>
              Predict
            </button>
            <div className="result-area">
              <h4>Result:</h4>
              <p>{prediction}</p>
            </div>
            {uploadStatus && (
              <div className="upload-status">
                <p>{uploadStatus}</p>
                {uploadProgress > 0 && (
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            )}
          </div> */}
          {/* 
          <div className="t-card div11 insect-classification">
            <h3>Entomology Classification</h3>
            <div className="input-container">
              <input
                type="file"
                accept="image/*"
                id="insect-image"
                onChange={handleInsectFileChange}
              />
              <label htmlFor="insect-image" className="upload-label">
                <i className="fa-solid fa-upload"></i> Upload Image
              </label>
            </div>
            {insectImagePreview && (
              <div className="image-preview">
                <img src={insectImagePreview} alt="Insect Preview" />
              </div>
            )}
            <button className="predict-button" onClick={handleInsectPredict}>
              Classify
            </button>
            <div className="result-area">
              <h4>Result:</h4>
              <p>{insectPrediction}</p>
            </div>
            {insectUploadStatus && (
              <div className="upload-status">
                <p>{insectUploadStatus}</p>
                {insectUploadProgress > 0 && (
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${insectUploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            )}
          </div> */}
          {/* 
          <div className="t-card div12">
            <h3>Predicted Results</h3>
            {loadingResults ? (
              <div className="loading-results">
                <p>Analyzing results...</p>
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <div className="predicted-results">
                <div className="result-item">
                  <h4>Plant Disease:</h4>
                  {diseaseName && diseaseInfo ? (
                    <>
                      <p>
                        <strong>{diseaseName}</strong>
                      </p>
                      <p>{diseaseInfo}</p>
                    </>
                  ) : (
                    <p className="placeholder">
                      No disease prediction available
                    </p>
                  )}
                </div>
                <div className="result-item">
                  <h4>Insect in Plant:</h4>
                  {insectName && insectInfo ? (
                    <>
                      <p>
                        <strong>{insectName}</strong>
                      </p>
                      <p>{insectInfo}</p>
                    </>
                  ) : (
                    <p className="placeholder">
                      No insect classification available
                    </p>
                  )}
                </div>
              </div>
            )}
          </div> */}

          {/* <div className="t-card div13">
            <h3>Suggestions & Feedbacks</h3>
            {loadingResults ? ( */}
          {/* <div className="loading-results">
                <p>Generating recommendations...</p>
                <div className="loading-spinner"></div>
              </div> */}
          {/* ) : suggestions ? (
              <div className="suggestions">
                <div
                  dangerouslySetInnerHTML={{
                    __html: suggestions.replace(/\n/g, "<br/>"),
                  }}
                /> */}
          {/* </div>
            ) : (
              <div className="placeholder">
                <p>
                  Suggestions will appear here after both disease and insect
                  predictions are made.
                </p>
              </div>
            )}
          </div> */}

          {/* <Predictor /> */}
        </div>
      </div>
      {/*<center>
        <button className="continue-button" onClick={imageScope}>
          Continue
        </button>
        
      </center>*/}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          margin: "20px 0",
        }}
      >
        <button className="continue-button" onClick={imageScope}>
          Continue
        </button>
        <button className="continue-button" onClick={handleGisAnalysisClick}>
          Gis Analysis
        </button>
      </div>

      {/* <GenerateReport /> */}

      <div className="footer">
        <p>Agro zapp @ 2025</p>
      </div>
      <Chatbot />
    </>
  );
}
