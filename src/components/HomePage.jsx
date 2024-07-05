import React, { useState, useEffect, useRef } from 'react'

function HomePage(props) {
    const { setAudioStream, setFile } = props
    const [recordingStatus, setRecordingStatus] = useState('inactive')
    const [audioChunks, setAudioChunks] = useState([])
    const [duration, setDuration] = useState(0)

    const mediaRecoader = useRef(null)

    const mimeType = 'audio/webm'

    async function startRecording() {
        let tempStream;

        console.log('started recording')

        try {
            const streamData = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            })
            tempStream = streamData;
        } catch (error) {
            console.log(error.message)
            return
        }
        setRecordingStatus('recording')

        const media = new MediaRecorder(tempStream, { type: mimeType })
        mediaRecoader.current = media

        mediaRecoader.current.start()
        let localAudioChunks = []
        mediaRecoader.current.ondataavailable = (event) => {
            if (typeof event.data === 'undefined') { return }
            if (event.data.size === 0) { return }
            localAudioChunks.push(event.data)
        }
        setAudioChunks(localAudioChunks)
    }

    async function stopReacording() {
        setRecordingStatus('inactive')
        console.log('stoped recording')

        mediaRecoader.current.stop()
        mediaRecoader.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: mimeType })
            setAudioStream(audioBlob)
            setAudioChunks([])
            setDuration(0)
        }
    }


    useEffect(() => {
        if (recordingStatus === 'inactive') { return }
        const interval = setInterval(() => {
            setDuration(curr => curr + 1)
        }, 1000)
        return () => clearInterval(interval)
    })


    return (
        <main className='flex-1 flex flex-col gap-3 sm:gap-4 md:gap-5 text-center justify-center  p-4 pb-10'>
            <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl'>Trans<span className='text-blue-400 bold'>Scribe</span></h1>
            <h3 className='md:text-lg font-medium'>Record <span className='text-blue-400'>&rarr;</span> Transscribe<span className='text-blue-400'>&rarr;</span> Translate</h3>
            <button onClick={recordingStatus === 'recording' ? stopReacording : startRecording} className='specialBtn px-4 py-2 rounded-xl flex items-center text-base gap-4 mx-auto w-72 max-w-full my-4  justify-between'>
                <p className='text-blue-400'>{recordingStatus === 'inactive' ? 'Record' : `Recording`}</p>
                <div className='flex items-center gap-2'>
                    {duration !== 0 && (<p className='text-sm'>{duration}s</p>)}
                    <i className={"fa-solid duration-200 fa-microphone " + (recordingStatus === 'recording' ? '  text-rose-300' : '')}></i>
                </div>
            </button>
            <p className='text-base'>Or <label className='text-blue-400 cursor-pointer hover:text-blue-600' htmlFor="upload">upload <input className='hidden' id='upload' type="file" onChange={(e) => {
                const tempfile = e.target.files[0];
                setFile(tempfile)
            }} accept='.mp3,.wave' /></label> a mp3 file</p>
            <p className='italic text-slate-500'>Translate away!!</p>
        </main>
    )
}

export default HomePage
