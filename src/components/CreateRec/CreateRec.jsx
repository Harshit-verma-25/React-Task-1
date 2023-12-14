import React, { useState, useRef, useEffect } from 'react'
import { doc, setDoc, addDoc, getDocs } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, recordCollection, storage } from '../Firebase/firebase'
import { nanoid } from 'nanoid'
import './CreateRec.css'

function CreateRec( { id, setRecordId } ) {
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
    
    async function loadLink () {

        try {    
            let imgRef = ref(storage, `images/${formData.userID}`)

            let resumeRef = ref(storage, `resumes/${formData.userID}`)

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
        
        const [imgURL, resURL] = await loadLink()
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
        setImage(event.target.files[0])
    }
    
    function handleResumeChange (event) {
        setResume(event.target.files[0])
    }
    
    function handleAdd () {
        const empty = [...addInputField, ""]
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
                    setAddInputField(docData.qualificaion)
                }
            })
        }
        catch (err) {
            console.log("Kuch toh GadBad hai daya !!")
        }
    }

    // console.log(addInputField)
    // console.log(image)
    // console.log(resume)

    async function saveEdit () {
        
        if (image === '' && resume === '') {
            let docRef = doc(db, 'record', id)    
            let data = { ...formData, qualificaion: addInputField}
            setFormData(data)
    
            await setDoc(docRef, formData)
            
            alert("Record Successfully Updated")
    
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
        }
        else {
            if (image === '') {
                const [resURL] = await loadLink()
                console.log(resURL)
                let data = { ...formData, qualificaion: addInputField, resume: resURL }
                console.log(data)
                setFormData(data)
            }
            else if (resume === '') {
                const [imgURL] = await loadLink()
                console.log(imgURL)
                let data = { ...formData, qualificaion: addInputField, img: imgURL }
                console.log(data)
                setFormData(data)
            }
            else {
                const [imgURL, resURL] = await loadLink()
                console.log(imgURL, "\n", resURL)
                let data = { ...formData, qualificaion: addInputField, img: imgURL, resume: resURL }
                console.log(data)
                setFormData(data)
            }       


            console.log(formData)
            let docRef = doc(db, 'record', id)
            await setDoc(docRef, formData)
            
            alert("Record Successfully Updated")
    
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
                        <img className='image-preview' src={image != '' ? URL.createObjectURL(image) : '/image-upload.png' } alt="" />
                        
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
                    <button type="submit" className='button' onClick={createNewRecord} disabled={disable}>SAVE</button>
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
                        <img className='image-preview' src={image == '' ? formData.img : URL.createObjectURL(image)} alt="" />
                        
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