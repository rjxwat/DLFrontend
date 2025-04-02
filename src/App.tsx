import React, { useState } from "react";
import {
  Newspaper,
  Send,
  Save,
  RefreshCw,
  Loader2,
  Upload,
} from "lucide-react";
import logo from "./image.png"; // Import the image

interface PredictionResponse {
  category: string;
  text: string;
}

function App() {
  const [newsText, setNewsText] = useState("");
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const getCategoryColor = (category: string) => {
    const categories: Record<string, string> = {
      "World News": "#3B82F6", // Vibrant blue
      Sports: "#10B981", // Rich green
      Business: "#F59E0B", // Deep amber
      "Science/Tech": "#EC4899", // Bright pink
    };
    return categories[category] || "#3B82F6";
  };

  const API_BASE_URL = "https://c9ca-160-20-123-9.ngrok-free.app";

  const handlePredict = async (shouldSave: boolean = false) => {
    if (!newsText.trim()) {
      setError("Please enter some text to classify");
      return;
    }

    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const endpoint = shouldSave ? "/predict-and-log" : "/predict";
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newsText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get prediction");
      }

      const data = await response.json();
      setPrediction(data);
      if (shouldSave) {
        setSaved(true);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilePredict = async () => {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);
    setSaved(false);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${API_BASE_URL}/predict-file`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get prediction");
      }

      const data = await response.json();
      setPrediction(data);
      setSelectedFile(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setNewsText("");
    setPrediction(null);
    setError(null);
    setSaved(false);
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-indigo-100 via-blue-50 to-violet-100">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="text-center backdrop-blur-sm bg-white/80 p-8 rounded-xl shadow-xl mb-8 border border-blue-100 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-lg font-bold text-blue-600 mb-2">
            Department of Information Technology
          </h2>
          <h4 className="text-md font-semibold text-amber-600 mb-4">
            National Institute of Technology, Karnataka
          </h4>
          <h1 className="text-2xl font-bold text-indigo-800 mb-4">
            Deep Learning Course Project: Deep Learning-Based Algorithm for
            Classification of News Text
          </h1>
          <p className="text-gray-700 mb-2">
            Carried out by: Abhay Singh Rajput (221AI002) & Raghasai K
            (221AI032)
          </p>
          <p className="text-gray-600 text-sm">
            Session: January to April 2025
          </p>
        </header>

        {/* Main Content */}
        <div className="backdrop-blur-sm bg-white/80 rounded-xl shadow-xl p-8 mb-8 border border-blue-100">
          {/* Text Input */}
          <div className="mb-8">
            <textarea
              className="w-full min-h-[150px] p-6 border rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 border-blue-200 focus:ring-4 focus:ring-blue-200 focus:border-transparent placeholder-gray-500 transition-all duration-300 hover:shadow-md"
              placeholder="Enter your text here for classification..."
              value={newsText}
              onChange={(e) => setNewsText(e.target.value)}
            />
          </div>

          {/* File Upload Section */}
          <div className="mb-8 p-6 border rounded-xl backdrop-blur-sm bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-blue-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".txt"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-blue-500 file:to-blue-600 file:text-white hover:file:from-blue-600 hover:file:to-blue-700 file:transition-all file:duration-300"
              />
              <button
                onClick={handleFilePredict}
                disabled={loading || !selectedFile}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Upload size={20} />
                )}
                Upload & Predict
              </button>
            </div>
            {selectedFile && (
              <p className="mt-2 text-gray-600 text-sm">
                Selected file: {selectedFile.name}
              </p>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => handlePredict(false)}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
              Predict
            </button>
            <button
              onClick={() => handlePredict(true)}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              Predict & Save
            </button>
            <button
              onClick={handleClear}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              <RefreshCw size={20} />
              Clear
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-300 text-red-600 rounded">
              {error}
            </div>
          )}

          {/* Results Display */}
          {prediction && (
            <div className="backdrop-blur-sm bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-8 rounded-xl animate-fade-in border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-indigo-800">
                  Prediction Results
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: getCategoryColor(prediction.category) }}
                  >
                    {prediction.category}
                  </span>
                  {saved && (
                    <span className="bg-emerald-500 text-white text-sm px-2 py-1 rounded">
                      Saved to database
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300">
                <h4 className="text-sm font-semibold text-indigo-800 mb-2">
                  Classified Text
                </h4>
                <p className="text-gray-800">{prediction.text}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-indigo-800 backdrop-blur-sm bg-white/80 p-6 rounded-xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-center gap-2">
            <Newspaper size={20} className="text-blue-500" />
            <span>
              Powered by CNN-LSTM Model | Classifies into 4 categories
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
