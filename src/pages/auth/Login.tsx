import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
  IonToast,
  IonSpinner,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./auth.css";

const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      setLoading(false);
      // Navigate to main tab
      history.push("/properties");
    } catch (err: unknown) {
      console.error("Login error", err);
      let message = "Erro ao efetuar login";
      if (typeof err === "object" && err !== null && "response" in err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        message = (err as any).response?.data?.message ?? message;
      }
      setError(message);
      setLoading(false);
      setToastOpen(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text={"Voltar"} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding auth-page">
        <div className="auth-box">
          <h2 className="auth-title">Bem-vindo!</h2>

          <form onSubmit={handleSubmit}>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value || "")}
                  required
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Senha</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value || "")}
                  required
                />
              </IonItem>

              <div className="actions">
                <IonButton expand="block" type="submit" disabled={loading}>
                  {loading ? <IonSpinner name="crescent" /> : "Entrar"}
                </IonButton>
              </div>
            </IonList>
          </form>

          <div className="auth-footer">
            <p>
              Não tem conta? <a href="/register">Cadastre-se</a>
            </p>
          </div>
        </div>

        <IonToast
          isOpen={toastOpen}
          onDidDismiss={() => setToastOpen(false)}
          message={error || "Erro"}
          duration={3000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
