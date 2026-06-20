import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Upsert templates
  const templates = [
    {
      name: 'Elegan Gold',
      slug: 'elegan-gold',
      componentKey: 'elegan-gold',
      category: 'elegan',
      thumbnail: '/templates/elegan-gold.jpg',
      description: 'Template mewah bernuansa emas dengan tipografi elegan',
    },
    {
      name: 'Minimalis Putih',
      slug: 'minimalis-putih',
      componentKey: 'minimalis-putih',
      category: 'minimalis',
      thumbnail: '/templates/minimalis-putih.jpg',
      description: 'Template bersih dan modern dengan desain minimalis',
    },
    {
      name: 'Islami',
      slug: 'islami',
      componentKey: 'islami',
      category: 'islami',
      thumbnail: '/templates/islami.jpg',
      description: 'Template bernuansa islami dengan ornamen arabesque',
    },
    {
      name: 'Gelap Romantis',
      slug: 'gelap-romantis',
      componentKey: 'gelap-romantis',
      category: 'islami',
      thumbnail: '/templates/gelap-romantis.jpg',
      description: 'Template dark elegan dengan aksen emas, font sakral, dan navigasi bawah bergaya',
    },
    {
      name: 'Romantis Pink',
      slug: 'romantis-pink',
      componentKey: 'romantis-pink',
      category: 'romantis',
      thumbnail: '/templates/romantis-pink.jpg',
      description: 'Template pernikahan bertema pink putih dengan animasi bunga dan ornamen floral yang elegan',
    },
    {
      name: 'Javanese Heritage',
      slug: 'javanese-heritage',
      componentKey: 'javanese-heritage',
      category: 'tradisional',
      thumbnail: '/templates/javanese-heritage.jpg',
      description: 'Template mewah bernuansa batik Jawa dengan ornamen kawung, border emas, frame dekoratif, dan animasi kelopak bunga',
    },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { slug: template.slug },
      update: template,
      create: template,
    });
    console.log(`Template: ${template.name}`);
  }

  // Upsert packages by name (delete+create since no unique slug)
  const packages = [
    {
      name: 'Basic',
      price: 99000,
      durationDays: 90,
      features: {
        maxPhotos: 5,
        customDomain: false,
        musik: true,
        livestream: false,
        guestManagement: false,
      },
    },
    {
      name: 'Premium',
      price: 199000,
      durationDays: 180,
      features: {
        maxPhotos: 20,
        customDomain: false,
        musik: true,
        livestream: true,
        guestManagement: true,
      },
    },
    {
      name: 'Exclusive',
      price: 349000,
      durationDays: 365,
      features: {
        maxPhotos: 50,
        customDomain: true,
        musik: true,
        livestream: true,
        guestManagement: true,
      },
    },
  ];

  for (const pkg of packages) {
    // Delete existing then create fresh
    await prisma.package.deleteMany({ where: { name: pkg.name } });
    await prisma.package.create({ data: pkg });
    console.log(`Package: ${pkg.name}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
