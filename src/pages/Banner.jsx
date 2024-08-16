import React from 'react';
import banner from '../assets/banner.png'

const Banner = () => {
    return (
        <div>
            <img src={banner} alt="banner" className='w-full h-72' />
        </div>
    );
};

export default Banner;