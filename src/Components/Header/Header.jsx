import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    // User data - in a real app, this would come from context or props
    const userName = "Adam";
    const userProfileImage = "/images/profile.jpg"; // Path to profile image
    
    const handleToggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                {/* Hello Message */}
                <div className={styles.helloMessage}>
                    <h2 className={styles.greeting}>Hello {userName} <span className={styles.waveEmoji}>👋</span></h2>
                    <p className={styles.subGreeting}>Let's learn something new today!</p>
                </div>
                
                {/* Search Bar */}
                <div className={styles.searchContainer}>
                    <div className="input-group">
                        <input
                            className={styles.searchInput}
                            type="text"
                            placeholder="Search for courses, assignments, etc."
                            aria-label="Search"
                        />
                        <span className={styles.searchIcon}>
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </span>
                    </div>
                </div>
                
                {/* Right Side Icons */}
                <div className={styles.actionsContainer}>
                    {/* Notification Icon */}
                    <div className={styles.iconContainer}>
                        <i className={`fa-regular fa-bell ${styles.icon}`}></i>
                        <span className={styles.badge}>3</span>
                    </div>
                    
                    {/* Message Icon */}
                    <div className={styles.iconContainer}>
                        <i className={`fa-regular fa-envelope ${styles.icon}`}></i>
                        <span className={styles.badge}>5</span>
                    </div>
                    
                    {/* User Profile */}
                    <div className={styles.userProfile} ref={dropdownRef}>
                        <div 
                            className={styles.profileImage} 
                            onClick={handleToggleDropdown}
                            tabIndex="0"
                            aria-label="Open profile menu"
                            onKeyDown={(e) => e.key === 'Enter' && handleToggleDropdown()}
                        >
                            <img 
                                src={userProfileImage} 
                                alt={`${userName}'s profile`} 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${userName}&background=3CB0A5&color=fff`;
                                }}
                            />
                        </div>
                        
                        <button 
                            className={styles.dropdownToggle}
                            onClick={handleToggleDropdown}
                            aria-label="Toggle profile dropdown"
                        >
                            <i className={`fa-solid fa-chevron-${isDropdownOpen ? 'up' : 'down'}`}></i>
                        </button>
                        
                        {isDropdownOpen && (
                            <div className={styles.profileDropdown}>
                                <Link to="/profile" className={styles.dropdownItem}>
                                    Profile
                                </Link>
                                <Link to="/settings" className={styles.dropdownItem}>
                                    Setting
                                </Link>
                                <Link to="/contact" className={styles.dropdownItem}>
                                    Contact Us
                                </Link>
                                <Link to="/logout" className={styles.dropdownItem}>
                                    Logout
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
} 