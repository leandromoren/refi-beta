import React from "react";
import styles from "../styles/Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">About Us</h4>
            <p className="text-gray-300">Your trusted real estate platform</p>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Contact</h4>
            <div className="text-gray-300 space-y-2">
              <p>Email: contact@refi.com</p>
              <p>Phone: (555) 123-4567</p>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                Twitter
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-700 pt-4">
          <p className="text-center text-gray-300">
            &copy; {new Date().getFullYear()} Refi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;