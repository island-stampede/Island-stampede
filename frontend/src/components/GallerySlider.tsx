import React from 'react';
import { View, FlatList, Dimensions, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

type Props = {
  images: Array<any>; // require(...) or uri strings
};

export default function GallerySlider({ images = [] }: Props) {
  const { width } = Dimensions.get('window');
  return (
    <View style={styles.wrap}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(i) => (typeof i === 'string' ? i : String(i))}
        renderItem={({ item }) => (
          <Pressable style={{ width, paddingHorizontal: 16 }}>
            <Image source={item} style={styles.img} contentFit="cover" />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', overflow: 'hidden' },
  img: { width: '100%', height: 260, borderRadius: 12, backgroundColor: '#111' },
});
