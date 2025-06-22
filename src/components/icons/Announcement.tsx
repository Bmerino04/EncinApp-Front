import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <Path d="M4 11a9 9 0 019 9" />
      <Path d="M4 4a16 16 0 0116 16" />
      <Path d="M4 18h.01" />
    </Svg>
  );
}

export default SvgComponent; 