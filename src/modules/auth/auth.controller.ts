import {Controller, Get, Param, Req, UseGuards} from '@nestjs/common';
import {User} from 'src/dto/user.dto';
import {AuthenticationGuard} from '../../guards/authentication.guard';
import {AuthRepository} from './auth.repository';

@Controller()
export class AuthController {
	constructor(private _authRepo: AuthRepository) {}

	@UseGuards(AuthenticationGuard)
	@Get('/login')
	async login(@Req() req): Promise<User> {
		return this._authRepo.login({...req.user});
	}
	@Get('/newlogin')
	async newlogin(@Req() req): Promise<User> {
		return this._authRepo.newlogin({...req.user});
	}
	@Get('/generateToken/:phone')
	async generateToken(@Param('phone') phone: string): Promise<any> {
		return this._authRepo.generateToken(phone);
	}
	@UseGuards(AuthenticationGuard)
	@Get('/tokenRenew')
	async tokenRenew(@Req() req): Promise<any> {
		return this._authRepo.tokenRenew({...req.user});
	}
}
