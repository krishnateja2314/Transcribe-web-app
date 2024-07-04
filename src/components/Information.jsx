import React, { useState } from 'react'
import Transcripton from './Transcripton'
import Translation from './Translation'

function Information() {
    const [tab, setTab] = useState('transcription')

    return (
        <main className='flex-1 flex flex-col gap-3 sm:gap-4 md:gap-5 max-w-pros w-full  text-center justify-center p-4 pb-10 mx-auto'>
            <h1 className='font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl whitespace-nowrap'>Your <span className='text-blue-400 bold'>Transcription</span></h1>

            <div className='grid grid-cols-2 mx-auto bg-white shadow  rounded-full overflow-hidden items-center '>
                <button onClick={() => {
                    setTab('transcription')
                }} className={'px-4 py-1 font-medium ' + (tab === 'transcription' ? 'bg-blue-400 text-white' : ' text-blue-400 hover:text-blue-600 duration-200')}>Transcription</button>
                <button onClick={() => {
                    setTab('translation')
                }} className={'px-4 py-1 font-medium ' + (tab === 'translation' ? 'bg-blue-400 text-white' : ' text-blue-400 hover:text-blue-600 duration-200')} >Translation</button>
            </div>
            {tab === 'transcription' ? (<Transcripton />) : (<Translation />)
            }

        </main>
    )
}

export default Information
