import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProfileImage from '../components/ProfileImage';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className='flex w-full h-full items-start justify-center pt-8'>
      <div id='Profile' className="glass-card flex items-center flex-col p-8 rounded-3xl shadow-xl w-full max-w-sm text-center relative hover:shadow-2xl transition-all duration-300 border border-[var(--glass-border)]">
        {user?.isAdmin ? 
        <div className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
          Admin
        </div> 
        : null  
      }
        <Link to={"/profilesettings"} className="group">
           <div className="relative w-full my-4 flex justify-center">
             <div className="relative">
                <ProfileImage 
                  src={user?.profilePic || user?.avatar}
                  size="lg"
                  className="border-4 border-[var(--color-primary)]/30 group-hover:border-[var(--color-primary)] transition-all duration-300 rounded-full"
                />
             </div>
           </div>
        <h2 id='name' className="text-xl font-bold mb-1 text-white group-hover:text-[var(--color-primary)] transition-colors">{user?.name || 'User Name'}</h2>
        <p id='info' className="text-[var(--color-text-muted)] text-sm mb-4">
          {user?.email || 'user@example.com'}
        </p>
        <div className="w-full h-px bg-[var(--glass-border)] my-4"></div>
        <div className="text-[var(--color-text-main)] space-y-1">
          <p className="font-semibold">{user?.branch || 'Branch'}</p>
          <div className="flex justify-center gap-2 text-sm text-[var(--color-text-muted)]">
             <span>{user?.year ? `${user.year} Year` : 'Year'}</span>
             <span>•</span>
             <span>{user?.semester ? `Sem ${user.semester}` : 'Semester'}</span>
          </div>
        </div>
        </Link>
        
      </div>
    </div>
  );
};

export default Profile;
