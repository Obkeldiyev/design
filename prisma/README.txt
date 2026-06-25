Prisma schema for the Cardify starter backend.

Use this file to understand the data model and how to keep Prisma in sync with the database.

1. Setup
   - Add DATABASE_URL to your .env file.
   - Install dependencies: npm install
   - Generate Prisma Client: npx prisma generate
   - Push schema to database: npx prisma db push

2. JSON fields
   - Models like Design.data, DesignPage.elements, Template.data, QRCode.data,
     Website.seo, Website.config, WebsitePage.blocks, and Subscription.metadata use
     PostgreSQL JSON storage.
   - Store the editor state, page structure, element metadata, and AI-generated assets
     in JSON rather than as static images.

3. Typical workflow
   - Create a User.
   - Create a Business for that User.
   - Create Designs, QR codes, Websites, Templates, and Assets under the Business.
   - Use the JSON fields to save the editable canvas state and page structure.

4. Recommended schema usage
   - Prefer Prisma Client in TypeScript for CRUD operations.
   - Use plain JSON objects when writing to Json fields.
   - Keep objects small enough to update parts of the design or page instead of rewritting huge blobs.

5. Important model relationships
   - User -> Business: one-to-many
   - User -> AuthAccount: one-to-many
   - Business -> Design: one-to-many
   - Design -> DesignPage: one-to-many
   - Business -> QRCode: one-to-many
   - Business -> Website: one-to-many
   - User -> Subscription: one-to-many
   - Plan -> Subscription: one-to-many
   - Subscription -> Payment: one-to-many

6. SuperAdmin / Founder account
   - `SuperAdmin` is a hidden founder account separate from regular users.
   - It is not part of the normal registration flow.
   - Use `SuperAdmin` for the project owner / founder who controls everything.
   - This record can store its own credentials, provider, and permissions.

7. Authentication and OAuth
   - The User model now supports both password-based and OAuth-based users.
   - Use the AuthAccount model to store external provider identity details.
   - A user may have multiple auth accounts (Google, Telegram, GitHub, etc.).
   - A local password is optional when the user signs up through OAuth.
   - For Passport.js, create or link an AuthAccount record on successful login.
   - Store provider profile data in AuthAccount.profile and tokens in accessToken / refreshToken.

7. Notes
   - This schema is built for a SaaS platform with multiple businesses per user.
   - Use the JSON fields to keep the editable design model and website blocks flexible.
   - Avoid storing generated exports in the database; use JSON for the canonical editable source.
