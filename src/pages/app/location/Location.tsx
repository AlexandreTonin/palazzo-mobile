import {
  IonButton,
  IonContent,
  IonPage,
  IonSpinner,
  useIonViewWillEnter,
} from '@ionic/react';
import './location.css';
import Header from '../../../components/layout/Header';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '../../../types/property';
import propertiesService from '../../../services/properties';
import formatToBrl from '../../../utils/formatToBrl';
import { Locate } from 'lucide-react';
import PropertyPopup from '../../../components/layout/properties/PropertyPopup';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createPropertyIcon = (price: string) => {
  return L.divIcon({
    className: 'custom-property-marker',
    html: `<div class="property-marker-content">${formatToBrl(
      Number(price)
    )}</div>`,
    iconSize: [80, 32],
    iconAnchor: [40, 32],
  });
};

const userIcon = L.divIcon({
  className: 'user-location-marker',
  html: '<div class="user-marker-content">📍</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function MapEvents({ onMove }: { onMove: (center: [number, number]) => void }) {
  const map = useMap();

  useEffect(() => {
    const handleMove = () => {
      const center = map.getCenter();
      onMove([center.lat, center.lng]);
    };

    map.on('moveend', handleMove);
    return () => {
      map.off('moveend', handleMove);
    };
  }, [map, onMove]);

  return null;
}

function RecenterButton({ position }: { position: [number, number] }) {
  const map = useMap();

  return (
    <IonButton
      fill="solid"
      color="light"
      onClick={() => map.setView(position, 13)}
      style={{
        position: 'absolute',
        bottom: '32px',
        right: '20px',
        zIndex: 1000,
        borderRadius: '50%',
        width: '48px',
        height: '48px',
        '--padding-start': '0',
        '--padding-end': '0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Locate size={22} />
    </IonButton>
  );
}

const Tab3: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setUserLocation(coords);
          setMapCenter(coords);
          setLocationError(null);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          setLocationError(
            'Não foi possível acessar sua localização. Mostrando São Paulo.'
          );
          // Define São Paulo como fallback apenas se houver erro
          setMapCenter([-23.5505, -46.6333]);
          setLoading(false);
        }
      );
    } else {
      setLocationError('Geolocalização não suportada neste dispositivo.');
      setMapCenter([-23.5505, -46.6333]);
      setLoading(false);
    }
  }, []);

  useIonViewWillEnter(() => {
    fetchProperties();
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await propertiesService.getAll({ limit: 100 });
      const validProperties = (response.data || []).filter(
        (prop) => prop.latitude !== null && prop.longitude !== null
      );
      setProperties(validProperties);
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapMove = (center: [number, number]) => {
    setMapCenter(center);
  };

  return (
    <IonPage>
      <div className="status-bar-bg"></div>

      <Header />

      <IonContent className="map-content">
        {locationError && (
          <div
            style={{
              padding: '10px',
              background: 'var(--ion-color-warning)',
              color: 'white',
              textAlign: 'center',
              fontSize: '12px',
            }}
          >
            {locationError}
          </div>
        )}

        {loading && !mapCenter ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <IonSpinner name="crescent" />
          </div>
        ) : (
          mapCenter && (
            <div style={{ height: '100%', width: '100%' }}>
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {userLocation && (
                  <Marker position={userLocation} icon={userIcon}>
                    <Popup>
                      <strong>Você está aqui</strong>
                    </Popup>
                  </Marker>
                )}

                {properties.map((property) => {
                  if (property.latitude === null || property.longitude === null)
                    return null;

                  return (
                    <Marker
                      key={property.id}
                      position={[property.latitude, property.longitude]}
                      icon={createPropertyIcon(property.price)}
                    >
                      <Popup>
                        <PropertyPopup property={property} />
                      </Popup>
                    </Marker>
                  );
                })}

                <MapEvents onMove={handleMapMove} />
                {userLocation && <RecenterButton position={userLocation} />}
              </MapContainer>
            </div>
          )
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
