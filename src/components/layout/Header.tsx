import { IonButtons, IonToolbar } from "@ionic/react";
import { CircleUserRound } from "lucide-react";

const Header = () => {
  return (
    <IonToolbar className="toolbar">
      <p className="ion-font-bold">Palazzo</p>

      <IonButtons slot="end">
        <CircleUserRound size={24} />
      </IonButtons>
    </IonToolbar>
  );
};

export default Header;
