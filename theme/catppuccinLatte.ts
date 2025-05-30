// Catppuccin Latte color palette and NativeBase theme
export const catppuccinLatte = {
  rosewater: '#dc8a78',
  flamingo: '#dd7878',
  pink: '#ea76cb',
  mauve: '#8839ef',
  red: '#d20f39',
  maroon: '#e64553',
  peach: '#fe640b',
  yellow: '#df8e1d',
  green: '#40a02b',
  teal: '#179299',
  sky: '#04a5e5',
  sapphire: '#209fb5',
  blue: '#1e66f5',
  lavender: '#7287fd',
  text: '#4c4f69',
  subtext1: '#5c5f77',
  subtext0: '#6c6f85',
  overlay2: '#7c7f93',
  overlay1: '#8c8fa1',
  overlay0: '#9ca0b0',
  surface2: '#acb0be',
  surface1: '#bcc0cc',
  surface0: '#ccd0da',
  base: '#eff1f5',
  mantle: '#e6e9ef',
  crust: '#dce0e8',
};

import { extendTheme } from 'native-base';

export const theme = extendTheme({
  colors: {
    primary: catppuccinLatte.blue,
    secondary: catppuccinLatte.lavender,
    background: catppuccinLatte.base,
    muted: catppuccinLatte.overlay1,
    card: catppuccinLatte.surface0,
    border: catppuccinLatte.surface2,
    error: catppuccinLatte.red,
    // Add more as needed
    ...catppuccinLatte,
  },
  fontConfig: {
    Geist: {
      100: 'Geist-Thin',
      200: 'Geist-ExtraLight',
      300: 'Geist-Light',
      400: 'Geist-Regular',
      500: 'Geist-Medium',
      600: 'Geist-SemiBold',
      700: 'Geist-Bold',
      800: 'Geist-ExtraBold',
      900: 'Geist-Black',
    },
  },
  fonts: {
    heading: 'Geist',
    body: 'Geist',
    mono: 'Geist',
  },
  components: {
    // You can customize NativeBase components here
  },
}); 