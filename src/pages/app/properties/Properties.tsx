import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonPage,
  IonSearchbar,
  IonSpinner,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import './properties.css';
import Header from '../../../components/layout/Header';
import { useEffect, useState } from 'react';
import PropertyCard from '../../../components/layout/properties/PropertyCard';
import PropertyFilter from '../../../components/layout/properties/PropertyFilter';
import propertiesService from '../../../services/properties';
import favoritesService from '../../../services/favorites';
import { Property } from '../../../types/property';
import { Preferences } from '@capacitor/preferences';

const Tab1: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<
    'house' | 'apartment' | 'penthouse' | 'loft' | undefined
  >();
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchFavorites = async () => {
    setLoadingFavorites(true);
    try {
      const { value: token } = await Preferences.get({
        key: 'Palazzo.accessToken',
      });

      if (token) {
        const favorites = await favoritesService.getAll();
        const ids = favorites.map((fav) => fav.listingId);
        setFavoriteIds(ids);
      } else {
        setFavoriteIds([]);
      }
    } catch {
      setFavoriteIds([]);
    } finally {
      setLoadingFavorites(false);
    }
  };

  useIonViewWillEnter(() => {
    fetchFavorites();
  });

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await propertiesService.getAll({
          type: selectedType,
          search: searchQuery || undefined,
          page: 1,
          limit: 6,
        });
        setProperties(response.data || []);
        setCurrentPage(1);
        setHasMore(
          response.pagination?.currentPage < response.pagination?.totalPages
        );
      } catch (err) {
        console.error('Erro ao buscar propriedades:', err);
        setError('Erro ao carregar imóveis');
        setProperties([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [selectedType, searchQuery]);

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
      setFavoriteIds((prev) => prev.filter((id) => id !== propertyId));
    }
  };

  const loadMore = async (event: CustomEvent<void>) => {
    try {
      const nextPage = currentPage + 1;
      const response = await propertiesService.getAll({
        type: selectedType,
        search: searchQuery || undefined,
        page: nextPage,
        limit: 6,
      });

      if (response.data && response.data.length > 0) {
        setProperties((prev) => [...prev, ...response.data]);
        setCurrentPage(nextPage);
        setHasMore(
          response.pagination?.currentPage < response.pagination?.totalPages
        );
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erro ao carregar mais propriedades:', error);
      setHasMore(false);
    } finally {
      (event.target as HTMLIonInfiniteScrollElement).complete();
    }
  };

  return (
    <IonPage>
      <div className="status-bar-bg"></div>

      <Header />

      <IonToolbar style={{ padding: '0 8px' }}>
        <h1>Imóveis</h1>

        <IonSearchbar
          placeholder="Pesquisar imóveis"
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
        {properties.length === 0 && !loading && !error && (
          <p>Nenhum imóvel encontrado.</p>
        )}

        {loading && <IonSpinner name="crescent" />}
        {error && <p>Erro ao carregar imóveis: {error}</p>}

        {!loadingFavorites && (
          <>
            <IonList
              lines="none"
              style={{ paddingBlockEnd: '80px', paddingBlockStart: 0 }}
            >
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  initialIsFavorited={favoriteIds.includes(property.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </IonList>

            <IonInfiniteScroll
              onIonInfinite={loadMore}
              threshold="100px"
              disabled={!hasMore}
            >
              <IonInfiniteScrollContent
                loadingSpinner="crescent"
                loadingText="Carregando mais imóveis..."
              />
            </IonInfiniteScroll>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
