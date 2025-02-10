export default function isValidPassword (password: string) {
  // Проверяем длину пароля
  if (password.length < 8 || password.length > 20) {
    return false;
  }

  // Проверяем наличие цифры и буквы
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  return hasNumber && hasLetter;
};
