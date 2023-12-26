import React, { useState } from "react"
import HomePage from "./components/HomePage/HomePage"
import Create from "./components/record/Create"
import View from "./components/record/view"
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
        element: <Create id={recordId} setRecordId={setRecordId} />
    },
    {
        path: "/view-record",
        element: <View id={recordId} getRecordId = {getRecordIdHandler}/>
    }
    ])
    return (
        <RouterProvider router={router}>
        </RouterProvider>
    )
}

export default App