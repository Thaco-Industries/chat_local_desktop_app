import React from 'react';
import LogoThacoId from '../../assets/icons/logo-thacoID';

export default function WelcomeScreen() {
  return (
    <div className="h-full hidden tablet:flex flex-col items-center justify-center gap-11">
      <div className="w-[70%] flex justify-center">
        <LogoThacoId />
      </div>
      <p className="text-primary text-lg text-center w-[70%]">
        Chào mừng bạn đến với phần mềm chat nội bộ Trung tâm R&D
      </p>
    </div>
  );
}
