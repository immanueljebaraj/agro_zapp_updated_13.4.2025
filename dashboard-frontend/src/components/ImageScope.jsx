import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./ImageScope.css";

const ImageScope = () => {
  // Refs
  const imageContainerRef = useRef(null);
  const scopeRef = useRef(null);
  const imgElementRef = useRef(null);
  const fileInputRef = useRef(null);

  // State
  const [scopePosition, setScopePosition] = useState({ x: 100, y: 100 });
  const [capturedImages, setCapturedImages] = useState([]);
  const [selectedImageType, setSelectedImageType] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [scopeSize, setScopeSize] = useState(200);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("captures");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Prediction States
  const [diseasePrediction, setDiseasePrediction] = useState("");
  const [insectPrediction, setInsectPrediction] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [insectUploadStatus, setInsectUploadStatus] = useState("");
  const [insectUploadProgress, setInsectUploadProgress] = useState(0);

  // Groq Result States
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [insectInfo, setInsectInfo] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [diseaseName, setDiseaseName] = useState("");
  const [insectName, setInsectName] = useState("");

  // Configuration
  const plantImageUrl = "/farm.png";
  const imageTypes = [
    { id: "type1", label: "Plant", icon: "🌱" },
    { id: "type2", label: "Pest", icon: "🐛" },
  ];

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setScopeSize(mobile ? 150 : 200);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Groq API Functions
  const fetchDiseaseInfo = async (disease) => {
    try {
      setLoadingResults(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/ollama/ask-groq/",
        {
          question: `My tomato plant is affected by ${diseasePrediction
            .replace("Strawberry___", "Tomato___")
            .replace(
              /_/g,
              " "
            )} so give a short report about it in about 50 words.`,
        }
      );
      setDiseaseInfo(response.data.response);
      setDiseaseName(disease);
    } catch (error) {
      console.error("Error fetching disease info:", error);
      setDiseaseInfo(
        `Could not fetch information about ${diseasePrediction
          .replace("Strawberry___", "Tomato___")
          .replace(/_/g, " ")}.`
      );
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
          question: `My tomato plant is affected by ${insect} pests so give a short report about it in about 50 words.`,
        }
      );
      setInsectInfo(response.data.response);
      setInsectName(insect);
    } catch (error) {
      console.error("Error fetching insect info:", error);
      setInsectInfo(`Could not fetch information about ${insect}.`);
    } finally {
      setLoadingResults(false);
    }
  };

  const fetchSuggestions = async (disease, insect) => {
    try {
      setLoadingResults(true);
      setSuggestions(null);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/ollama/ask-groq/",
        {
          question: `Provide specific integrated treatment recommendations for managing both ${diseasePrediction
            .replace("Strawberry___", "Tomato___")
            .replace(/_/g, " ")} and ${insect} in tomato plants. 
          Include:
          1. Immediate actions
          2. Fertilizer and Pesticide recommendation
          3. Organic treatment options
          4. Chemical options (if needed)
          
          Format as clear points with no more than 260 words.`,
        }
      );

      if (response.data && response.data.response) {
        setSuggestions(response.data.response);
      } else {
        setSuggestions("No recommendations available at this time.");
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions(
        "Could not fetch recommendations. Please try again later."
      );
    } finally {
      setLoadingResults(false);
    }
  };

  // Scope Movement
  const moveScope = (direction) => {
    const step = isMobile ? 15 : 20;
    const newPosition = { ...scopePosition };
    const container = imageContainerRef.current;
    const scope = scopeRef.current;

    if (!container || !scope) return;

    switch (direction) {
      case "up":
        newPosition.y = Math.max(0, newPosition.y - step);
        break;
      case "down":
        newPosition.y = Math.min(
          container.clientHeight - scope.offsetHeight,
          newPosition.y + step
        );
        break;
      case "left":
        newPosition.x = Math.max(0, newPosition.x - step);
        break;
      case "right":
        newPosition.x = Math.min(
          container.clientWidth - scope.offsetWidth,
          newPosition.x + step
        );
        break;
      default:
        break;
    }
    setScopePosition(newPosition);
  };

  // Image Capture
  const captureImage = () => {
    if (
      !imageLoaded ||
      !imgElementRef.current ||
      !scopeRef.current ||
      !selectedImageType
    )
      return;

    const existingImage = capturedImages.find(
      (img) => img.type === selectedImageType
    );
    if (existingImage) return setShowWarning(true);

    const img = imgElementRef.current;
    const scope = scopeRef.current;
    const imgRect = img.getBoundingClientRect();
    const scopeRect = scope.getBoundingClientRect();

    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;
    const x = (scopeRect.left - imgRect.left) * scaleX;
    const y = (scopeRect.top - imgRect.top) * scaleY;
    const width = scope.offsetWidth * scaleX;
    const height = scope.offsetHeight * scaleY;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

    setCapturedImages((prev) => [
      ...prev,
      {
        id: Date.now(),
        url: canvas.toDataURL("image/png"),
        type: selectedImageType,
        label: imageTypes.find((t) => t.id === selectedImageType)?.label,
        icon: imageTypes.find((t) => t.id === selectedImageType)?.icon,
      },
    ]);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    if (!selectedImageType) {
      alert("Please select an image type first");
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    const existingImage = capturedImages.find(
      (img) => img.type === selectedImageType
    );
    if (existingImage) {
      setShowWarning(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedImages((prev) => [
        ...prev,
        {
          id: Date.now(),
          url: event.target.result,
          type: selectedImageType,
          label: imageTypes.find((t) => t.id === selectedImageType)?.label,
          icon: imageTypes.find((t) => t.id === selectedImageType)?.icon,
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  // Prediction Handlers
  const handleDiseasePredict = async (imageUrl) => {
    try {
      setUploadStatus("Uploading...");
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("image", blob, "plant_image.png");

      const { data } = await axios.post(
        "http://127.0.0.1:8000/api/plant/predict/",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
            setUploadStatus(`Uploading: ${percentCompleted}%`);
          },
        }
      );

      const prediction = data.prediction;
      setDiseasePrediction(prediction);
      setUploadStatus("Predicted successfully!");
      await fetchDiseaseInfo(prediction);
      return prediction;
    } catch (error) {
      console.error("Error predicting disease:", error);
      setDiseasePrediction("Error predicting disease.");
      setUploadStatus("Upload failed.");
      return null;
    }
  };

  const handleInsectPredict = async (imageUrl) => {
    try {
      setInsectUploadStatus("Uploading...");
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append("file", blob, "insect_image.png");

      const { data } = await axios.post(
        "http://127.0.0.1:8000/api/insect/predict/",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setInsectUploadProgress(percentCompleted);
            setInsectUploadStatus(`Uploading: ${percentCompleted}%`);
          },
        }
      );

      const prediction = data.class;
      setInsectPrediction(prediction);
      setInsectUploadStatus("Predicted successfully!");
      await fetchInsectInfo(prediction);
      return prediction;
    } catch (error) {
      console.error("Error classifying insect:", error);
      setInsectPrediction("Error classifying insect.");
      setInsectUploadStatus("Upload failed.");
      return null;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const plantImage = capturedImages.find((img) => img.type === "type1");
      const insectImage = capturedImages.find((img) => img.type === "type2");

      const diseasePred = plantImage
        ? await handleDiseasePredict(plantImage.url)
        : null;
      const insectPred = insectImage
        ? await handleInsectPredict(insectImage.url)
        : null;

      if (diseasePred || insectPred) {
        await fetchSuggestions(
          diseasePred || "No disease detected",
          insectPred || "No pests detected"
        );
      }
    } catch (error) {
      console.error("Error during analysis:", error);
    } finally {
      setIsSubmitting(false);
      setActiveTab("analysis");
    }
  };

  // Generate clip path for overlay
  const generateClipPath = () => {
    return `polygon(
      0% 0%, 0% 100%, ${scopePosition.x}px 100%, 
      ${scopePosition.x}px ${scopePosition.y}px, 
      ${scopePosition.x + scopeSize}px ${scopePosition.y}px, 
      ${scopePosition.x + scopeSize}px ${scopePosition.y + scopeSize}px, 
      ${scopePosition.x}px ${scopePosition.y + scopeSize}px, 
      ${scopePosition.x}px 100%, 100% 100%, 100% 0%
    )`;
  };

  const removeImage = (id) => {
    setCapturedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const Predictor = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const [weatherPrediction, setWeatherPrediction] = useState("");
    const [fertilizerSuggestion, setFertilizerSuggestion] = useState("");

    const handleDateSubmit = async () => {
      if (!selectedDate) {
        alert("Please select a date.");
        return;
      }

      try {
        const API_KEY = "92abd0d592ed4d91a7212745252303";
        const response = await axios.get(
          "https://api.weatherapi.com/v1/forecast.json",
          {
            params: {
              key: API_KEY,
              q: "Hyderabad",
              dt: selectedDate,
            },
          }
        );

        const weatherData = response.data.forecast.forecastday[0].day;
        const weatherDescription = weatherData.condition.text;
        const rain = weatherData.daily_will_it_rain === 1;

        setWeatherPrediction(
          `Weather on ${selectedDate}: ${weatherDescription}`
        );
        setFertilizerSuggestion(
          rain
            ? "Rain detected. Avoid using fertilizers and pesticides today."
            : "No rain detected. You can use fertilizers and pesticides."
        );
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setWeatherPrediction("Failed to fetch weather data. Please try again.");
        setFertilizerSuggestion("");
      }
    };

    return (
      <div className="predictor-container">
        <h3>Weather Predictor</h3>
        <div className="predictor-inputs">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
          <button onClick={handleDateSubmit} className="predictor-button">
            Check
          </button>
        </div>
        {weatherPrediction && (
          <div className="weather-result">
            <p>{weatherPrediction}</p>
            {fertilizerSuggestion && (
              <p className="suggestion">{fertilizerSuggestion}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="image-scope-app">
      <header className="app-header">
        <div className="header-content">
          <h1>🌱 Plant Health Analyzer</h1>
          <p>Capture and analyze plant diseases and pests with precision</p>
        </div>
      </header>

      <main className="app-main">
        <div className="content-grid">
          {/* Image Capture Section */}
          <section className="capture-panel">
            <div className="image-viewer">
              <div className="image-container" ref={imageContainerRef}>
                {!imageLoaded && (
                  <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <p>Loading image...</p>
                  </div>
                )}
                <img
                  ref={imgElementRef}
                  src={plantImageUrl}
                  alt="Plant farm"
                  className="main-image"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(false)}
                  crossOrigin="anonymous"
                />
                <div
                  className="scope-overlay"
                  style={{ clipPath: generateClipPath() }}
                />
                <div
                  ref={scopeRef}
                  className="scope-view"
                  style={{
                    left: `${scopePosition.x}px`,
                    top: `${scopePosition.y}px`,
                    width: `${scopeSize}px`,
                    height: `${scopeSize}px`,
                  }}
                />
              </div>

              <div className="capture-controls">
                <div className="type-selector">
                  <h3>Capture Target</h3>
                  <div className="type-buttons">
                    {imageTypes.map((type) => (
                      <button
                        key={type.id}
                        className={`type-btn ${
                          selectedImageType === type.id ? "active" : ""
                        }`}
                        onClick={() => setSelectedImageType(type.id)}
                      >
                        <span className="type-icon">{type.icon}</span>
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="scope-controller">
                  <div className="controller">
                    <button
                      className="control-btn up"
                      onClick={() => moveScope("up")}
                      aria-label="Move scope up"
                    >
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path d="M12 4l-8 8h5v8h6v-8h5z" fill="currentColor" />
                      </svg>
                    </button>
                    <button
                      className="control-btn left"
                      onClick={() => moveScope("left")}
                      aria-label="Move scope left"
                    >
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path d="M4 12l8-8v5h8v6h-8v5z" fill="currentColor" />
                      </svg>
                    </button>
                    <div className="control-center" />
                    <button
                      className="control-btn right"
                      onClick={() => moveScope("right")}
                      aria-label="Move scope right"
                    >
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path
                          d="M20 12l-8 8v-5H4v-6h8V4z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                    <button
                      className="control-btn down"
                      onClick={() => moveScope("down")}
                      aria-label="Move scope down"
                    >
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path d="M12 20l8-8h-5V4h-6v8H4z" fill="currentColor" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    className="capture-btn"
                    onClick={captureImage}
                    disabled={!selectedImageType}
                    aria-label="Capture image"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path
                        d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm8.94-3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
                        fill="currentColor"
                      />
                    </svg>
                    Capture
                  </button>
                  <button
                    className="upload-btn"
                    onClick={() => fileInputRef.current.click()}
                    disabled={!selectedImageType}
                    aria-label="Upload image"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path
                        d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
                        fill="currentColor"
                      />
                    </svg>
                    Upload
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>

            {/* Weather Predictor */}
            <Predictor />
          </section>

          {/* Results Section */}
          <section className="results-panel">
            <div className="results-tabs">
              <button
                className={`tab ${activeTab === "captures" ? "active" : ""}`}
                onClick={() => setActiveTab("captures")}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  className="tab-icon"
                >
                  <path
                    d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                    fill="currentColor"
                  />
                </svg>
                Captures
              </button>
              <button
                className={`tab ${activeTab === "analysis" ? "active" : ""}`}
                onClick={() => setActiveTab("analysis")}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  className="tab-icon"
                >
                  <path d="M16 8l-8 8-1.41-1.41L16 8z" fill="currentColor" />
                </svg>
                Analysis
              </button>
            </div>

            <div className="results-content">
              {activeTab === "captures" ? (
                <div className="captures-view">
                  <div className="capture-previews">
                    {imageTypes.map((type) => {
                      const capturedImage = capturedImages.find(
                        (img) => img.type === type.id
                      );
                      return (
                        <div key={type.id} className="preview-card">
                          <div className="card-header">
                            <h3>
                              <span className="type-icon">{type.icon}</span>
                              {type.label}
                            </h3>
                            {capturedImage && (
                              <button
                                className="remove-btn"
                                onClick={() => removeImage(capturedImage.id)}
                                aria-label={`Remove ${type.label} image`}
                              >
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                  <path
                                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                          <div className="card-content">
                            {capturedImage ? (
                              <div className="image-wrapper">
                                <img
                                  src={capturedImage.url}
                                  alt={`Captured ${type.label}`}
                                />
                              </div>
                            ) : (
                              <div className="empty-state">
                                <svg viewBox="0 0 24 24" width="40" height="40">
                                  <path
                                    d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
                                    fill="currentColor"
                                    opacity="0.3"
                                  />
                                </svg>
                                <p>No image captured</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    className="analyze-btn"
                    onClick={handleSubmit}
                    disabled={
                      capturedImages.length < imageTypes.length || isSubmitting
                    }
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="spinner" viewBox="0 0 50 50">
                          <circle
                            cx="25"
                            cy="25"
                            r="20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="5"
                          ></circle>
                        </svg>
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Images"
                    )}
                  </button>
                </div>
              ) : (
                <div className="analysis-view">
                  <div className="analysis-grid">
                    {/* Prediction Results */}
                    <div className="prediction-box disease-result">
                      <h3>
                        <span className="icon">🌿</span> Plant Disease
                      </h3>
                      <div className="result-content">
                        {diseasePrediction ? (
                          <div className="prediction-value">
                            {diseasePrediction
                              .replace("Strawberry___", "Tomato___")
                              .replace(/_/g, " ")}
                          </div>
                        ) : (
                          <div className="empty-state">
                            <p>No disease prediction available</p>
                          </div>
                        )}
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
                    </div>

                    <div className="prediction-box pest-result">
                      <h3>
                        <span className="icon">🐞</span> Pest Detection
                      </h3>
                      <div className="result-content">
                        {insectPrediction ? (
                          <div className="prediction-value">
                            {insectPrediction}
                          </div>
                        ) : (
                          <div className="empty-state">
                            <p>No pest classification available</p>
                          </div>
                        )}
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
                    </div>

                    {/* Detailed Report */}
                    <div className="report-box">
                      <h3>
                        <span className="icon">📋</span> Detailed Report
                      </h3>
                      <div className="report-content">
                        <div className="report-section">
                          <h4>Plant Disease</h4>
                          <div className="report-details">
                            <p>
                              <strong>Host Plant:</strong> Tomato
                            </p>
                            <p>
                              <strong>Prediction:</strong>{" "}
                              {diseasePrediction ? "Positive" : "Negative"}
                            </p>
                            <p>
                              <strong>Recommendation:</strong>{" "}
                              {diseaseInfo || "No recommendations available"}
                            </p>
                          </div>
                        </div>

                        <div className="report-section">
                          <h4>Pest Diagnosis</h4>
                          <div className="report-details">
                            <p>
                              <strong>Crop:</strong> Tomato
                            </p>
                            <p>
                              <strong>Predicted Pest:</strong>{" "}
                              {insectPrediction || "Not detected"}
                            </p>
                            <p>
                              <strong>Observation:</strong>{" "}
                              {insectPrediction
                                ? "Leaf damage detected"
                                : "No signs of pests"}
                            </p>
                            <p>
                              <strong>Recommendation:</strong>{" "}
                              {insectInfo || "No recommendations available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div className="recommendations-box">
                      <h3>
                        <span className="icon">💡</span> Treatment Plan
                      </h3>
                      <div className="recommendations-content">
                        {loadingResults ? (
                          <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Generating recommendations...</p>
                          </div>
                        ) : suggestions ? (
                          <div className="recommendation-list">
                            {suggestions.split("\n").map((item, index) => (
                              <p key={index}>{item}</p>
                            ))}
                          </div>
                        ) : (
                          <div className="placeholder-instructions">
                            {diseasePrediction && insectPrediction ? (
                              <p>
                                Recommendations are being generated. Please
                                wait...
                              </p>
                            ) : (
                              <>
                                <p>
                                  Complete analysis of both plant and pest to
                                  get recommendations.
                                </p>
                                <div className="missing-analysis">
                                  <p>Missing analysis:</p>
                                  <ul>
                                    {!diseasePrediction && (
                                      <li>Plant disease analysis</li>
                                    )}
                                    {!insectPrediction && (
                                      <li>Pest identification</li>
                                    )}
                                  </ul>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Warning Modal */}
      {showWarning && (
        <div className="warning-modal">
          <div className="modal-content">
            <h3>⚠️ Warning</h3>
            <p>
              An image of this type already exists. Please remove it before
              capturing a new one.
            </p>
            <button
              className="modal-close-btn"
              onClick={() => setShowWarning(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageScope;
