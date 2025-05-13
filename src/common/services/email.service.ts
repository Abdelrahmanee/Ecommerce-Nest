import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { EmailOptions } from '../interfaces/email.interface';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service:'gmail',
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false } 
    });
  }

  private async compileTemplate(templateName: string, context: Record<string, any>) {
    const templatePath = path.join(process.cwd(), 'src/common/templates', `${templateName}.hbs`);
    
    const template = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(context);
  }

  async sendEmail(options: EmailOptions) {
    try {
      const html = await this.compileTemplate(options.template, options.context);
      
      await this.transporter.sendMail({
        from:process.env.EMAIL_USERNAME,
        to: options.to,
        subject: options.subject,
        html,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendVerificationCode(email: string, verificationCode: string) {
    await this.sendEmail({
      to: email,
      subject: 'Your Verification Code',
      template: 'verification-code',
      context: {
        verificationCode,
        userName: email.split('@')[0],
        expiryMinutes: 15,
      },
    });
  }
  async sendPasswordResetEmail(email: string, resetToken: string) {
    // const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    
    await this.sendEmail({
      to: email,
      subject: 'Password Reset Request',
      template: 'password-reset',
      context: {
        // resetUrl,
        userName: email.split('@')[0],
        expiryHours: 24,
      },
    });
  }
}
