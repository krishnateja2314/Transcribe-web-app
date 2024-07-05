import React from 'react'
import { LANGUAGES } from '../utils/presets'

function Translation(props) {
    const { generateTranslation, translating, setToLanguage, textElement, toLanguage } = props
    return (
        <div className='flex flex-col gap-2 max-w-[400px] w-full mx-auto'>
            {!translating && (<div className='flex flex-col gap-1'>
                <p className='text-xs mr-auto sm:text-sm font-medium'>To language</p>
                <div className='flex items-stretch gap-2'>
                    <select className='flex-1 outline-none bg-white focus:outline-none border border-solid border-transparent hover:border-blue-300 duration-200 p-2 rounded' value={toLanguage} onChange={(e) => setToLanguage(e.target.value)}>
                        <option value="select language">select language</option>
                        {Object.entries(LANGUAGES).map((key, value) => {
                            return (
                                <option key={key} value={value}>{key}</option>
                            )
                        })}
                    </select>
                    <button onClick={generateTranslation} className='specialBtn px-3 py-2 rounded-lg text-blue-400 hover:text-blue-600 duration-200'>Translate</button>
                </div>
            </div>)}
            {textElement && !translating && (
                <p>{textElement}</p>
            )}
            {translating && (
                <div className='grid place-items-center'>
                    <i className="fa-solid fa-spinner animate-spin"></i>
                </div>
            )}
        </div>
    )
}

export default Translation
