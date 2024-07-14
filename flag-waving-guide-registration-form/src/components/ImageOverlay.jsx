import React, { useState } from 'react';

const ImageOverlay = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  const handleImageClick = (src) => {
    setImageSrc(src);
    setShowOverlay(true);
  };

  const handleOverlayClick = () => {
    setShowOverlay(false);
  };

  return (
    <div>
      <img
        id="clickableImage"
        src="/flag-waving-guide-registration-form/map.jpg"
        alt="map"
        onClick={() => handleImageClick('/flag-waving-guide-registration-form/map.jpg')}
      />
      {showOverlay && (
        <div id="imageOverlay" onClick={handleOverlayClick}>
          <img id="fullSizeImage" src={imageSrc} alt="full-size" />
        </div>
      )}
    </div>
  );
};

export default ImageOverlay;
