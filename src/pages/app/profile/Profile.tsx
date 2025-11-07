import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonSpinner,
  IonButtons,
  IonBackButton,
  IonRefresher,
  IonRefresherContent,
  RefresherCustomEvent,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { LogOut } from "lucide-react";

const Profile: React.FC = () => {
  const history = useHistory();
  const { user, isAuthenticated, loading, logout, refreshUser } = useAuth();

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      // redirect to login when not authenticated
      history.replace("/login");
    }
  }, [loading, isAuthenticated, history]);

  const handleLogout = async () => {
    await logout();
    history.replace("/login");
  };

  function handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      refreshUser();
      event.detail.complete();
    }, 2000);
  }

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Perfil</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent
          className="ion-padding"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IonSpinner name="crescent" />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonTitle>Perfil</IonTitle>
            <IonBackButton text={"Voltar"} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonCard>
          <IonCardContent>
            {user ? (
              <IonList>
                <IonItem>
                  <IonLabel>
                    <h3>Nome</h3>
                    <p>{user.name}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h3>Email</h3>
                    <p>{user.email}</p>
                  </IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>
                    <h3>Telefone</h3>
                    <p>{user.phone}</p>
                  </IonLabel>
                </IonItem>
              </IonList>
            ) : (
              <p>Nenhum usuário autenticado.</p>
            )}
          </IonCardContent>
        </IonCard>

        <div className="ion-padding-horizontal">
          <IonButton
            color="danger"
            onClick={handleLogout}
            style={{ display: "flex", gap: 8, flex: 1 }}
            fill="solid"
          >
            <LogOut /> <span>Sair</span>
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
