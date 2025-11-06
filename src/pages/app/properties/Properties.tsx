import {
  IonContent,
  IonList,
  IonPage,
  IonSearchbar,
  IonSpinner,
  IonToolbar,
} from '@ionic/react';
import './properties.css';
import Header from '../../../components/layout/Header';
import { useEffect, useState } from 'react';
import PropertyCard from '../../../components/layout/properties/PropertyCard';
import PropertyFilter from '../../../components/layout/properties/PropertyFilter';
import propertiesService from '../../../services/properties';
import { Property } from '../../../types/property';

const Tab1: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    const response = await propertiesService.getAll();
    setProperties(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <IonPage>
      <div className="status-bar-bg"></div>

      <Header />

      <IonToolbar style={{ padding: '0 8px' }}>
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
          style={{ paddingBlockEnd: '80px', paddingBlockStart: 0 }}
        >
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
