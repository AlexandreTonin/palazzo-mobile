import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
  IonToast,
  IonSpinner,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./auth.css";

const Register: React.FC = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setToastOpen(true);
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password, phone });
      setLoading(false);
      setSuccessOpen(true);
      // small delay then redirect to login
      setTimeout(() => history.push("/login"), 1200);
    } catch (err: unknown) {
      console.error("Register error", err);
      let message = "Erro ao realizar cadastro";
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
          <IonTitle>Cadastro</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding auth-page">
        <div className="auth-box">
          <h2 className="auth-title">Crie sua conta</h2>

          <form onSubmit={handleSubmit}>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Nome completo</IonLabel>
                <IonInput
                  type="text"
                  value={name}
                  onIonChange={(e) => setName(e.detail.value || "")}
                  required
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Telefone</IonLabel>
                <IonInput
                  type="tel"
                  value={phone}
                  onIonChange={(e) => setPhone(e.detail.value || "")}
                  required
                />
              </IonItem>

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

              <IonItem>
                <IonLabel position="stacked">Confirmar senha</IonLabel>
                <IonInput
                  type="password"
                  value={confirmPassword}
                  onIonChange={(e) => setConfirmPassword(e.detail.value || "")}
                  required
                />
              </IonItem>

              <div className="actions">
                <IonButton expand="block" type="submit" disabled={loading}>
                  {loading ? <IonSpinner name="crescent" /> : "Cadastrar"}
                </IonButton>
              </div>
            </IonList>
          </form>

          <div className="auth-footer">
            <p>
              Já possui conta? <a href="/login">Entrar</a>
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

        <IonToast
          isOpen={successOpen}
          onDidDismiss={() => setSuccessOpen(false)}
          message="Cadastro realizado com sucesso"
          duration={1500}
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;
