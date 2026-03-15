import { EventEmitter } from "events";
import { generateOTP } from "../otp/otp.js";
import { sendEmail } from "../emailServices/email.services.js";
import { set } from "../../../database/redis.service.js";
import { generateHash } from "../../hash/hash.js";

export let event = new EventEmitter();

event.on("verifyEmail",async(data)=>{
    let {userId,email}=data
      const otp = generateOTP();
      set({
        key: `otp::${userId}`,
        value: await generateHash(otp),
        ttl: 5 * 60,
      });
      await sendEmail(
        email,
        "Your OTP Code",
        `Your verification code is: ${otp}`,
      );
})
