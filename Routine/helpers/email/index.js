import fs from 'fs';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import { resolve } from 'path';

const credentialsPath = '/sender.json';

export class Email {
    constructor(recipient, subject, content, templateName) {
        this.recipient = recipient;
        this.subject = subject;
        this.content = content;
        this.templateName = templateName;
        this.sender = {};

        this.setCredentials();
    }

    setCredentials() {
        return new Promise((resolve, reject) => {
            fs.readFile(`${__dirname}${credentialsPath}`, (err, data) => {
                if (err) {
                    reject(err);
                }

                let sender = JSON.parse(data);
                if (!sender || !sender.user || !sender.pass) throw new Error("Missing sender info");
                this.sender = sender;
                resolve(sender);
            });
        });
    }

    async setTransporter() {
        return new Promise(async (resolve, reject) => {
            let transport;
            if (Object.keys(this.sender).length === 0) {
                let sender = await this.setCredentials();
                if (!sender) throw new Error('No credentials');
            }
            transport = nodemailer.createTransport(this.getGmailConfiguration());
            resolve(transport);
        });
    }

    getGmailConfiguration() {
        return {
            service: 'gmail',
            auth: {
                user: this.sender.user,
                pass: this.sender.pass
            },
            tls: {
                rejectUnauthorized: false
            }
        };
    }

    setEmailOptionsHTML(html) {
        return {
            from: this.sender.user,
            to: this.recipient,
            subject: this.subject,
            html: html
        };
    };

    readHTMLFile(path) {
        return new Promise(resolve => {
            fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
                if (err) throw err;
                resolve(html);
            });
        });
    };

    send() {
        return new Promise((resolve) => {
            resolve(this.readHTMLFile(__dirname + `/${this.templateName}.html`));
        }).then(async (html) => {
            let template = handlebars.compile(html);

            let htmlToSend = template(this.content);

            let mailOptions = this.setEmailOptionsHTML(htmlToSend);

            let transporter = await this.setTransporter();
            
            return([transporter, mailOptions]);
        }).then(([transporter, mailOptions]) => {
            return transporter.sendMail(mailOptions);
        });
    }
}