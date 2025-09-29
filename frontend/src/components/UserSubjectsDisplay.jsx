import React, { use, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserSubjectsDisplay = ({ user }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userBranch = user?.branch?.trim() || '';
  const userSemester = user?.semester?.toString() || '';

  useEffect(() => {
    const fetchSubjects = async () => {
      if (userBranch && userSemester) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`http://localhost:3000/api/subjects/byUser`, {
            params: {
              branch: userBranch,
              semester: userSemester
            }
          });
          setSubjects(response.data);
        } catch (e) {
          console.error("Error fetching subjects:", e);
          setError("Failed to load subjects.");
          setSubjects([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSubjects([]);
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [userBranch, userSemester]);

  if (!user || !user.branch || !user.semester) {
    return (
      <div className="text-white">
        <p>Please set your branch and semester in your profile to view subjects.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-white">Loading subjects...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (subjects.length === 0) {
    return <div className="text-white">No subjects found for {userBranch} - Semester {userSemester}.</div>;
  }
   
  const handleClick = (subject) => {
    console.log(`Subject clicked: ${subject.name}`);
    navigate(`/subjects/${subject._id}`);

  };

  return (
    <div className="flex flex-col gap-4 ">
      {subjects.map((subject) => (
        <div key={subject._id} onClick={() => handleClick(subject)} className="p-4 bg-gray-800 rounded-lg shadow-md text-white">
          <p className="text-lg cursor-pointer font-semibold">{subject.name}</p>
        </div>
      ))}
    </div>
  );
};

export default UserSubjectsDisplay;
