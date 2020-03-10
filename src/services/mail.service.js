import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { logger } from '../utils/logging';
import { sendEmail } from '../utils/nodemailer';

class MailService {

  constructor() {
    this.pathToTemplates = 'src/assets/emailTemplates';
  }

  getTemplate(template) {

    try {
      if (!template.name || template.name === '') {
        throw new Error(`Template name should be provided`)
      }
    } catch (err) {
      logger.error(err.message);
    }

    const regEx = RegExp(`^(${template.name})(.html)$`, 'i');

    // Checking for a file in a template directory and assigning its full name to a variable
    var fileName = readdirSync(path.join(process.cwd(), this.pathToTemplates)).filter(file => regEx.test(file))[0];

    try {
      if (!fileName) {
        throw new Error(`Couldn't find template "${template.name}" in a directory: ${this.pathToTemplates}`);
      }
    } catch (err) {
      logger.error(err.message);
    }


    // Reading a template and assigning it to a variable
    var html = readFileSync(path.join(process.cwd(), this.pathToTemplates, fileName), { encoding: 'utf8' });

    // Replacing placeholders in a template with data
    for (const key in template['data']) {
      const ex = RegExp(`\{ +${key} +\}`, 'i');
      html = html.replace(ex, template.data[key]);
    }

    return html;
  }

  sendEmail(to, subject, template) {
    const sender = '';


    if (!to || to.length < 0) {
      logger.warn(`Should be at least one recipient!`);
    };

    const html = this.getTemplate(template);

    const data = {
      to,
      subject,
      from: sender,
      html
    }

    sendEmail(data);
  }

}

export const mailService = new MailService();
