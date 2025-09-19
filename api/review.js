import nodemailer from 'nodemailer';

export async function POST({ request }) {
    const data = await request.formData();
    const name = data.get('name');
    const email = data.get('email');
    const review = data.get('review');

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'officialwebsitesupto@gmail.com',
            pass: 'boka112233boka'
        }
    });

    await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: 'officialwebsitesupto@gmail.com',
        subject: 'New Website Review',
        text: review
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}
