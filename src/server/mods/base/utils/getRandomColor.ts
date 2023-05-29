import colors from './constants/colors';

export default function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * 15);
  return colors[randomIndex];
}
