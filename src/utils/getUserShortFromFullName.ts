const getUserShortFromFullName = (fullName: string | undefined) => {
  if (!fullName) {
    return '';
  }

  const parts = fullName.split(' ');
  const letters = parts.map((part) => part[0]);
  return letters.join('');
}

export default getUserShortFromFullName;