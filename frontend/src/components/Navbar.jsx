import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Languages, Map as MapIcon, Sprout, Bell, User, Menu, X } from 'lucide-react';
import useNavItems from '../hooks/useNavItems';

const Navbar = () => {    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { farmerMenuItems, adminMenuItems } = useNavItems();
    const role = localStorage.getItem('role');

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const isLoggedIn = !!localStorage.getItem('token');

    return (
        <nav className="navbar">
            <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sprout size={24} />
                {'app_name'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {isLoggedIn && (
                    <>
                        <button onClick={() => navigate('/notifications')} className="btn-nav-icon desktop-only" title={'notifications'}>
                            <Bell size={20} />
                        </button>
                        <button onClick={() => navigate('/profile')} className="btn-nav-icon avatar desktop-only" title={'profile'}>
                            <User size={20} />
                        </button>
                        <button onClick={logout} className="btn-nav-icon logout desktop-only" title={'logout'}>
                            <LogOut size={20} />
                            <span className="nav-btn-text">{'logout'}</span>
                        </button>

                        <button className="btn-nav-icon mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </>
                )}
            </div>

            {isLoggedIn && isMenuOpen && (
                <div className="mobile-menu">
                    {role === 'Admin' && (
                        <div className="mobile-menu-group">
                            <div className="mobile-menu-header">{'admin_panel'}</div>
                            {adminMenuItems.map((item) => (
                                <div key={item.id} className="mobile-menu-item" onClick={() => { navigate(item.path); setIsMenuOpen(false); }}>
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mobile-menu-group">
                        <div className="mobile-menu-header">{'menu'}</div>
                        {farmerMenuItems.map((item) => (
                            <div key={item.id} className="mobile-menu-item" onClick={() => { navigate(item.path); setIsMenuOpen(false); }}>
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mobile-menu-divider"></div>
                    <div className="mobile-menu-item" onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}>
                        <User size={20} />
                        <span>{'profile'}</span>
                    </div>
                    <div className="mobile-menu-item" onClick={() => { navigate('/notifications'); setIsMenuOpen(false); }}>
                        <Bell size={20} />
                        <span>{'notifications'}</span>
                    </div>
                    <div className="mobile-menu-item logout" onClick={logout}>
                        <LogOut size={20} />
                        <span>{'logout'}</span>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
