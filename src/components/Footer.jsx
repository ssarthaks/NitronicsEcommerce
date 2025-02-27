import React from 'react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-black text-primaryWhite py-8">
      <div className="container mx-auto px-12 ">
        <div className="flex flex-wrap justify-center text-left text-sm">
          <div className="w-full md:w-1/6 mb-6">
            <h3 className="font-semibold mb-3">Shop</h3>
            <ul className='space-y-2'>
              <li><a href="#" className="hover:text-gray-400">All Products</a></li>
              <li><a href="#" className="hover:text-gray-400">Gaming Consoles</a></li>
              <li><a href="#" className="hover:text-gray-400">Accessories</a></li>
              <li><a href="#" className="hover:text-gray-400">PC Components</a></li>
              <li><a href="#" className="hover:text-gray-400">Headsets</a></li>
              <li><a href="#" className="hover:text-gray-400">Game Titles</a></li>
            </ul>
          </div>

          <div className="w-full md:w-1/6 mb-6">
            <h3 className="font-semibold mb-3">About</h3>
            <ul className='space-y-2'>
              <li><a href="#" className="hover:text-gray-400">Our Story</a></li>
              <li><a href="#" className="hover:text-gray-400">Careers</a></li>
              <li><a href="#" className="hover:text-gray-400">Sustainability</a></li>
              <li><a href="#" className="hover:text-gray-400">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-gray-400">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/6 mb-6">
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className='space-y-2'>
              <li><a href="#" className="hover:text-gray-400">FAQs</a></li>
              <li><a href="/privacy-policy" className="hover:text-gray-400">Privacy Policy</a></li>
              <li><a href="/terms-and-conditions" className="hover:text-gray-400">Terms of Service</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/6 mb-6">
            <h3 className="font-semibold mb-3">Contact</h3>
            <ul className='space-y-2'>
              <li>Email Us: <a className="hover:text-gray-400" href='mailto:support@nitronicsgaming.com'>support@nitronicsgaming.com</a></li>
              <li><a className="hover:text-gray-400" href="tel:+977-984-3346958">+977-9843346958</a></li>
              <li><a className="hover:text-gray-400" href="tel:+977-984-3346957">+977-9843346957</a></li>
              <li><a className="hover:text-gray-400" href="tel:+977-980-1090699">+977-9801090699</a></li>
              <li><a href="#" className="hover:text-gray-400">Help Center</a></li>
            </ul>
          </div>
          
        </div>

        <div className="flex justify-center space-x-6 mt-8">
          <a href="https://www.facebook.com/nitronicsgaming" className="flex items-center justify-center p-2 bg-transparent hover:bg-white hover:text-black rounded-full transition duration-300" aria-label="Facebook">
            <FaFacebookF size={20} className="hover:text-black" />
          </a>
          <a href="https://www.instagram.com/nitronicsgaming" className="flex items-center justify-center p-2 bg-transparent hover:bg-white hover:text-black rounded-full transition duration-300" aria-label="Instagram">
            <FaInstagram size={20} className="hover:text-black" />
          </a>
          <a href="https://twitter.com/nitronicsgaming" className="flex items-center justify-center p-2 bg-transparent hover:bg-white hover:text-black rounded-full transition duration-300" aria-label="Twitter">
            <FaXTwitter size={20} className="hover:text-black" />
          </a>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm">© {new Date().getFullYear()} Nitronics Gaming. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
