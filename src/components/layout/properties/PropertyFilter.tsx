import { IonButton } from '@ionic/react';
import { Building, Building2, Home, Hotel } from 'lucide-react';
import React from 'react';

interface PropertyFilterProps {
  selectedType?: 'house' | 'apartment' | 'penthouse' | 'loft';
  onFilterChange: (type?: 'house' | 'apartment' | 'penthouse' | 'loft') => void;
}

const PropertyFilter: React.FC<PropertyFilterProps> = ({
  selectedType,
  onFilterChange,
}) => {
  const filters = [
    { type: 'house' as const, label: 'Casas', icon: Home },
    { type: 'apartment' as const, label: 'Apartamentos', icon: Building },
    { type: 'penthouse' as const, label: 'Coberturas', icon: Building2 },
    { type: 'loft' as const, label: 'Lofts', icon: Hotel },
  ];

  return (
    <div
      style={{ display: 'flex', overflowX: 'auto', paddingBlockEnd: 8, gap: 8 }}
    >
      <IonButton
        size="small"
        color={!selectedType ? 'primary' : 'light'}
        shape="round"
        onClick={() => onFilterChange(undefined)}
      >
        Todos
      </IonButton>

      {filters.map(({ type, label, icon: Icon }) => (
        <IonButton
          key={type}
          size="small"
          color={selectedType === type ? 'primary' : 'light'}
          shape="round"
          onClick={() => onFilterChange(type)}
        >
          <Icon size={16} style={{ marginRight: 4 }} />
          {label}
        </IonButton>
      ))}
    </div>
  );
};

export default PropertyFilter;
