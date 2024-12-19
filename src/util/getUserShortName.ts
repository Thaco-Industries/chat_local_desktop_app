const getUserShortName = (userName: string) => {
  if (!userName) return '';
  const trimmedUserName = userName.trim();
  const names = trimmedUserName.split(' ');
  return names.length === 1
    ? names[0][0]
    : `${names[0][0]}${names[names.length - 1][0]}`;
};
export default getUserShortName;
