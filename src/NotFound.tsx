import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-2xl font-bold'>404 Not Found</h1>
            <Link to='/dashboard' className='text-klt_primary-500 mt-2'>Go to Dashboard</Link>
        </div>
    )
}

export default NotFound;