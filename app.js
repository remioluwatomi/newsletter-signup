const express = require("express");
const mailChimp = require("@mailchimp/mailchimp_marketing");

// Environment variables validation
const requiredEnvVars = [
  "MAIL_CHIMP_KEY",
  "MAIL_CHIMP_ID",
  "MAIL_CHIMP_SERVER",
];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const app = express();

app.use(express.json());
app.use(express.static("public"));

// Configure MailChimp
mailChimp.setConfig({
  apiKey: process.env.MAIL_CHIMP_KEY,
  server: process.env.MAIL_CHIMP_SERVER,
});

const validateSignupInput = (req, res, next) => {
  const { email, fname, lname } = req.body;

  if (!email || !fname || !lname) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: email, fname, and lname are required",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  next();
};

app.get("/signup", (_, res) => {
  res.json({
    success: true,
    message: "Signup endpoint ready to receive POST requests",
  });
});

app.post("/signup", validateSignupInput, async (req, res) => {
  const { email, fname, lname } = req.body;

  try {
    const response = await mailChimp.lists.batchListMembers(
      process.env.MAIL_CHIMP_ID,
      {
        members: [
          {
            email_address: email,
            status: "subscribed",
            merge_fields: {
              FNAME: fname,
              LNAME: lname,
            },
          },
        ],
      }
    );

    if (response.error_count > 0) {
      const error = response.errors[0];
      return res.status(400).json({
        success: false,
        message: error.error,
        code: error.error_code,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully subscribed to the newsletter",
      data: {
        email,
        firstName: fname,
        lastName: lname,
      },
    });
  } catch (error) {
    console.error("MailChimp Error:", error);

    if (error.response && error.response.body) {
      return res.status(error.response.status || 400).json({
        success: false,
        message: error.response.body.detail || "MailChimp request failed",
        code: error.response.body.status,
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while processing your request",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
});

app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
    code: "INTERNAL_SERVER_ERROR",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
