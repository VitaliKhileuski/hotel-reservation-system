import React from 'react';
import './../../css/App.css'
import { Link } from 'react-router-dom'

function NavBar() {

    return (
        <nav>
            <ul className="nav-links">
                <li>Logo</li>
               <Link to="/login">
               <li>login</li>
               </Link> 
            </ul>
        </nav>
    )
};
export default NavBar;