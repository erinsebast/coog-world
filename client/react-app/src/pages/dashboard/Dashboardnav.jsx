import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Dashboard.css';

const DashboardNav = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user?.role?.toLowerCase();

    const [isWeatherDropdownOpen, setIsWeatherDropdownOpen] = useState(false);

    const [isReportsDropdownOpen, setIsReportsDropdownOpen] = useState(false);
    const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
    const [isInvDropdownOpen, setIsInvDropdownOpen] = useState(false);
    const [isEmpDropdownOpen, setIsEmpDropdownOpen] = useState(false);

    const toggleWeatherDropdown = () => {
        setIsWeatherDropdownOpen(prev => !prev);
    };

    const toggleInvDropdown = () => {
        setIsInvDropdownOpen(prev => !prev);
    };
    const toggleEmpDropdown = () => {
        setIsEmpDropdownOpen(prev => !prev);
    };
    const toggleReportsDropdown = () => { // Toggle function for Reports dropdown
        setIsReportsDropdownOpen(prev => !prev);
    };

    const toggleEmployeeDropdown = () => {
        setIsEmployeeDropdownOpen(prev => !prev);
    };

    return (
        <nav className="dashboard-nav">
            <ul>
                <li><Link to={'/employee-dashboard/hours'}>Clock-In/Clock-Out</Link></li>
                {(role === 'manager') && (
                    <>
                        <li><Link to={'/employee-dashboard/employees'}>Employees</Link></li>
                        <li><Link to={'/employee-dashboard/rides'}>Rides</Link></li>
                        <li><Link to={'/employee-dashboard/kiosks'}>Kiosks</Link></li>
                        <li><Link to={'/employee-dashboard/shows'}>Shows</Link></li>
                        <li><Link to={'/employee-dashboard/items'}>Items</Link></li>
                        <li><Link to={'/employee-dashboard/inventory-report'}>Inventory</Link></li>
                    </>
                )}
                {(role === 'admin') && (
                    <>
                        <li className="dropdown">
                            <button onClick={toggleEmpDropdown}>
                                Employees
                                <span className={`arrow-icon ${isEmpDropdownOpen ? 'open' : ''}`}>▼</span>
                            </button>
                            {isEmpDropdownOpen && (
                                <ul>
                                    <li><Link to={'/employee-dashboard/employees'}>Employee List</Link></li>
                                    <li><Link to={'/employee-dashboard/attendance-report'}>Attendance Logs</Link></li>
                                    <li><Link to={'/employee-dashboard/attendance'}>Attendance</Link></li>
                                </ul>
                            )}
                        </li>
                        <li><Link to={'/employee-dashboard/rides'}>Rides</Link></li>
                        <li><Link to={'/employee-dashboard/kiosks'}>Kiosks</Link></li>
                        <li><Link to={'/employee-dashboard/stages'}>Stages</Link></li>
                        <li><Link to={'/employee-dashboard/shows'}>Shows</Link></li>
                        <li><Link to={'/employee-dashboard/ticket-report'}>Tickets</Link></li>
                        <li className="dropdown">
                            <button onClick={toggleInvDropdown}>
                                Inventory
                                <span className={`arrow-icon ${isInvDropdownOpen ? 'open' : ''}`}>▼</span>
                            </button>
                            {isInvDropdownOpen && (
                                <ul>
                                    <li><Link to={'/employee-dashboard/items'}>Items List</Link></li>
                                    <li><Link to={'/employee-dashboard/inventory-report'}>Inventory Management</Link></li>
                                </ul>
                            )}
                        </li>
                        <li><Link to={'/employee-dashboard/maintenance-report'}>Maintenance</Link></li>
                        <li className="dropdown">
                            <button onClick={toggleWeatherDropdown} className="dropdown-btn">
                                Weather
                                <span className={`arrow-icon ${isWeatherDropdownOpen ? 'open' : ''}`}>▼</span>
                            </button>
                            {isWeatherDropdownOpen && (
                                <ul className="dropdown-menu">
                                    <li><Link to={'/employee-dashboard/weather-report'}>Weather Logs</Link></li>
                                    <li><Link to={'/employee-dashboard/rainout-report'}>Rainout Report</Link></li>
                                </ul>
                            )}
                        </li>
                        <li className="dropdown">
                            <button onClick={toggleReportsDropdown} className="dropdown-btn">
                                Reports
                                <span className={`arrow-icon ${isReportsDropdownOpen ? 'open' : ''}`}>▼</span>
                            </button>
                            {isReportsDropdownOpen && (
                                <ul className="dropdown-menu">
                                    <li><Link to={'/employee-dashboard/revenue-report'}>Revenue Report</Link></li>
                                    <li><Link to={'/employee-dashboard/ticket-sales-trends'}>Ticket Sales Trends</Link></li>
                                    <li><Link to={'/employee-dashboard/customer-trends-report'}>Customer Trends Report</Link></li>
                                </ul>
                            )}
                        </li>
                    </>
                )}

                {role === 'maintenance' && (
                    <>
                        <li><Link to={'/employee-dashboard/rides'}>Rides</Link></li>
                        <li><Link to={'/employee-dashboard/kiosks'}>Kiosks</Link></li>
                        <li><Link to={'/employee-dashboard/maintenance-report'}>Maintenance Report</Link></li>
                    </>
                )}
            </ul>
        </nav>
    )
}

export default DashboardNav;