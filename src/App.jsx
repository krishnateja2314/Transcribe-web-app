import React, { useState, useRef, useEffect } from 'react'
import HomePage from './components/HomePage'
import Header from './components/Header'
import FileDisplay from './components/FileDisplay'
import Information from './components/Information'
import Transcribing from './components/Transcribing'
import { MessageTypes } from './utils/presets'

function App() {
  const [file, setFile] = useState(null)
  const [audioStream, setAudioStream] = useState(null)
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const isAudioAvailable = file || audioStream

  function handleAudioReset() {
    setAudio(null)
    setFile(null)
  }

  const worker = useRef(null)

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./utils/wisper.worker.js', import.meta.url), {
        type: 'module'
      })
    }

    const onMessageReceived = async (e) => {
      switch (e.data.type) {
        case 'DOWNLOADING':
          setDownloading(true)
          console.log('Downloading')
          break;
        case 'LOADING':
          setLoading(true)
          console.log('lOADING')
          break;
        case 'RESULT':
          console.log(e.data.results)
          setOutput(e.data.results)
          break;
        case 'INFERENCE_DONE':
          setFinished(true)
          console.log('Done')
          break;
      }

    }

    worker.current.addEventListener('message', onMessageReceived)

    return () => worker.current.removeEventListener('message', onMessageReceived)
  }, [])


  async function readAudioFrom(file) {
    const sampling_rate = 16000
    const audioCTX = new AudioContext({ sampleRate: sampling_rate })
    const responce = await file.arrayBuffer()
    const decoded = await audioCTX.decodeAudioData(responce)
    const audio = decoded.getChannelData(0)
    return audio
  }


  async function handleFormSubmission() {
    if (!file && !audioStream) { return }

    let audio = await readAudioFrom(file ? file : audioStream)
    const model_name = `openai/whisper-tiny.en`

    worker.current.postMessage({
      type: MessageTypes.INFERENCE_REQUEST,
      audio,
      model_name,
    })

  }

  return (
    <div className='flex flex-col w-full  mx-auto max-w-[1000px]'>
      <section className='min-h-screen flex flex-col'>
        <Header />
        {output ? (
          <Information output={output} />
        ) : loading ? (
          <Transcribing />
        ) : isAudioAvailable ? (<FileDisplay handleFormSubmission={handleFormSubmission} handleAudioReset={handleAudioReset} file={file} audioStream={audioStream} />) : (<HomePage setFile={setFile} setAudioStream={setAudioStream} />)}
      </section>
      <footer>

      </footer>
    </div>
  )
}

export default App
