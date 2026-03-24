import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Animated,
  Linking,
  FlatList,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useCart } from '@/lib/cart-context';
import { MENU_ITEMS, TESTIMONIALS, FAQ_ITEMS, COMMITMENTS } from '@/constants/data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HERO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663473039589/ZduhfGfuDUikCLBWg6gRh6/croustwok-hero-TfyELSPRqy9cr5XgvCKbW8.webp';
const LOGO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663473039589/ZduhfGfuDUikCLBWg6gRh6/croustwok-logo-QWPKiABRNah3V4EwPjbBcs.webp';

// ─── Promo Banner ────────────────────────────────────────────────────────────
function PromoBanner() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const text = '🔥 HOT AND FRESH  •  Livraison gratuite dès 20€  •  Commande 24h/7j  •  +33 667 155 358  •  ';

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(scrollX, {
        toValue: -SCREEN_WIDTH * 1.5,
        duration: 12000,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <View style={styles.promoBanner}>
      <Animated.Text
        style={[styles.promoText, { transform: [{ translateX: scrollX }] }]}
        numberOfLines={1}
      >
        {text.repeat(4)}
      </Animated.Text>
    </View>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({ onDiscoverMenu, onOrder }: { onDiscoverMenu: () => void; onOrder: () => void }) {
  return (
    <View style={styles.heroContainer}>
      <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} resizeMode="cover" />
      <View style={styles.heroOverlay}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>🔥 HOT AND FRESH</Text>
        </View>
        <Text style={styles.heroTitle}>La cuisine asiatique{'\n'}revisitée</Text>
        <Text style={styles.heroSubtitle}>
          Parce qu'entre la France et l'Asie,{'\n'}c'est une belle histoire d'amour
        </Text>
        <View style={styles.heroButtons}>
          <TouchableOpacity style={styles.heroBtnPrimary} onPress={onDiscoverMenu} activeOpacity={0.85}>
            <Text style={styles.heroBtnPrimaryText}>Découvrir la carte</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.heroBtnSecondary} onPress={onOrder} activeOpacity={0.85}>
            <Text style={styles.heroBtnSecondaryText}>Commander</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, light = false }: { title: string; subtitle?: string; light?: boolean }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionAccent} />
      <Text style={[styles.sectionTitle, light && styles.sectionTitleLight]}>{title}</Text>
      {subtitle && <Text style={[styles.sectionSubtitle, light && styles.sectionSubtitleLight]}>{subtitle}</Text>}
    </View>
  );
}

// ─── Concept Section ──────────────────────────────────────────────────────────
function ConceptSection({ onLearnMore }: { onLearnMore: () => void }) {
  return (
    <View style={styles.conceptSection}>
      <SectionHeader
        title="Le Concept Crous't Wok"
        subtitle="Une expérience culinaire unique"
      />
      <Text style={styles.conceptText}>
        CROUS'T WOK revisite la cuisine asiatique autour du riz, de ses déclinaisons et d'une expérience chaleureuse.
      </Text>
      <View style={styles.conceptCards}>
        {[
          { icon: '🍚', title: 'Riz Crous\'t', desc: 'Notre plat phare sublimé par une sauce secrète onctueuse' },
          { icon: '🥣', title: 'Sauce Secrète', desc: 'Préparée maison, crémeuse et inoubliable' },
          { icon: '🍜', title: 'Nouilles & Udons', desc: 'Pads, nouilles et udons pour toutes les envies' },
          { icon: '❤️', title: 'Expérience', desc: 'Un accueil chaleureux et convivial' },
        ].map((item, index) => (
          <View key={index} style={styles.conceptCard}>
            <Text style={styles.conceptCardIcon}>{item.icon}</Text>
            <Text style={styles.conceptCardTitle}>{item.title}</Text>
            <Text style={styles.conceptCardDesc}>{item.desc}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.conceptBtn} onPress={onLearnMore} activeOpacity={0.85}>
        <Text style={styles.conceptBtnText}>Découvrez maintenant</Text>
        <IconSymbol name="arrow.right" size={16} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

// ─── Commitments Section ──────────────────────────────────────────────────────
function CommitmentsSection() {
  return (
    <View style={styles.commitmentsSection}>
      <SectionHeader title="Nos Engagements" subtitle="Ce qui nous rend uniques" light />
      <View style={styles.commitmentsGrid}>
        {COMMITMENTS.map((item) => (
          <View key={item.id} style={styles.commitmentCard}>
            <View style={styles.commitmentIconBg}>
              <IconSymbol name={item.icon as any} size={22} color="#C0392B" />
            </View>
            <Text style={styles.commitmentTitle}>{item.title}</Text>
            <Text style={styles.commitmentDesc}>{item.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Menu Dish Card ───────────────────────────────────────────────────────────
function DishCard({ item, onOrder }: { item: typeof MENU_ITEMS[0]; onOrder: () => void }) {
  const { addItem } = useCart();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    addItem({
      id: item.id,
      name: item.name,
      price: item.priceMin,
      image: item.image,
    });
    onOrder();
  };

  const priceText = item.priceMin === item.priceMax
    ? `€${item.priceMin.toFixed(2)}`
    : `€${item.priceMin.toFixed(2)} – €${item.priceMax.toFixed(2)}`;

  return (
    <Animated.View style={[styles.dishCard, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.dishImageContainer}>
        <Image source={{ uri: item.image }} style={styles.dishImage} resizeMode="cover" />
        {item.badge && (
          <View style={styles.dishBadge}>
            <Text style={styles.dishBadgeText}>{item.badge}</Text>
          </View>
        )}
      </View>
      <View style={styles.dishInfo}>
        <Text style={styles.dishName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.dishDesc} numberOfLines={2}>{item.description}</Text>
        <View style={styles.dishFooter}>
          <Text style={styles.dishPrice}>{priceText}</Text>
          <TouchableOpacity style={styles.dishOrderBtn} onPress={handlePress} activeOpacity={0.85}>
            <Text style={styles.dishOrderBtnText}>Commander</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Hot Dishes Section ───────────────────────────────────────────────────────
function HotDishesSection({ onOrder }: { onOrder: () => void }) {
  return (
    <View style={styles.hotDishesSection}>
      <SectionHeader title="Les Plats les Plus Chauds" subtitle="Nos incontournables du mois" />
      <FlatList
        data={MENU_ITEMS}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dishesListContent}
        renderItem={({ item }) => <DishCard item={item} onOrder={onOrder} />}
        snapToInterval={SCREEN_WIDTH * 0.72 + 12}
        decelerationRate="fast"
      />
    </View>
  );
}

// ─── Online Order Section ─────────────────────────────────────────────────────
function OnlineOrderSection() {
  const handleCall = () => Linking.openURL('tel:+33667155358');

  return (
    <View style={styles.onlineOrderSection}>
      <View style={styles.onlineOrderContent}>
        <Text style={styles.onlineOrderEmoji}>🛵</Text>
        <Text style={styles.onlineOrderTitle}>Commande en Ligne</Text>
        <Text style={styles.onlineOrderText}>
          Offrez-vous un voyage culinaire inoubliable ! Simplifiez-vous la vie avec notre service de commande en ligne. Chez Crous't Wok, nous mettons à votre disposition une solution rapide et pratique pour savourer nos délicieuses recettes, où que vous soyez.
        </Text>
        <View style={styles.onlineOrderBadge}>
          <IconSymbol name="clock.fill" size={16} color="#D4A843" />
          <Text style={styles.onlineOrderBadgeText}>Commande rapide 24h/7j</Text>
        </View>
        <TouchableOpacity style={styles.onlineOrderCallBtn} onPress={handleCall} activeOpacity={0.85}>
          <IconSymbol name="phone.fill" size={18} color="#FFFFFF" />
          <Text style={styles.onlineOrderCallText}>+33 667 155 358</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.onlineOrderBtn} activeOpacity={0.85}>
          <Text style={styles.onlineOrderBtnText}>Commander en ligne</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Stats Section ────────────────────────────────────────────────────────────
function StatsSection() {
  const stats = [
    { value: '15k+', label: 'Clients satisfaits', icon: '😊' },
    { value: '17+', label: 'Récompenses', icon: '🏆' },
    { value: '50+', label: 'Plats au menu', icon: '🍽️' },
  ];

  return (
    <View style={styles.statsSection}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statCard}>
          <Text style={styles.statIcon}>{stat.icon}</Text>
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Specialties Section ──────────────────────────────────────────────────────
function SpecialtiesSection({ onOrder }: { onOrder: () => void }) {
  const specialties = [
    {
      title: 'Spécial du Jour',
      subtitle: 'Riz Crous\'t',
      tag: 'Offre limitée',
      color: '#C0392B',
      emoji: '🔥',
    },
    {
      title: 'Wok Crous\'t',
      subtitle: 'Menu des plats',
      tag: 'Populaire',
      color: '#E67E22',
      emoji: '🥘',
    },
    {
      title: 'Salades Crevettes',
      subtitle: 'Des goûts inoubliables',
      tag: 'Fraîcheur',
      color: '#27AE60',
      emoji: '🥗',
    },
  ];

  return (
    <View style={styles.specialtiesSection}>
      <SectionHeader title="Nos Spécialités" subtitle="Des créations uniques" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.specialtiesContent}>
        {specialties.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.specialtyCard, { borderTopColor: item.color }]}
            onPress={onOrder}
            activeOpacity={0.85}
          >
            <Text style={styles.specialtyEmoji}>{item.emoji}</Text>
            <View style={[styles.specialtyTag, { backgroundColor: item.color }]}>
              <Text style={styles.specialtyTagText}>{item.tag}</Text>
            </View>
            <Text style={styles.specialtyTitle}>{item.title}</Text>
            <Text style={styles.specialtySubtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Benefits Section ─────────────────────────────────────────────────────────
function BenefitsSection() {
  const benefits = [
    {
      icon: '🚴',
      title: 'Livraison Gratuite',
      desc: 'Livraison gratuite sur un rayon de 3 km à partir de 20€.',
    },
    {
      icon: '⚡',
      title: 'Livraison Rapide',
      desc: 'Livraison rapide en 30 minutes, au lieu de 40 minutes.',
    },
    {
      icon: '⭐',
      title: 'Meilleure Qualité',
      desc: 'Du frais, du vrai, du bon… La qualité, notre recette secrète.',
    },
  ];

  return (
    <View style={styles.benefitsSection}>
      <SectionHeader title="Vos Avantages" subtitle="Pourquoi choisir Crous't Wok ?" light />
      <View style={styles.benefitsGrid}>
        {benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitCard}>
            <Text style={styles.benefitIcon}>{benefit.icon}</Text>
            <Text style={styles.benefitTitle}>{benefit.title}</Text>
            <Text style={styles.benefitDesc}>{benefit.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Testimonials Section ─────────────────────────────────────────────────────
function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.testimonialsSection}>
      <SectionHeader title="Avis Clients" subtitle="Ce que nos clients disent de nous" />
      <FlatList
        data={TESTIMONIALS}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.testimonialsContent}
        snapToInterval={SCREEN_WIDTH - 48}
        decelerationRate="fast"
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 48));
          setActiveIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={[styles.testimonialCard, { width: SCREEN_WIDTH - 64 }]}>
            <View style={styles.testimonialHeader}>
              <Text style={styles.testimonialAvatar}>{item.avatar}</Text>
              <View>
                <Text style={styles.testimonialName}>{item.name}</Text>
                <Text style={styles.testimonialDate}>{item.date}</Text>
              </View>
              <View style={styles.testimonialStars}>
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Text key={i} style={styles.testimonialStar}>⭐</Text>
                ))}
              </View>
            </View>
            <Text style={styles.testimonialComment}>"{item.comment}"</Text>
          </View>
        )}
      />
      <View style={styles.testimonialDots}>
        {TESTIMONIALS.map((_, index) => (
          <View
            key={index}
            style={[styles.testimonialDot, index === activeIndex && styles.testimonialDotActive]}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Newsletter Section ───────────────────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <View style={styles.newsletterSection}>
      <Text style={styles.newsletterEmoji}>🎁</Text>
      <Text style={styles.newsletterTitle}>Obtenez 10% de réduction !</Text>
      <Text style={styles.newsletterText}>
        Entrez votre email et recevez 10% de réduction sur votre prochaine commande !
      </Text>
      {subscribed ? (
        <View style={styles.newsletterSuccess}>
          <Text style={styles.newsletterSuccessText}>✅ Merci ! Votre code promo a été envoyé.</Text>
        </View>
      ) : (
        <View style={styles.newsletterForm}>
          <TextInput
            style={styles.newsletterInput}
            placeholder="Votre adresse email"
            placeholderTextColor="#9A8F85"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleSubscribe}
          />
          <TouchableOpacity style={styles.newsletterBtn} onPress={handleSubscribe} activeOpacity={0.85}>
            <Text style={styles.newsletterBtnText}>S'abonner</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ─── Location Section ─────────────────────────────────────────────────────────
function LocationSection() {
  const handleCall = () => Linking.openURL('tel:+33613175051');
  const handleEmail = () => Linking.openURL('mailto:support@croustwok.com');
  const handleMaps = () => Linking.openURL('https://maps.google.com/?q=78+Avenue+des+Champs+Elysees+Paris');

  return (
    <View style={styles.locationSection}>
      <SectionHeader title="Nos Restaurants" subtitle="Trouvez un emplacement près de chez vous" />
      <View style={styles.locationCard}>
        <View style={styles.locationMapPlaceholder}>
          <Text style={styles.locationMapEmoji}>🗺️</Text>
          <Text style={styles.locationMapText}>78 Avenue des Champs Élysées</Text>
          <Text style={styles.locationMapSubtext}>75008 Paris, France</Text>
          <TouchableOpacity style={styles.locationMapBtn} onPress={handleMaps} activeOpacity={0.85}>
            <IconSymbol name="map.fill" size={16} color="#FFFFFF" />
            <Text style={styles.locationMapBtnText}>Voir sur la carte</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.locationContacts}>
          <TouchableOpacity style={styles.locationContact} onPress={handleCall} activeOpacity={0.85}>
            <View style={styles.locationContactIcon}>
              <IconSymbol name="phone.fill" size={18} color="#C0392B" />
            </View>
            <View>
              <Text style={styles.locationContactLabel}>Téléphone</Text>
              <Text style={styles.locationContactValue}>+33 613 175 051</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.locationContact} onPress={handleEmail} activeOpacity={0.85}>
            <View style={styles.locationContactIcon}>
              <IconSymbol name="envelope.fill" size={18} color="#C0392B" />
            </View>
            <View>
              <Text style={styles.locationContactLabel}>Email</Text>
              <Text style={styles.locationContactValue}>support@croustwok.com</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.locationContact}>
            <View style={styles.locationContactIcon}>
              <IconSymbol name="clock.fill" size={18} color="#C0392B" />
            </View>
            <View>
              <Text style={styles.locationContactLabel}>Horaires</Text>
              <Text style={styles.locationContactValue}>7j/7 — 11h à 22h30</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── FAQ Section ─────────────────────────────────────────────────────────────
function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <View style={styles.faqSection}>
      <SectionHeader title="Questions Fréquentes" subtitle="Tout ce que vous devez savoir" light />
      {FAQ_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.faqItem}
          onPress={() => setOpenId(openId === item.id ? null : item.id)}
          activeOpacity={0.85}
        >
          <View style={styles.faqHeader}>
            <Text style={styles.faqQuestion}>{item.question}</Text>
            <Text style={styles.faqChevron}>{openId === item.id ? '▲' : '▼'}</Text>
          </View>
          {openId === item.id && (
            <Text style={styles.faqAnswer}>{item.answer}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <View style={styles.footer}>
      <Image source={{ uri: LOGO_IMAGE }} style={styles.footerLogo} resizeMode="contain" />
      <Text style={styles.footerTagline}>Hot and Fresh</Text>
      <Text style={styles.footerQuote}>« Parce qu'entre la France et l'Asie, c'est une belle histoire d'amour »</Text>
      <View style={styles.footerSocials}>
        <TouchableOpacity
          style={styles.footerSocialBtn}
          onPress={() => Linking.openURL('https://tiktok.com')}
          activeOpacity={0.85}
        >
          <Text style={styles.footerSocialText}>TikTok</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerSocialBtn}
          onPress={() => Linking.openURL('https://instagram.com')}
          activeOpacity={0.85}
        >
          <Text style={styles.footerSocialText}>Instagram</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footerLinks}>
        {['Conditions d\'utilisation', 'Confidentialité', 'Mentions légales', 'Franchisé', 'Contact'].map((link, i) => (
          <Text key={i} style={styles.footerLink}>{link}</Text>
        ))}
      </View>
      <Text style={styles.footerCopyright}>Droits d'auteur © 2025 Crous't WOK. Tous droits réservés.</Text>
    </View>
  );
}

// ─── Floating Buttons ─────────────────────────────────────────────────────────
function FloatingButtons({ onOrder }: { onOrder: () => void }) {
  const handleWhatsApp = () => Linking.openURL('tel:+33667155358');

  return (
    <View style={styles.floatingButtons} pointerEvents="box-none">
      <TouchableOpacity style={styles.floatingWhatsApp} onPress={handleWhatsApp} activeOpacity={0.85}>
        <Text style={styles.floatingWhatsAppIcon}>📞</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.floatingOrder} onPress={onOrder} activeOpacity={0.85}>
        <Text style={styles.floatingOrderText}>Commander</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Home Screen ─────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();

  const handleDiscoverMenu = () => router.push('/menu' as any);
  const handleOrder = () => router.push('/order' as any);

  return (
    <View style={styles.container}>
      <ScreenContainer edges={['top', 'left', 'right']} containerClassName="bg-background">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <PromoBanner />
          <HeroSection onDiscoverMenu={handleDiscoverMenu} onOrder={handleOrder} />
          <ConceptSection onLearnMore={handleDiscoverMenu} />
          <CommitmentsSection />
          <HotDishesSection onOrder={handleOrder} />
          <OnlineOrderSection />
          <StatsSection />
          <SpecialtiesSection onOrder={handleOrder} />
          <BenefitsSection />
          <TestimonialsSection />
          <NewsletterSection />
          <LocationSection />
          <FAQSection />
          <Footer />
        </ScrollView>
      </ScreenContainer>
      <FloatingButtons onOrder={handleOrder} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5EFE6' },
  scrollContent: { paddingBottom: 100 },

  // Promo Banner
  promoBanner: {
    backgroundColor: '#C0392B',
    paddingVertical: 8,
    overflow: 'hidden',
  },
  promoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    width: SCREEN_WIDTH * 6,
  },

  // Hero
  heroContainer: { height: 480, position: 'relative' },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
    padding: 24,
    paddingBottom: 36,
  },
  heroBadge: {
    backgroundColor: '#C0392B',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  heroBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 42,
    marginBottom: 10,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  heroButtons: { flexDirection: 'row', gap: 12 },
  heroBtnPrimary: {
    backgroundColor: '#C0392B',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 30,
    flex: 1,
    alignItems: 'center',
  },
  heroBtnPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  heroBtnSecondary: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 30,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  heroBtnSecondaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  // Section Header
  sectionHeader: { paddingHorizontal: 20, marginBottom: 20 },
  sectionAccent: {
    width: 40,
    height: 4,
    backgroundColor: '#C0392B',
    borderRadius: 2,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A', lineHeight: 30 },
  sectionTitleLight: { color: '#F5EFE6' },
  sectionSubtitle: { fontSize: 14, color: '#6B5E52', marginTop: 4, lineHeight: 20 },
  sectionSubtitleLight: { color: 'rgba(245,239,230,0.7)' },

  // Concept
  conceptSection: { backgroundColor: '#FFFFFF', paddingVertical: 36, paddingHorizontal: 0 },
  conceptText: {
    fontSize: 15,
    color: '#6B5E52',
    lineHeight: 23,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  conceptCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
    marginBottom: 24,
  },
  conceptCard: {
    width: (SCREEN_WIDTH - 56) / 2,
    backgroundColor: '#F5EFE6',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  conceptCardIcon: { fontSize: 32, marginBottom: 8 },
  conceptCardTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 4, textAlign: 'center' },
  conceptCardDesc: { fontSize: 12, color: '#6B5E52', textAlign: 'center', lineHeight: 17 },
  conceptBtn: {
    flexDirection: 'row',
    backgroundColor: '#C0392B',
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  conceptBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  // Commitments
  commitmentsSection: { backgroundColor: '#1A1A1A', paddingVertical: 36 },
  commitmentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
    marginTop: 4,
  },
  commitmentCard: {
    width: (SCREEN_WIDTH - 56) / 2,
    backgroundColor: '#242424',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  commitmentIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(192,57,43,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  commitmentTitle: { fontSize: 13, fontWeight: '700', color: '#F5EFE6', marginBottom: 4, textAlign: 'center' },
  commitmentDesc: { fontSize: 11, color: '#9A8F85', textAlign: 'center', lineHeight: 16 },

  // Hot Dishes
  hotDishesSection: { backgroundColor: '#FFFFFF', paddingVertical: 36 },
  dishesListContent: { paddingHorizontal: 20, gap: 12 },
  dishCard: {
    width: SCREEN_WIDTH * 0.72,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F0E8DC',
  },
  dishImageContainer: { position: 'relative', height: 180 },
  dishImage: { width: '100%', height: '100%' },
  dishBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#C0392B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dishBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  dishInfo: { padding: 14 },
  dishName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  dishDesc: { fontSize: 12, color: '#6B5E52', lineHeight: 17, marginBottom: 12 },
  dishFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dishPrice: { fontSize: 16, fontWeight: '800', color: '#C0392B' },
  dishOrderBtn: {
    backgroundColor: '#C0392B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dishOrderBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

  // Online Order
  onlineOrderSection: { backgroundColor: '#1A1A1A', paddingVertical: 40, paddingHorizontal: 20 },
  onlineOrderContent: { alignItems: 'center' },
  onlineOrderEmoji: { fontSize: 48, marginBottom: 16 },
  onlineOrderTitle: { fontSize: 26, fontWeight: '800', color: '#F5EFE6', marginBottom: 12, textAlign: 'center' },
  onlineOrderText: { fontSize: 14, color: '#9A8F85', lineHeight: 22, textAlign: 'center', marginBottom: 20 },
  onlineOrderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212,168,67,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(212,168,67,0.3)',
  },
  onlineOrderBadgeText: { color: '#D4A843', fontSize: 13, fontWeight: '600' },
  onlineOrderCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    gap: 8,
    marginBottom: 14,
    width: '100%',
    justifyContent: 'center',
  },
  onlineOrderCallText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  onlineOrderBtn: {
    backgroundColor: '#C0392B',
    paddingVertical: 14,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  onlineOrderBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  // Stats
  statsSection: {
    backgroundColor: '#C0392B',
    flexDirection: 'row',
    paddingVertical: 32,
    paddingHorizontal: 12,
  },
  statCard: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  statIcon: { fontSize: 28, marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', lineHeight: 34 },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 4, lineHeight: 15 },

  // Specialties
  specialtiesSection: { backgroundColor: '#FFFFFF', paddingVertical: 36 },
  specialtiesContent: { paddingHorizontal: 20, gap: 12 },
  specialtyCard: {
    width: SCREEN_WIDTH * 0.55,
    backgroundColor: '#F5EFE6',
    borderRadius: 20,
    padding: 20,
    borderTopWidth: 4,
    alignItems: 'flex-start',
  },
  specialtyEmoji: { fontSize: 40, marginBottom: 12 },
  specialtyTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  specialtyTagText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  specialtyTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  specialtySubtitle: { fontSize: 12, color: '#6B5E52', lineHeight: 17 },

  // Benefits
  benefitsSection: { backgroundColor: '#242424', paddingVertical: 36 },
  benefitsGrid: { paddingHorizontal: 16, gap: 12 },
  benefitCard: {
    backgroundColor: '#2E2E2E',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  benefitIcon: { fontSize: 32 },
  benefitTitle: { fontSize: 15, fontWeight: '700', color: '#F5EFE6', marginBottom: 4, flex: 1 },
  benefitDesc: { fontSize: 13, color: '#9A8F85', lineHeight: 19, flex: 1 },

  // Testimonials
  testimonialsSection: { backgroundColor: '#FFFFFF', paddingVertical: 36 },
  testimonialsContent: { paddingHorizontal: 20, gap: 12 },
  testimonialCard: {
    backgroundColor: '#F5EFE6',
    borderRadius: 20,
    padding: 20,
    marginRight: 4,
    borderWidth: 1,
    borderColor: '#E8DDD0',
  },
  testimonialHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  testimonialAvatar: { fontSize: 36 },
  testimonialName: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  testimonialDate: { fontSize: 12, color: '#9A8F85', marginTop: 2 },
  testimonialStars: { flexDirection: 'row', marginLeft: 'auto' },
  testimonialStar: { fontSize: 12 },
  testimonialComment: { fontSize: 14, color: '#6B5E52', lineHeight: 22, fontStyle: 'italic' },
  testimonialDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 16 },
  testimonialDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D4C5B5' },
  testimonialDotActive: { backgroundColor: '#C0392B', width: 20 },

  // Newsletter
  newsletterSection: {
    backgroundColor: '#C0392B',
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  newsletterEmoji: { fontSize: 48, marginBottom: 12 },
  newsletterTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', marginBottom: 10 },
  newsletterText: { fontSize: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 21, marginBottom: 24 },
  newsletterForm: { width: '100%', gap: 12 },
  newsletterInput: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  newsletterBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  newsletterBtnText: { color: '#C0392B', fontSize: 15, fontWeight: '700' },
  newsletterSuccess: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
  },
  newsletterSuccessText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', textAlign: 'center' },

  // Location
  locationSection: { backgroundColor: '#FFFFFF', paddingVertical: 36 },
  locationCard: { marginHorizontal: 20 },
  locationMapPlaceholder: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  locationMapEmoji: { fontSize: 48, marginBottom: 12 },
  locationMapText: { fontSize: 16, fontWeight: '700', color: '#F5EFE6', textAlign: 'center', marginBottom: 4 },
  locationMapSubtext: { fontSize: 13, color: '#9A8F85', textAlign: 'center', marginBottom: 20 },
  locationMapBtn: {
    flexDirection: 'row',
    backgroundColor: '#C0392B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    alignItems: 'center',
  },
  locationMapBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  locationContacts: { gap: 12 },
  locationContact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F5EFE6',
    padding: 14,
    borderRadius: 14,
  },
  locationContactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(192,57,43,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationContactLabel: { fontSize: 11, color: '#9A8F85', marginBottom: 2 },
  locationContactValue: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },

  // FAQ
  faqSection: { backgroundColor: '#1A1A1A', paddingVertical: 36, paddingHorizontal: 20 },
  faqItem: {
    backgroundColor: '#242424',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333333',
  },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 14, fontWeight: '600', color: '#F5EFE6', flex: 1, lineHeight: 20 },
  faqChevron: { fontSize: 12, color: '#C0392B', marginLeft: 12 },
  faqAnswer: { fontSize: 13, color: '#9A8F85', lineHeight: 20, marginTop: 12 },

  // Footer
  footer: { backgroundColor: '#0D0D0D', paddingVertical: 40, paddingHorizontal: 24, alignItems: 'center' },
  footerLogo: { width: 100, height: 100, borderRadius: 16, marginBottom: 12 },
  footerTagline: { fontSize: 13, fontWeight: '700', color: '#D4A843', letterSpacing: 2, marginBottom: 12 },
  footerQuote: { fontSize: 13, color: '#9A8F85', textAlign: 'center', lineHeight: 20, fontStyle: 'italic', marginBottom: 24 },
  footerSocials: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  footerSocialBtn: {
    backgroundColor: '#242424',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  footerSocialText: { color: '#F5EFE6', fontSize: 13, fontWeight: '600' },
  footerLinks: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 20 },
  footerLink: { fontSize: 11, color: '#9A8F85', textDecorationLine: 'underline' },
  footerCopyright: { fontSize: 11, color: '#6B5E52', textAlign: 'center' },

  // Floating Buttons
  floatingButtons: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    gap: 12,
    alignItems: 'flex-end',
    pointerEvents: 'box-none',
  },
  floatingWhatsApp: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingWhatsAppIcon: { fontSize: 24 },
  floatingOrder: {
    backgroundColor: '#C0392B',
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 30,
    shadowColor: '#C0392B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingOrderText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});
