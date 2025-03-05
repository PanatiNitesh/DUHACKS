import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChartLine, faCogs, faRocket, faShieldAlt, faSignInAlt, 
  faUsers, faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import "./Home.css";
import Footer from "./Footer";

const Home = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Renamed for clarity

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Toggle state
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1>Cost-Sage</h1>
          </Link>
        </div>
        <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="nav-menu">
            <a href="#features" className="nav-link" onClick={toggleMobileMenu}>Features</a>
            <a href="#faq" className="nav-link" onClick={toggleMobileMenu}>FAQ</a>
          </div>
          <button className="login-button" onClick={() => { navigate("/login"); toggleMobileMenu(); }}>
            <FontAwesomeIcon icon={faSignInAlt} /> Login
          </button>
          <button className="signup-button" onClick={() => { navigate("/register"); toggleMobileMenu(); }}>
            Sign Up
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span className={isMobileMenuOpen ? "bar open" : "bar"}></span>
          <span className={isMobileMenuOpen ? "bar open" : "bar"}></span>
          <span className={isMobileMenuOpen ? "bar open" : "bar"}></span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h2>Welcome to <span className="brand-highlight">Cost-Sage</span></h2>
          <p className="hero-subtitle">Your ultimate platform for cost-cutting strategies and AI-driven financial planning.</p>
          <div className="hero-buttons">
            <button className="get-started-button" onClick={() => navigate("/register")}>
              <FontAwesomeIcon icon={faRocket} /> Get Started
            </button>
            {/* <button className="demo-button" onClick={() => navigate("/demo")}>
              Watch Demo
            </button> */}
          </div>
        </div>
        {/* <div className="hero-image">
          <div className="dashboard-preview"></div>
        </div> */}
      </div>

      {/* Features Section */}
      <div id="features" className="features-section">
        <h3>Why Choose Cost-Sage?</h3>
        <div className="features-grid">
          <div className="feature">
            <FontAwesomeIcon icon={faChartLine} className="feature-icon" />
            <h4>AI-Powered Insights</h4>
            <p>Get actionable insights to optimize your spending and savings.</p>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faCogs} className="feature-icon" />
            <h4>Streamlined Workflows</h4>
            <p>Automate and simplify your financial processes.</p>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faShieldAlt} className="feature-icon" />
            <h4>Secure & Reliable</h4>
            <p>Your data is safe with our advanced security measures.</p>
          </div>
          <div className="feature">
            <FontAwesomeIcon icon={faUsers} className="feature-icon" />
            <h4>Collaborative Tools</h4>
            <p>Share insights with your team or family members.</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h3>How Cost-Sage Works</h3>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Sign Up</h4>
            <p>Create your account in less than 2 minutes</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>Connect Accounts</h4>
            <p>Securely link your financial data</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>Get Insights</h4>
            <p>Receive personalized recommendations</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h4>Save Money</h4>
            <p>Implement strategies and track progress</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div id="testimonials" className="testimonials-section">
        <h3>What Our Users Say</h3>
        <div className="testimonials-grid">
          <div className="testimonial">
            <div className="testimonial-content">
              <p>"Cost-Sage helped me save over $400 monthly on unnecessary expenses I didn't even know I had."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <h5>Sarah Johnson</h5>
                <p>Small Business Owner</p>
              </div>
            </div>
          </div>
          <div className="testimonial">
            <div className="testimonial-content">
              <p>"The AI recommendations were spot-on. I've completely transformed my financial habits."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar"></div>
              <div className="author-info">
                <h5>Michael Chen</h5>
                <p>Software Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <h3>Ready to Optimize Your Finances?</h3>
        <p>Join thousands of users who have transformed their financial future with Cost-Sage.</p>
        <button className="cta-button" onClick={() => navigate("/register")}>
          Start Your Free Trial
        </button>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="faq-section">
        <h3>Frequently Asked Questions</h3>
        <div className="faq-container">
          <div className="faq-item">
            <div className="faq-question">
              <FontAwesomeIcon icon={faQuestionCircle} />
              <h4>How does Cost-Sage protect my financial data?</h4>
            </div>
            <div className="faq-answer">
              <p>We use bank-level encryption and never store your account credentials. Our platform is SOC 2 compliant and regularly audited for security.</p>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-question">
              <FontAwesomeIcon icon={faQuestionCircle} />
              <h4>Can I use Cost-Sage for my business?</h4>
            </div>
            <div className="faq-answer">
              <p>Absolutely! We offer specialized business plans with features designed for expense management, budgeting, and financial forecasting for companies of all sizes.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;