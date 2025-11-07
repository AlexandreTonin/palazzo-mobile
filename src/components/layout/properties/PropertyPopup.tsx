import React, { useEffect, useState } from 'react';
import { Property } from '../../../types/property';
import formatToBrl from '../../../utils/formatToBrl';
import { Bath, Bed, MapPin, Square, Heart } from 'lucide-react';
import { IonButton, useIonToast } from '@ionic/react';
import favoritesService from '../../../services/favorites';
import './PropertyPopup.css';

interface PropertyPopupProps {
  property: Property;
  onFavoriteToggle?: (propertyId: number, isFavorited: boolean) => void;
  favoritesUpdatedAt?: number;
}

const PropertyPopup: React.FC<PropertyPopupProps> = ({
  property,
  onFavoriteToggle,
  favoritesUpdatedAt,
}) => {
  const [favorited, setFavorited] = useState(false);
  const [presentToast] = useIonToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const favs = await favoritesService.getAll();
        if (!mounted) return;
        const exists = (favs || []).some((f) => f.listingId === property.id);
        setFavorited(!!exists);
      } catch {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [property.id, favoritesUpdatedAt]);

  const handleFavoriteToggle = async () => {
    try {
      if (favorited) {
        await favoritesService.remove(property.id);
        setFavorited(false);
        onFavoriteToggle?.(property.id, false);
        presentToast({
          message: 'Removido dos favoritos',
          duration: 2000,
          color: 'medium',
        });
        // notify other parts of the app that favorites changed
        try {
          window.dispatchEvent(
            new CustomEvent('favorites:changed', {
              detail: { propertyId: property.id, isFavorited: false },
            })
          );
        } catch {
          /* ignore */
        }
      } else {
        await favoritesService.add(property.id);
        setFavorited(true);
        onFavoriteToggle?.(property.id, true);
        presentToast({
          message: 'Adicionado aos favoritos',
          duration: 2000,
          color: 'success',
        });
        // notify other parts of the app that favorites changed
        try {
          window.dispatchEvent(
            new CustomEvent('favorites:changed', {
              detail: { propertyId: property.id, isFavorited: true },
            })
          );
        } catch {
          /* ignore */
        }
      }
    } catch (error) {
      interface AxiosError {
        response?: {
          status?: number;
          data?: unknown;
        };
        message?: string;
      }

      const axiosError = error as AxiosError;
      const status = axiosError?.response?.status;
      const message = String(error);

      const isAuthError =
        !status ||
        status === 401 ||
        message.includes('does not exist') ||
        message.includes('No refresh token') ||
        message.includes('Unauthorized');

      if (isAuthError) {
        presentToast({
          message: 'Faça login para favoritar imóveis',
          duration: 3000,
          color: 'warning',
          position: 'bottom',
        });
      } else {
        presentToast({
          message: 'Erro ao favoritar. Tente novamente.',
          duration: 2000,
          color: 'danger',
        });
      }
    }
  };

  return (
    <div className="property-popup">
      <div className="property-popup__image-wrapper">
        {property.images[0] && (
          <img
            src={property.images[0].url}
            alt={property.title}
            className="property-popup__image"
          />
        )}
        <IonButton
          className="property-popup__fav-btn"
          fill="solid"
          color="light"
          size="small"
          shape="round"
          onClick={handleFavoriteToggle}
          aria-label={favorited ? 'Remover favorito' : 'Adicionar favorito'}
        >
          <Heart
            size={16}
            fill={favorited ? '#ff385c' : 'none'}
            color={favorited ? '#ff385c' : '#222'}
          />
        </IonButton>
      </div>
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
