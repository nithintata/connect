module.exports = {
    'secretKey': process.env.JWT_SEC,
    'mongoUrl': process.env.MONGO_URI,
    'nodemailer_api': process.env.SENDGRID_API,
    'domain': process.env.MAIL_DOMAIN,
    'publicVapidKey': process.env.PUBLIC_VAPID_KEY,
    'privateVapidKey': process.env.PRIVATE_VAPID_KEY
}
