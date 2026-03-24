import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useCart } from '@/lib/cart-context';
import { MENU_ITEMS } from '@/constants/data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', label: 'Tous', emoji: '🍽️' },
  { id: 'riz', label: 'Riz', emoji: '🍚' },
  { id: 'nouilles', label: 'Nouilles', emoji: '🍜' },
  { id: 'salades', label: 'Salades', emoji: '🥗' },
  { id: 'entrees', label: 'Entrées', emoji: '🥟' },
];

function MenuItemCard({ item }: { item: typeof MENU_ITEMS[0] }) {
  const { addItem, state } = useCart();
  const cartItem = state.items.find(ci => ci.id === item.id);
  const quantity = cartItem?.quantity ?? 0;

  const priceText = item.priceMin === item.priceMax
    ? `€${item.priceMin.toFixed(2)}`
    : `€${item.priceMin.toFixed(2)} – €${item.priceMax.toFixed(2)}`;

  const handleAdd = () => {
    addItem({ id: item.id, name: item.name, price: item.priceMin, image: item.image });
  };

  return (
    <View style={styles.menuCard}>
      <View style={styles.menuImageContainer}>
        <Image source={{ uri: item.image }} style={styles.menuImage} resizeMode="cover" />
        {item.badge && (
          <View style={styles.menuBadge}>
            <Text style={styles.menuBadgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.menuInfo}>
        <Text style={styles.menuName}>{item.name}</Text>
        <Text style={styles.menuDesc} numberOfLines={3}>{item.description}</Text>
        <View style={styles.menuFooter}>
          <Text style={styles.menuPrice}>{priceText}</Text>
          <View style={styles.menuActions}>
            {quantity > 0 ? (
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={styles.quantityBtn}
                  onPress={() => {
                    const { updateQuantity } = useCart();
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.quantityBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity style={styles.quantityBtnAdd} onPress={handleAdd} activeOpacity={0.85}>
                  <Text style={styles.quantityBtnAddText}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.85}>
                <Text style={styles.addBtnText}>+ Ajouter</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

function MenuItemCardSimple({ item }: { item: typeof MENU_ITEMS[0] }) {
  const { addItem } = useCart();

  const priceText = item.priceMin === item.priceMax
    ? `€${item.priceMin.toFixed(2)}`
    : `€${item.priceMin.toFixed(2)} – €${item.priceMax.toFixed(2)}`;

  return (
    <View style={styles.menuCard}>
      <View style={styles.menuImageContainer}>
        <Image source={{ uri: item.image }} style={styles.menuImage} resizeMode="cover" />
        {item.badge && (
          <View style={styles.menuBadge}>
            <Text style={styles.menuBadgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.menuInfo}>
        <Text style={styles.menuName}>{item.name}</Text>
        <Text style={styles.menuDesc} numberOfLines={3}>{item.description}</Text>
        <View style={styles.menuFooter}>
          <Text style={styles.menuPrice}>{priceText}</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => addItem({ id: item.id, name: item.name, price: item.priceMin, image: item.image })}
            activeOpacity={0.85}
          >
            <Text style={styles.addBtnText}>+ Ajouter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function MenuScreen() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = activeCategory === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  return (
    <ScreenContainer edges={['top', 'left', 'right']} containerClassName="bg-background">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerAccent} />
          <Text style={styles.headerTitle}>Notre Carte</Text>
          <Text style={styles.headerSubtitle}>Des saveurs authentiques, revisitées avec amour</Text>
        </View>

        {/* Categories */}
        <View style={styles.categoriesWrapper}>
          <FlatList
            data={CATEGORIES}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.categoryBtn, activeCategory === item.id && styles.categoryBtnActive]}
                onPress={() => setActiveCategory(item.id)}
                activeOpacity={0.85}
              >
                <Text style={styles.categoryEmoji}>{item.emoji}</Text>
                <Text style={[styles.categoryLabel, activeCategory === item.id && styles.categoryLabelActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Items */}
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <MenuItemCardSimple item={item} />}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={styles.emptyText}>Aucun plat dans cette catégorie</Text>
            </View>
          }
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5EFE6' },

  header: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerAccent: { width: 40, height: 4, backgroundColor: '#C0392B', borderRadius: 2, marginBottom: 10 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#F5EFE6', lineHeight: 34 },
  headerSubtitle: { fontSize: 13, color: '#9A8F85', marginTop: 4, lineHeight: 19 },

  categoriesWrapper: { backgroundColor: '#FFFFFF', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0E8DC' },
  categoriesContent: { paddingHorizontal: 16, gap: 8 },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5EFE6',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#E8DDD0',
  },
  categoryBtnActive: { backgroundColor: '#C0392B', borderColor: '#C0392B' },
  categoryEmoji: { fontSize: 16 },
  categoryLabel: { fontSize: 13, fontWeight: '600', color: '#6B5E52' },
  categoryLabelActive: { color: '#FFFFFF' },

  listContent: { padding: 16, gap: 16, paddingBottom: 100 },

  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0E8DC',
  },
  menuImageContainer: { position: 'relative', height: 200 },
  menuImage: { width: '100%', height: '100%' },
  menuBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#C0392B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  menuBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  menuInfo: { padding: 16 },
  menuName: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 },
  menuDesc: { fontSize: 13, color: '#6B5E52', lineHeight: 19, marginBottom: 14 },
  menuFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  menuPrice: { fontSize: 18, fontWeight: '800', color: '#C0392B' },
  menuActions: {},
  addBtn: {
    backgroundColor: '#C0392B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  quantityControl: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  quantityBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5EFE6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#C0392B',
  },
  quantityBtnText: { color: '#C0392B', fontSize: 18, fontWeight: '700', lineHeight: 22 },
  quantityText: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', minWidth: 20, textAlign: 'center' },
  quantityBtnAdd: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#C0392B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityBtnAddText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', lineHeight: 22 },

  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: '#9A8F85' },
});
