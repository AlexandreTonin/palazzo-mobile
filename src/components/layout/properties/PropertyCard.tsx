import {
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import { IonButton, IonCard } from "@ionic/react";
import formatToBrl from "../../../utils/formatToBrl";
import { Bath, Bed, Heart, MapPin, Square } from "lucide-react";

const PropertyCard = ({ property }) => {
  return (
    <IonCard
      style={{
        paddingBlockStart: 0,
        marginBlockStart: 8,
        position: "relative",
      }}
    >
      <img
        alt="Silhouette of mountains"
        src={
          // property.images[0].url ||
          "https://ionicframework.com/docs/img/demos/card-media.png"
        }
      />
      <IonCardHeader>
        <IonCardTitle>{property.title}</IonCardTitle>
        <IonCardSubtitle>{formatToBrl(Number(property.price))}</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
        <span
          className="ion-display-flex ion-align-items-center"
          style={{ marginBottom: 8 }}
        >
          <MapPin size={16} style={{ marginRight: 4 }} />
          {property.neighborhood} - {property.city}
        </span>

        <div
          className="ion-display-flex ion-align-items-center"
          style={{ marginBottom: 8, gap: 12 }}
        >
          <span className="ion-display-flex ion-align-items-center">
            <Bed size={16} style={{ marginRight: 4 }} />
            {property.bedrooms}
          </span>

          <span className="ion-display-flex ion-align-items-center">
            <Bath size={16} style={{ marginRight: 4 }} />
            {property.bathrooms}
          </span>

          <span className="ion-display-flex ion-align-items-center">
            <Square size={16} style={{ marginRight: 4 }} />
            {property.squareMeters}m²
          </span>
        </div>

        <IonButton color="tertiary" style={{ width: "100%" }}>
          Ver detalhes
        </IonButton>
      </IonCardContent>

      <IonButton
        color="light"
        size="small"
        shape="round"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
        }}
      >
        <Heart size={16} />
      </IonButton>
    </IonCard>
  );
};

export default PropertyCard;
