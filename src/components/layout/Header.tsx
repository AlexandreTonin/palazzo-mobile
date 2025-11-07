import { IonButtons, IonToolbar } from "@ionic/react";
import { CircleUserRound } from "lucide-react";
import { useHistory } from "react-router";
import useAuth from "../../hooks/useAuth";

const Header = () => {
  const { isAuthenticated } = useAuth();
  const history = useHistory();

  const handleProfilePage = () => {
    if (isAuthenticated) {
      history.push("/profile");
    } else {
      history.push("/login");
    }
  };

  return (
    <IonToolbar className="toolbar">
      <p className="ion-font-bold">Palazzo</p>

      <IonButtons slot="end" onClick={handleProfilePage}>
        <CircleUserRound size={24} />
      </IonButtons>
    </IonToolbar>
  );
};

export default Header;
