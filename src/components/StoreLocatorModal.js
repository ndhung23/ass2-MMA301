import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const STORE_LOCATIONS = [
  {
    id: 'store_1',
    name: 'ShopEase Flagship Store - Cau Giay',
    address: 'FPT Tower, 10 Pham Van Bach, Cau Giay, Hanoi',
    distance: '0.8 km',
    hours: '08:00 - 22:00',
    phone: '(+84) 24 7300 1866',
    isOpen: true,
  },
  {
    id: 'store_2',
    name: 'ShopEase Experience Center - Hoa Lac',
    address: 'Khu Cong Nghe Cao Hoa Lac, Thach That, Hanoi',
    distance: '24.5 km',
    hours: '08:30 - 21:30',
    phone: '(+84) 24 7300 5588',
    isOpen: true,
  },
  {
    id: 'store_3',
    name: 'ShopEase Hub - Hai Chau',
    address: 'FPT Complex, Nam Ky Khoi Nghia, Ngu Hanh Son, Da Nang',
    distance: 'Direct Delivery',
    hours: '09:00 - 22:00',
    phone: '(+84) 23 6730 0999',
    isOpen: true,
  },
];

export const StoreLocatorModal = ({ visible, onClose, onSelectStore }) => {
  const [selectedId, setSelectedId] = useState('store_1');

  const handleSelect = (store) => {
    setSelectedId(store.id);
    if (onSelectStore) {
      onSelectStore(store);
    }
    Alert.alert('Store Selected', `Selected pickup at: ${store.name}`);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="location" size={24} color={theme.colors.primary} />
              <View>
                <Text style={styles.title}>Store Pickup Locations</Text>
                <Text style={styles.subtitle}>Free click & collect in 2 hours</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Interactive Map Visual Mockup */}
          <View style={styles.mapBanner}>
            <Ionicons name="map-outline" size={32} color={theme.colors.primary} />
            <Text style={styles.mapBannerText}>Interactive Store Map & GPS Route</Text>
            <View style={styles.mapBadge}>
              <Ionicons name="navigate-circle" size={14} color="#166534" />
              <Text style={styles.mapBadgeText}>3 Stores nearby</Text>
            </View>
          </View>

          {/* Stores List */}
          <ScrollView style={styles.list}>
            {STORE_LOCATIONS.map((store) => {
              const isSelected = selectedId === store.id;
              return (
                <TouchableOpacity
                  key={store.id}
                  style={[styles.storeCard, isSelected && styles.storeCardSelected]}
                  onPress={() => handleSelect(store)}
                  activeOpacity={0.8}
                >
                  <View style={styles.storeCardHeader}>
                    <Text style={styles.storeName}>{store.name}</Text>
                    <View style={styles.distanceBadge}>
                      <Text style={styles.distanceText}>{store.distance}</Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons name="pin" size={14} color={theme.colors.textMuted} />
                    <Text style={styles.infoText}>{store.address}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={14} color={theme.colors.textMuted} />
                    <Text style={styles.infoText}>{store.hours} • Open</Text>
                  </View>

                  <View style={styles.actionRow}>
                    <View style={[styles.selectBtn, isSelected && styles.selectBtnActive]}>
                      <Ionicons
                        name={isSelected ? 'checkmark-circle' : 'radio-button-off'}
                        size={16}
                        color={isSelected ? theme.colors.textInverse : theme.colors.primary}
                      />
                      <Text
                        style={[
                          styles.selectBtnText,
                          isSelected && styles.selectBtnTextActive,
                        ]}
                      >
                        {isSelected ? 'Selected for Pickup' : 'Select This Store'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  closeBtn: {
    padding: 4,
  },
  mapBanner: {
    backgroundColor: '#EFF6FF',
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 4,
  },
  mapBannerText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  mapBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
    gap: 4,
    marginTop: 2,
  },
  mapBadgeText: {
    fontSize: 11,
    color: '#166534',
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: theme.spacing.md,
  },
  storeCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  storeCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
  },
  storeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
    marginRight: 8,
  },
  distanceBadge: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.xs,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  actionRow: {
    marginTop: theme.spacing.md,
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceVariant,
  },
  selectBtnActive: {
    backgroundColor: theme.colors.primary,
  },
  selectBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  selectBtnTextActive: {
    color: theme.colors.textInverse,
  },
});

export default StoreLocatorModal;
