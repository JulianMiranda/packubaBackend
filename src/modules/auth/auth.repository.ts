import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/dto/user.dto';
import { FirebaseService } from 'src/services/firebase.service';
import { ENTITY } from '../../enums/entity.enum';
import { ImageRepository } from '../image/image.repository';
import jwt from 'jsonwebtoken';
import { generarJWT } from 'src/utils/generateJWS';
import { verifyJWT } from 'src/utils/verifyJWS';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel('User') private userDb: Model<User>,
    private imageRepository: ImageRepository,
  ) {}

  readonly type = ENTITY.USERS;

  async login(user: User): Promise<User> {
    try {
      if (user.id) {
        console.log(`Se ha logueado el usuario: ${user.id}`);
        return this.userDb
          .findById(user.id, {
            name: true,
            email: true,
            role: true,
            image: true,
            theme: true,
            phone: true,
          })
          .populate([
            {
              path: 'image',
              match: { status: true },
              select: { url: true },
            },
          ]);
      }
      return await this.RegisterUser(user);
    } catch (e) {
      throw new InternalServerErrorException('Login Database error', e);
    }
  }

  async RegisterUser(user: User): Promise<User> {
    try {
      const { image, ...rest } = user;
      const registeredUser = await new this.userDb(rest).save();

      const claims = { role: user.role, mongoId: registeredUser.id };
      FirebaseService.setClaims(user.firebaseId, claims);

      const setImage = {
        url: image,
        parentType: this.type,
        parentId: registeredUser.id,
      };
      const imageModel = await this.imageRepository.insertImages([setImage]);

      return await this.userDb
        .findOneAndUpdate(
          { _id: registeredUser.id },
          { image: imageModel[0]._id },
          { new: true },
        )
        .select({
          name: true,
          email: true,
          image: true,
          role: true,
          theme: true,
          phone: true,
        })
        .populate([
          {
            path: 'image',
            match: { status: true },
            select: { url: true },
          },
        ]);
    } catch (e) {
      throw new InternalServerErrorException(
        'Register Mongo Database error',
        e,
      );
    }
  }

  async newlogin(user: User): Promise<User> {
    try {
      console.log('esto', user);
      
      const token = await generarJWT( '+593962914922' );
      if(token){

        const verify = verifyJWT( token );
        console.log(verify);
      }
     
      
      if (user.id) {
        console.log(`Se ha logueado el usuario: ${user.id}`);
        return this.userDb
          .findById(user.id, {
            name: true,
            email: true,
            role: true,
            image: true,
            theme: true,
            phone: true,
          })
          .populate([
            {
              path: 'image',
              match: { status: true },
              select: { url: true },
            },
          ]);
      }
      /* return await this.newRegisterUser(user); */
    } catch (e) {
      throw new InternalServerErrorException('Login Database error', e);
    }
  }

  async newRegisterUser(user: User): Promise<User> {
    try {
      const { image, ...rest } = user;
      const registeredUser = await new this.userDb(rest).save();

      const setImage = {
        url: image,
        parentType: this.type,
        parentId: registeredUser.id,
      };
      const imageModel = await this.imageRepository.insertImages([setImage]);

      return await this.userDb
        .findOneAndUpdate(
          { _id: registeredUser.id },
          { image: imageModel[0]._id },
          { new: true },
        )
        .select({
          name: true,
          email: true,
          image: true,
          role: true,
          theme: true,
          phone: true,
        })
        .populate([
          {
            path: 'image',
            match: { status: true },
            select: { url: true },
          },
        ]);
    } catch (e) {
      throw new InternalServerErrorException(
        'Register Mongo Database error',
        e,
      );
    }
  }
  async generateToken(phone: string): Promise<any> {
    try {
     const user = await this.userDb.findOne({phone}, {
      name: true,
      email: true,
      role: true,
      image: true,
      theme: true,
      phone: true,
      status: true
    }).populate([
      {
        path: 'image',
        match: { status: true },
        select: { url: true },
      },
    ]);
     const token = await generarJWT( phone );
     if(!!user){
       console.log('login');
       
      return {state: 'Login', user, token};
     } else{       
      const registeredUser = await new this.userDb({phone}).save(); 
      console.log('Register');   
      return {
        state: 'Register',
        user: registeredUser,
        token
      }
     }
        
    } catch (e) {
      throw new InternalServerErrorException(
        'Register Mongo Database error',
        e,
      );
    }
  }

  async tokenRenew(user: User): Promise<any> {
    try {
    const token = await generarJWT( user.phone );
 
     return {state: 'Login', user, token};

     /*  return await this.userDb
        .findOne(
          { _id: registeredUser.id },
          { new: true },
        )
        .select({
          name: true,
          email: true,
          image: true,
          role: true,
          theme: true,
          phone: true,
        })
       
        ; */
    } catch (e) {
      throw new InternalServerErrorException(
        'Register Mongo Database error',
        e,
      );
    }
  }
  
}
