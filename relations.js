import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createUserAndPost({ name, email }, { title, content }) {
  if (!name && !email && !title) return;

  const user = await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  console.log("NUEVO USUARIO: ", user);
  console.log("************\n");

  const finalContent = content || null;

  const post = await prisma.post.create({
    data: {
      title,
      content: finalContent,
      author: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  console.log("NUEVA PUBLICACION: ", post);
  console.log("************\n");
}

// createUserAndPost(
//   { name: "Admin", email: "admin@gmail.com" },
//   { title: "Mi primera publicacion", content: "Contenido de la publicacion" }
// );

async function createUserWithPost({ name, email }, { title, content }) {
  if (!name && !email && !title) return;

  const finalContent = content || null;
  const user = await prisma.user.create({
    data: {
      name,
      email,
      posts: {
        create: {
          title,
          content: finalContent,
        },
      },
    },
  });

  console.log("NUEVO USUARIO Y PUBLICACION: ", user);
}

// createUserWithPost(
//   { name: "Admin2", email: "admin2@gmail.com" },
//   { title: "Mi primera publicacion2", content: "Contenido de la publicacion2" }
// );

async function getPosts() {
  const posts = await prisma.post.findMany();
  console.log("PUBLICACIONES: ", posts);
}

// getPosts();

async function getUsersPosts() {
  const users = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
  console.log("USUARIOS: ", users);
}

getUsersPosts();
