import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Assuming Redux for state management and dispatch
import { Camera, ChevronRight } from 'lucide-react'; // Assuming lucide-react is available
import ProfileImage from '../../components/ProfileImage'; // Assuming ProfileImage is in ../components/ProfileImage
import { updateUserProfile } from '../../store/authSlice'; // Thunk to update user profile
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfileData = () => {
  // State for form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [gender, setGender] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(''); // State for selected branch
  const [selectedYears, setSelectedYears] = useState(''); // State for selected years
  const [selectedSemesters, setSelectedSemesters] = useState(''); // State for selected semesters

  const dispatch = useDispatch();
  // Fetch user data from Redux store
  const { user: reduxUser } = useSelector((state) => state.auth) || {};
  console.log("Redux User:", reduxUser); // Log Redux user data to check if it's populated

  // Use placeholder data if reduxUser is not available, and include years/semesters for pre-filling
  const user = reduxUser || {
    name: 'Felecia Burke',
    email: 'example@mail.com',
    profilePic: '', // Placeholder for profile picture URL
    avatar: '', // Fallback avatar
    branch: 'Computer Science and Engineering', // Placeholder for branch
    years: 4, // Placeholder for years
    semesters: 8, // Placeholder for semesters
  };

  // Pre-fill form fields if user data is available
  const prefillFirstName = user?.name?.split(' ')[0] || '';
  const prefillLastName = user?.name?.split(' ')[1] || '';
  const prefillEmail = user?.email || '';
  const prefillBranch = user?.branch || '';
  const prefillYears = user?.years || ''; // Pre-fill years
  const prefillSemesters = user?.semesters || ''; // Pre-fill semesters

  // Initialize state with pre-filled values from initial user data
  // This useEffect ensures that the form fields are populated when the component mounts
  // or when the prefill values change.
  useEffect(() => {
    setFirstName(prefillFirstName);
    setLastName(prefillLastName);
    setEmail(prefillEmail);
    setSelectedBranch(prefillBranch);
    setSelectedYears(prefillYears);
    setSelectedSemesters(prefillSemesters);
  }, [prefillFirstName, prefillLastName, prefillEmail, prefillBranch, prefillYears, prefillSemesters]);

  // Effect to update local state when reduxUser changes (e.g., after an update or login)
  // This ensures that if the user data in Redux store is updated, the form reflects it.
  useEffect(() => {
    if (reduxUser) {
      setFirstName(reduxUser.name?.split(' ')[0] || '');
      setLastName(reduxUser.name?.split(' ')[1] || '');
      setEmail(reduxUser.email || '');
      setSelectedBranch(reduxUser.branch || '');
      // Use fallback to prefillYears/prefillSemesters if reduxUser doesn't have them
      setSelectedYears(reduxUser.years || prefillYears);
      setSelectedSemesters(reduxUser.semesters || prefillSemesters);
    }
  }, [reduxUser, prefillYears, prefillSemesters]); // Depend on reduxUser and prefill values

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleUpdate = async () => {
    // Construct the updated user data object using current state values.
    // We send only the values that have been changed or are non-empty.
    // This aligns with the backend's `if (field)` checks for updates.
    const updatedUserData = {
      name: `${firstName} ${lastName}`.trim(),
      email: email,
      branch: selectedBranch,
      year: selectedYears,
      sem: selectedSemesters,
      // Add other fields as needed, e.g., DOB, gender, profilePic etc.
    };

    // Filter out empty values before dispatching.
    const dataToSend = Object.fromEntries(
      Object.entries(updatedUserData).filter(([key, value]) => value !== '')
    );

    if (!reduxUser) {
      setErrorMsg('User not logged in. Please login and try again.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      // Dispatch the thunk and wait for the result
      const resultAction = await dispatch(updateUserProfile(dataToSend));

      if (updateUserProfile.fulfilled.match(resultAction)) {
        // Success - Redux and localStorage are updated in the thunk reducer
        toast.success('Profile updated successfully');
      } else {
        // Rejected - extract error message
        const err = resultAction.payload || resultAction.error?.message || 'Failed to update profile';
        setErrorMsg(err);
        toast.error(err);
      }
    } catch (err) {
        console.error('Unexpected error updating profile:', err);
        setErrorMsg('Unexpected error. Please try again.');
        toast.error('Unexpected error while updating profile');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate options for dropdowns
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentYear = new Date().getFullYear();
  // Generate birth years from current year back to 100 years ago
  const birthYears = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const semesters = Array.from({ length: 8 }, (_, i) => i + 1); // Options for semesters (e.g., 1 to 8 for typical 4-year course)
  
  const branches =[
  "Computer Science and Engineering",
  "Artificial Intelligence and Machine Learning",
  "Artificial Intelligence",
  "Computer Science and Engineering (Data Science)",
  "Computer Science and Engineering (Cyber Security)",
  "Chemical Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Electronics Engineering",
  "Electronics and TeleCommunication Engineering",
  "Information Technology",
  "Civil Engineering",
  "Industrial Engineering",
  "Biomedical Engineering",
  "Fire Engineering",
  "Electronics Design Technology"
]


  return (
    <div className="h-[90vh] overflow-y-auto rounded-2xl bg-gray-900 text-white p-4 flex flex-col md:flex-row gap-8">
      {/* Left Section: Profile Picture, Branch, Years, Semesters */}
      <div className="md:w-1/3 flex flex-col items-center">
        <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4 shadow-lg group">
          <ProfileImage
            src={user?.profilePic || user?.avatar}
            size="lg" // Assuming 'lg' size is supported or handled by className
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-center">
              <Camera size={32} className="mx-auto mb-2 text-white" />
              <p className="text-xs font-medium">Click to change photo</p>
            </div>
          </div>
        </div>
        {/* Branch Selection */}
        <div className="mt-4 w-full">
          <label htmlFor="branch" className="block text-sm font-medium text-gray-400 mb-1">Branch:</label>
          <select
            id="branch"
            value={selectedBranch} // Use state directly
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white appearance-none placeholder-gray-400"
          >
            <option value="">Select Branch</option>
            {branches.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>
        {/* Years Selection */}
        <div className="mt-4 w-full">
          <label htmlFor="years" className="block text-sm font-medium text-gray-400 mb-1">Year:</label>
          <select
            id="years"
            value={selectedYears} // Use state directly
            onChange={(e) => setSelectedYears(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white appearance-none placeholder-gray-400"
          >
            <option value="">Select Year</option>
            {/* This dropdown is for college years, not birth years. */}
            {Array.from({ length: 4 }, (_, i) => i + 1).map(year => (
              <option key={year} value={year}>{year} Year{year > 1 ? '' : ''}</option>
            ))}
          </select>
        </div>
        {/* Semesters Selection */}
        <div className="mt-4 w-full">
          <label htmlFor="semesters" className="block text-sm font-medium text-gray-400 mb-1">Semester:</label>
          <select
            id="semesters"
            value={selectedSemesters} // Use state directly
            onChange={(e) => setSelectedSemesters(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white appearance-none placeholder-gray-400"
          >
            <option value="">Select Semester</option>
            {semesters.map(semester => (
              <option key={semester} value={semester}>{semester} Semester{semester > 1 ? '' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Section: Account Details Form */}
      <div className="md:w-2/3 bg-gray-800 rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-6">Account Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-1">First Name: *</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
              placeholder="Enter first name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-1">Last Name: *</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
              placeholder="Enter last name"
            />
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">E-Mail: *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
              placeholder="Enter email"
            />
          </div>

          {/* Date of Birth (Optional) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Date of Birth (Optional):</label>
            <div className="grid grid-cols-3 gap-2">
              {/* Day */}
              <div>
                <select
                  id="dobDay"
                  value={dobDay}
                  onChange={(e) => setDobDay(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white appearance-none placeholder-gray-400"
                >
                  <option value="">Day</option>
                  {days.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>
              {/* Month */}
              <div>
                <select
                  id="dobMonth"
                  value={dobMonth}
                  onChange={(e) => setDobMonth(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white appearance-none placeholder-gray-400"
                >
                  <option value="">Month</option>
                  {months.map(month => <option key={month} value={month}>{month}</option>)}
                </select>
              </div>
              {/* Year */}
              <div>
                <select
                  id="dobYear"
                  value={dobYear}
                  onChange={(e) => setDobYear(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white appearance-none placeholder-gray-400"
                >
                  <option value="">Year</option>
                  {birthYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Gender (Optional) */}
          <div className="md:col-span-2">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-400 mb-1">Gender (Optional):</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white appearance-none placeholder-gray-400"
            >
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Update Button */}
        <div className="mt-6 flex justify-end items-center gap-4">
          {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
          <button
            onClick={handleUpdate}
            disabled={submitting}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center gap-2 ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <ChevronRight size={20} /> {/* Using ChevronRight as in the image's update button */}
            {submitting ? (
              <span className="inline-flex items-center gap-2"><Spinner size={0.9} thickness={2} speed={700} />Updating...</span>
            ) : (
              'Update'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileData;
