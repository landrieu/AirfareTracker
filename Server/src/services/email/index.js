import fs from 'fs';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';

const credentialsPath = '/sender.json';

/**
 * Email object, used to send notification when an account or tracker is created, and for alerts
 */
export class Email {
    /**
     * Set email params
     * @param {String} recipient 
     * @param {String} subject 
     * @param {Object} content 
     * @param {String} templateName 
     */
    constructor(recipient, subject, content, templateName) {
        this.recipient = recipient;
        this.subject = subject;
        this.content = content;
        this.templateName = templateName;
        this.sender = {};

        this.setCredentials();
    }

    /**
     * Set sender creadentials
     */
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

    /**
     * Set up the transporter
     */
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

    /**
     * Set GMail configuration
     */
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

    /**
     * Set email params
     * @param {Object} html 
     */
    setEmailOptionsHTML(html) {
        return {
            from: this.sender.user,
            to: this.recipient,
            subject: this.subject,
            html: html
        };
    };

    /**
     * Open an HTML file
     * @param {*} path 
     */
    readHTMLFile(path) {
        return new Promise(resolve => {
            fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
                if (err) throw err;
                resolve(html);
            });
        });
    };

    /**
     * Send an HTML email
     */
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