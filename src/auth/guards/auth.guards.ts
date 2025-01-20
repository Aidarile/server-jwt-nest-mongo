
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from 'express';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor ( @Inject() private jwtService : JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // context -> sacaré el Request -> sacaré el header Auth -> sacaré el Token
        // necesito el jwtService -> para validar el token -> sacar el payload

        const request = context.switchToHttp().getRequest();
        const token = this.extraerTokenDeLaCabecera(request);
        if (!token) throw new UnauthorizedException();
        
        return true;
    }

        private extraerTokenDeLaCabecera(req: Request) : string | undefined {
            const [ tipo, token ] = req.headers.authorization?.split(" ") ?? [];
            return (tipo === "Bearer") ? token:undefined;
    
        }

}