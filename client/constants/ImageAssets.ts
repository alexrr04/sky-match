export const Images = {
  beach: require('@/assets/images/beach.png'),
  mountain: require('@/assets/images/mountain.png'),
  hot: require('@/assets/images/hot.png'),
  cold: require('@/assets/images/cold.png'),
  adventure: require('@/assets/images/adventure.png'),
  relax: require('@/assets/images/relax.png'),
  modernCity: require('@/assets/images/modernCity.png'),
  historic: require('@/assets/images/historic.png'),
  goodFood: require('@/assets/images/goodFood.png'),
  fastFood: require('@/assets/images/fastFood.png'),
  party: require('@/assets/images/party.png'),
  sleep: require('@/assets/images/sleep.png'),
} as const;

export type ImageAssetKeys = keyof typeof Images;
