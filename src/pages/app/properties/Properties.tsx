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
  IonButton,
  IonBadge,
} from '@ionic/react';
import './properties.css';
import Header from '../../../components/layout/Header';
import { useEffect, useState } from 'react';
import PropertyCard from '../../../components/layout/properties/PropertyCard';
import PropertyFilter from '../../../components/layout/properties/PropertyFilter';
import AdvancedFiltersModal, {
  FilterValues,
} from '../../../components/layout/properties/AdvancedFiltersModal';
import propertiesService from '../../../services/properties';
import favoritesService from '../../../services/favorites';
import { Property } from '../../../types/property';
import { Preferences } from '@capacitor/preferences';
import { SlidersHorizontal } from 'lucide-react';

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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterValues>({});

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
    const handler = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (!detail) return;
      const { propertyId, isFavorited } = detail as {
        propertyId: number;
        isFavorited: boolean;
      };

      if (!propertyId) return;

      if (isFavorited) {
        setFavoriteIds((prev) =>
          prev.includes(propertyId) ? prev : [...prev, propertyId]
        );
      } else {
        setFavoriteIds((prev) => prev.filter((id) => id !== propertyId));
      }
    };

    window.addEventListener('favorites:changed', handler as EventListener);
    return () =>
      window.removeEventListener('favorites:changed', handler as EventListener);
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
          ...advancedFilters,
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
  }, [selectedType, searchQuery, advancedFilters]);

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
    try {
      window.dispatchEvent(
        new CustomEvent('favorites:changed', {
          detail: { propertyId, isFavorited },
        })
      );
    } catch {
      /* ignore */
    }
  };

  const handleApplyFilters = (filters: FilterValues) => {
    setAdvancedFilters(filters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (advancedFilters.minPrice) count++;
    if (advancedFilters.maxPrice) count++;
    if (advancedFilters.minBedrooms) count++;
    if (advancedFilters.minBathrooms) count++;
    if (advancedFilters.country) count++;
    if (advancedFilters.city) count++;
    return count;
  };

  const loadMore = async (event: CustomEvent<void>) => {
    try {
      const nextPage = currentPage + 1;
      const response = await propertiesService.getAll({
        type: selectedType,
        search: searchQuery || undefined,
        page: nextPage,
        limit: 6,
        ...advancedFilters,
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

        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'top',
            marginBottom: '8px',
            overflow: 'visible',
          }}
        >
          <IonSearchbar
            placeholder="Pesquisar imóveis"
            className="ion-no-padding ion-no-margin"
            debounce={500}
            value={searchQuery}
            onIonInput={(e) => handleSearchChange(e.detail.value || '')}
            onIonClear={() => handleSearchChange('')}
            style={{ flex: 1, '--min-height': '44px' }}
          ></IonSearchbar>

          <div style={{ position: 'relative', overflow: 'visible' }}>
            <IonButton
              fill="outline"
              onClick={() => setIsFilterModalOpen(true)}
              style={{
                width: '44px',
                height: '36px',
                minHeight: 'auto',
                position: 'relative',
                margin: 0,
                '--padding-start': '0',
                '--padding-end': '0',
                '--padding-top': '0',
                '--padding-bottom': '0',
                '--min-height': '36px',
                '--height': '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'visible',
              }}
            >
              <SlidersHorizontal size={20} />
            </IonButton>
            {getActiveFiltersCount() > 0 && (
              <IonBadge
                color="primary"
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  fontSize: '11px',
                  minWidth: '20px',
                  height: '20px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                }}
              >
                {getActiveFiltersCount()}
              </IonBadge>
            )}
          </div>
        </div>

        <PropertyFilter
          selectedType={selectedType}
          onFilterChange={handleFilterChange}
        />
      </IonToolbar>

      <AdvancedFiltersModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={advancedFilters}
      />

      <IonContent scrollY={true}>
        {properties.length === 0 && !loading && !error && (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <p
              style={{
                fontSize: '16px',
                color: 'var(--ion-color-medium)',
                margin: 0,
              }}
            >
              Nenhum imóvel encontrado
            </p>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--ion-color-medium)',
                marginTop: '8px',
              }}
            >
              Tente ajustar os filtros ou fazer uma nova busca
            </p>
          </div>
        )}

        {loading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '40px',
            }}
          >
            <IonSpinner name="crescent" />
          </div>
        )}

        {error && (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: '16px', color: 'var(--ion-color-danger)' }}>
              Erro ao carregar imóveis: {error}
            </p>
          </div>
        )}

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
