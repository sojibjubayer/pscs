import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className='bg-gray-700 flex justify-between items-center'>
            <div className='bg-red-400 text-white font-semibold py-1 px-2 rounded-sm mr-2'>pscs</div>
            <ul className='flex h-12 gap-20 justify-center items-center'>
                <li><Link to="/" className='bg-white py-1 px-2 rounded-sm'>Home</Link> </li>
                <li><Link to="/products" className='bg-white py-1 px-2 rounded-sm'>Products</Link> </li>
                <li><Link to="/about-us" className='bg-white py-1 px-2 rounded-sm'>About Us</Link> </li>
                <li><Link to="/contact-us" className='bg-white py-1 px-2 rounded-sm'>Contact Us</Link> </li>
               
            </ul>
            <div  ><Link className='bg-white py-1 px-2 rounded-sm mr-2'>login</Link></div>
        </div>
    );
};

export default Navbar;