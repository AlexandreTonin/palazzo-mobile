import {
  IonContent,
  IonList,
  IonPage,
  IonSearchbar,
  IonSpinner,
  IonToolbar,
  useIonViewWillEnter,
  IonButton,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  RefresherCustomEvent,
} from "@ionic/react";
import "./likedProperties.css";
import Header from "../../../components/layout/Header";
import { useEffect, useState } from "react";
import PropertyCard from "../../../components/layout/properties/PropertyCard";
import PropertyFilter from "../../../components/layout/properties/PropertyFilter";
import AdvancedFiltersModal, {
  FilterValues,
} from "../../../components/layout/properties/AdvancedFiltersModal";
import favoritesService from "../../../services/favorites";
import { Property } from "../../../types/property";
import { SlidersHorizontal } from "lucide-react";
import useAuth from "../../../hooks/useAuth";

const Tab2: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<
    "house" | "apartment" | "penthouse" | "loft" | undefined
  >();
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterValues>({});
  const [refresh, setRefresh] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchFavorites = async () => {
    if (!isAuthenticated) {
      setProperties([]);
      setFilteredProperties([]);
      setFavoriteIds([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const favorites = await favoritesService.getAll();
      const favoriteProperties = favorites.map((fav) => fav.listing);
      const ids = favorites.map((fav) => fav.listingId);

      setProperties(favoriteProperties);
      setFavoriteIds(ids);
    } catch (err) {
      console.error("Erro ao buscar favoritos:", err);
      setError("Erro ao carregar imóveis favoritados");
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
  }, [refresh]);

  useEffect(() => {
    const filtered = properties.filter((prop) => {
      if (selectedType && prop.type !== selectedType) return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          prop.title.toLowerCase().includes(query) ||
          prop.city.toLowerCase().includes(query) ||
          prop.neighborhood.toLowerCase().includes(query) ||
          prop.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      if (
        advancedFilters.minPrice &&
        Number(prop.price) < advancedFilters.minPrice
      )
        return false;
      if (
        advancedFilters.maxPrice &&
        Number(prop.price) > advancedFilters.maxPrice
      )
        return false;
      if (
        advancedFilters.minBedrooms &&
        prop.bedrooms < advancedFilters.minBedrooms
      )
        return false;
      if (
        advancedFilters.minBathrooms &&
        prop.bathrooms < advancedFilters.minBathrooms
      )
        return false;
      if (
        advancedFilters.country &&
        !prop.country
          .toLowerCase()
          .includes(advancedFilters.country.toLowerCase())
      )
        return false;
      if (
        advancedFilters.city &&
        !prop.city.toLowerCase().includes(advancedFilters.city.toLowerCase())
      )
        return false;

      return true;
    });

    setFilteredProperties(filtered);
  }, [properties, selectedType, searchQuery, advancedFilters, refresh]);

  const handleFilterChange = (
    type?: "house" | "apartment" | "penthouse" | "loft"
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

  function handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      setRefresh((prev) => !prev);
      event.detail.complete();
    }, 2000);
  }

  return (
    <IonPage>
      <div className="status-bar-bg"></div>

      <Header />

      <IonToolbar style={{ padding: "0 8px" }}>
        <h1>Imóveis Curtidos</h1>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "top",
            marginBottom: "8px",
            overflow: "visible",
          }}
        >
          <IonSearchbar
            placeholder="Pesquisar favoritos"
            className="ion-no-padding ion-no-margin"
            debounce={500}
            value={searchQuery}
            onIonInput={(e) => handleSearchChange(e.detail.value || "")}
            onIonClear={() => handleSearchChange("")}
            style={{ flex: 1, "--min-height": "44px" }}
          ></IonSearchbar>

          <div style={{ position: "relative", overflow: "visible" }}>
            <IonButton
              fill="outline"
              onClick={() => setIsFilterModalOpen(true)}
              style={{
                width: "44px",
                height: "36px",
                minHeight: "auto",
                position: "relative",
                margin: 0,
                "--padding-start": "0",
                "--padding-end": "0",
                "--padding-top": "0",
                "--padding-bottom": "0",
                "--min-height": "36px",
                "--height": "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "visible",
              }}
            >
              <SlidersHorizontal size={20} />
            </IonButton>
            {getActiveFiltersCount() > 0 && (
              <IonBadge
                color="primary"
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  fontSize: "11px",
                  minWidth: "20px",
                  height: "20px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {!isAuthenticated && (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p>Faça login para ver seus imóveis favoritos</p>
          </div>
        )}

        {isAuthenticated &&
          filteredProperties.length === 0 &&
          !loading &&
          !error && (
            <div style={{ padding: "20px", textAlign: "center" }}>
              <p>
                {properties.length === 0
                  ? "Você ainda não favoritou nenhum imóvel"
                  : "Nenhum imóvel encontrado com os filtros selecionados"}
              </p>
            </div>
          )}

        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <IonSpinner name="crescent" />
          </div>
        )}

        {error && (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p>Erro ao carregar imóveis: {error}</p>
          </div>
        )}

        {isAuthenticated && !loading && (
          <IonList
            lines="none"
            style={{ paddingBlockEnd: "80px", paddingBlockStart: 0 }}
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
