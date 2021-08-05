import {
    Injectable,
    NestMiddleware,
    ServiceUnavailableException,
    UnauthorizedException,
  } from '@nestjs/common';
import { UserRepository } from 'src/modules/user/user.repository';
  import { FirebaseService } from 'src/services/firebase.service';
import { verifyJWT } from 'src/utils/verifyJWS';
  import { User } from '../dto/user.dto';
  import { ROLES } from '../enums/roles.enum';
  import { RoleRepository } from '../modules/role/role.repository';
  import { getDefaultImage } from '../utils/index';
  
  @Injectable()
  export class GetTokenMiddleware implements NestMiddleware {
    constructor(private roleRepository: RoleRepository, private userRepository: UserRepository) {}
  
    async use(req: Request, res: Response, next: () => void) {
        
      
      const token = req.headers['x-token'];
      
      if (!token) {
        next();
        return;
      }
      try {
        
        const  useruid  = verifyJWT( token);
        console.log(useruid);
        
        const nw = await this.userRepository.getUser(useruid[1]);
        if (useruid) {
          if (!useruid[0])
            throw new ServiceUnavailableException('Please login again');
  
          const user: Partial<User> = {
            
            name: nw.name ? nw.name : 'Anonymous',
            image: nw.name ? getDefaultImage(nw.name) : getDefaultImage('Anonymous'),
            role: nw.role || ROLES.CUN,
          };
          if (nw.email) user.email = nw.email;
          if (nw.phone) user.phone = nw.phone;
          if (nw.id) user.id = nw.id;
  
          (user.permissions = this.roleRepository.getRoles()[user.role]),
            (req['user'] = user);
        }
      } catch (e) {
        if (e.status === 503) throw e;
        else throw new UnauthorizedException('Authentication error', e);
      }
  
      next();
    }
  }
  