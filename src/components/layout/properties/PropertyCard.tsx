import {
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  useIonToast,
} from '@ionic/react';
import { IonButton, IonCard } from '@ionic/react';
import formatToBrl from '../../../utils/formatToBrl';
import { Bath, Bed, Heart, MapPin, Square } from 'lucide-react';
import { Property } from '../../../types/property';
import { useState, useEffect } from 'react';
import favoritesService from '../../../services/favorites';

interface PropertyCardProps {
  property: Property;
  initialIsFavorited?: boolean;
  onFavoriteToggle?: (propertyId: number, isFavorited: boolean) => void;
}

const PropertyCard = ({
  property,
  initialIsFavorited = false,
  onFavoriteToggle,
}: PropertyCardProps) => {
  const [loading, setLoading] = useState(false);
  const [favorited, setFavorited] = useState(initialIsFavorited);
  const [presentToast] = useIonToast();

  useEffect(() => {
    setFavorited(initialIsFavorited);
  }, [initialIsFavorited]);

  const handleFavoriteToggle = async () => {
    setLoading(true);

    try {
      if (favorited) {
        await favoritesService.remove(property.id);
        setFavorited(false);
        onFavoriteToggle?.(property.id, false);

        presentToast({
          message: 'Removido dos favoritos',
          duration: 2000,
          color: 'medium',
          position: 'bottom',
        });
      } else {
        await favoritesService.add(property.id);
        setFavorited(true);
        onFavoriteToggle?.(property.id, true);

        presentToast({
          message: 'Adicionado aos favoritos',
          duration: 2000,
          color: 'success',
          position: 'bottom',
        });
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
          position: 'bottom',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonCard
      style={{
        paddingBlockStart: 0,
        marginBlockStart: 8,
        position: 'relative',
      }}
    >
      <img
        alt={property.title}
        src={
          property.images[0]?.url ||
          'https://ionicframework.com/docs/img/demos/card-media.png'
        }
      />
      <IonCardHeader>
        <IonCardTitle>{property.title}</IonCardTitle>
        <IonCardSubtitle>{formatToBrl(Number(property.price))}</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
        <span
          className="ion-display-flex ion-align-items-center"
          style={{ marginBottom: 8 }}
        >
          <MapPin size={16} style={{ marginRight: 4 }} />
          {property.neighborhood} - {property.city}
        </span>

        <div
          className="ion-display-flex ion-align-items-center"
          style={{ marginBottom: 8, gap: 12 }}
        >
          <span className="ion-display-flex ion-align-items-center">
            <Bed size={16} style={{ marginRight: 4 }} />
            {property.bedrooms}
          </span>

          <span className="ion-display-flex ion-align-items-center">
            <Bath size={16} style={{ marginRight: 4 }} />
            {property.bathrooms}
          </span>

          <span className="ion-display-flex ion-align-items-center">
            <Square size={16} style={{ marginRight: 4 }} />
            {property.squareMeters}m²
          </span>
        </div>

        <IonButton color="tertiary" style={{ width: '100%' }}>
          Ver detalhes
        </IonButton>
      </IonCardContent>

      <IonButton
        color="light"
        size="small"
        shape="round"
        disabled={loading}
        onClick={handleFavoriteToggle}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
        }}
      >
        <Heart
          size={16}
          fill={favorited ? 'red' : 'none'}
          color={favorited ? 'red' : 'currentColor'}
        />
      </IonButton>
    </IonCard>
  );
};

export default PropertyCard;
