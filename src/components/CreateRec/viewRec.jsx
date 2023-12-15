import React, { useState, useEffect } from "react"
import { doc, getDocs, deleteDoc } from "firebase/firestore"
import { ref, deleteObject, listAll, list } from 'firebase/storage'
import { recordCollection, storage } from "../Firebase/firebase"
import { Link } from "react-router-dom"
import './viewRec.css'

function ViewRec({ id, getRecordId }) {
    const [viewData, setViewData] = React.useState([])

    React.useEffect(() => {
        readData();
    }, [])

    async function readData() {
        try {
            const querySnapshot = await getDocs(recordCollection);
            const dataArray = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                dataArray.push({ id: doc.id, ...data });
            });
            setViewData(dataArray);
        } catch (error) {
            console.error("Error reading data:", error);
        }
    }

    async function handleDelete(id, imgURL, resURL) {

        console.log(id)

        const deleteImgRef = ref(storage, `images/${id}`)
        await deleteObject(deleteImgRef)

        const deleteResRef = ref(storage, `resumes/${id}`)
        await deleteObject(deleteResRef)
        console.log("Data Deleted")

        setViewData((prevData) => prevData.filter((data) => data.userID !== id))
        await deleteDoc(doc(recordCollection, id))

        readData()
    }

    return (
        <>
            <h1>View Record</h1>
            <br />
            <table>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Profile</th>
                        <th>Resume</th>
                        <th colSpan={2}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        viewData.map((item, index) => (
                            <tr key={item.userID}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.contact}</td>
                                <td><img className="image-pre" src={item.img} alt="" /></td>
                                <td>
                                    <Link to={`${item.resume}`} target="_blank">
                                        <button>View</button>
                                    </Link>
                                </td>
                                <td>
                                    <Link to={'/create-record'}><button onClick={(e) => getRecordId(item.userID)}>Edit</button></Link>
                                    <button onClick={() => handleDelete(item.id, item.img, item.resume)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <Link to={'/'}><button>Back</button></Link>
        </>
    )
}

export default ViewRec