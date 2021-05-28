import jwt from 'jsonwebtoken';
import config from 'config';

const auth = async (request, response, next) => {
  try {
    const token = request.headers.authorization.replace('Bearer ', '');
    const decodedData = await jwt.verify(token, config.get('JWT_SECRET'));
    request.userData = decodedData.user;
    next();
  } catch (error) {
    return response.status(401).json({
      message: 'Authentification Failed',
    });
  }
};

export default auth;
