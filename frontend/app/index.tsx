import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  FlatList, ImageBackground, useWindowDimensions, LayoutAnimation,
  Platform, UIManager,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { colors, font, spacing, radius } from '@/src/theme';
import { EVENT, WHY_ATTEND, EVENT_INFO, SPONSORS, TESTIMONIALS, FAQS, GALLERY, VIDEO, STORE_URL, SHOP } from '@/src/data';
import Countdown from '@/src/components/Countdown';
import LeadSheet from '@/src/components/LeadSheet';
import SocialLinks from '@/src/components/SocialLinks';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const IMAGES: Record<string, any> = {
  hero: require('../assets/images/hero.jpg'),
  gallery1: require('../assets/images/gallery1.jpg'),
  gallery2: require('../assets/images/gallery2.jpg'),
  gallery3: require('../assets/images/gallery3.jpg'),
  gallery4: require('../assets/images/gallery4.jpg'),
};

function SectionHeader({ kicker, title, testID }: { kicker: string; title: string; testID?: string }) {
  return (
    <View style={styles.sectionHead} testID={testID}>
      <View style={styles.kickerRow}>
        <View style={styles.kickerBar} />
        <Text style={styles.kicker}>{kicker}</Text>
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export default function Landing() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [sheet, setSheet] = useState<null | 'ticket' | 'sponsor'>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const openTickets = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); WebBrowser.openBrowserAsync(EVENT.ticketUrl); };
  const openSponsor = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setSheet('sponsor'); };
  const openUrl = (url: string) => { Haptics.selectionAsync(); WebBrowser.openBrowserAsync(url); };

  const toggleFaq = (i: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOpenFaq(openFaq === i ? null : i);
  };

  const galleryW = width;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Sticky top header */}
      <BlurView intensity={30} tint="dark" style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <Text style={styles.brand} testID="header-brand">ISLAND<Text style={{ color: colors.brand }}> STAMPEDE</Text></Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <SocialLinks
            facebookUrl="https://www.facebook.com/share/1D8DMzKVxY/?mibextid=wwXIfr"
            instagramUrl="https://www.instagram.com/"
            eventUrl="https://www.facebook.com/share/17xCfDgyMM/?mibextid=wwXIfr"
          />
          <Pressable style={styles.topTicketBtn} onPress={openTickets} testID="header-tickets-button">
            <Text style={styles.topTicketText}>TICKETS</Text>
          </Pressable>
        </View>
      </BlurView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
        testID="landing-scroll"
      >
        {/* HERO */}
        <ImageBackground source={IMAGES.hero} style={[styles.hero, { paddingTop: insets.top + 90 }]} resizeMode="cover">
          <LinearGradient
            colors={['rgba(10,10,10,0.55)', 'rgba(10,10,10,0.2)', 'rgba(10,10,10,0.95)', '#0A0A0A']}
            locations={[0, 0.4, 0.85, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroContent}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>TASMANIA&apos;S PREMIER PRO BULL RIDING</Text>
            </View>
            <Text style={styles.heroTitle} testID="hero-title">{EVENT.tagline}</Text>
            <Text style={styles.heroSub}>{EVENT.subtitle}</Text>
            <Text style={styles.heroPresenter}>{EVENT.presenter}</Text>
            <View style={styles.heroMeta}>
              <View style={styles.metaChip}>
                <Ionicons name="calendar" size={14} color={colors.brand} />
                <Text style={styles.metaText}>{EVENT.dates}</Text>
              </View>
              <View style={styles.metaChip}>
                <Ionicons name="location" size={14} color={colors.brand} />
                <Text style={styles.metaText}>Launceston Silverdome</Text>
              </View>
            </View>
            <Pressable style={styles.ctaPrimary} onPress={openTickets} testID="hero-buy-tickets-button">
              <Text style={styles.ctaPrimaryText}>BUY TICKETS</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </Pressable>
            <Pressable style={styles.ctaSecondary} onPress={openSponsor} testID="hero-sponsor-button">
              <Text style={styles.ctaSecondaryText}>BECOME A SPONSOR</Text>
            </Pressable>
          </View>
        </ImageBackground>

        {/* COUNTDOWN */}
        <Countdown />

        {/* ABOUT */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.section}>
          <SectionHeader kicker="THE EVENT" title="WELCOME TO THE STAMPEDE" testID="about-section" />
          <Text style={styles.body}>
            Presented by Bucking Good Rodeo Promotions, Island Stampede brings professional bull riding
            to Tasmania&apos;s Silverdome. Australia&apos;s top bull riders go head-to-head with some of the country&apos;s
            rankest bulls in an electrifying indoor arena showdown, backed by music, lights and feature events.
          </Text>
          <Text style={styles.body}>
            It&apos;s a full weekend of high-energy entertainment beyond the chutes — food vendors, licensed bars
            and a vibrant atmosphere for families, couples and groups. Proceeds support the Launceston
            Children&apos;s Ward Auxiliary at the LGH. The Saturday night main event regularly sells out.
          </Text>
          <View style={styles.statRow}>
            {[['20+', 'ELITE RIDERS'], ['2', 'BIG NIGHTS'], ['5K+', 'FANS ROARING']].map(([n, l]) => (
              <View key={l} style={styles.statBox}>
                <Text style={styles.statNum}>{n}</Text>
                <Text style={styles.statLabel}>{l}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* WHY ATTEND */}
        <View style={styles.section}>
          <SectionHeader kicker="WHY ATTEND" title="BUILT FOR THE FANS" testID="why-attend-section" />
          <View style={styles.grid}>
            {WHY_ATTEND.map((w) => (
              <View key={w.title} style={styles.gridCard} testID={`why-card-${w.title}`}>
                <View style={styles.iconWrap}>
                  <Ionicons name={w.icon as any} size={22} color={colors.brand} />
                </View>
                <Text style={styles.cardTitle}>{w.title}</Text>
                <Text style={styles.cardDesc}>{w.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* GALLERY */}
        <View style={[styles.section, { paddingHorizontal: 0 }]}>
          <View style={{ paddingHorizontal: spacing.lg }}>
            <SectionHeader kicker="IN THE ARENA" title="RAW. LOUD. RELENTLESS." testID="gallery-section" />
          </View>
          <FlatList
            data={GALLERY as unknown as string[]}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(i) => i}
            onScroll={(e) => setGalleryIndex(Math.round(e.nativeEvent.contentOffset.x / galleryW))}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <View style={{ width: galleryW, paddingHorizontal: spacing.lg }}>
                <Image source={IMAGES[item]} style={styles.galleryImg} contentFit="cover" transition={200} />
              </View>
            )}
          />
          <View style={styles.dots}>
            {GALLERY.map((_, i) => (
              <View key={i} style={[styles.dot, galleryIndex === i && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* VIDEO */}
        <View style={styles.section}>
          <SectionHeader kicker="HIGHLIGHTS" title="FEEL THE ADRENALINE" testID="video-section" />
          <Pressable style={styles.videoCard} onPress={() => openUrl(VIDEO.url)} testID="video-play-button">
            <Image source={IMAGES[VIDEO.poster]} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
            <LinearGradient colors={["rgba(10,10,10,0.15)", "rgba(10,10,10,0.75)"]} style={StyleSheet.absoluteFill} />
            <View style={styles.playCircle}>
              <Ionicons name="play" size={30} color="#fff" style={{ marginLeft: 3 }} />
            </View>
            <View style={styles.videoBadge}>
              <Ionicons name="logo-facebook" size={14} color="#fff" />
              <Text style={styles.videoBadgeText}>WATCH THE REEL</Text>
            </View>
          </Pressable>
          <Text style={styles.videoCaption}>See last year&apos;s action from inside the arena.</Text>
        </View>

        {/* EVENT INFO */}
        <View style={styles.section}>
          <SectionHeader kicker="KNOW BEFORE YOU GO" title="EVENT INFORMATION" testID="event-info-section" />
          {EVENT_INFO.map((e) => (
            <View key={e.label} style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name={e.icon as any} size={18} color={colors.brand} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>{e.label}</Text>
                <Text style={styles.infoValue}>{e.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* SHOP */}
        <View style={[styles.section, { paddingHorizontal: 0 }]}>
          <View style={{ paddingHorizontal: spacing.lg }}>
            <SectionHeader kicker="OFFICIAL MERCH" title="GEAR UP" testID="shop-section" />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
          >
            {SHOP.map((p, i) => (
              <Pressable key={i} style={styles.shopCard} onPress={() => openUrl(p.url)} testID={`shop-item-${i}`}>
                <Image source={{ uri: p.image }} style={styles.shopImg} contentFit="cover" transition={200} />
                <View style={styles.shopBody}>
                  <Text style={styles.shopTitle} numberOfLines={2}>{p.title}</Text>
                  <View style={styles.shopRow}>
                    <Text style={styles.shopPrice}>{p.price}</Text>
                    <View style={styles.shopBtn}>
                      <Text style={styles.shopBtnText}>SHOP</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable style={[styles.sponsorCta, { marginHorizontal: spacing.lg }]} onPress={() => openUrl(STORE_URL)} testID="shop-all-button">
            <Ionicons name="bag" size={18} color={colors.brand} />
            <Text style={styles.sponsorCtaText}>VISIT THE OFFICIAL STORE</Text>
          </Pressable>
        </View>


        {/* SPONSORS */}
        <View style={styles.section}>
          <SectionHeader kicker="OUR PARTNERS" title="POWERED BY THE BEST" testID="sponsors-section" />
          <View style={styles.sponsorGrid}>
            {SPONSORS.map((s, i) => (
              <View
                key={`${s.name}-${i}`}
                style={[styles.sponsorCard, s.available && styles.sponsorCardOpen]}
                testID={`sponsor-card-${i}`}>
                <Text style={[styles.sponsorText, s.available && styles.sponsorTextOpen]}>{s.name}</Text>
              </View>
            ))}
          </View>
          <Pressable style={styles.sponsorCta} onPress={openSponsor} testID="sponsors-cta-button">
            <Ionicons name="briefcase" size={18} color={colors.brand} />
            <Text style={styles.sponsorCtaText}>EXPLORE SPONSORSHIP OPPORTUNITIES</Text>
          </Pressable>
        </View>

        {/* TESTIMONIALS */}
        <View style={[styles.section, { paddingHorizontal: 0 }]}>
          <View style={{ paddingHorizontal: spacing.lg }}>
            <SectionHeader kicker="THE VERDICT" title="FANS CAN'T STOP TALKING" testID="testimonials-section" />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
          >
            {TESTIMONIALS.map((t) => (
              <View key={t.name} style={styles.reviewCard}>
                <View style={styles.stars}>
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Ionicons key={s} name="star" size={14} color={colors.warning} />
                  ))}
                </View>
                <Text style={styles.reviewQuote}>&ldquo;{t.quote}&rdquo;</Text>
                <Text style={styles.reviewName}>{t.name}</Text>
                <Text style={styles.reviewTag}>{t.tag}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <SectionHeader kicker="QUESTIONS?" title="FREQUENTLY ASKED" testID="faq-section" />
          {FAQS.map((f, i) => (
            <Pressable key={f.q} style={styles.faqItem} onPress={() => toggleFaq(i)} testID={`faq-item-${i}`}>
              <View style={styles.faqRow}>
                <Text style={styles.faqQ}>{f.q}</Text>
                <Ionicons name={openFaq === i ? 'remove' : 'add'} size={22} color={colors.brand} />
              </View>
              {openFaq === i && <Text style={styles.faqA} testID={`faq-answer-${i}`}>{f.a}</Text>}
            </Pressable>
          ))}
        </View>

        {/* FINAL CTA */}
        <View style={styles.finalCta} testID="final-cta-section">
          <LinearGradient colors={[colors.brandSecondary, colors.brand]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.finalGradient}>
            <Text style={styles.finalKicker}>TICKETS SELLING FAST</Text>
            <Text style={styles.finalTitle}>DON&apos;T MISS THE ROAR</Text>
            <Text style={styles.finalSub}>
              Two nights only. Limited ringside & VIP. Once they&apos;re gone, they&apos;re gone.
            </Text>
            <Pressable style={styles.finalBtn} onPress={openTickets} testID="final-buy-tickets-button">
              <Text style={styles.finalBtnText}>BUY TICKETS NOW</Text>
            </Pressable>
            <Text style={styles.finalMeta}>{EVENT.dates} · {EVENT.venue}</Text>
          </LinearGradient>
        </View>

        <View style={styles.footerWrap}>
          <SocialLinks
            facebookUrl="https://www.facebook.com/share/1D8DMzKVxY/?mibextid=wwXIfr"
            instagramUrl="https://www.instagram.com/"
            eventUrl="https://www.facebook.com/share/17xCfDgyMM/?mibextid=wwXIfr"
          />
          <Text style={styles.footerBrand}>ISLAND STAMPEDE</Text>
          <Text style={styles.footer}>{EVENT.presenter}</Text>
          <Text style={styles.footer}>{EVENT.address}</Text>
          <Text style={styles.footer}>{EVENT.phone} · {EVENT.email}</Text>
          <Text style={styles.footer}>© 2026 Island Stampede · Launceston, Tasmania</Text>
        </View>
      </ScrollView>

      {/* Sticky bottom CTA */}
      <BlurView intensity={40} tint="dark" style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.sm }]}>
        <Pressable style={styles.bottomSponsor} onPress={openSponsor} testID="sticky-sponsor-button">
          <Text style={styles.bottomSponsorText}>SPONSOR</Text>
        </Pressable>
        <Pressable style={styles.bottomBuy} onPress={openTickets} testID="sticky-buy-tickets-button">
          <Ionicons name="ticket" size={18} color="#fff" />
          <Text style={styles.bottomBuyText}>BUY TICKETS</Text>
        </Pressable>
      </BlurView>

      <LeadSheet visible={sheet !== null} type={sheet || 'ticket'} onClose={() => setSheet(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },

  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingBottom: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: 'rgba(41,41,41,0.6)',
  },
  brand: { color: colors.onSurface, fontFamily: font.extrabold, fontSize: 16, letterSpacing: 1 },
  topTicketBtn: { backgroundColor: colors.brand, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md },
  topTicketText: { color: '#fff', fontFamily: font.extrabold, fontSize: 12, letterSpacing: 1 },

  hero: { minHeight: 620, justifyContent: 'flex-end' },
  heroContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: spacing.xs,
    backgroundColor: 'rgba(10,68,255,0.15)', borderWidth: 1, borderColor: colors.brand,
    paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.pill, marginBottom: spacing.md,
  },
  liveDot: { width: 6, height: 6, borderRadius: radius.pill, backgroundColor: colors.brand },
  liveText: { color: colors.onBrandTertiary, fontFamily: font.bold, fontSize: 10, letterSpacing: 1 },
  heroTitle: { color: colors.onSurface, fontFamily: font.display, fontSize: 68, lineHeight: 64, letterSpacing: 1 },
  heroSub: { color: colors.onSurfaceSecondary, fontFamily: font.semibold, fontSize: 16, marginTop: spacing.sm },
  heroPresenter: { color: colors.onSurfaceTertiary, fontFamily: font.regular, fontSize: 12, marginTop: 4, marginBottom: spacing.lg, letterSpacing: 0.5 },
  heroMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: 'rgba(20,20,20,0.8)', borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md,
  },
  metaText: { color: colors.onSurface, fontFamily: font.semibold, fontSize: 13 },
  ctaPrimary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    backgroundColor: colors.brand, paddingVertical: spacing.lg, borderRadius: radius.lg, marginBottom: spacing.md,
  },
  ctaPrimaryText: { color: '#fff', fontFamily: font.extrabold, fontSize: 17, letterSpacing: 1 },
  ctaSecondary: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.lg,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.borderStrong,
  },
  ctaSecondaryText: { color: colors.onSurface, fontFamily: font.bold, fontSize: 14, letterSpacing: 1 },

  section: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xxl },
  sectionHead: { marginBottom: spacing.xl },
  kickerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  kickerBar: { width: 28, height: 3, backgroundColor: colors.brand },
  kicker: { color: colors.brand, fontFamily: font.bold, fontSize: 12, letterSpacing: 2 },
  sectionTitle: { color: colors.onSurface, fontFamily: font.display, fontSize: 40, lineHeight: 40, letterSpacing: 0.5 },
  body: { color: colors.onSurfaceTertiary, fontFamily: font.regular, fontSize: 15, lineHeight: 24, marginBottom: spacing.md },

  statRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  statBox: { flex: 1, backgroundColor: colors.surfaceSecondary, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingVertical: spacing.lg, alignItems: 'center' },
  statNum: { color: colors.brand, fontFamily: font.display, fontSize: 34 },
  statLabel: { color: colors.onSurfaceTertiary, fontFamily: font.bold, fontSize: 10, letterSpacing: 1, marginTop: 2 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.md },
  gridCard: { width: '48%', backgroundColor: colors.surfaceSecondary, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg },
  iconWrap: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.brandTertiary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  cardTitle: { color: colors.onSurface, fontFamily: font.extrabold, fontSize: 16, marginBottom: spacing.xs },
  cardDesc: { color: colors.onSurfaceTertiary, fontFamily: font.regular, fontSize: 13, lineHeight: 19 },

  galleryImg: { width: '100%', height: 260, borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: spacing.xs, marginTop: spacing.lg },
  dot: { width: 8, height: 8, borderRadius: radius.pill, backgroundColor: colors.borderStrong },
  dotActive: { backgroundColor: colors.brand, width: 22 },

  videoCard: { height: 220, borderRadius: radius.lg, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceSecondary },
  playCircle: { width: 74, height: 74, borderRadius: radius.pill, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: 'rgba(255,255,255,0.3' },
  videoBadge: { position: 'absolute', bottom: spacing.md, left: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: spacing.sm },
  videoBadgeText: { color: '#fff', fontFamily: font.bold, fontSize: 11, letterSpacing: 1 },
  videoCaption: { color: colors.onSurfaceTertiary, fontFamily: font.regular, fontSize: 13, marginTop: spacing.md, textAlign: 'center' },

  shopCard: { width: 200, backgroundColor: colors.surfaceSecondary, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden' },
  shopImg: { width: '100%', height: 180, backgroundColor: colors.surfaceTertiary },
  shopBody: { padding: spacing.md },
  shopTitle: { color: colors.onSurface, fontFamily: font.bold, fontSize: 14, minHeight: 38 },
  shopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  shopPrice: { color: colors.onBrandTertiary, fontFamily: font.extrabold, fontSize: 16 },
  shopBtn: { backgroundColor: colors.brand, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.md },
  shopBtnText: { color: '#fff', fontFamily: font.extrabold, fontSize: 12, letterSpacing: 1 },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.divider },
  infoIcon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surfaceSecondary, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { color: colors.onSurfaceTertiary, fontFamily: font.bold, fontSize: 11, letterSpacing: 1 },
  infoValue: { color: colors.onSurface, fontFamily: font.semibold, fontSize: 15, marginTop: 2 },

  sponsorGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.md },
  sponsorCard: { width: '48%', height: 72, backgroundColor: colors.surfaceSecondary, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'ce' },
  sponsorCardOpen: { backgroundColor: 'transparent', borderStyle: 'dashed', borderColor: colors.borderStrong },
  sponsorText: { color: colors.silver, fontFamily: font.extrabold, fontSize: 15, letterSpacing: 1 },
  sponsorTextOpen: { color: colors.onSurfaceTertiary, fontFamily: font.bold, fontSize: 12 },
  sponsorCta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.lg, paddingVertical: spacing.lg, borderRadius: radius.lg, borderWidth: 1 },
  sponsorCtaText: { color: colors.onSurface, fontFamily: font.bold, fontSize: 13, letterSpacing: 1 },

  reviewCard: { width: 280, backgroundColor: colors.surfaceSecondary, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg },
  stars: { flexDirection: 'row', gap: 2, marginBottom: spacing.md },
  reviewQuote: { color: colors.onSurfaceSecondary, fontFamily: font.semibold, fontSize: 15, lineHeight: 22, marginBottom: spacing.md },
  reviewName: { color: colors.onSurface, fontFamily: font.extrabold, fontSize: 14 },
  reviewTag: { color: colors.brand, fontFamily: font.bold, fontSize: 11, letterSpacing: 1, marginTop: 2 },

  faqItem: { backgroundColor: colors.surfaceSecondary, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.sm },
  faqRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  faqQ: { flex: 1, color: colors.onSurface, fontFamily: font.bold, fontSize: 15 },
  faqA: { color: colors.onSurfaceTertiary, fontFamily: font.regular, fontSize: 14, lineHeight: 21, marginTop: spacing.md },

  finalCta: { paddingHorizontal: spacing.lg, marginTop: spacing.sm },
  finalGradient: { borderRadius: radius.lg, padding: spacing.xxl, alignItems: 'center' },
  finalKicker: { color: 'rgba(255,255,255,0.85)', fontFamily: font.bold, fontSize: 12, letterSpacing: 2, marginBottom: spacing.sm },
  finalTitle: { color: '#fff', fontFamily: font.display, fontSize: 46, lineHeight: 44, textAlign: 'center' },
  finalSub: { color: 'rgba(255,255,255,0.9)', fontFamily: font.regular, fontSize: 14, textAlign: 'center', lineHeight: 21, marginTop: spacing.md, marginBottom: spacing.xl },
  finalBtn: { backgroundColor: '#0A0A0A', paddingVertical: spacing.lg, paddingHorizontal: spacing.xxl, borderRadius: radius.lg, width: '100%', alignItems: 'center' },
  finalBtnText: { color: '#fff', fontFamily: font.extrabold, fontSize: 17, letterSpacing: 1 },
  finalMeta: { color: 'rgba(255,255,255,0.8)', fontFamily: font.semibold, fontSize: 12, marginTop: spacing.lg, textAlign: 'center' },

  footer: { color: colors.onSurfaceTertiary, fontFamily: font.regular, fontSize: 12, textAlign: 'center', marginTop: spacing.xxl },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
    flexDirection: 'row', gap: spacing.sm,
    paddingHorizontal: spacing.lg, paddingTop: spacing.md,
    borderTopWidth: 1, borderTopColor: 'rgba(41,41,41,0.8)',
  },
  bottomSponsor: { paddingHorizontal: spacing.lg, justifyContent: 'center', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.borderStrong },
  bottomSponsorText: { color: colors.onSurface, fontFamily: font.bold, fontSize: 13, letterSpacing: 1 },
  bottomBuy: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.brand, paddingVertical: spacing.lg, borderRadius: radius.lg },
  bottomBuyText: { color: '#fff', fontFamily: font.extrabold, fontSize: 16, letterSpacing: 1 },
});
