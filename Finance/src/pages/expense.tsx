import { useState, useEffect, ChangeEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./expense.css";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface Expense {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: string;
  userEmail?: string;
  expenseType: string;
}

interface ExpenseCategory {
  [key: string]: string[];
}

const ExpenseTracker = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [categorySearch, setCategorySearch] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const expenseType = location.pathname
    .split("/")
    .filter(Boolean)[1]
    .replace(/-/g, " ")
    .toLowerCase();

  // Capitalize first letter of each word for display
  const capitalizedExpenseType = expenseType
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Complete expense categories with all options
  const expenseCategories: ExpenseCategory = {
    "business": [
      // Office Expenses
      "Office Supplies", "Office Furniture", "Office Equipment", "Printing & Stationery",
      "Office Snacks", "Office Maintenance", "Office Decoration", "Office Security",
      
      // Technology
      "Software Subscriptions", "Hardware", "IT Services", "Cloud Services",
      "Cybersecurity", "Tech Support", "Website Expenses", "Mobile Apps",
      
      // Marketing & Sales
      "Advertising", "Digital Marketing", "Print Marketing", "Social Media Marketing",
      "Event Marketing", "Trade Shows", "PR Expenses", "Sales Materials",
      
      // Professional Services
      "Legal Services", "Accounting Services", "Consulting Fees", "Professional Training",
      "Recruitment", "Background Checks", "Payroll Services", "HR Services",
      
      // Travel & Transportation
      "Business Travel", "Client Meetings", "Conference Expenses", "Vehicle Expenses",
      "Fuel", "Parking", "Travel Insurance", "Accommodation",
      
      // Utilities & Services
      "Electricity", "Water", "Internet", "Phone Services",
      "Cleaning Services", "Waste Management", "Security Services", "Insurance",
      
      // Financial
      "Bank Charges", "Transaction Fees", "Loan Payments", "Credit Card Fees",
      "Investment Expenses", "Tax Payments", "Financial Advisory", "Currency Exchange",
      
      // Additional Business Categories
      "Research & Development", "Patents & Trademarks", "Employee Benefits",
      "Team Building", "Office Rent", "Business Insurance", "Business Licenses",
      "Membership Fees", "Subscriptions", "Equipment Rental", "Maintenance & Repairs",
      "Business Meals", "Client Entertainment", "Office Utilities", "Shipping & Postage"
    ],
    
    "personal": [
      // Food & Dining
      "Groceries", "Restaurants", "Fast Food", "Coffee Shops",
      "Food Delivery", "Specialty Foods", "Alcohol & Bars", "Snacks",
      
      // Housing
      "Rent/Mortgage", "Property Tax", "Home Insurance", "Home Maintenance",
      "Home Improvement", "Furniture", "Home Decor", "Cleaning Supplies",
      
      // Transportation
      "Public Transport", "Car Payment", "Car Insurance", "Fuel",
      "Car Maintenance", "Parking", "Ride Sharing", "Bicycle Expenses",
      
      // Health & Wellness
      "Health Insurance", "Doctor Visits", "Medications", "Dental Care",
      "Vision Care", "Gym Membership", "Sports Equipment", "Wellness Products",
      
      // Entertainment
      "Movies", "Games", "Books", "Music",
      "Streaming Services", "Concerts", "Sports Events", "Hobbies",
      
      // Shopping
      "Clothing", "Electronics", "Personal Care", "Home Goods",
      "Gifts", "Apps & Software", "Online Subscriptions", "Beauty Products",
      
      // Education
      "Tuition", "Books & Supplies", "Online Courses", "Training Programs",
      "Professional Development", "Language Learning", "Educational Apps", "School Activities",
      
      // Additional Personal Categories
      "Pet Care", "Child Care", "Family Activities", "Vacation & Travel",
      "Emergency Fund", "Savings", "Investments", "Charitable Donations",
      "Personal Loans", "Credit Card Payments", "Bank Fees", "Tax Preparation",
      "Life Insurance", "Identity Protection", "Legal Services", "Personal Gifts"
    ],
    
    "daily": [
      // Food & Beverages
      "Breakfast", "Lunch", "Dinner", "Coffee/Tea",
      "Snacks", "Beverages", "Street Food", "Restaurant Meals",
      
      // Transportation
      "Bus Fare", "Train Fare", "Taxi", "Fuel",
      "Parking", "Bike Sharing", "Car Sharing", "Metro Pass",
      
      // Personal Care
      "Toiletries", "Hygiene Products", "Cosmetics", "Hair Care",
      "Skin Care", "Personal Grooming", "Health Supplies", "Medications",
      
      // Work-Related
      "Office Lunch", "Work Supplies", "Printing", "Coffee Breaks",
      "Meeting Expenses", "Work Transport", "Work Snacks", "Office Equipment",
      
      // Entertainment
      "Daily News", "Magazine", "Quick Games", "Music Services",
      "Video Content", "Social Activities", "Quick Hobbies", "Entertainment Apps",
      
      // Shopping
      "Convenience Store", "Quick Shopping", "Daily Necessities", "Small Purchases",
      "Daily Subscriptions", "Quick Services", "Impulse Buys", "Daily Deals",
      
      // Miscellaneous Daily
      "Tips", "Small Gifts", "Daily Services", "Quick Repairs",
      "Vending Machines", "ATM Fees", "Small Donations", "Daily Subscriptions",
      
      // Additional Daily Categories
      "Daily Parking", "Toll Charges", "Quick Snacks", "Water Refills",
      "Phone Credits", "Quick Prints", "Small Tools", "Daily Maintenance",
      "Quick Repairs", "Daily Supplies", "Small Electronics", "Quick Services"
    ],
    
    "full": [
      // Combined Categories
      "Housing & Utilities", "Transportation", "Food & Dining", "Health & Medical",
      "Personal Care", "Entertainment", "Shopping", "Education & Training",
      "Business Services", "Professional Fees", "Insurance", "Investments",
      "Debt Payments", "Charitable Giving", "Travel & Vacation", "Family Expenses",
      "Pet Care", "Hobbies & Recreation", "Gifts & Donations", "Emergency Fund",
      
      // Additional Full Categories
      "Savings Goals", "Retirement Planning", "Tax Payments", "Legal Services",
      "Financial Services", "Vehicle Expenses", "Home Improvement", "Technology",
      "Subscriptions", "Membership Fees", "Professional Development", "Office Expenses",
      "Marketing & Advertising", "Equipment & Supplies", "Maintenance & Repairs",
      "Miscellaneous Expenses", "Bank Charges", "Credit Card Fees", "Loan Payments",
      "Investment Properties"
    ]
  };

  // Get filtered suggestions based on search input
  const getFilteredSuggestions = (): string[] => {
    const currentCategories = expenseCategories[expenseType.split(" ")[0]] || expenseCategories.full;
    if (!categorySearch) return currentCategories;
    
    return currentCategories.filter(cat => 
      cat.toLowerCase().includes(categorySearch.toLowerCase())
    );
  };

  // Handle category selection
  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setCategorySearch(selectedCategory);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("userEmail");

    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setUserEmail(storedEmail);

    // Clear existing expenses when component mounts or expense type changes
    setExpenses([]);
    fetchExpenses();
  }, [expenseType]);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://duhacks-p6t6.onrender.com/api/expenses/${encodeURIComponent(expenseType)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        // Set fresh expenses from the server
        setExpenses(response.data.expenses);
      }
    } catch (err) {
      console.error("Failed to fetch expenses:", (err as Error).message);
    }
  };

  const addExpense = async () => {
    if (!amount || !category || !description || !date) {
      alert("Please fill all fields");
      return;
    }

    const newExpense = {
      id: Date.now(),
      amount: parseFloat(amount),
      category,
      description,
      date,
      userEmail,
      expenseType,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://duhacks-p6t6.onrender.com/api/expenses",
        {
          expenses: [newExpense],
          username,
          userEmail,
          expenseType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Fetch fresh expenses instead of appending
        await fetchExpenses();
        setAmount("");
        setCategory("");
        setDescription("");
        setDate("");
        setCategorySearch("");
        console.log("Expense added successfully");
      }
    } catch (err) {
      console.error("Expense addition failed:", (err as Error).message);
    }
  };

  const getTotalExpense = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const handleDelete = async (expenseId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `https://duhacks-p6t6.onrender.com/api/expenses/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.success) {
        await fetchExpenses(); // Refresh the expense list
        console.log("Expense deleted successfully");
      }
    } catch (err) {
      console.error("Failed to delete expense:", (err as Error).message);
    }
  };

  const submitForAnalysis = async (expenseType: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://duhacks-p6t6.onrender.com/api/expenses/analysis",
        {
          username,
          userEmail,
          expenseType,
          expenses: expenses.map((expense) => ({
            ...expense,
            userEmail,
            expenseType,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(`/analysis/${expenseType}`);
    } catch (error) {
      console.error("Error submitting data:", (error as Error).message);
    }
  };

  return (
    <div className="expense-container">
      <motion.nav 
        className="navbar"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="title text-transform-capitalize"
          whileHover={{ scale: 1.05 }}
          style={{ textTransform: 'capitalize' }}
        >
          {capitalizedExpenseType} Expenses
        </motion.h1>
        <span className="username">Welcome, {username}</span>
        <motion.button 
          className="back-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            window.history.back();
            setExpenses([]); // Clear expenses when navigating back
          }}
        >
          ← Go Back
        </motion.button>
      </motion.nav>

      <div className="expense-content">
        <motion.div 
          className="expense-form"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 style={{ textTransform: 'capitalize' }}>Add {capitalizedExpenseType} Expense</h2>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="number"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
            className="form-input"
          />
          
          <div className="category-search-container">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Search Category..."
              value={categorySearch}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setCategorySearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="form-input"
            />
            
            <AnimatePresence>
              {showSuggestions && (
                <motion.div 
                  className="category-suggestions"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {getFilteredSuggestions().map((suggestion) => (
                    <motion.div
                      key={suggestion}
                      className="suggestion-item"
                      onClick={() => handleCategorySelect(suggestion)}
                      whileHover={{ backgroundColor: '#f0f0f0' }}
                    >
                      {suggestion}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addExpense}
            className="add-expense-button"
          >
            Add Expense
          </motion.button>
        </motion.div>

        <motion.div 
          className="expense-list"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 style={{ textTransform: 'capitalize' }}>{capitalizedExpenseType} Expense List</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount (₹)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense, index) => (
                  <motion.tr 
                    key={expense.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <td>{expense.date}</td>
                    <td>{expense.category}</td>
                    <td>{expense.description}</td>
                    <td>₹{expense.amount.toFixed(2)}</td>
                    <td>
                      <motion.button
                        className="delete-button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(expense.id)}
                      >
                        Delete
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <motion.div 
            className="total-expense"
            whileHover={{ scale: 1.05 }}
          >
            <h3 style={{ textTransform: 'capitalize' }}>Total {capitalizedExpenseType} Expenses: ₹{getTotalExpense().toFixed(2)}</h3>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div className="action-buttons">
        <NavLink to={`/analysis/${expenseType}`}>
          <motion.button
            className="analysis-button"
            whileHover={{ scale: 1.05, backgroundColor: "#003d82" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => submitForAnalysis(expenseType)}
          >
            Analyze Expenses
          </motion.button>
        </NavLink>
                </motion.div>
      {/* Add a filter section */}
      <motion.div 
        className="filter-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3>Filters</h3>
        <div className="filter-options">
          <select 
            onChange={(e) => {
              const sortedExpenses = [...expenses];
              switch(e.target.value) {
                case "date-asc":
                  sortedExpenses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                  break;
                case "date-desc":
                  sortedExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                  break;
                case "amount-asc":
                  sortedExpenses.sort((a, b) => a.amount - b.amount);
                  break;
                case "amount-desc":
                  sortedExpenses.sort((a, b) => b.amount - a.amount);
                  break;
              }
              setExpenses(sortedExpenses);
            }}
          >
            <option value="">Sort By</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="date-desc">Date (Newest First)</option>
            <option value="amount-asc">Amount (Low to High)</option>
            <option value="amount-desc">Amount (High to Low)</option>
          </select>

          <input 
            type="text"
            placeholder="Search descriptions..."
            onChange={(e) => {
              const searchTerm = e.target.value.toLowerCase();
              fetchExpenses().then(() => {
                setExpenses(prev => 
                  prev.filter(expense => 
                    expense.description.toLowerCase().includes(searchTerm) ||
                    expense.category.toLowerCase().includes(searchTerm)
                  )
                );
              });
            }}
            className="search-input"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ExpenseTracker;