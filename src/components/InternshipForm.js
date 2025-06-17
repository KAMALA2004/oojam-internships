import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/internshipFormStyles.css';
import Header from '../components/Header';

const InternshipForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    gender: '',
    dob: '',
    email: '',
    phone_number: '',
    address: '',
    university_name: '',
    course_program: '',
    year_of_study: '',
    major: '',
    current_gpa: '',
    internship_area: '',
    internship_duration: '',
    start_date: '',
    internship_mode: '',
    relevant_skills: '',
    portfolio_links: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    terms_agreement: false,
  });

  const [files, setFiles] = useState({
    photo: null,
    resume: null,
    adhaar_card: null,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeSection, setActiveSection] = useState('personal');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prevFiles) => ({
      ...prevFiles,
      [name]: selectedFiles[0],
    }));
  };

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (!formData.full_name || !formData.email || !formData.terms_agreement) {
        setErrorMessage('Please fill out all required fields and agree to the terms.');
        return;
      }

      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }

      const formattedDob = formatDate(formData.dob);
      const formattedStartDate = formatDate(formData.start_date);

      // Simulate storing the data
      console.log('Form Submitted:', {
        ...formData,
        dob: formattedDob,
        start_date: formattedStartDate,
        photo: files.photo?.name,
        resume: files.resume?.name,
        adhaar_card: files.adhaar_card?.name,
      });

      setSuccessMessage('Registration successful!');
      localStorage.setItem('isRegistered', true);
      navigate('/dashboard');

      setFormData({
        full_name: '',
        gender: '',
        dob: '',
        email: '',
        phone_number: '',
        address: '',
        university_name: '',
        course_program: '',
        year_of_study: '',
        major: '',
        current_gpa: '',
        internship_area: '',
        internship_duration: '',
        start_date: '',
        internship_mode: '',
        relevant_skills: '',
        portfolio_links: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        terms_agreement: false,
      });
      setFiles({ photo: null, resume: null, adhaar_card: null });
    } catch (error) {
      console.error('Registration error:', error.message);
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'personal', title: 'Personal Information' },
    { id: 'education', title: 'Education Details' },
    { id: 'internship', title: 'Internship Preferences' },
    { id: 'documents', title: 'Documents Upload' },
    { id: 'review', title: 'Review & Submit' },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="+1234567890"
                />
              </div>
              
              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St, City, Country"
                />
              </div>
            </div>
          </div>
        );
        
      case 'education':
        return (
          <div className="form-section">
            <h3>Education Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>University Name</label>
                <input
                  type="text"
                  name="university_name"
                  value={formData.university_name}
                  onChange={handleChange}
                  placeholder="University of Example"
                />
              </div>
              
              <div className="form-group">
                <label>Course Program</label>
                <input
                  type="text"
                  name="course_program"
                  value={formData.course_program}
                  onChange={handleChange}
                  placeholder="Bachelor of Science"
                />
              </div>
              
              <div className="form-group">
                <label>Year of Study</label>
                <input
                  type="text"
                  name="year_of_study"
                  value={formData.year_of_study}
                  onChange={handleChange}
                  placeholder="3rd Year"
                />
              </div>
              
              <div className="form-group">
                <label>Major</label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  placeholder="Computer Science"
                />
              </div>
              
              <div className="form-group">
                <label>Current GPA</label>
                <input
                  type="text"
                  name="current_gpa"
                  value={formData.current_gpa}
                  onChange={handleChange}
                  placeholder="3.5"
                />
              </div>
              
              <div className="form-group full-width">
                <label>Relevant Skills</label>
                <textarea
                  name="relevant_skills"
                  value={formData.relevant_skills}
                  onChange={handleChange}
                  placeholder="List your relevant skills separated by commas"
                  rows="3"
                />
              </div>
              
              <div className="form-group full-width">
                <label>Portfolio Links</label>
                <input
                  type="text"
                  name="portfolio_links"
                  value={formData.portfolio_links}
                  onChange={handleChange}
                  placeholder="https://github.com/yourusername, https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>
          </div>
        );
        
      case 'internship':
        return (
          <div className="form-section">
            <h3>Internship Preferences</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Internship Area</label>
                <input
                  type="text"
                  name="internship_area"
                  value={formData.internship_area}
                  onChange={handleChange}
                  placeholder="Software Development"
                />
              </div>
              
              <div className="form-group">
                <label>Internship Duration</label>
                <input
                  type="text"
                  name="internship_duration"
                  value={formData.internship_duration}
                  onChange={handleChange}
                  placeholder="3 months"
                />
              </div>
              
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Internship Mode</label>
                <select
                  name="internship_mode"
                  value={formData.internship_mode}
                  onChange={handleChange}
                >
                  <option value="">Select Mode</option>
                  <option value="Online">Online</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Emergency Contact Name</label>
                <input
                  type="text"
                  name="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                />
              </div>
              
              <div className="form-group">
                <label>Emergency Contact Phone</label>
                <input
                  type="tel"
                  name="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={handleChange}
                  placeholder="+1234567890"
                />
              </div>
            </div>
          </div>
        );
        
      case 'documents':
        return (
          <div className="form-section">
            <h3>Documents Upload</h3>
            <div className="form-grid">
              <div className="form-group file-upload">
                <label>Upload Photo</label>
                <div className="file-input-container">
                  <input 
                    type="file" 
                    name="photo" 
                    id="photo" 
                    onChange={handleFileChange} 
                    className="file-input"
                  />
                  <label htmlFor="photo" className="file-label">
                    {files.photo ? files.photo.name : 'Choose file...'}
                  </label>
                </div>
              </div>
              
              <div className="form-group file-upload">
                <label>Upload Resume</label>
                <div className="file-input-container">
                  <input 
                    type="file" 
                    name="resume" 
                    id="resume" 
                    onChange={handleFileChange} 
                    className="file-input"
                  />
                  <label htmlFor="resume" className="file-label">
                    {files.resume ? files.resume.name : 'Choose file...'}
                  </label>
                </div>
              </div>
              
              <div className="form-group file-upload">
                <label>Upload Adhaar Card</label>
                <div className="file-input-container">
                  <input 
                    type="file" 
                    name="adhaar_card" 
                    id="adhaar_card" 
                    onChange={handleFileChange} 
                    className="file-input"
                  />
                  <label htmlFor="adhaar_card" className="file-label">
                    {files.adhaar_card ? files.adhaar_card.name : 'Choose file...'}
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'review':
        return (
          <div className="form-section">
            <h3>Review Your Information</h3>
            <div className="review-section">
              <h4>Personal Information</h4>
              <div className="review-grid">
                <div><strong>Full Name:</strong> {formData.full_name || 'Not provided'}</div>
                <div><strong>Gender:</strong> {formData.gender || 'Not provided'}</div>
                <div><strong>Date of Birth:</strong> {formData.dob || 'Not provided'}</div>
                <div><strong>Email:</strong> {formData.email || 'Not provided'}</div>
                <div><strong>Phone:</strong> {formData.phone_number || 'Not provided'}</div>
                <div><strong>Address:</strong> {formData.address || 'Not provided'}</div>
              </div>
              
              <h4>Education Details</h4>
              <div className="review-grid">
                <div><strong>University:</strong> {formData.university_name || 'Not provided'}</div>
                <div><strong>Course:</strong> {formData.course_program || 'Not provided'}</div>
                <div><strong>Year:</strong> {formData.year_of_study || 'Not provided'}</div>
                <div><strong>Major:</strong> {formData.major || 'Not provided'}</div>
                <div><strong>GPA:</strong> {formData.current_gpa || 'Not provided'}</div>
                <div><strong>Skills:</strong> {formData.relevant_skills || 'Not provided'}</div>
              </div>
              
              <h4>Internship Preferences</h4>
              <div className="review-grid">
                <div><strong>Area:</strong> {formData.internship_area || 'Not provided'}</div>
                <div><strong>Duration:</strong> {formData.internship_duration || 'Not provided'}</div>
                <div><strong>Start Date:</strong> {formData.start_date || 'Not provided'}</div>
                <div><strong>Mode:</strong> {formData.internship_mode || 'Not provided'}</div>
                <div><strong>Emergency Contact:</strong> {formData.emergency_contact_name || 'Not provided'}</div>
                <div><strong>Emergency Phone:</strong> {formData.emergency_contact_phone || 'Not provided'}</div>
              </div>
              
              <h4>Documents</h4>
              <div className="review-grid">
                <div><strong>Photo:</strong> {files.photo ? files.photo.name : 'Not uploaded'}</div>
                <div><strong>Resume:</strong> {files.resume ? files.resume.name : 'Not uploaded'}</div>
                <div><strong>Adhaar Card:</strong> {files.adhaar_card ? files.adhaar_card.name : 'Not uploaded'}</div>
              </div>
              
              <div className="terms-agreement">
                <input
                  type="checkbox"
                  name="terms_agreement"
                  id="terms_agreement"
                  checked={formData.terms_agreement}
                  onChange={handleChange}
                />
                <label htmlFor="terms_agreement">
                  I agree to the <a href="#terms">terms and conditions</a> <span className="required">*</span>
                </label>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <>
      <div className="internship-form-container">
        <div className="form-progress">
          {sections.map((section) => (
            <div 
              key={section.id}
              className={`progress-step ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <div className="step-number">
                {sections.findIndex(s => s.id === section.id) + 1}
              </div>
              <div className="step-title">{section.title}</div>
            </div>
          ))}
        </div>
        
        <div className="form-wrapper">
          <div className="form-header">
            <h2>Internship Application</h2>
            <p>Complete the form to apply for our internship program</p>
          </div>
          
          {errorMessage && <div className="alert error">{errorMessage}</div>}
          {successMessage && <div className="alert success">{successMessage}</div>}
          
          <form onSubmit={handleSubmit}>
            {renderSection()}
            
            <div className="form-navigation">
              {activeSection !== 'personal' && (
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    const currentIndex = sections.findIndex(s => s.id === activeSection);
                    setActiveSection(sections[currentIndex - 1].id);
                  }}
                >
                  ← Previous
                </button>
              )}
              
              {activeSection !== 'review' ? (
                <button 
                  type="button" 
                  className="btn-primary"
                  onClick={() => {
                    const currentIndex = sections.findIndex(s => s.id === activeSection);
                    setActiveSection(sections[currentIndex + 1].id);
                  }}
                >
                  Next →
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span> Submitting...
                    </>
                  ) : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default InternshipForm;