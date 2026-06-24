import React from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();

    const farmerMenuItems = [
        { id: 'dashboard', label: t('dashboard'), path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'Question Bank', label: t('Question Bank'), path: '/question-bank', icon: <User size={20} /> },
        { id: 'Question Papers', label: t('Question Papers'), path: '/question-papers', icon: <Map size={20} /> },
        { id: 'Evaluations', label: t('Evaluations'), path: '/Evaluations', icon: <Sprout size={20} /> },
        { id: 'Reports', label: t('Reports'), path: '/Reports', icon: <History size={20} /> },
        { id: 'Notifications', label: t('Notifications'), path: '/Notifications', icon: <Bell size={20} /> },
        { id: 'Profile', label: t('Profile'), path: '/Profile', icon: <User size={20} /> },
    ];

    const adminMenuItems = [
        { id: 'Users', label: t('Users'), path: '/users', icon: <User size={20} /> },
        { id: 'Teachers', label: t('Teachers'), path: '/teachers', icon: <User size={20} /> },
        { id: 'Clerks', label: t('Clerks'), path: '/clerks', icon: <User size={20} /> },
    ];

    return { farmerMenuItems, adminMenuItems };
};

export default useNavItems;
