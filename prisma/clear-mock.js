const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up Vesti database mock data...");
  
  // 1. Delete dependent transactional records
  const trg = await prisma.trackingEvent.deleteMany({});
  console.log(`Deleted ${trg.count} tracking events.`);
  
  const ord = await prisma.order.deleteMany({});
  console.log(`Deleted ${ord.count} orders.`);
  
  const msg = await prisma.message.deleteMany({});
  console.log(`Deleted ${msg.count} messages.`);
  
  const cp = await prisma.conversationParticipant.deleteMany({});
  console.log(`Deleted ${cp.count} conversation participants.`);
  
  const conv = await prisma.conversation.deleteMany({});
  console.log(`Deleted ${conv.count} conversations.`);
  
  const fav = await prisma.favorite.deleteMany({});
  console.log(`Deleted ${fav.count} favorites.`);
  
  const pr = await prisma.promoRedemption.deleteMany({});
  console.log(`Deleted ${pr.count} promo redemptions.`);

  // 2. Delete main entity records
  const wdb = await prisma.wardrobeItem.deleteMany({});
  console.log(`Deleted ${wdb.count} wardrobe items.`);
  
  const lst = await prisma.listing.deleteMany({});
  console.log(`Deleted ${lst.count} marketplace listings.`);
  
  const sp = await prisma.styleProfile.deleteMany({});
  console.log(`Deleted ${sp.count} style profiles.`);
  
  const sc = await prisma.savedCard.deleteMany({});
  console.log(`Deleted ${sc.count} saved cards.`);
  
  // 3. Delete ONLY pre-seeded mock users, keeping your newly registered account intact
  const mockEmails = ["test@vesti.com", "elif@vesti.com", "selin@vesti.com", "kaan@vesti.com", "admin@vesti.com"];
  const usr = await prisma.user.deleteMany({
    where: {
      email: {
        in: mockEmails
      }
    }
  });
  console.log(`Deleted ${usr.count} pre-seeded mock user accounts.`);

  console.log("🚀 Vesti cloud database is now 100% clean and ready for real testing!");
}

main()
  .catch((e) => {
    console.error("Clean up failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
