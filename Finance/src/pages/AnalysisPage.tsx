import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import "./AnalysisPage.css";
// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AnalysisData {
  _id: string; // Category
  totalAmount: number;
  count: number;
}

const AnalysisPage = () => {
  const { expenseType } = useParams<{ expenseType: string }>();
  const [analysisData, setAnalysisData] = useState<AnalysisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<"bar" | "line" | "pie">("bar"); // State for active chart
  const navigate = useNavigate();

  // Handle undefined expenseType
  if (!expenseType) {
    return (
      <div className="analysis-container">
        <h1>Error: Expense Type Not Found</h1>
        <p>Please go back to the dashboard and try again.</p>
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  useEffect(() => {
    const fetchAnalysisData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No auth token found");
        }

        const response = await axios.get(
          `https://duhacks-p6t6.onrender.com/api/expenses/analysis/${encodeURIComponent(expenseType)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setAnalysisData(response.data.analysis);
          generateInsights(response.data.analysis); // Generate AI insights
        } else {
          throw new Error("Failed to fetch analysis data");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch analysis data";
        console.error("Failed to fetch analysis data:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [expenseType]);

  const generateInsights = async (data: AnalysisData[]) => {
    try {
      setInsightsLoading(true);
      // Prepare data for AI analysis
      const categories = data.map((item) => item._id);
      const amounts = data.map((item) => item.totalAmount);
  
      // Call the backend endpoint
      const response = await axios.post(
        "https://duhacks-p6t6.onrender.com/api/generate-insights", // Backend endpoint
        { categories, amounts },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      // Extract the generated insights and process them
      const rawInsights = response.data.insights;
      // Parse insights into array, clean unwanted content and format each point
      const cleanedInsights = rawInsights
        .split("\n")
        .filter((line: string) => 
          line.trim() !== "" && 
          !line.includes("Let me know if you would like") &&
          !line.includes("Here's an analysis") &&
          !line.includes("Based on the expense data")
        )
        .map((line: string) => line.trim());
      
      setInsights(cleanedInsights);
    } catch (err) {
      console.error("Error generating insights:", err);
      setInsights(["Unable to generate insights at this time."]);
    } finally {
      setInsightsLoading(false);
    }
  };

  // Generate random colors for each category
  const generateColors = (count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      colors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
    }
    return colors;
  };

  // Data for Bar Chart
  const barChartData = {
    labels: analysisData.map((item) => item._id),
    datasets: [
      {
        label: "Total Amount",
        data: analysisData.map((item) => item.totalAmount),
        backgroundColor: generateColors(analysisData.length), // Unique colors for each category
        borderColor: analysisData.map(() => "rgba(0, 0, 0, 1)"), // Black borders
        borderWidth: 1,
      },
    ],
  };

  // Data for Line Chart
  const lineChartData = {
    labels: analysisData.map((item) => item._id),
    datasets: [
      {
        label: "Total Amount",
        data: analysisData.map((item) => item.totalAmount),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  // Data for Pie Chart
  const pieChartData = {
    labels: analysisData.map((item) => item._id),
    datasets: [
      {
        label: "Total Amount",
        data: analysisData.map((item) => item.totalAmount),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Common chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Expense Analysis for ${expenseType}`,
      },
    },
  };

  return (
    <div className="div">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>Cost-Sage</h1>
        </div>
        <div className="navbar-links">
          <button className="back-button" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </nav>
      <div className="analysis-container">
        <h1>Expense Analysis: {expenseType}</h1>

        {loading && <p>Loading analysis data...</p>}
        {error && <p className="error-message">Error: {error}</p>}

        {!loading && !error && (
          <>
            {/* Tabs for Chart Selection */}
            <div className="chart-tabs">
              <button
                className={`tab-button ${activeChart === "bar" ? "active" : ""}`}
                onClick={() => setActiveChart("bar")}
              >
                Bar Chart
              </button>
              <button
                className={`tab-button ${activeChart === "line" ? "active" : ""}`}
                onClick={() => setActiveChart("line")}
              >
                Line Chart
              </button>
              <button
                className={`tab-button ${activeChart === "pie" ? "active" : ""}`}
                onClick={() => setActiveChart("pie")}
              >
                Pie Chart
              </button>
            </div>

            {/* Render Active Chart */}
            <div className="chart-container">
              {activeChart === "bar" && <Bar data={barChartData} options={chartOptions} />}
              {activeChart === "line" && <Line data={lineChartData} options={chartOptions} />}
              {activeChart === "pie" && <Pie data={pieChartData} options={chartOptions} />}
            </div>

            {/* Improved AI Insights Card */}
            <div className="insights-card">
              <div className="insights-header">
                <h2>AI Insights</h2>
                {insightsLoading && <div className="insights-loader">Processing data...</div>}
              </div>
              
              {!insightsLoading && insights.length > 0 ? (
                <div className="insights-content">
                  {insights.map((insight, index) => {
                    // Check if it's a numbered point
                    const isNumbered = /^\d+\./.test(insight);
                    
                    if (isNumbered) {
                      const [number, ...rest] = insight.split('.');
                      return (
                        <div key={index} className="insight-point">
                          <span className="insight-number">{number}.</span>
                          <span className="insight-text">{rest.join('.')}</span>
                        </div>
                      );
                    } else {
                      return (
                        <div key={index} className="insight-point">
                          <span className="insight-text">{insight}</span>
                        </div>
                      );
                    }
                  })}
                </div>
              ) : !insightsLoading ? (
                <div className="insights-empty">No insights available for this data.</div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;