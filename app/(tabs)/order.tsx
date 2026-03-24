import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'expo-router';

function EmptyCart({ onGoToMenu }: { onGoToMenu: () => void }) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🛒</Text>
      <Text style={styles.emptyTitle}>Votre panier est vide</Text>
      <Text style={styles.emptyText}>Découvrez nos délicieux plats et ajoutez-les à votre panier.</Text>
      <TouchableOpacity style={styles.emptyBtn} onPress={onGoToMenu} activeOpacity={0.85}>
        <Text style={styles.emptyBtnText}>Voir le menu</Text>
      </TouchableOpacity>
    </View>
  );
}

function CartItemRow({ item }: { item: { id: string; name: string; price: number; image: string; quantity: number } }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.cartItemImage} resizeMode="cover" />
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>€{item.price.toFixed(2)}</Text>
        <View style={styles.cartItemActions}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
            activeOpacity={0.85}
          >
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtnAdd}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
            activeOpacity={0.85}
          >
            <Text style={styles.qtyBtnAddText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => removeItem(item.id)}
            activeOpacity={0.85}
          >
            <IconSymbol name="trash.fill" size={16} color="#C0392B" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.cartItemTotal}>€{(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );
}

export default function OrderScreen() {
  const { state, clearCart } = useCart();
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [ordered, setOrdered] = useState(false);

  const deliveryFee = orderType === 'delivery' && state.total < 20 ? 3.50 : 0;
  const grandTotal = state.total + deliveryFee;

  const handleOrder = () => {
    if (!name.trim() || !phone.trim() || (orderType === 'delivery' && !address.trim())) {
      Alert.alert('Informations manquantes', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setOrdered(true);
    clearCart();
  };

  const handleCall = () => Linking.openURL('tel:+33667155358');

  if (ordered) {
    return (
      <ScreenContainer edges={['top', 'left', 'right']} containerClassName="bg-background">
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Commande confirmée !</Text>
          <Text style={styles.successText}>
            Merci {name} ! Votre commande a bien été enregistrée. Vous recevrez une confirmation sous peu.
          </Text>
          <View style={styles.successInfo}>
            <Text style={styles.successInfoText}>⏱️ Livraison estimée : 30 minutes</Text>
          </View>
          <TouchableOpacity style={styles.successCallBtn} onPress={handleCall} activeOpacity={0.85}>
            <IconSymbol name="phone.fill" size={18} color="#FFFFFF" />
            <Text style={styles.successCallText}>Appeler le restaurant</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.successBackBtn}
            onPress={() => { setOrdered(false); router.push('/menu' as any); }}
            activeOpacity={0.85}
          >
            <Text style={styles.successBackText}>Retour au menu</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={['top', 'left', 'right']} containerClassName="bg-background">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerAccent} />
          <Text style={styles.headerTitle}>Mon Panier</Text>
          {state.items.length > 0 && (
            <TouchableOpacity onPress={clearCart} activeOpacity={0.85}>
              <Text style={styles.clearBtn}>Vider</Text>
            </TouchableOpacity>
          )}
        </View>

        {state.items.length === 0 ? (
          <EmptyCart onGoToMenu={() => router.push('/menu' as any)} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Cart Items */}
            <View style={styles.section}>
              {state.items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </View>

            {/* Order Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Type de commande</Text>
              <View style={styles.orderTypeRow}>
                <TouchableOpacity
                  style={[styles.orderTypeBtn, orderType === 'delivery' && styles.orderTypeBtnActive]}
                  onPress={() => setOrderType('delivery')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.orderTypeEmoji}>🛵</Text>
                  <Text style={[styles.orderTypeLabel, orderType === 'delivery' && styles.orderTypeLabelActive]}>
                    Livraison
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.orderTypeBtn, orderType === 'pickup' && styles.orderTypeBtnActive]}
                  onPress={() => setOrderType('pickup')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.orderTypeEmoji}>🏪</Text>
                  <Text style={[styles.orderTypeLabel, orderType === 'pickup' && styles.orderTypeLabelActive]}>
                    À emporter
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Form */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vos informations</Text>
              <TextInput
                style={styles.input}
                placeholder="Votre nom *"
                placeholderTextColor="#9A8F85"
                value={name}
                onChangeText={setName}
                returnKeyType="next"
              />
              <TextInput
                style={styles.input}
                placeholder="Votre téléphone *"
                placeholderTextColor="#9A8F85"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                returnKeyType="next"
              />
              {orderType === 'delivery' && (
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  placeholder="Adresse de livraison *"
                  placeholderTextColor="#9A8F85"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={3}
                  returnKeyType="done"
                />
              )}
            </View>

            {/* Summary */}
            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>Récapitulatif</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sous-total</Text>
                <Text style={styles.summaryValue}>€{state.total.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Livraison</Text>
                <Text style={[styles.summaryValue, deliveryFee === 0 && styles.summaryFree]}>
                  {deliveryFee === 0 ? 'Gratuite' : `€${deliveryFee.toFixed(2)}`}
                </Text>
              </View>
              {deliveryFee > 0 && (
                <Text style={styles.summaryNote}>
                  Livraison gratuite à partir de 20€ (dans un rayon de 3 km)
                </Text>
              )}
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalValue}>€{grandTotal.toFixed(2)}</Text>
              </View>
            </View>

            {/* Order Button */}
            <TouchableOpacity style={styles.orderBtn} onPress={handleOrder} activeOpacity={0.85}>
              <Text style={styles.orderBtnText}>Confirmer la commande — €{grandTotal.toFixed(2)}</Text>
            </TouchableOpacity>

            {/* Call option */}
            <TouchableOpacity style={styles.callOrderBtn} onPress={handleCall} activeOpacity={0.85}>
              <IconSymbol name="phone.fill" size={16} color="#C0392B" />
              <Text style={styles.callOrderText}>Commander par téléphone</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5EFE6' },
  scrollContent: { paddingBottom: 100 },

  header: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  headerAccent: { position: 'absolute', top: 20, left: 20, width: 40, height: 4, backgroundColor: '#C0392B', borderRadius: 2 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#F5EFE6', marginTop: 18 },
  clearBtn: { fontSize: 13, color: '#C0392B', fontWeight: '600', marginBottom: 4 },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', marginBottom: 10 },
  emptyText: { fontSize: 14, color: '#6B5E52', textAlign: 'center', lineHeight: 21, marginBottom: 28 },
  emptyBtn: {
    backgroundColor: '#C0392B',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
  },
  emptyBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 14 },

  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E8DC',
    gap: 12,
  },
  cartItemImage: { width: 64, height: 64, borderRadius: 12 },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 },
  cartItemPrice: { fontSize: 12, color: '#6B5E52', marginBottom: 8 },
  cartItemActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cartItemTotal: { fontSize: 15, fontWeight: '800', color: '#C0392B', minWidth: 50, textAlign: 'right' },

  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5EFE6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#C0392B',
  },
  qtyBtnText: { color: '#C0392B', fontSize: 16, fontWeight: '700', lineHeight: 20 },
  qtyText: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', minWidth: 20, textAlign: 'center' },
  qtyBtnAdd: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#C0392B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnAddText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', lineHeight: 20 },
  removeBtn: { marginLeft: 4 },

  orderTypeRow: { flexDirection: 'row', gap: 12 },
  orderTypeBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F5EFE6',
    borderWidth: 2,
    borderColor: '#E8DDD0',
    gap: 6,
  },
  orderTypeBtnActive: { borderColor: '#C0392B', backgroundColor: 'rgba(192,57,43,0.05)' },
  orderTypeEmoji: { fontSize: 28 },
  orderTypeLabel: { fontSize: 13, fontWeight: '600', color: '#6B5E52' },
  orderTypeLabelActive: { color: '#C0392B' },

  input: {
    backgroundColor: '#F5EFE6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    color: '#1A1A1A',
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#E8DDD0',
  },
  inputMultiline: { height: 80, textAlignVertical: 'top', paddingTop: 13 },

  summarySection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: '#6B5E52' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  summaryFree: { color: '#27AE60' },
  summaryNote: { fontSize: 11, color: '#9A8F85', marginBottom: 10, fontStyle: 'italic' },
  summaryTotal: {
    borderTopWidth: 1.5,
    borderTopColor: '#F0E8DC',
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 0,
  },
  summaryTotalLabel: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  summaryTotalValue: { fontSize: 20, fontWeight: '900', color: '#C0392B' },

  orderBtn: {
    backgroundColor: '#C0392B',
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#C0392B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  orderBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },

  callOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#C0392B',
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  callOrderText: { color: '#C0392B', fontSize: 14, fontWeight: '700' },

  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#F5EFE6' },
  successEmoji: { fontSize: 80, marginBottom: 20 },
  successTitle: { fontSize: 28, fontWeight: '800', color: '#1A1A1A', marginBottom: 12, textAlign: 'center' },
  successText: { fontSize: 15, color: '#6B5E52', textAlign: 'center', lineHeight: 23, marginBottom: 24 },
  successInfo: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F0E8DC',
  },
  successInfoText: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  successCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C0392B',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 10,
    marginBottom: 14,
    width: '100%',
    justifyContent: 'center',
  },
  successCallText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  successBackBtn: {
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#C0392B',
    width: '100%',
    alignItems: 'center',
  },
  successBackText: { color: '#C0392B', fontSize: 15, fontWeight: '700' },
});
