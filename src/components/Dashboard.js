import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../styles/dashboardStyles.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaUser , FaClock, FaFileUpload } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [file, setFile] = useState({});
  const [reportDescription, setReportDescription] = useState('');
  const [workingStatus, setWorkingStatus] = useState('Present');
  const [leaveStatus, setLeaveStatus] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [inTime, setInTime] = useState('');
  const [outTime, setOutTime] = useState('');
  const [personName, setPersonName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskReports, setTaskReports] = useState({});
  const [feedback, setFeedback] = useState('');
  const [isFeedbackGiven, setIsFeedbackGiven] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const pendingTasks = tasks.length - completedTasks;

  const pieData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completedTasks, pendingTasks],
        backgroundColor: ['#4caf50', '#f44336'],
        borderWidth: 1,
      },
    ],
  };

  const handleFileChange = (e, type, taskIndex) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].files = {
      ...updatedTasks[taskIndex].files,
      [type]: e.target.files[0],
    };
    setTasks(updatedTasks);
  };

  const validateInputs = () => {
    if (leaveStatus === 'On Leave') {
      // Only validate personName when on leave
      if (!personName) {
        setMessage('Please enter your name.');
        return false;
      }
      // Allow submission without other fields
      return true;
    } else {
      // Validate all required fields when working status is Present
      if (!reportDescription || !workingStatus || !inTime || !outTime || !personName) {
        setMessage('Please fill all required fields.');
        return false;
      }

      // Check if any tasks are completed and require a task report
      for (const task of tasks) {
        if (task.status === 'Completed' && !taskReports[task.name]) {
          setMessage('Please provide a task report for completed tasks.');
          return false;
        }
      }

      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const uploadedFiles = {};
      const sanitizedPersonName = personName.replace(/[^a-zA-Z0-9-_]/g, '_');

      for (const [taskIndex, task] of tasks.entries()) {
        if (task.files && Object.keys(task.files).length) {
          for (const [type, selectedFile] of Object.entries(task.files)) {
            if (selectedFile) {
              const timestamp = Date.now();
              const fileName = `${taskIndex}_${type}_${selectedFile.name}_${timestamp}`;

              const { data, error } = await supabase.storage
                .from('internship-uploads')
                .upload(`reports/${sanitizedPersonName}/${fileName}`, selectedFile);

              if (error) throw new Error(`Error uploading ${type} for task ${taskIndex}: ${error.message}`);
              uploadedFiles[taskIndex] = uploadedFiles[taskIndex] || {};
              uploadedFiles[taskIndex][type] = data.path;
            }
          }
        }
      }

      const { error: insertError } = await supabase.from('internship_reports').insert([{
        internship_registration_id: 1,
        working_status: workingStatus || null,
        leave_status: leaveStatus || null,
        leave_reason: leaveReason || null,
        report_description: reportDescription || '',
        task_files: uploadedFiles,
        in_time: inTime || null,
        out_time: outTime || null,
        person_name: personName,
        report_date: new Date().toISOString().split('T')[0],
        feedback: feedback || '',
      }]);

      if (insertError) throw new Error(insertError.message);

      setMessage('Report submitted successfully!');
      setIsSubmitted(true);
      resetForm();
      window.scrollTo(0, 0);
      setTimeout(() => {
        setMessage('');
      }, 5000);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile({});
    setReportDescription('');
    setWorkingStatus('Present');
    setLeaveStatus('');
    setLeaveReason('');
    setInTime('');
    setOutTime('');
    setPersonName('');
    setTaskReports({});
    setFeedback('');
    setIsFeedbackGiven(false);
    setTasks([]);
    setIsSubmitted(false);
  };

  const handleTaskNameChange = (index, name) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].name = name;
    setTasks(updatedTasks);
  };

  const handleTaskStatusChange = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].status = updatedTasks[index].status === 'Completed' ? 'Pending' : 'Completed';
    setTasks(updatedTasks);
  };

  const handleTaskReportChange = (index, report) => {
    setTaskReports((prevReports) => ({
      ...prevReports,
      [index]: report,
    }));
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      setIsFeedbackGiven(true);
      setMessage('Thank you for your feedback!');
    } else {
      setMessage('Please provide valid feedback.');
    }
  };

  const handleAddTask = () => {
    setTasks([...tasks, { name: '', status: 'Pending', files: {} }]);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <header>
          <h1>Internship Dashboard</h1>
        </header>

        <div className="message-container">
          <p>{message}</p>
        </div>

        {isSubmitted ? (
          <div className="success-message">
            <p>Report submitted successfully!</p>
          </div>
        ) : (
          <div className="form-container">
            <div className="boxes-row">
              <div className="box full-width">
                <h2><FaUser  /> Person Info</h2>
                <div className="dashboard-tile">
                  <label htmlFor="personName">Person Name</label>
                  <input
                    id="personName"
                    type="text"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="dashboard-tile">
                  <label htmlFor="inTime">In Time</label>
                  <input
                    id="inTime"
                    type="datetime-local"
                    value={inTime}
                    onChange={(e) => setInTime(e.target.value)}
                  />
                </div>
                <div className="dashboard-tile">
                  <label htmlFor="outTime">Out Time</label>
                  <input
                    id="outTime"
                    type="datetime-local"
                    value={outTime}
                    onChange={(e) => setOutTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="box full-width">
                <h2><FaClock /> Status</h2 >
                <div className="dashboard-tile">
                  <label htmlFor="workingStatus">Working Status</label>
                  <select id="workingStatus"
                    value={workingStatus}
                    onChange={(e) => setWorkingStatus(e.target.value)}
                  >
                    <option value="Present">Present</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                {leaveStatus === 'On Leave' && (
                  <div className="dashboard-tile">
                    <label htmlFor="leaveReason">Leave Reason</label>
                    <textarea
                      id="leaveReason"
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      placeholder="Provide reason for leave"
                    />
                  </div>
                )}
              </div>

              <div className="box full-width">
                <h2><FaFileUpload /> Report</h2>
                <div className="dashboard-tile">
                  <label htmlFor="reportDescription">Daily Report</label>
                  <textarea
                    id="reportDescription"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Enter your daily report description"
                  />
                </div>
              </div>
            </div>

            <div className="task-container">
              <h3>Tasks for Today</h3>
              <button className="buttontask" type="button" onClick={handleAddTask}>Add Task</button>
              {tasks.length > 0 ? (
                <>
                  {tasks.map((task, index) => (
                    <div key={index} className="task-item">
                      <label htmlFor={`taskName-${index}`}>Task Name:</label>
                      <input
                        id={`taskName-${index}`}
                        type="text"
                        value={task.name}
                        onChange={(e) => handleTaskNameChange(index, e.target.value)}
                        placeholder={`Task ${index + 1} Name`}
                      />
                      <label>Status:</label>
                      <select
                        value={task.status}
                        onChange={() => handleTaskStatusChange(index)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </select>
                      {task.status === 'Completed' && (
                        <>
                          <div>
                            <label htmlFor={`taskReport-${index}`}>Task Report:</label>
                            <textarea
                              id={`taskReport-${index}`}
                              value={taskReports[index] || ''}
                              onChange={(e) => handleTaskReportChange(index, e.target.value)}
                              placeholder="Enter your task report"
                            />
                          </div>
                          <div className="task-file-upload">
                            <label htmlFor={`taskFile-${index}`}>Upload File:</label>
                            <input
                              id={`taskFile-${index}`}
                              type="file"
                              onChange={(e) => handleFileChange(e, 'file', index)}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}

                  <div className="chart-container">
                    <Pie data={pieData} />
                  </div>
                </>
              ) : (
                <p>No tasks for today</p>
              )}
            </div>

            <div className="feedback-container">
              <h3>Feedback</h3>
              <textarea
                value={feedback}
                onChange={handleFeedbackChange}
                placeholder="Provide feedback"
              />
              <button type="button" onClick={handleFeedbackSubmit} disabled={isFeedbackGiven}>
                {isFeedbackGiven ? 'Feedback Submitted' : 'Submit Feedback'}
              </button>
            </div>

            <div className="submit-container">
              <button type="button" onClick={handleSubmit} disabled={loading || isSubmitted}>
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;