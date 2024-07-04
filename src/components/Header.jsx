import React from 'react'

function Header() {
    return (
        <header className='flex p-4 items-center justify-between gap-4'>
            <a href="/">
                <h1 className='bold font-medium'>Trans<span className='text-blue-400'>Scribe</span></h1>
            </a>
            <a href='/' className='specialBtn text-sm px-3 py-2 rounded-lg flex items-center gap-2'>
                <p>New</p>
                <i className="fa-solid fa-plus"></i>
            </a>
        </header>
    )
}

export default Header
