const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const TMDB_POSTER_SIZES = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original'
};

const TMDB_BACKDROP_SIZES = {
  small: 'w300',
  medium: 'w780',
  large: 'w1280',
  original: 'original'
};

export const getImageUrl = (path, size = 'medium', type = 'poster') => {
  if (!path) {
    // Return placeholder image based on type
    return type === 'poster' 
      ? '/placeholder-poster.jpg'
      : '/placeholder-backdrop.jpg';
  }

  const sizeMap = type === 'poster' ? TMDB_POSTER_SIZES : TMDB_BACKDROP_SIZES;
  const imageSize = sizeMap[size] || sizeMap.medium;

  return `${TMDB_IMAGE_BASE_URL}${imageSize}${path}`;
};
