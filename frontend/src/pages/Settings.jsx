import React from 'react';
import { Link } from 'react-router-dom';
import SubjectsList from  '../components/SubjectsList';


const Settings = () => {
  return (
    <div className='text-4xl text-center flex flex-col items-center mt-2'>
        <h1>Settings</h1>
        <div className='md:w-[65vw] w-[90vw] h-[85vh] mt-5 rounded-2xl'>
            <div id="subjectLists">
           <SubjectsList
              items={[{ name: 'Profile Settings', to: "/profilesettings" }, { name: 'Notification Settings' }, { name: 'Privacy Settings' }, { name: 'Language Settings' }, { name: 'Connected Apps' }]}
              onItemSelect={(item, index) => console.log(item, index)}
              showGradients={false}
              enableArrowNavigation={true}
              displayScrollbar={false}
           />
        </div>
        </div>
    </div>
  );
};

export default Settings;
