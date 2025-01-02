import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLaptopCode, FaPalette, FaBullhorn, FaTools } from 'react-icons/fa';
import '../styles/homeStyles.css';

const Home = ({ user }) => {
  const internships = [
    {
      title: 'Web Development and Design',
      description: 'Learn to create beautiful and responsive websites using modern web technologies.',
      videoSrc: 'assets/web-dev.mp4',
      icon: <FaLaptopCode />,
    },
    {
      title: 'Graphic Design and Branding',
      description: 'Master the art of design and branding with practical projects.',
      videoSrc: 'assets/graphic-design.mp4',
      icon: <FaPalette />,
    },
    {
      title: 'Digital Marketing and SEO',
      description: 'Dive into digital marketing strategies and search engine optimization techniques.',
      videoSrc: 'assets/digital-marketing.mp4',
      icon: <FaBullhorn />,
    },
    {
      title: 'Technical Development and Support',
      description: 'Enhance your technical skills with hands-on development and support training.',
      videoSrc: 'assets/technical-support.mp4',
      icon: <FaTools />,
    },
  ];

  return (
    <>
      <header className="header">
        <h1>Welcome to the Internship Portal</h1>
        <nav>
          {!user ? (
            <>
              <Link to="/signup" className="nav-link">New User? Sign Up</Link>
              <Link to="/login" className="nav-link">Already have an account? Log In</Link>
            </>
          ) : (
            <>
              <Link to="/internship-form" className="nav-link">Register</Link>
              <Link to="/dashboard" className="dashboard-link">Already registered? Move to Dashboard</Link>
            </>
          )}
        </nav>
      </header>

      <section className="welcome-message">
        {!user ? (
          <p className="auth-message">Please log in or sign up to explore our internship opportunities.</p>
        ) : (
          <p className="auth-message">Welcome back! Explore the internships we offer below.</p>
        )}
      </section>

      {internships.map((internship, index) => (
        <InternshipItem key={index} internship={internship} index={index} />
      ))}
    </>
  );
};

const InternshipItem = ({ internship, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 500);

    return () => clearTimeout(timer);
  }, [index]);

  const videoAnimationClass = index % 2 === 0 ? 'slide-in-left' : 'slide-in-right';
  const infoAnimationClass = index % 2 === 0 ? 'slide-in-right' : 'slide-in-left';

  return (
    <section className={`internship-item ${isVisible ? 'visible' : ''}`}>
      {index % 2 === 0 ? (
        <>
          <div className={`video-section ${videoAnimationClass}`}>
            <video
              autoPlay
              loop
              muted
              src={internship.videoSrc}
              className="internship-video"
            />
          </div>
          <div className={`info-section ${infoAnimationClass}`}>
            <h2>
              {internship.icon}
              {internship.title}
            </h2>
            <p>{internship.description}</p>
          </div>
        </>
      ) : (
        <>
          <div className={`info-section ${infoAnimationClass}`}>
            <h2>
              {internship.icon}
              {internship.title}
            </h2>
            <p>{internship.description}</p>
          </div>
          <div className={`video-section ${videoAnimationClass}`}>
            <video
              autoPlay
              loop
              muted
              src={internship.videoSrc}
              className="internship-video"
            />
          </div>
        </>
      )}
    </section>
  );
};

export default Home;
