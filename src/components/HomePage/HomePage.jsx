import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { recordCollection } from '../Firebase/firebase'
import './HomePage.css'
import { getCountFromServer } from 'firebase/firestore'

export default function HomePage() {

    const [totalRecords, setTotalRecords] = useState(0)
    
    React.useEffect(() => {
        const fetchTotalRecords = async () => {
            try {
                const snapshot = await getCountFromServer(recordCollection)
                const countCollections = snapshot.data().count
                setTotalRecords(countCollections)
            } catch (error) {
                console.log("error is : ", error)
            }
        }
        fetchTotalRecords(); // Call the async function inside useEffect
    }, []);

    return (
        <div className="home-page">
            <div className="record-number">
                <h4>Number of Records are: {totalRecords}</h4>
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