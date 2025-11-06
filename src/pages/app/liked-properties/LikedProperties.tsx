import { IonContent, IonPage } from "@ionic/react";
import "./likedProperties.css";
import Header from "../../../components/layout/Header";

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <div className="status-bar-bg"></div>

      <Header />

      <IonContent className="ion-padding-horizontal">
        <h1>Imóveis Curtidos</h1>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
