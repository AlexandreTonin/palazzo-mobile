import { IonButton } from "@ionic/react";
import { Building, Building2, Home } from "lucide-react";
import React from "react";

const PropertyFilter = () => {
  return (
    <div style={{ display: "flex", overflowX: "auto", paddingBlockEnd: 8 }}>
      <IonButton size="small" color={"light"} shape="round">
        <Home size={16} style={{ marginRight: 4 }} />
        Casas
      </IonButton>

      <IonButton size="small" color={"light"} shape="round">
        <Building size={16} style={{ marginRight: 4 }} />
        Apartamentos
      </IonButton>

      <IonButton size="small" color={"light"} shape="round">
        <Building2 size={16} style={{ marginRight: 4 }} />
        Prédios
      </IonButton>
    </div>
  );
};

export default PropertyFilter;
