import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';

type Props = {
  source: any; // require(...) or URI
  poster?: any;
  style?: any;
};

export default function HeroVideo({ source, poster, style }: Props) {
  if (Platform.OS === 'web') {
    // Render plain HTML5 video on web to avoid importing native-only modules at bundle time
    // eslint-disable-next-line react/no-unknown-property
    return (
      // @ts-ignore - allow raw div in RN Web environment
      <div style={{ width: '100%', height: '100%', overflow: 'hidden', ...(style || {}) }}>
        <video
          src={typeof source === 'string' ? source : source?.uri || ''}
          poster={poster?.uri || poster}
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    );
  }

  // Native: import expo-av at runtime to avoid bundling it into web build
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Video } = require('expo-av');

  return (
    <View style={[styles.container, style]}>
      {/* @ts-ignore - dynamic require returns any */}
      <Video
        source={source}
        useNativeControls={false}
        shouldPlay
        isLooping
        isMuted
        resizeMode="cover"
        style={styles.video}
        posterSource={poster}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', height: 400, overflow: 'hidden' },
  video: { width: '100%', height: '100%' },
});
