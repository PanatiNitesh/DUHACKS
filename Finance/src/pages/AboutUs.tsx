import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import "./AboutUs.css"; // Import the CSS file

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <h1>About Us</h1>
      <p className="about-description">
        We are a passionate team of developers dedicated to building innovative solutions that make a difference. With a focus on collaboration and creativity, we strive to deliver high-quality products that solve real-world problems.
      </p>

      <div className="team-members">
        {/* Team Member 1 */}
        <div className="team-member">
          <img
src="public/assets/ravindra.jpg"            alt="Ravindra S"
            className="profile-pic" onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/150"; // Fallback image
              }}
          />
          <h2>Ravindra S</h2>
          <p className="role">Full Stack Developer</p>
          <p className="bio">
            Passionate about building scalable web applications and solving complex problems. Experienced in React, Node.js, and cloud technologies.
          </p>
          <div className="social-links">
            <a href="https://github.com/ravindraogg" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href="https://X.com/Ravindra_Og" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://linkedin.com/in/ravindra-dev" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>

        {/* Team Member 2 */}
        <div className="team-member">
          <img
src="public/assets/nitesh.jpg"             alt="Nitesh Reddy"
            className="profile-pic"
            onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/150"; // Fallback image
              }}
          />
          <h2>Nitesh Reddy</h2>
          <p className="role">Frontend Developer</p>
          <p className="bio">
            Enthusiastic about creating beautiful and responsive user interfaces. Skilled in React, TypeScript, and modern CSS frameworks.
          </p>
          <div className="social-links">
            <a href="https://github.com/PanatiNitesh" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} />
            </a>
            <a href="https://x.com/Nitesh_Reddy_" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://www.linkedin.com/in/nitesh-reddy-dev/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;