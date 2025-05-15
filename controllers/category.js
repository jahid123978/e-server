const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


async function getCategory(request, response) {
  const { id } = request.params;
  const category = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });
  if (!category) {
    return response.status(404).json({ error: "Category not found" });
  }
  return response.status(200).json(category);
}

async function getAllCategories(request, response) {
  try {
    const categories = await prisma.category.findMany({});
    return response.json(categories);
  } catch (error) {
    return response.status(500).json({ error: "Error fetching categories" });
  }
}

module.exports = {
  getCategory,
  getAllCategories,
};
