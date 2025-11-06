import { IonContent, IonPage } from "@ionic/react";
import "./contact.css";
import Header from "../../../components/layout/Header";

const Tab3: React.FC = () => {
  return (
    <IonPage>
      <div className="status-bar-bg"></div>

      <Header />

      <IonContent className="ion-padding-horizontal">
        <h1>Contato</h1>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
