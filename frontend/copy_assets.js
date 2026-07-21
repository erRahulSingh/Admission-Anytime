import fs from 'fs';

const srcLogo = 'C:/Users/rahul/.gemini/antigravity-ide/brain/d310c0da-27dc-488b-aa2b-a4c611512e5f/media__1783316584023.png';
const destLogo = 'c:/Users/rahul/OneDrive/Desktop/Academy/frontend/public/logo.png';

const srcDoc = 'C:/Users/rahul/.gemini/antigravity-ide/brain/d310c0da-27dc-488b-aa2b-a4c611512e5f/media__1783317308649.jpg';
const destDoc = 'c:/Users/rahul/OneDrive/Desktop/Academy/frontend/public/doctor_hero.jpg';

const srcBg = 'C:/Users/rahul/.gemini/antigravity-ide/brain/55b4a9ed-8de0-412b-a749-193df1bd1ab3/media__1784608626867.png';
const destBg = 'c:/Users/rahul/OneDrive/Desktop/Academy/frontend/public/hero_bg.png';

try {
  fs.copyFileSync(srcLogo, destLogo);
  console.log('SUCCESS: Logo copied successfully to frontend/public/logo.png');
  fs.copyFileSync(srcDoc, destDoc);
  console.log('SUCCESS: Doctor image copied successfully to frontend/public/doctor_hero.jpg');
  fs.copyFileSync(srcBg, destBg);
  console.log('SUCCESS: Campus background image copied successfully to frontend/public/hero_bg.png');
} catch (e) {
  console.error('ERROR during asset copy:', e.message);
}
