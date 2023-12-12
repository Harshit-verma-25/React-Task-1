// import React from "react"
import { Link } from 'react-router-dom'
import './HomePage.css'

export default function HomePage() {
    return (
        <div className="home-page">
            <div className="record-number">
                <h4>Number of Records are: </h4>
            </div>
            <div className="home-btn">
                <Link to={'/create-record'}>
                    <button id="create-rec-btn" className="button" >CREATE RECORD</button>
                </Link>
                <Link to={'/view-record'}>
                    <button id="view-rec-btn" className="button">VIEW RECORD</button>
                </Link>
            </div>
        </div>
    )
}