/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';

const IMAGES = {
  'the-world': 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=800&q=80',
  'uranus': 'https://example.com/uranus-placeholder.png',
  'the-sun': 'https://example.com/the-sun-placeholder.png',
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<'main' | 'second'>('main');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  const handleSectionClick = (imageKey: string) => {
    setSelectedImage(imageKey);
    setCurrentPage('second');
  };

  const handleSaveImage = async () => {
    if (!selectedImage) return;

    if (selectedImage === 'the-sun') {
      setShowMessage(true);
      return;
    }

    const imageUrl = IMAGES[selectedImage as keyof typeof IMAGES];
    const fileName = `${selectedImage}.png`;

    try {
      // Fetch the image to get a blob (prevents some cross-origin issues with direct download links)
      // Note: This requires the image host to have CORS headers. Unsplash supports this.
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to save image:', error);
      // Fallback: try direct download if fetch fails (might just open in new tab depending on browser/headers)
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = fileName;
      a.target = '_blank';
      a.click();
    }
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  const handleBack = () => {
    setCurrentPage('main');
  };

  return (
    <>
      <div className="header-bar">
        Save the World Now
      </div>

      <div className="main-content">
        {/* Save the World Section */}
        <div 
          className="section" 
          onClick={() => handleSectionClick('the-world')}
          id="section-world"
        >
          <img 
            src={IMAGES['the-world']} 
            alt="An image of the world"
            referrerPolicy="no-referrer"
          />
          <span className="section-text">Save the World</span>
        </div>

        {/* Save Uranus Section */}
        <div 
          className="section" 
          onClick={() => handleSectionClick('uranus')}
          id="section-uranus"
        >
          <img 
            src={IMAGES['uranus']} 
            alt="An image of Uranus"
            referrerPolicy="no-referrer"
          />
          <span className="section-text">Save Uranus</span>
        </div>

        {/* Save the Sun Section */}
        <div 
          className="section" 
          onClick={() => handleSectionClick('the-sun')}
          id="section-sun"
        >
          <img 
            src={IMAGES['the-sun']} 
            alt="An image of the Sun"
            referrerPolicy="no-referrer"
          />
          <span className="section-text">Save the Sun</span>
        </div>
      </div>

      <div className="attribution">
        Original app by Outfit7 Limited.
      </div>
      
      <div 
        id="second-page" 
        className={`second-page ${currentPage === 'second' ? 'show' : ''}`}
      >
        <button 
          className="back-button"
          onClick={handleBack}
        >
          Back
        </button>
        <div className="image-container">
          <img 
            id="second-page-image" 
            src={selectedImage ? IMAGES[selectedImage as keyof typeof IMAGES] : ''}
            alt={selectedImage || ''}
            referrerPolicy="no-referrer"
          />
          <button 
            id="save-button" 
            className="second-page-button"
            onClick={handleSaveImage}
          >
            Save {selectedImage ? selectedImage.replace('-', ' ') : ''}
          </button>
        </div>
      </div>

      <div id="message-box" className={`message-box ${showMessage ? 'show' : ''}`}>
        <p>Saving aborted, you were too late. Oracle Corporation got there first!</p>
        <button id="close-message" onClick={handleCloseMessage}>OK</button>
      </div>
    </>
  );
}

