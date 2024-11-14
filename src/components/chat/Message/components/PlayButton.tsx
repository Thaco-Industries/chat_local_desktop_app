import React from 'react';
import PlayIcon from '../../../../assets/icons/play';

type Props = {};

function PlayButton({}: Props) {
  return (
    <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white w-12 h-12 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <PlayIcon />
    </button>
  );
}

export default PlayButton;
