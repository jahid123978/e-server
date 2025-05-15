const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const redis = require("../utills/redisClient");

async function getProductBySlug(request, response) {
  const { slugs } = request.params;
  console.log("slugs", slugs);
  try {
    // 1. Check if product is in Redis

    const cachedProduct = await redis.get(`product:${slugs}`);
    console.log("hfghgh",cachedProduct);
    if (cachedProduct !== null) {
      return response.status(200).json(JSON.parse(cachedProduct));
    }

    // 2. Fetch from DB if not in cache
    const product = await prisma.product.findMany({
      where: {
        slug: slugs,
      },
      include: {
        category: true,
      },
    });
  console.log("vbnbnb: ",product);
    if (!product) {
      return response.status(404).json({ error: "Product not found" });
    }

    // 3. Store result in Redis (optional expiry: e.g. 3600 sec = 1 hour)
    await redis.set(`product:${slugs}`, JSON.stringify(product), {
      EX: 3600, // expire in 1 hour
    });

    return response.status(200).json(product);
  } catch (err) {
    console.error("Error in getProductBySlug:", err);
    return response.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getProductBySlug };
