import React, { useState } from "react"
import HomePage from "./components/HomePage/HomePage"
import CreateRec from "./components/CreateRec/CreateRec"
import ViewRec from "./components/CreateRec/viewRec"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

function App() {

    const [recordId, setRecordId] = React.useState('')

    function getRecordIdHandler (id) {
        console.log("Id of current record is: ", id)
        setRecordId(id)
    }

    const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/create-record",
        element: <CreateRec id={recordId} setRecordId={setRecordId} />
    },
    {
        path: "/view-record",
        element: <ViewRec id={recordId} getRecordId = {getRecordIdHandler}/>
    }
    ])
    return (
        <RouterProvider router={router}>
        </RouterProvider>
    )
}

export default App