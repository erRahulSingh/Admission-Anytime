import type { NextConfig } from "next";
import fs from "fs";

// Copy FAQ illustration dynamically from brain folder
const srcFaq = "C:/Users/rahul/.gemini/antigravity-ide/brain/271acb05-0195-4d7f-8f4e-0166a67d03bb/faq_illustration_1783414783021.png";
const destFaq = "c:/Users/rahul/OneDrive/Desktop/Academy/frontend/public/faq_illustration.png";
try {
  if (fs.existsSync(srcFaq)) {
    fs.copyFileSync(srcFaq, destFaq);
    console.log("SUCCESS: Copied faq_illustration to public folder");
  }
} catch (err: any) {
  console.error("FAIL: Copying faq_illustration", err.message);
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
