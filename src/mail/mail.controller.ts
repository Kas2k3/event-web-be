import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Public } from 'src/auth/decorators/public.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly mailerService: MailerService,
  ) { }

  @Get()
  @Public()
  // @Cron(CronExpression.EVERY_30_SECONDS)
  @ResponseMessage('Test email')
  async handleTestEmail() {
    await this.mailerService.sendMail({
      to: 'phuoc17032003@gmail.com',
      from: '"Support Team" <support@example.com>',
      subject: 'Xác minh tài khoản của bạn',
      template: 'account-verification',
    });
  }
}
