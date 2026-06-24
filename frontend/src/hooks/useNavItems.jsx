import React from 'react';
import {
    User,
    Map,
    Sprout,
    History,
    LayoutDashboard,
    Users,
    Bell,
    Bot,
    MessageSquare,
    ClipboardCheck,
    BarChart
} from 'lucide-react';


const useNavItems = () => {
    const farmerMenuItems = [
        { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'Question Bank', label: 'Question Bank', path: '/question-bank', icon: <User size={20} /> },
        { id: 'Question Papers', label: 'Question Papers', path: '/question-papers', icon: <Map size={20} /> },
        { id: 'Evaluations', label: 'Evaluations', path: '/Evaluations', icon: <Sprout size={20} /> },
        { id: 'Reports', label: 'Reports', path: '/Reports', icon: <History size={20} /> },
        { id: 'Notifications', label: 'Notifications', path: '/Notifications', icon: <Bell size={20} /> },
        { id: 'Profile', label: 'Profile', path: '/Profile', icon: <User size={20} /> },
    ];

    const adminMenuItems = [
        { id: 'Users', label: 'Users', path: '/users', icon: <User size={20} /> },
        { id: 'Teachers', label: 'Teachers', path: '/teachers', icon: <User size={20} /> },
        { id: 'Clerks', label: 'Clerks', path: '/clerks', icon: <User size={20} /> },
    ];

    return { farmerMenuItems, adminMenuItems };
};

export default useNavItems;
