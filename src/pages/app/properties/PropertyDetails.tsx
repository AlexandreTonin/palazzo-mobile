import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonSpinner,
  IonBadge,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import propertiesService from "../../../services/properties";
import favoritesService from "../../../services/favorites";
import useAuth from "../../../hooks/useAuth";
import { getPropertyTypeName, Property } from "../../../types/property";
import formatToBrl from "../../../utils/formatToBrl";
import { Bath, Bed, Heart, MapPin, Square } from "lucide-react";
import { Browser } from "@capacitor/browser";
import { isPlatform } from "@ionic/react";
import { AppLauncher } from "@capacitor/app-launcher";

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { isAuthenticated } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await propertiesService.getById(id);
        setProperty(data);

        try {
          const favs = await favoritesService.getAll();
          const exists = favs.some((f) => f.listingId === data.id);
          setFavorited(exists);
        } catch {}
      } catch (err) {
        console.error("Error fetching property", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      history.push("/login");
      return;
    }

    if (!property) return;

    setFavLoading(true);
    try {
      if (favorited) {
        await favoritesService.remove(property.id);
        setFavorited(false);
      } else {
        await favoritesService.add(property.id);
        setFavorited(true);
      }
    } catch (err) {
      console.error("Favorite toggle failed", err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleContact = async () => {
    if (!property) return;

    const contactMessage = `Olá, tenho interesse no imóvel "${
      property.title
    }" listado por R$ ${formatToBrl(
      Number(property.price)
    )}. Por favor, entre em contato comigo.`;

    const phone = property.contactPhone.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(contactMessage);

    if (isPlatform("capacitor")) {
      const whatsappURL = `whatsapp://send?phone=${phone}&text=${encodedMessage}`;

      try {
        const canOpen = await AppLauncher.canOpenUrl({ url: whatsappURL });

        if (canOpen.value) {
          await AppLauncher.openUrl({ url: whatsappURL });
        } else {
          await Browser.open({
            url: `https://wa.me/${phone}?text=${encodedMessage}`,
          });
        }
      } catch (error) {
        await Browser.open({
          url: `https://wa.me/${phone}?text=${encodedMessage}`,
        });
      }
    } else {
      window.open(
        `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`,
        "_blank"
      );
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Imóvel</IonTitle>
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

  if (!property) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Imóvel</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>Imóvel não encontrado.</p>
        </IonContent>
      </IonPage>
    );
  }

  const mainImage =
    property.images && property.images.length > 0
      ? property.images[0].url
      : undefined;

  return (
    <IonPage style={{ padding: "0 0 100px 0px" }}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonTitle>{property.title}</IonTitle>
            <IonBackButton text={"Voltar"} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent
        style={{
          marginBlockEnd: 64,
          paddingBlockEnd: 64,
          paddingBottom: 64,
          marginBottom: 64,
        }}
      >
        {mainImage && (
          <div style={{ width: "100%", height: 280, overflow: "hidden" }}>
            <img
              src={mainImage}
              alt={property.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              {property.title}{" "}
              <IonBadge color="primary" style={{ marginLeft: 8 }}>
                {getPropertyTypeName(property.type)}
              </IonBadge>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p style={{ fontSize: 20, fontWeight: 700 }}>
              {formatToBrl(Number(property.price))}
            </p>
            <p style={{ marginTop: 8 }}>{property.description}</p>

            <div style={{ marginTop: 12 }}>
              <strong>Localização</strong>
              <span className="ion-display-flex ion-align-items-center">
                <MapPin size={16} style={{ marginRight: 4 }} />
                <p>
                  {property.neighborhood}, {property.city}, {property.region},{" "}
                  {property.country}
                </p>
              </span>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <div>
                <strong>Quartos</strong>
                <span className="ion-display-flex ion-align-items-center">
                  <Bed size={16} style={{ marginRight: 4 }} />
                  <p>{property.bedrooms}</p>
                </span>
              </div>
              <div>
                <strong>Banheiros</strong>
                <span className="ion-display-flex ion-align-items-center">
                  <Bath size={16} style={{ marginRight: 4 }} />
                  <p>{property.bathrooms}</p>
                </span>
              </div>
              <div>
                <strong>Área</strong>
                <span className="ion-display-flex ion-align-items-center">
                  <Square size={16} style={{ marginRight: 4 }} />
                  <p>{property.squareMeters} m²</p>
                </span>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <strong>Contato</strong>
              <p>Telefone: {property.contactPhone}</p>
              <p>Email: {property.contactEmail}</p>
            </div>

            <div
              style={{ display: "flex", gap: 12, marginTop: 18, width: "100%" }}
            >
              <IonButton style={{ width: "100%" }} onClick={handleContact}>
                Tenho Interesse
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        <IonButton
          color="light"
          size="small"
          shape="round"
          disabled={loading}
          onClick={toggleFavorite}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <Heart
            size={16}
            fill={favorited ? "red" : "none"}
            color={favorited ? "red" : "currentColor"}
          />
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default PropertyDetails;
