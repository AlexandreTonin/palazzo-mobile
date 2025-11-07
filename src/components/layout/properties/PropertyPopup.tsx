import React from 'react';
import { Property } from '../../../types/property';
import formatToBrl from '../../../utils/formatToBrl';
import { Bath, Bed, MapPin, Square } from 'lucide-react';
import './PropertyPopup.css';

interface PropertyPopupProps {
  property: Property;
}

const PropertyPopup: React.FC<PropertyPopupProps> = ({ property }) => {
  return (
    <div className="property-popup">
      {property.images[0] && (
        <img
          src={property.images[0].url}
          alt={property.title}
          className="property-popup__image"
        />
      )}
      <div className="property-popup__content">
        <h4 className="property-popup__title">{property.title}</h4>
        <p className="property-popup__price">
          {formatToBrl(Number(property.price))}
        </p>
        <p className="property-popup__location">
          <MapPin size={14} />
          <span>
            {property.neighborhood}, {property.city}
          </span>
        </p>
        <div className="property-popup__details">
          <span className="property-popup__detail-item">
            <Bed size={14} />
            {property.bedrooms}
          </span>
          <span className="property-popup__detail-item">
            <Bath size={14} />
            {property.bathrooms}
          </span>
          <span className="property-popup__detail-item">
            <Square size={14} />
            {property.squareMeters}m²
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyPopup;
