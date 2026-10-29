/**
 * NextAuth.js (Auth.js) Configuration for Discord OAuth2 Provider
 * Configured specifically with `identify` and `guilds` scopes
 * to retrieve the authenticated user and their administered Discord servers.
 */

export interface DiscordProfile {
  id: string;
  username: string;
  discriminator: string;
  global_name: string | null;
  avatar: string | null;
  banner?: string | null;
  accent_color?: number | null;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  premium_type?: number; // 0 = none, 1 = nitro classic, 2 = nitro, 3 = nitro basic
}

export interface DiscordOAuthGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string; // Bitfield permissions string
  features: string[];
}

// 0x8 = ADMINISTRATOR, 0x20 = MANAGE_GUILD
export const DISCORD_PERMISSIONS = {
  ADMINISTRATOR: 0x8,
  MANAGE_GUILD: 0x20,
  MANAGE_CHANNELS: 0x10,
  BAN_MEMBERS: 0x4,
  KICK_MEMBERS: 0x2,
};

export function hasAdminPermission(permissionBitfield: string | number): boolean {
  const perms = BigInt(permissionBitfield);
  const adminMask = BigInt(DISCORD_PERMISSIONS.ADMINISTRATOR);
  const manageGuildMask = BigInt(DISCORD_PERMISSIONS.MANAGE_GUILD);
  return (perms & adminMask) === adminMask || (perms & manageGuildMask) === manageGuildMask;
}

/**
 * Standard NextAuth options representation for Next.js 14/15 App Router
 * (app/api/auth/[...nextauth]/route.ts)
 */
export const NEXTAUTH_DISCORD_ROUTE_CODE = `import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { getDatabase } from "firebase-admin/database";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify guilds", // Requesting user info & server list
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (profile) {
        token.discordProfile = profile;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user = {
        ...session.user,
        id: token.sub as string,
        profile: token.discordProfile,
      };

      // Sync user profile to Firebase Realtime Database (uwu-bot-4cff1)
      try {
        const db = getDatabase();
        await db.ref(\`users/\${token.sub}\`).update({
          username: session.user.name || "DiscordUser",
          avatarUrl: session.user.image || "",
          lastLogin: new Date().toISOString(),
        });
      } catch (e) {
        console.error("Failed to sync user with Firebase Realtime DB:", e);
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
`;

export const FETCH_GUILDS_CODE = `// Example helper to fetch user's guilds in an App Router route
export async function getUserGuilds(accessToken: string) {
  const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
    headers: {
      Authorization: \`Bearer \${accessToken}\`,
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch guilds from Discord API");
  }

  const guilds = await response.json();
  // Filter for servers where the user has Administrator or Manage Guild permissions
  return guilds.filter((g: any) => {
    const perms = BigInt(g.permissions);
    return (perms & 0x8n) === 0x8n || (perms & 0x20n) === 0x20n || g.owner;
  });
}
`;
