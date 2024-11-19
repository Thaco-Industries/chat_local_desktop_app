const getColorBackround = (id: string) => {
  // Loại bỏ dấu gạch ngang trong UUID
  const sanitizedUUID = id.replace(/-/g, '');

  // Lấy 6 ký tự đầu tiên để làm màu HEX cơ bản
  const baseHex = sanitizedUUID.slice(0, 6);

  // Chuyển HEX sang các giá trị RGB
  const r = parseInt(baseHex.slice(0, 2), 16);
  const g = parseInt(baseHex.slice(2, 4), 16);
  const b = parseInt(baseHex.slice(4, 6), 16);

  // Điều chỉnh màu để đẹp hơn (tăng sáng và giảm bão hòa)
  const adjustedR = Math.min(255, Math.floor(r * 1.2));
  const adjustedG = Math.min(255, Math.floor(g * 1.2));
  const adjustedB = Math.min(255, Math.floor(b * 1.2));

  // Chuyển RGB đã điều chỉnh về HEX
  const prettyHex = `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG
    .toString(16)
    .padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`;

  return prettyHex;
};
export default getColorBackround;
