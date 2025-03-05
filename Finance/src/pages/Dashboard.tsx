import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

interface Expense {
  id: number;
  date: string;
  category: string;
  amount: number;
  description: string;
  expenseType: string;
}

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState(""); // Added username state
  const [, setUserEmail] = useState(""); // Keep userEmail for other functionality
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const expenseTypes = [
    {
      name: "Full Expense Tracker",
      img: "expense-tracker.png",
      description: "Track all your expenses in one place",
    },
    {
      name: "Business Expense Tracker",
      img: "business-expense.png",
      description: "Manage your business-related expenses",
    },
    {
      name: "Personal Expense Tracker",
      img: "personal-expense.png",
      description: "Keep track of your personal spending",
    },
    {
      name: "Daily Expense Tracker",
      img: "daily-expense.png",
      description: "Monitor your daily expenditures",
    },
    {
      name: "Other Expenses",
      img: "other-expenses.png",
      description: "Track miscellaneous expenses",
    },
  ];

  useEffect(() => {
    const init = async () => {
      const storedUsername = localStorage.getItem("username"); // Retrieve username
      const storedUserEmail = localStorage.getItem("userEmail"); // Retrieve userEmail

      if (storedUsername) {
        setUsername(storedUsername); // Set username
      }
      if (storedUserEmail) {
        setUserEmail(storedUserEmail); // Set userEmail
      }

      await fetchRecentExpenses();
    };
    init();
  }, []);

  const fetchRecentExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No auth token found");
      }

      const response = await axios.get("https://duhacks-p6t6.onrender.com/api/expenses/recent", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        console.log("Fetched expenses:", response.data.expenses);
        setExpenses(response.data.expenses);
      } else {
        throw new Error("Failed to fetch expenses");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch expenses";
      console.error("Failed to fetch expenses:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const goToExpenseTracker = (featureName: string) => {
    const formattedFeature = featureName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/expense/${formattedFeature}`);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No auth token found");
      }

      const response = await axios.post(
        "https://duhacks-p6t6.onrender.com/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Clear local storage and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userEmail");
        navigate("/");
      } else {
        throw new Error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to logout. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-left">
          <h1 className="website-name">Cost-Sage</h1>
        </div>
          <span className="username">Welcome, {username}</span>
        <div className="navbar-right">
          <button className="hamburger-button" onClick={toggleSidebar}>
            ☰
          </button>
        </div>
      </nav>

      <div className={`floating-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul className="sidebar-menu">
          {expenseTypes.map((feature) => (
            <li key={feature.name} onClick={() => goToExpenseTracker(feature.name)}>
              {feature.name}
            </li>
          ))}
          <li>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>

      <div className="main-section">
        <div className="feature-cards">
          {expenseTypes.map((feature) => (
            <div
              className="feature-card"
              key={feature.name}
              onClick={() => goToExpenseTracker(feature.name)}
            >
              <img src={feature.img} alt={feature.name} className="card-image" />
              <div className="card-content">
                <h2>{feature.name}</h2>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="recent-expenses">
          <h2>Recent Expenses Across All Categories</h2>
          <div className="expense-history">
            {loading && <p>Loading expenses...</p>}
            {error && <p className="error-message">Error: {error}</p>}
            {!loading && !error && expenses.length === 0 && (
              <p>No recent expenses found. Start adding expenses to see them here!</p>
            )}
            {!loading && !error && expenses.length > 0 && (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense, index) => (
                    <tr key={expense.id || index}>
                      <td>{formatDate(expense.date)}</td>
                      <td>{expense.category}</td>
                      <td>{expense.expenseType}</td>
                      <td>{expense.description}</td>
                      <td>₹{expense.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;