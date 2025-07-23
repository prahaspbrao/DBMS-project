import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { randomInt } from 'crypto';
import prisma from '../../../../lib/db';

// Temporary in-memory OTP store (replace with DB/Redis for production)
const otpStore = new Map<string, string>();

export async function POST(req: Request) {
  try {
    const { itemId } = await req.json();

    if (!itemId) {
      return NextResponse.json({ success: false, message: 'Item ID is required.' }, { status: 400 });
    }

    const item = await prisma.item.findUnique({
      where: { id: Number(itemId) },
      select: {
        user: {
          select: {
            email: true,
            usn: true,
          },
        },
      },
    });

    if (!item || !item.user || !item.user.email) {
      return NextResponse.json({ success: false, message: 'Item or user email not found.' }, { status: 404 });
    }

    const email = item.user.email;
    const userName = item.user.usn || 'User';

    const otp = randomInt(100000, 999999).toString();
    otpStore.set(email, otp);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Lost & Found System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'OTP Verification for Item Return',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2>OTP Verification</h2>
          <p>Hello ${userName},</p>
          <p>You have requested to verify the return of an item reported on the Lost & Found platform.</p>
          <p><strong>Your OTP is: <span style="color: #2e86de;">${otp}</span></strong></p>
          <p>Please enter this code to confirm the return. This OTP is valid for a short period only.</p>
          <br />
          <p>Thank you,<br />Lost & Found Management Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'OTP sent to the registered email.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ success: false, message: 'Failed to send OTP.' }, { status: 500 });
  }
}

export { otpStore };
