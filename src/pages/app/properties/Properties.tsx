import { IonContent, IonPage } from "@ionic/react";
import "./properties.css";
import Header from "../../../components/layout/Header";

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <div className="status-bar-bg"></div>

      <Header />

      <IonContent className="ion-padding-horizontal">
        <h1>Imóveis</h1>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
