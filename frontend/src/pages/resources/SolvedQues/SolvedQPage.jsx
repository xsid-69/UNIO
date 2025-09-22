import React from 'react'
import SubjectsList from  '../../../components/SubjectsList';
import { Link } from 'react-router-dom';

const items = [ 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7']

const SolvedQPage = () => {
  return (
    <div className='text-center mt-2 text-4xl h-100'>
        <h1>Solved Questions of University </h1>
        <div id="subjectLists">
           <SubjectsList
              items={items}
              onItemSelect={(item, index) => console.log(item, index)}
              showGradients={false}
              enableArrowNavigation={true}
              displayScrollbar={false}
           />
        </div>
    </div>
  )
}

export default SolvedQPage
