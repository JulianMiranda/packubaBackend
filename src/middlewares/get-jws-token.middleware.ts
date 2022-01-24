
import { Injectable, NestMiddleware, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


import { JWT_KEY } from 'src/config/config';
import { User } from 'src/dto/user.dto';
import { ROLES } from 'src/enums/roles.enum';
import { RoleRepository } from 'src/modules/role/role.repository';
import { UserRepository } from 'src/modules/user/user.repository';
import { verifyJWT } from 'src/utils/verifyJWS';


Injectable()
export class GetJWSMiddleware implements NestMiddleware {
    constructor(private roleRepository: RoleRepository) {}

  async use(req: Request, res: Response, next: () => void) {
    
    const token = req.headers['x-token'];
    if (!token) {
       
      next();
      return;
    }
    try {
  
        console.log('dio',this.roleRepository.getRoles()['CUN']);
        const  useruid  = verifyJWT( token);

        if (!useruid[0])
        throw new ServiceUnavailableException('Please login again');
       
      if (useruid[0]) {
       
        const user: Partial<User> = {           
            role: ROLES.CUN,
          };
          console.log('si esto');
        
        
        (user.permissions = this.roleRepository.getRoles()[user.role]),
          (req['user'] = user);
          console.log('userdb',user);
        /* const userdb = await this.userDB.getUser('+593962914922')
        console.log(userdb); */
        
        /* const user: Partial<User> = {
         
          name: firebaseInfo.name,
          image: firebaseInfo.picture
            ? firebaseInfo.picture
            : getDefaultImage(firebaseInfo.name),
          role: firebaseInfo.role || ROLES.CUN,
        };
        if (firebaseInfo.email) user.email = firebaseInfo.email;
        if (firebaseInfo.phone_number) user.phone = firebaseInfo.phone_number;
        if (firebaseInfo.mongoId) user.id = firebaseInfo.mongoId;

        (user.permissions = this.roleRepository.getRoles()[user.role]),
          (req['user'] = user); */
      }
    } catch (e) {
      if (e.status === 503) throw e;
      else throw new UnauthorizedException('Authentication error', e);
    }

    next();
  }
}


/* 
const validarJWT = ( req, res, next ) => {

    try {
        
        const token = req.header('x-token');

        if ( !token ) {
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la petición'
            });
        }
      
        const  useruid  = jwt.verify( token, process.env.JWT_KEY );
       

        next();

    } catch (e) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no es válido'
        });
    }



}


module.exports = {
    validarJWT
} */