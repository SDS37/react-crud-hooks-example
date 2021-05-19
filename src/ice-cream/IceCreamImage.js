import React from 'react';
import PropTypes from 'prop-types';

const IceCreamImage = ({ iceCreamId }) => 
  iceCreamId != null && <img 
    src={`${process.env.PUBLIC_URL}/ice-cream-images/ice-cream-${iceCreamId}.svg`}
    alt=""
  />

IceCreamImage.propTypes = {
  iceCreamId: PropTypes.number,
};

export default IceCreamImage;
