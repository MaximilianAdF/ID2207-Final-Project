import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Route {
    path: string;
    name: string;
    allowedUsernames?: string[];
    description: string;
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        navigate('/login', { replace: true });
    };

    const currentUserData = localStorage.getItem('currentUser');
    const currentUser = currentUserData ? JSON.parse(currentUserData) : null;

    const allRoutes: Route[] = [
        {
            path: '/CSForm',
            name: 'Customer Request Form',
            allowedUsernames: ['CS'],
            description: 'Customer Request Form'
        },
    ]

    const allowedRoutes = allRoutes.filter(route => {
        // If no allowedUsernames specified, show to everyone
        if (!route.allowedUsernames || route.allowedUsernames.length === 0) {
            return true;
        }
        // If allowedUsernames specified, check if current user is included
        return currentUser && route.allowedUsernames.includes(currentUser.username);
    });



    return (
        <div className="h-screen w-screen flex flex-col items-center gap-4 p-6">
        <div className="max-w-4xl w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold">Welcome, {currentUser.name}</h1>
                <p className="text-gray-600">Role: {currentUser.name} ({currentUser.username})</p>
            </div>
            <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
                Logout
            </button>
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allowedRoutes.map((route) => (
                <Link
                key={route.path}
                to={route.path}
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-blue-300"
                >
                <h3 className="text-xl font-semibold mb-2 text-blue-600">
                    {route.name}
                </h3>
                {route.description && (
                    <p className="text-gray-600 text-sm">{route.description}</p>
                )}
                </Link>
            ))}
            </div>
        </div>
        </div>
    );
};

export default Dashboard;