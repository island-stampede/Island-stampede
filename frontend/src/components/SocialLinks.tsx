import React from 'react';
import { Platform, Pressable, Text, View, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  facebookUrl?: string;
  instagramUrl?: string;
  eventUrl?: string;
};

export default function SocialLinks({
  facebookUrl = 'https://www.facebook.com/share/17xCfDgyMM/?mibextid=wwXIfr',
  instagramUrl = 'https://www.instagram.com/',
  eventUrl = '',
}: Props) {
  const open = (url: string) => {
    try {
      if (Platform.OS === 'web') {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        Linking.openURL(url);
      }
    } catch (e) {
      console.error('open link failed', e);
    }
  };

  const shareEvent = () => {
    const shareUrl = eventUrl || facebookUrl;
    open(shareUrl);
  };

  return (
    <View style={styles.row}>
      <Pressable onPress={() => open(facebookUrl)} style={styles.btn} accessibilityLabel="Facebook">
        <Ionicons name="logo-facebook" size={18} color="#1877F2" />
      </Pressable>

      <Pressable onPress={() => open(instagramUrl)} style={styles.btn} accessibilityLabel="Instagram">
        <Ionicons name="logo-instagram" size={18} color="#E4405F" />
      </Pressable>

      <Pressable onPress={shareEvent} style={[styles.btn, styles.shareBtn]} accessibilityLabel="Share Event">
        <Ionicons name="share-social" size={18} color="#fff" />
        <Text style={styles.shareText}>Share</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btn: { padding: 6 },
  shareBtn: { backgroundColor: '#1877F2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, flexDirection: 'row', alignItems: 'center' },
  shareText: { color: '#fff', marginLeft: 6, fontSize: 14 },
});
