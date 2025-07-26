import React from 'react'
import subhartiLogo from '../assets/subharti-logo.png';

export const Navbar = () => {
    return (
        <>
            <nav className='w-[100vw] h-[8vh] bg-transparent flex items-center bg-[#b39dd6]'>
                <div className='flex gap-2 m-2'>
                    <img src={subhartiLogo} alt="subharti-logo" className='size-12' />
                    <div className='flex flex-col'>
                        <h2 className='text-xl marcellus-sc-regular text-white'>Subharti Instituite Of Technology And Engineering</h2>
                        <p className='newsreader  text-white'>Subhartipuram, NH-58, Delhi-Haridwar Bypass Road, Meerut-250005.</p>
                    </div>
                </div>
            </nav>
        </>
    )
}
