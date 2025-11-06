import { IonButton, IonInput, IonItem, IonLabel, IonModal } from '@ionic/react';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import './AdvancedFiltersModal.css';

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
}

export interface FilterValues {
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  country?: string;
  city?: string;
}

const AdvancedFiltersModal: React.FC<AdvancedFiltersModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: FilterValues = {};
    setFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    onClose();
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      backdropDismiss={true}
      className="filters-modal"
    >
      <div className="filters-modal-content">
        <div className="filters-modal-header">
          <IonButton onClick={onClose} fill="clear" className="close-button">
            <X size={24} />
          </IonButton>
          <h2>Filtros</h2>
          <IonButton
            onClick={handleClear}
            fill="clear"
            className="clear-button"
          >
            Limpar
          </IonButton>
        </div>

        <div className="filters-modal-body">
          <div style={{ marginBottom: 0 }}>
            <h3 style={{ marginBottom: 12, fontSize: 16 }}>Faixa de preço</h3>

            <div style={{ display: 'flex', gap: 12 }}>
              <IonItem style={{ flex: 1 }}>
                <IonLabel position="stacked">Preço mínimo</IonLabel>
                <IonInput
                  type="number"
                  placeholder="R$ 0"
                  value={filters.minPrice}
                  onIonInput={(e) =>
                    setFilters({
                      ...filters,
                      minPrice: e.detail.value
                        ? Number(e.detail.value)
                        : undefined,
                    })
                  }
                />
              </IonItem>

              <IonItem style={{ flex: 1 }}>
                <IonLabel position="stacked">Preço máximo</IonLabel>
                <IonInput
                  type="number"
                  placeholder="R$ 100.000.000"
                  value={filters.maxPrice}
                  onIonInput={(e) =>
                    setFilters({
                      ...filters,
                      maxPrice: e.detail.value
                        ? Number(e.detail.value)
                        : undefined,
                    })
                  }
                />
              </IonItem>
            </div>
          </div>

          <div style={{ marginBottom: 0 }}>
            <h3 style={{ marginBottom: 12, fontSize: 16 }}>Quartos</h3>
            <div
              style={{
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <IonButton
                  key={num}
                  fill={filters.minBedrooms === num ? 'solid' : 'outline'}
                  size="default"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      minBedrooms: num === 0 ? undefined : num,
                    })
                  }
                  style={{ minWidth: '70px', flex: '0 0 auto' }}
                >
                  {num === 0 ? 'Todos' : `${num}+`}
                </IonButton>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 0 }}>
            <h3 style={{ marginBottom: 12, fontSize: 16 }}>Banheiros</h3>
            <div
              style={{
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <IonButton
                  key={num}
                  fill={filters.minBathrooms === num ? 'solid' : 'outline'}
                  size="default"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      minBathrooms: num === 0 ? undefined : num,
                    })
                  }
                  style={{ minWidth: '70px', flex: '0 0 auto' }}
                >
                  {num === 0 ? 'Todos' : `${num}+`}
                </IonButton>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 0 }}>
            <h3 style={{ marginBottom: 12, fontSize: 16 }}>Localização</h3>
            <IonItem>
              <IonLabel position="stacked">País</IonLabel>
              <IonInput
                placeholder="Ex: Brasil"
                value={filters.country}
                onIonInput={(e) =>
                  setFilters({
                    ...filters,
                    country: e.detail.value || undefined,
                  })
                }
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Cidade</IonLabel>
              <IonInput
                placeholder="Ex: São Paulo"
                value={filters.city}
                onIonInput={(e) =>
                  setFilters({ ...filters, city: e.detail.value || undefined })
                }
              />
            </IonItem>
          </div>
        </div>

        <div className="filters-modal-footer">
          <IonButton expand="block" onClick={handleApply} color="primary">
            Aplicar filtros
          </IonButton>
        </div>
      </div>
    </IonModal>
  );
};

export default AdvancedFiltersModal;
