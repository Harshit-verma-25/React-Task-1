import React, { useState, useRef, useEffect } from 'react'
import { doc, setDoc, addDoc, getDocs } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, recordCollection, storage } from '../Firebase/firebase'
import './CreateRec.css'

function CreateRec( { id, setRecordId } ) {
    const imageRef = useRef(null)
    const [image, setImage] = React.useState('')
    const [resume, setResume] = React.useState('')
    const [addInputField, setAddInputField] = React.useState([])
    const [formData, setFormData] = React.useState({
        userID: '',
        name: '',
        img: '',
        address: '',
        contact: '',
        email: '',
        dob: '',
        resume: ''
    })
    
    async function loadLink () {

        try {    
            let imgRef = ref(storage, `images/${image.name}`)

            let resumeRef = ref(storage, `resumes/${resume.name}`)
        
            // console.log(imgRef)
            // console.log(resumeRef)

            await uploadBytes(imgRef, image)
            const imgURL = await getDownloadURL(imgRef)
            
            await uploadBytes(resumeRef, resume)
            const resURL = await getDownloadURL(resumeRef)
            
            return [ imgURL, resURL ]
        } 
        catch (error) {
            console.error('Error uploading files:', error)
        }
    }

    
    async function createNewRecord () {   
        const newRecordRef = await addDoc(recordCollection, { ...formData})
        
        const [imgURL, resURL] = await loadLink()
        let data = { ...formData, userID: newRecordRef.id, qualificaion: addInputField, img: imgURL, resume: resURL }
        setFormData(data) 

        let docRef = doc(db, 'record', newRecordRef.id)
        
        await setDoc(docRef, data).then(() => console.log(data))
        
        alert("Record Successfully Added")
        setFormData({
            userID: '',
            name: '',
            img: '',
            address: '',
            contact: 0,
            email: '',
            dob: '',
            resume: ''
        })
        setAddInputField([])
        setImage('')
        setResume('')
    }

    function handleInput(event, isnumber=false) {
        const {name, value} = event.target
        setFormData(prevData => ({
            ...prevData,
            [name]: isnumber ? Number(value) : value
        }))
    }
    
    function handleImageClick (event) {
        imageRef.current.click()
    }
    
    function handleImageChange (event) {
        let file = event.target.files[0]
        setImage(file)
    }
    
    function handleResumeChange (event) {
        let file = event.target.files[0]
        setResume(file)
    }
    
    function handleAdd () {
        const empty = [...addInputField, []]
        setAddInputField(empty)
    }
    function handleChange (onChangeValue, i) {
        const inputData = [...addInputField]
        inputData[i] = onChangeValue.target.value
        setAddInputField(inputData)
    }
    function handleDelete (i) {
        const deleteInput = [...addInputField]
        deleteInput.splice(i,1)
        setAddInputField(deleteInput)
    }

    async function editHandler () {
        try {
            const docSnap = await getDocs(recordCollection, id)
            docSnap.forEach((doc) => {
                if (doc.id === id){
                    const docData = doc.data()
                    setFormData(docData)
                    setImage(formData.img)
                    setResume(formData.resume)
                }
            })
        }
        catch (err) {
            console.log("Kuch toh GadBad hai daya !!")
        }
    }

    async function saveEdit () {
        let docRef = doc(db, 'record', id)
        const [imgURL, resURL] = await loadLink()

        let data = { ...formData, qualificaion: addInputField, img: imgURL, resume: resURL }
        setFormData(data)

        await setDoc(docRef, formData)
        
        alert("Record Successfully Updated")

        setFormData({
            userID: '',
            name: '',
            img: '',
            address: '',
            contact: 0,
            email: '',
            dob: '',
            resume: ''
        })
        setAddInputField([])
        setImage('')
        setResume('')
    }

    React.useEffect(() => {
        if (id !== undefined && id !== ""){
            editHandler()
        }
    }, [id])

    if (id === undefined || id === "") {
        return (
            <div className='form'>
                <div className='form-container'>
                    <div className="form-input">
                        Name: <input type="text" name='name' className="input" placeholder="Enter your Name" 
                        value={formData.name} onChange={handleInput} autoComplete='true' required/>

                        Address: <input type="text" name='address' className="input" placeholder="Enter your Address" 
                        value={formData.address} onChange={handleInput} autoComplete='true' required/>

                        Contact: <input type="text" name='contact' className="input" placeholder="Enter your Contact" 
                        value={formData.contact} onChange={(e) => handleInput(e,true)} autoComplete='true' required/>
                        
                        Email: <input type="text" name='email' className="input" placeholder="Enter your Email" 
                        value={formData.email} onChange={handleInput} autoComplete='true' required/>
                        
                        DOB: <input type="date" name='dob' className="input" placeholder="Enter your DOB" 
                        value={formData.dob} onChange={handleInput} autoComplete='true' required/>
                    </div>
                    <div className='profile' onClick={handleImageClick}>
                        {image ? ( <img className='image-preview' src={URL.createObjectURL(image)} alt=""/> ) : ( <img src="/image-upload.png" alt=""/>) }
                        
                        <input type="file" className='input' 
                        ref={imageRef} onChange={handleImageChange} required style={{display: "none"}}/>

                        <input type="file" name="img" className='input' onChange={handleInput} required 
                        style={{display:'none'}}/>
                    </div>
                </div>
                <div className='other-input'>
                    <div className='edu'>
                        <span>Qualification:</span><button className='add-field-btn' value={addInputField} onClick={() => handleAdd()}>+</button>
                    </div>
                    {addInputField.map((data, i) => {
                        return (
                                <div className='add-input' key={i}>    
                                    <input type='text' value={data} placeholder='Enter your Qualification' onChange={e => handleChange(e,i)} />
                                    <button onClick={() => handleDelete(i)}>-</button>
                                </div>
                        )
                    })}
                </div>
                Resume (PDF only): <input type="file" className='input' onChange={handleResumeChange} />
                <input type="file" name="resume" className='input' onChange={handleInput} style={{display: 'none'}} />
                <div className='form-button'>
                    <button type="submit" className='button' onClick={createNewRecord}>SAVE</button>
                    <a href={'/'}><button className='button'>BACK</button></a>
                </div>  
            </div>
        )
    }
    else {
        return (
            <div className='form'>
                <div className='form-container'>
                    <div className="form-input">
                        Name: <input type="text" name='name' className="input" placeholder="Enter your Name" 
                        value={formData.name} onChange={handleInput} autoComplete='true' required/>
        
                        Address: <input type="text" name='address' className="input" placeholder="Enter your Address" 
                        value={formData.address} onChange={handleInput} autoComplete='true' required/>
        
                        Contact: <input type="text" name='contact' className="input" placeholder="0" 
                        value={formData.contact} onChange={(e) => handleInput(e,true)} autoComplete='true' required/>
                        
                        Email: <input type="text" name='email' className="input" placeholder="Enter your Email" 
                        value={formData.email} onChange={handleInput} autoComplete='true' required/>
                        
                        DOB: <input type="date" name='dob' className="input" placeholder="Enter your DOB" 
                        value={formData.dob} onChange={handleInput} autoComplete='true' required/>
                    </div>
                    <div className='profile' onClick={handleImageClick}>
                        {image ? ( <img className='image-preview' src={URL.createObjectURL(image)} alt=""/>) : ( <img className='image-preview' src={formData.img} alt=""/> ) }
                        
                        <input type="file" className='input' 
                        ref={imageRef} onChange={handleImageChange} required style={{display: "none"}}/>

                        <input type="file" name="img" className='input' onChange={handleInput} required 
                        style={{display:'none'}}/>
                    </div>
                </div>
                <div className='other-input'>
                    <div className='edu'>
                        <span>Qualification:</span><button className='add-field-btn' value={addInputField} onClick={() => handleAdd()}>+</button>
                    </div>
                    {addInputField.map((data, i) => {
                        return (
                                <div className='add-input' key={i}>    
                                    <input type='text' value={data} placeholder='Enter your Qualification' onChange={e => handleChange(e,i)} />
                                    <button onClick={() => handleDelete(i)}>-</button>
                                </div>
                        )
                    })}
                </div>
                Resume (PDF only): <input type="file" name="resume" className='input' onChange={handleResumeChange}/>
                <div className='form-button'>
                    <button type="submit" className='button' onClick={saveEdit}>EDIT</button>
                    <a href={'/view-record'}><button className='button'>CANCEL</button></a>
                </div>  
            </div>
        )
    }
}

export default CreateRec