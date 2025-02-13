import React from 'react';
import style from './Sidebar.module.css';

export default function Sidebar() {
    return (
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <div className="container">
                <a className="navbar-brand" href="#">Navbar</a>
                <button
                    className="navbar-toggler d-lg-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapsibleNavId"
                    aria-controls="collapsibleNavId"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="collapsibleNavId">
                   
                    <form className="d-flex my-2 my-lg-0 mx-auto w-50">
                    <div className="input-group">
    <span className="input-group-text">
        <i className="fa-solid fa-magnifying-glass"></i>
    </span>
    <input
        className="form-control"
        type="text"
        placeholder="Search"
    />
</div>
                      
                    </form>
                </div>
            </div>
        </nav>
    );
}
