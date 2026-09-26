import jwt from 'jsonwebtoken';

const TOKEN_TTL_DAYS = 30;

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV !== 'development',
  sameSite: 'strict',
  path: '/',
});

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: `${TOKEN_TTL_DAYS}d`,
    algorithm: 'HS256',
  });

  // Зберігаємо JWT в HttpOnly cookie
  res.cookie('jwt', token, {
    ...cookieOptions(),
    maxAge: TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  });
};

const clearToken = (res) => {
  res.clearCookie('jwt', cookieOptions());
};

export { clearToken };
export default generateToken;
