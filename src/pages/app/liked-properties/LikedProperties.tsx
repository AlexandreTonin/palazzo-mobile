import {
  IonContent,
  IonList,
  IonPage,
  IonSearchbar,
  IonSpinner,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import './likedProperties.css';
import Header from '../../../components/layout/Header';
import { useEffect, useState } from 'react';
import PropertyCard from '../../../components/layout/properties/PropertyCard';
import PropertyFilter from '../../../components/layout/properties/PropertyFilter';
import favoritesService from '../../../services/favorites';
import { Property } from '../../../types/property';
import { Preferences } from '@capacitor/preferences';

const Tab2: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<
    'house' | 'apartment' | 'penthouse' | 'loft' | undefined
  >();
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchFavorites = async () => {
    const { value: token } = await Preferences.get({
      key: 'Palazzo.accessToken',
    });

    if (!token) {
      setIsAuthenticated(false);
      setProperties([]);
      setFilteredProperties([]);
      setFavoriteIds([]);
      return;
    }

    setIsAuthenticated(true);
    setLoading(true);
    setError(null);

    try {
      const favorites = await favoritesService.getAll();
      const favoriteProperties = favorites.map((fav) => fav.listing);
      const ids = favorites.map((fav) => fav.listingId);

      setProperties(favoriteProperties);
      setFavoriteIds(ids);
    } catch (err) {
      console.error('Erro ao buscar favoritos:', err);
      setError('Erro ao carregar imóveis favoritados');
      setProperties([]);
      setFavoriteIds([]);
    } finally {
      setLoading(false);
    }
  };

  useIonViewWillEnter(() => {
    fetchFavorites();
  });

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    let filtered = [...properties];

    if (selectedType) {
      filtered = filtered.filter((prop) => prop.type === selectedType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (prop) =>
          prop.title.toLowerCase().includes(query) ||
          prop.city.toLowerCase().includes(query) ||
          prop.neighborhood.toLowerCase().includes(query) ||
          prop.description.toLowerCase().includes(query)
      );
    }

    setFilteredProperties(filtered);
  }, [properties, selectedType, searchQuery]);

  const handleFilterChange = (
    type?: 'house' | 'apartment' | 'penthouse' | 'loft'
  ) => {
    setSelectedType(type);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleFavoriteToggle = (propertyId: number, isFavorited: boolean) => {
    if (isFavorited) {
      setFavoriteIds((prev) => [...prev, propertyId]);
    } else {
      setProperties((prev) => prev.filter((prop) => prop.id !== propertyId));
      setFavoriteIds((prev) => prev.filter((id) => id !== propertyId));
    }
  };

  return (
    <IonPage>
      <div className="status-bar-bg"></div>

      <Header />

      <IonToolbar style={{ padding: '0 8px' }}>
        <h1>Imóveis Curtidos</h1>

        <IonSearchbar
          placeholder="Pesquisar favoritos"
          className="ion-no-padding ion-no-margin"
          debounce={500}
          value={searchQuery}
          onIonInput={(e) => handleSearchChange(e.detail.value || '')}
          onIonClear={() => handleSearchChange('')}
        ></IonSearchbar>

        <PropertyFilter
          selectedType={selectedType}
          onFilterChange={handleFilterChange}
        />
      </IonToolbar>

      <IonContent scrollY={true}>
        {!isAuthenticated && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Faça login para ver seus imóveis favoritos</p>
          </div>
        )}

        {isAuthenticated &&
          filteredProperties.length === 0 &&
          !loading &&
          !error && (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p>
                {properties.length === 0
                  ? 'Você ainda não favoritou nenhum imóvel'
                  : 'Nenhum imóvel encontrado com os filtros selecionados'}
              </p>
            </div>
          )}

        {loading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <IonSpinner name="crescent" />
          </div>
        )}

        {error && (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Erro ao carregar imóveis: {error}</p>
          </div>
        )}

        {isAuthenticated && !loading && (
          <IonList
            lines="none"
            style={{ paddingBlockEnd: '80px', paddingBlockStart: 0 }}
          >
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                initialIsFavorited={favoriteIds.includes(property.id)}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
