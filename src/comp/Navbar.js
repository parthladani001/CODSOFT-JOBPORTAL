import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../logo.png';
import light_dark from '../images/light_dark.png';
function Navbar(props) {
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleNavbar = () => {
        setIsExpanded(!isExpanded);
    };

    const closeNavbar = () => {
        setIsExpanded(false);
    };

    return (
        <>
            <nav className={`navbar navbar-expand-lg navbar-${props.mode} bg-${props.mode}`} id="nav">
                <div className="container-fluid">
                    {/* eslint-disable-next-line */}
                    <img className={`me-2 ${isExpanded ? '' : 'collapsed'}`} onClick={toggleNavbar} src={logo} alt="logo" aria-expanded={isExpanded} aria-controls="navbarNav" type="button" width="45" height="45" aria-label="Toggle navigation" />

                    <div className={`collapse navbar-collapse ${isExpanded ? 'show' : ''}`} id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/" onClick={closeNavbar}>Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/browseJob" ? "active" : ""}`} to="/browseJob" onClick={closeNavbar}>Browse Job</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/contactUs" ? "active" : ""}`} to="/contactUs" onClick={closeNavbar}>Contact Us</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        {props.user ? (
                            <Link role="button" className={`btn me-3 btn-sm btn-outline-${props.mode === 'light' ? 'dark' : 'light'}`} onClick={props.logout} to="/">Logout</Link>
                        ) : (
                            <div>
                                <Link role="button" className={`btn me-3 btn-sm btn-outline-${props.mode === 'light' ? 'dark' : 'light'}`} to="/employerLogin">Post a Job</Link>
                                <Link role="button" className={`btn me-3 btn-sm btn-outline-${props.mode === 'light' ? 'dark' : 'light'}`} to="/login" onClick={closeNavbar}>Login</Link>
                            </div>
                        )}
                    </div>
                    <img style={{ cursor: 'pointer' }} src={light_dark} alt="img" onClick={props.toggleMode} width="40" height="40" />
                </div>
            </nav>
        </>
    )
}

export default Navbar;