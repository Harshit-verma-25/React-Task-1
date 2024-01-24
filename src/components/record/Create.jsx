import React, { useState, useRef, useEffect } from 'react'
import { doc, setDoc, addDoc, getDocs } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, recordCollection, storage } from '../Firebase/firebase'
import { nanoid } from 'nanoid'
import './Create.css'

function Create() {

    const maxDate = new Date() 
    const imageRef = useRef(null)
    const [image, setImage] = React.useState('')
    const [resume, setResume] = React.useState('')
    const [addInputField, setAddInputField] = React.useState([])
    const [disable, setDisable] = React.useState(false)
    const [formData, setFormData] = React.useState({
        userID: nanoid(),
        name: '',
        img: '',
        address: '',
        contact: '',
        email: '',
        qualificaion: [],
        dob: '',
        resume: ''
    })

    async function loadLink() {
        const imageRef = ref(storage, `images/${formData.userID}`)
        await uploadBytes(imageRef, image);
        let imgURL = await getDownloadURL(imageRef)
            
        const resumeref = ref(storage, `resumes/${formData.userID}`)
        await uploadBytes(resumeref, resume);
        let resURL = await getDownloadURL(resumeref);

        return [ imgURL, resURL ]
    }


    async function createNewRecord() {

        let [imgURL, resURL] = await loadLink()
        let data = { ...formData, qualificaion: addInputField, img: imgURL, resume: resURL }
        setFormData(data)
        setDisable(true)

        await setDoc(doc(db, 'record', formData.userID), data)

        alert("Record Successfully Added")
        setFormData({
            userID: '',
            name: '',
            img: '',
            address: '',
            contact: '',
            email: '',
            qualificaion: [],
            dob: '',
            resume: ''
        })
        setAddInputField([])
        setImage('')
        setResume('')
    }

    const handleInput = (e) => {
        let name, value;
        name = e.target.name;
        value = e.target.value;

        if (name === "dob") {
            const currentDate = new Date();
            const selectedDate = new Date(value);
      
            if (selectedDate >= currentDate) {
                alert("DOB should be less than today's date");
                return;
            }
        }

        setFormData({
            ...formData,
            [name]: value
        })
    }

    function handleImageClick(event) {
        imageRef.current.click()
    }

    function handleImageChange(event) {
        setImage(event.target.files[0])
    }

    function handleResumeChange(event) {
        setResume(event.target.files[0])
    }

    function handleAdd() {
        const empty = [...addInputField, ""]
        setAddInputField(empty)
    }

    function handleChange(onChangeValue, i) {
        const inputData = [...addInputField]
        inputData[i] = onChangeValue.target.value
        setAddInputField(inputData)
    }

    function handleDelete(i) {
        const deleteInput = [...addInputField]
        deleteInput.splice(i, 1)
        setAddInputField(deleteInput)
    }

    return (
        <div className='form'>
            <div className='form-container'>
                <div className="form-input">
                    Name: <input type="text" name='name' className="input" placeholder="Enter your Name"
                        value={formData.name} onChange={handleInput} autoComplete='true' required />

                    Address: <input type="text" name='address' className="input" placeholder="Enter your Address"
                        value={formData.address} onChange={handleInput} autoComplete='true' required />

                    Contact: <input type="text" name='contact' className="input" placeholder="Enter your Contact"
                        value={formData.contact} onChange={(e) => handleInput(e, true)} autoComplete='true' required />

                    Email: <input type="text" name='email' className="input" placeholder="Enter your Email"
                        value={formData.email} onChange={handleInput} autoComplete='true' required />

                    DOB: <input type="date" name='dob' className="input" placeholder="Enter your DOB"
                        value={formData.dob} onChange={handleInput} autoComplete='true' required />
                </div>
                <div className='profile' onClick={handleImageClick}>
                    <img className='image-preview' src={image != '' ? URL.createObjectURL(image) : '/image-upload.png'} alt="" />

                    <input type="file" className='input'
                        ref={imageRef} onChange={handleImageChange} accept='.jpg, .jpeg' required style={{ display: "none" }} />

                    <input type="file" name="img" className='input' onChange={handleInput} required
                        style={{ display: 'none' }} />
                </div>
            </div>
            <div className='other-input'>
                <div className='edu'>
                    <span>Qualification:</span><button className='add-field-btn' value={addInputField} onClick={() => handleAdd()}>+</button>
                </div>
                {addInputField.map((data, i) => {
                    return (
                        <div className='add-input' key={i}>
                            <input type='text' value={data} placeholder='Enter your Qualification' onChange={e => handleChange(e, i)} />
                            <button onClick={() => handleDelete(i)}>-</button>
                        </div>
                    )
                })}
            </div>
            Resume (PDF only): <input type="file" className='input' accept='.pdf' onChange={handleResumeChange} />
            <div className='form-button'>
                <button type="submit" className='button' onClick={createNewRecord} disabled={disable}>SAVE</button>
                <a href={'/'}><button className='button'>BACK</button></a>
            </div>
        </div>
    )
}

export default Create