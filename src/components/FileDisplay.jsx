import React from 'react'

function FileDisplay(props) {
    const { file, handleFormSubmission, handleAudioReset, audio } = props

    return (
        <main className='flex-1 flex flex-col gap-3 sm:gap-4 md:gap-5 max-w-full sm:w-96 w-72 text-center justify-center p-4 pb-10 mx-auto'>
            <h1 className='font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl'>Your <span className='text-blue-400 bold'>File</span></h1>
            <div className='my-4 flex flex-col text-left  gap-2'>
                <h3 className='font-semibold '>Name</h3>
                <p>{file ? file.name : 'Custom Audio'}</p>
            </div>
            <div className='flex items-center justify-between gap-4'>
                <button onClick={handleAudioReset} className='text-slate-400 hover:text-blue-600 duration-200'>Reset</button>
                <button onClick={handleFormSubmission} className='specialBtn flex items-center gap-2 px-3 py-2  rounded-lg text-blue-400'><p>Transcribe</p>
                    <i className="fa-solid fa-pen-nib"></i></button>
            </div>
        </main>
    )
}

export default FileDisplay
