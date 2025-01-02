import { useState } from 'react';
import { supabase } from '../supabaseClient'; // Import your Supabase client setup
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/internshipFormStyles.css'; // Import your CSS for styling
import Header from '../components/Header';  // If Header is inside a 'components' folder

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
    terms_agreement: false, // Default to false
  });

  const [files, setFiles] = useState({
    photo: null,
    resume: null,
    adhaar_card: null,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate(); // Initialize navigate

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked, // Toggle checkbox value
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prevFiles) => ({
      ...prevFiles,
      [name]: selectedFiles[0],
    }));
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  // Upload files to Supabase storage
  const uploadFile = async (file, fullName) => {
    if (file && file.size > 5000000) { // 5MB file size limit
      setErrorMessage('File size exceeds the 5MB limit.');
      return null;
    }

    // Sanitize the full name to create a valid folder name
    const sanitizedFullName = fullName.replace(/[^a-zA-Z0-9-_]/g, '_'); // Replace invalid characters with underscores

    const { data, error } = await supabase.storage
    .from('internship-files')
    .upload(`uploads/${sanitizedFullName}/${Date.now()}_${file.name}`, file); 
    if (error) {
      setErrorMessage('Failed to upload file. Please try again.');
      console.error(error.message);
      return null;
    }
    return data.path;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Basic validation
      if (!formData.full_name || !formData.email || !formData.terms_agreement) {
        setErrorMessage('Please fill out all required fields and agree to the terms.');
        return;
      }

      // Validate email format
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }

      // Format date fields
      const formattedDob = formatDate(formData.dob);
      const formattedStartDate = formatDate(formData.start_date);

      // Handle file uploads
      const photoPath = files.photo ? await uploadFile(files.photo, formData.full_name) : '';
      const resumePath = files.resume ? await uploadFile(files.resume, formData.full_name) : '';
      const adhaarPath = files.adhaar_card ? await uploadFile(files.adhaar_card, formData.full_name) : '';

      // Insert form data into Supabase
      const { error } = await supabase.from('internship_registrations').insert([{
        ...formData,
        dob: formattedDob,
        start_date: formattedStartDate,
        photo_url: photoPath,
        resume_url: resumePath,
        adhaar_card_url: adhaarPath,
      }]);

      if (error) {
        setErrorMessage('Registration failed. Please try again.');
        console.error('Insert error:', error.message);
        return;
      }

      setSuccessMessage('Registration successful!');
      // Set 'isRegistered' flag in localStorage
      localStorage.setItem('isRegistered', true);

      // Navigate to /dashboard
      navigate('/dashboard'); 

      // Reset form
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
        terms_agreement: false, // Reset checkbox
      });
      setFiles({ photo: null, resume: null, adhaar_card: null });
    } catch (error) {
      console.error('Registration error:', error.message);
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="internship-form">
        <div className="form-container">
          <div className="video-background">
            <video autoPlay muted loop className="background-video">
              <source src="/assets/intern-vid.mp4" type="video/mp4" />
            </video>
          </div>
          <h2>Internship Registration Form</h2>

          {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
          {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

          <form onSubmit={handleSubmit}>
            <div>
              <label>👤 Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>🚻 Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label>📅 Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>📧 Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>📞 Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>🏠 Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>🏫 University Name</label>
              <input
                type="text"
                name="university_name"
                value={formData.university_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>🎓 Course Program</label>
              <input
                type="text"
                name="course_program"
                value={formData.course_program}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>🗓 Year of Study</label>
              <input
                type="text"
                name="year_of_study"
                value={formData.year_of_study}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>📘 Major</label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>📊 Current GPA</label>
              <input
                type="text"
                name="current_gpa"
                value={formData.current_gpa}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>🌍 Internship Area</label>
              <input
                type="text"
                name="internship_area"
                value={formData.internship_area}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>⏳ Internship Duration</label>
              <input
                type="text"
                name="internship_duration"
                value={formData.internship_duration}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>📅 Internship Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>
            <div>
  <label htmlFor="internship_mode">💼 Internship Mode</label>
  <select
    id="internship_mode"
    name="internship_mode"
    value={formData.internship_mode}
    onChange={handleChange}
  >
    <option value="Online">Online</option>
    <option value="Hybrid">Hybrid</option>
  </select>
</div>

            <div>
              <label>🔧 Relevant Skills</label>
              <textarea
                name="relevant_skills"
                value={formData.relevant_skills}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>🌐 Portfolio Links</label>
              <input
                type="text"
                name="portfolio_links"
                value={formData.portfolio_links}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>🚑 Emergency Contact Name</label>
              <input
                type="text"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>📱 Emergency Contact Phone</label>
              <input
                type="tel"
                name="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <input
                type="checkbox"
                name="terms_agreement"
                checked={formData.terms_agreement}
                onChange={handleChange}
              />
              <label>📜 I agree to the terms and conditions</label>
            </div>

            <div>
              <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default InternshipForm;
