## GTM Day Site

Three-page Next.js experience inspired by the GTM Day Toronto card aesthetic.

- **Randomizer**: `/random` draws a number from 1–12 in glowing black-and-yellow balls.
- **Timer**: `/timer` runs a large focus timer (default 40 minutes) with start / pause / reset.
- **Social Feed**: `/feed` embeds an external site and slowly scrolls it for ambient viewing.

### Running locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

### Railway deployment

Use these commands in your Railway service configuration:

- **Build command**: `npm run build`
- **Start command**: `npm start`

The app binds to port `3000` by default; Railway will provide the `PORT` environment variable automatically.

To point the social feed page at your own source, set:

```bash
NEXT_PUBLIC_FEED_URL="https://your-feed-url.example.com"
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
