import { useEffect } from 'react';
import { Image } from 'react-native';
import { ImageAssets } from '@/constants/ImageAssets';

export const useImagePreloader = () => {
  useEffect(() => {
    const uris = Object.values(ImageAssets).map((img) =>
      Image.resolveAssetSource(img).uri
    );
    uris.forEach((uri) => {
      Image.prefetch(uri);
    });
  }, []);
};