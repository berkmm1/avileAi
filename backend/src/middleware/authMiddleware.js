import jwt from 'jsonwebtoken';
export default function auth(req,res,next){
  const h = req.headers.authorization;
  if(!h) return res.status(401).json({error:'unauthenticated'});
  const token = h.split(' ')[1];
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  }catch(e){
    return res.status(401).json({error:'invalid token'});
  }
}
