import React, { useState, useEffect, useRef } from 'react'
import Transcripton from './Transcripton'
import Translation from './Translation'

function Information(props) {
    const { output } = props;
    const [tab, setTab] = useState('transcription')
    const [translation, setTranslation] = useState(null)
    const [toLanguage, setToLanguage] = useState('select language')
    const [translating, setTranslating] = useState(null)

    const worker = useRef()

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker(new URL('./utils/translate.worker.js', import.meta.url), {
                type: 'module'
            })
        }

        const onMessageReceived = async (e) => {
            switch (e.data.type) {
                case 'initiate':
                    console.log('Downloading')
                    break;
                case 'progress':
                    setLoading(true)
                    console.log('lOADING')
                    break;
                case 'update':
                    console.log(e.data.results)
                    setTranslation(e.data.results)
                    break;
                case 'complete':
                    setTranslating(false)
                    console.log('Done')
                    break;
            }
        }

        worker.current.addEventListener('message', onMessageReceived)
        return () => worker.current.removeEventListener('message', onMessageReceived)
    }, [])

    function handleCopy() {
        navigator.clipboard.writeText()
    }

    function handleDownload() {
        const element = document.createElement('a')
        const file = new Blob([], {
            type: 'text/plain'
        })
        element.href = URL.createObjectURL(file)
        element.download(`Transcribe_${(new Date()).toDateString()}.txt`)
        document.body.appendChild(element)
        element.click()
    }

    function generateTranslation() {
        if (translating || toLanguage === 'select language') { return }

        worker.current.postMessage({
            text: output.map(val => val.text),
            src_language: 'eng_Latn',
            tgt_lang: toLanguage,
        })

    }

    const textElement = tab === 'transcription' ? output.map(val => val.text) : ''
    return (
        <main className='flex-1 flex flex-col gap-3 sm:gap-4 md:gap-5 max-w-pros w-full  text-center justify-center p-4 pb-10 mx-auto'>
            <h1 className='font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl whitespace-nowrap'>Your <span className='text-blue-400 bold'>Transcription</span></h1>

            <div className='grid grid-cols-2 mx-auto bg-white shadow  rounded-full overflow-hidden items-center '>
                <button onClick={() => {
                    setTab('transcription')
                }} className={'px-4 py-1 ' + (tab === 'transcription' ? 'bg-blue-300 text-white' : ' text-blue-400 hover:text-blue-600 duration-200')}>Transcription</button>
                <button onClick={() => {
                    setTab('translation')
                }} className={'px-4 py-1 ' + (tab === 'translation' ? 'bg-blue-300 text-white' : ' text-blue-400 hover:text-blue-600 duration-200')} >Translation</button>
            </div>
            <div className='my-8 flex flex-col'>
                {tab === 'transcription' ? (<Transcripton textElement={textElement} {...props} />) : (<Translation toLanguage={toLanguage} textElement={textElement} setTranslating={setTranslating} translating={translating} translation={translation} setTranslation={setTranslation} generateTranslation={generateTranslation} setToLanguage={setToLanguage} {...props} />)
                }
            </div>

            <div className='flex items-center gap-4 mx-auto '>
                <button title={'copy'} className='bg-white text-blue-300 px-2 aspect-square grid place-items-center rounded hover:text-blue-500'>
                    <i className="fa-solid fa-copy"></i>
                </button>
                <button title={'Download'} className='bg-white text-blue-300 px-2 aspect-square grid place-items-center rounded hover:text-blue-500'>
                    <i className="fa-solid fa-download"></i>
                </button>
            </div>

        </main>
    )
}

export default Information
