import React from 'react';
import { Github, Linkedin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/sheikhmuhammadzain"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-300 transition-colors"
            >
              <Github size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/muhammad-zain-afzal-649209227/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-300 transition-colors"
            >
              <Linkedin size={24} />
            </a>
          </div>
          <p className="flex items-center gap-2">
            Made with <Heart className="text-red-500" size={16} /> by ZainSheikh
          </p>
        </div>
      </div>
    </footer>
  );
}