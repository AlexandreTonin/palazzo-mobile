import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  IonSearchbar,
  IonSpinner,
  IonToolbar,
} from "@ionic/react";
import { home } from "ionicons/icons";
import "./properties.css";
import Header from "../../../components/layout/Header";
import { useEffect, useState } from "react";
import formatToBrl from "../../../utils/formatToBrl";
import {
  Bath,
  Bed,
  Building,
  Building2,
  Heart,
  Home,
  MapPin,
  Pin,
  Square,
} from "lucide-react";
import PropertyCard from "../../../components/layout/properties/PropertyCard";
import PropertyFilter from "../../../components/layout/properties/PropertyFilter";

const Tab1: React.FC = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/listings/");
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      const data = await response.json();
      setProperties(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <IonPage>
      <div className="status-bar-bg"></div>

      <Header />

      <IonToolbar style={{ padding: "0 8px" }}>
        <h1>Imóveis</h1>

        <IonSearchbar
          placeholder="Pesquisar imóveis"
          className="ion-no-padding ion-no-margin"
        ></IonSearchbar>

        <PropertyFilter />
      </IonToolbar>

      <IonContent scrollY={true}>
        {properties.length === 0 && !loading && !error && (
          <p>Nenhum imóvel encontrado.</p>
        )}

        {loading && <IonSpinner name="crescent" />}
        {error && <p>Erro ao carregar imóveis: {error}</p>}

        <IonList
          lines="none"
          style={{ paddingBlockEnd: "80px", paddingBlockStart: 0 }}
        >
          {properties.map((property: any) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
