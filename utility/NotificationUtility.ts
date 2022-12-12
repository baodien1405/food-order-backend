// email

// notification

// OTP
export const GenerateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000)
  let expiry = new Date()
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000)

  return { otp, expiry }
}

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  const accountSid = 'ACf563ae527ac580d561bdc5f7fae97012'
  const authToken = '7667129b6a961837e59dfc53771319ab'
  const client = require('twilio')(accountSid, authToken)

  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: '+18658004211',
    to: `+84${toPhoneNumber}`
  })
  return response
}

// Payment notification or emails
