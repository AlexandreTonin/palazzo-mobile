import React, { useEffect, useState, useRef } from "react";
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
  const [currentImage, setCurrentImage] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    setCurrentImage(0);
  }, [property?.id]);

  const images = property?.images || [];

  const prevImage = () => {
    if (images.length === 0) return;
    setCurrentImage((i) => (i - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    if (images.length === 0) return;
    setCurrentImage((i) => (i + 1) % images.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    if (
      touchStartX.current !== null &&
      touchEndX.current !== null &&
      Math.abs(touchStartX.current - touchEndX.current) > 50
    ) {
      if (touchStartX.current > touchEndX.current) {
        nextImage();
      } else {
        prevImage();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

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
        {images && images.length > 0 && (
          <div
            style={{ position: "relative", width: "100%", height: 280, overflow: "hidden" }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={images[currentImage].url}
              alt={property.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  aria-label="Anterior"
                  style={{
                    position: "absolute",
                    left: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0,0,0,0.35)",
                    color: "white",
                    border: "none",
                    borderRadius: 20,
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  aria-label="Próxima"
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0,0,0,0.35)",
                    color: "white",
                    border: "none",
                    borderRadius: 20,
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  ›
                </button>

                <div
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 6,
                  }}
                >
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      aria-label={`Ir para imagem ${i + 1}`}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 8,
                        background: i === currentImage ? "white" : "rgba(255,255,255,0.6)",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </>
            )}
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
