import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Image,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';

const LOGO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663473039589/ZduhfGfuDUikCLBWg6gRh6/croustwok-logo-QWPKiABRNah3V4EwPjbBcs.webp';

function ContactButton({
  icon,
  label,
  value,
  onPress,
  color = '#C0392B',
}: {
  icon: any;
  label: string;
  value: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <TouchableOpacity style={styles.contactBtn} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.contactBtnIcon, { backgroundColor: `${color}18` }]}>
        <IconSymbol name={icon} size={22} color={color} />
      </View>
      <View style={styles.contactBtnInfo}>
        <Text style={styles.contactBtnLabel}>{label}</Text>
        <Text style={styles.contactBtnValue}>{value}</Text>
      </View>
      <IconSymbol name="chevron.right" size={18} color="#9A8F85" />
    </TouchableOpacity>
  );
}

export default function ContactScreen() {
  const handleCall = () => Linking.openURL('tel:+33613175051');
  const handleCallOrder = () => Linking.openURL('tel:+33667155358');
  const handleEmail = () => Linking.openURL('mailto:support@croustwok.com');
  const handleMaps = () => Linking.openURL('https://maps.google.com/?q=78+Avenue+des+Champs+Elysees+Paris');
  const handleTikTok = () => Linking.openURL('https://tiktok.com');
  const handleInstagram = () => Linking.openURL('https://instagram.com');

  return (
    <ScreenContainer edges={['top', 'left', 'right']} containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={{ uri: LOGO_IMAGE }} style={styles.headerLogo} resizeMode="contain" />
          <View style={styles.headerAccent} />
          <Text style={styles.headerTitle}>Nous Contacter</Text>
          <Text style={styles.headerSubtitle}>Choisissez votre restaurant</Text>
        </View>

        {/* Map Placeholder */}
        <TouchableOpacity style={styles.mapCard} onPress={handleMaps} activeOpacity={0.85}>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapEmoji}>📍</Text>
            <Text style={styles.mapTitle}>78 Avenue des Champs Élysées</Text>
            <Text style={styles.mapSubtitle}>75008 Paris, France</Text>
            <View style={styles.mapBtn}>
              <IconSymbol name="map.fill" size={14} color="#FFFFFF" />
              <Text style={styles.mapBtnText}>Ouvrir dans Maps</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coordonnées</Text>
          <ContactButton
            icon="phone.fill"
            label="Téléphone restaurant"
            value="+33 613 175 051"
            onPress={handleCall}
          />
          <ContactButton
            icon="phone.fill"
            label="Commandes"
            value="+33 667 155 358"
            onPress={handleCallOrder}
            color="#E67E22"
          />
          <ContactButton
            icon="envelope.fill"
            label="Email"
            value="support@croustwok.com"
            onPress={handleEmail}
            color="#3498DB"
          />
        </View>

        {/* Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horaires d'ouverture</Text>
          {[
            { day: 'Lundi – Vendredi', hours: '11h00 – 22h30' },
            { day: 'Samedi', hours: '11h00 – 23h00' },
            { day: 'Dimanche', hours: '12h00 – 22h00' },
          ].map((item, index) => (
            <View key={index} style={styles.hoursRow}>
              <Text style={styles.hoursDay}>{item.day}</Text>
              <View style={styles.hoursOpen}>
                <View style={styles.hoursOpenDot} />
                <Text style={styles.hoursTime}>{item.hours}</Text>
              </View>
            </View>
          ))}
          <View style={styles.hoursNote}>
            <Text style={styles.hoursNoteText}>🔥 Ouvert 7j/7 — Service continu</Text>
          </View>
        </View>

        {/* Delivery Info */}
        <View style={styles.deliverySection}>
          <Text style={styles.deliverySectionTitle}>Livraison</Text>
          <View style={styles.deliveryCards}>
            <View style={styles.deliveryCard}>
              <Text style={styles.deliveryCardEmoji}>🚴</Text>
              <Text style={styles.deliveryCardTitle}>Zone de livraison</Text>
              <Text style={styles.deliveryCardDesc}>Rayon de 3 km autour du restaurant</Text>
            </View>
            <View style={styles.deliveryCard}>
              <Text style={styles.deliveryCardEmoji}>⚡</Text>
              <Text style={styles.deliveryCardTitle}>Délai</Text>
              <Text style={styles.deliveryCardDesc}>30 minutes en moyenne</Text>
            </View>
            <View style={styles.deliveryCard}>
              <Text style={styles.deliveryCardEmoji}>🎁</Text>
              <Text style={styles.deliveryCardTitle}>Livraison gratuite</Text>
              <Text style={styles.deliveryCardDesc}>À partir de 20€ de commande</Text>
            </View>
          </View>
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suivez-nous</Text>
          <View style={styles.socialsRow}>
            <TouchableOpacity style={[styles.socialBtn, styles.tiktokBtn]} onPress={handleTikTok} activeOpacity={0.85}>
              <Text style={styles.socialEmoji}>🎵</Text>
              <Text style={styles.socialLabel}>TikTok</Text>
              <Text style={styles.socialHandle}>@croustwok</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialBtn, styles.instagramBtn]} onPress={handleInstagram} activeOpacity={0.85}>
              <Text style={styles.socialEmoji}>📸</Text>
              <Text style={styles.socialLabel}>Instagram</Text>
              <Text style={styles.socialHandle}>@croustwok</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Franchise */}
        <View style={styles.franchiseSection}>
          <Text style={styles.franchiseEmoji}>🤝</Text>
          <Text style={styles.franchiseTitle}>Devenir Franchisé</Text>
          <Text style={styles.franchiseText}>
            Vous souhaitez ouvrir votre propre Crous't Wok ? Rejoignez notre réseau de franchisés et bénéficiez de notre concept unique.
          </Text>
          <TouchableOpacity style={styles.franchiseBtn} onPress={handleEmail} activeOpacity={0.85}>
            <Text style={styles.franchiseBtnText}>Nous contacter</Text>
          </TouchableOpacity>
        </View>

        {/* Footer note */}
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>Droits d'auteur © 2025 Crous't WOK. Tous droits réservés.</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 100 },

  header: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
    alignItems: 'flex-start',
  },
  headerLogo: { width: 64, height: 64, borderRadius: 12, marginBottom: 16 },
  headerAccent: { width: 40, height: 4, backgroundColor: '#C0392B', borderRadius: 2, marginBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#F5EFE6', lineHeight: 34 },
  headerSubtitle: { fontSize: 13, color: '#9A8F85', marginTop: 4 },

  mapCard: { margin: 16 },
  mapPlaceholder: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 36,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  mapEmoji: { fontSize: 48, marginBottom: 12 },
  mapTitle: { fontSize: 16, fontWeight: '700', color: '#F5EFE6', textAlign: 'center', marginBottom: 4 },
  mapSubtitle: { fontSize: 13, color: '#9A8F85', textAlign: 'center', marginBottom: 20 },
  mapBtn: {
    flexDirection: 'row',
    backgroundColor: '#C0392B',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    alignItems: 'center',
  },
  mapBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },

  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 14 },

  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E8DC',
    gap: 14,
  },
  contactBtnIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactBtnInfo: { flex: 1 },
  contactBtnLabel: { fontSize: 11, color: '#9A8F85', marginBottom: 2 },
  contactBtnValue: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },

  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E8DC',
  },
  hoursDay: { fontSize: 14, color: '#6B5E52', fontWeight: '500' },
  hoursOpen: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  hoursOpenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#27AE60' },
  hoursTime: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  hoursNote: {
    backgroundColor: 'rgba(192,57,43,0.08)',
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
    alignItems: 'center',
  },
  hoursNoteText: { fontSize: 13, color: '#C0392B', fontWeight: '600' },

  deliverySection: { backgroundColor: '#1A1A1A', marginHorizontal: 16, marginBottom: 16, borderRadius: 20, padding: 16 },
  deliverySectionTitle: { fontSize: 16, fontWeight: '700', color: '#F5EFE6', marginBottom: 14 },
  deliveryCards: { gap: 10 },
  deliveryCard: {
    backgroundColor: '#242424',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#333333',
  },
  deliveryCardEmoji: { fontSize: 28 },
  deliveryCardTitle: { fontSize: 14, fontWeight: '700', color: '#F5EFE6', marginBottom: 2 },
  deliveryCardDesc: { fontSize: 12, color: '#9A8F85', lineHeight: 17 },

  socialsRow: { flexDirection: 'row', gap: 12 },
  socialBtn: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  tiktokBtn: { backgroundColor: '#1A1A1A' },
  instagramBtn: { backgroundColor: '#833AB4' },
  socialEmoji: { fontSize: 32 },
  socialLabel: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  socialHandle: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },

  franchiseSection: {
    backgroundColor: '#C0392B',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  franchiseEmoji: { fontSize: 40, marginBottom: 12 },
  franchiseTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginBottom: 10 },
  franchiseText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  franchiseBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  franchiseBtnText: { color: '#C0392B', fontSize: 14, fontWeight: '700' },

  footerNote: { alignItems: 'center', paddingVertical: 16 },
  footerNoteText: { fontSize: 11, color: '#9A8F85', textAlign: 'center' },
});
