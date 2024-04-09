import { ExceptionFilter, Catch, UnauthorizedException, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';


@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(401).json({
      statusCode: 401,
      message: 'This endpiont needs Authorization. You have to add the Bearer token for authorization. (First Login/SignUp to get the JWT Bearer token)',
    });
  }
}