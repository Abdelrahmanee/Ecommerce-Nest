import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { ApiOperation } from '@nestjs/swagger';
import { SendVerifivationCode } from './dto/SendVerifivationCode.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('sign-up')
  @ApiOperation({ summary: "SignUp" })
  async signUp(@Body() signUpDto: SignUpDto) {
    const createdUser = await this.authService.signUp(signUpDto)
    return ApiResponse.success(createdUser)
  }
  @ApiOperation({ summary: "Login" })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto)
    return ApiResponse.success(data)
  }

  @ApiOperation({ summary: "Send Verification Code" })
  @Patch('send-reset-code')
  async sendResetPasswordCode(@Body() sendVerifivationCode: SendVerifivationCode) {
    const isSent = await this.authService.sendResetPasswordCode(sendVerifivationCode)
    if (!isSent) return ApiResponse.fail("Erorr In Sending Cdde", 400)
    return ApiResponse.success("Code Sent successfully")
  }

  @ApiOperation({ summary: "Reset Password" })
  @Patch('reset-password')
  async ResetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const isReset = await this.authService.resetPassword(resetPasswordDto)
    if (!isReset) return ApiResponse.fail("Erorr In Reset Password", 400)
    return ApiResponse.success("Password Is Reset Success")
  }
}
