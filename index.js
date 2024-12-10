import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createUser({ name, lastname, email }) {
  if (!name && !email) return;

  const finalLastName = lastname || null;

  const newUser = await prisma.user.create({
    data: {
      name,
      lastname: finalLastName,
      email,
    },
  });

  console.log("NUEVO USUARIO: ", newUser);
}

//createUser({ name: "Lorena", lastname: "Ramirez", email: "lorena@gmail.com" });

async function getUsers() {
  const users = await prisma.user.findMany();

  users.map((user) => {
    console.log("ID: ", user.id);
    console.log("NOMBRE: ", user.name);
    console.log("************\n");
  });
}

// getUsers();

async function getUserByID({ userID }) {
  if (typeof userID !== "number") return;

  const user = await prisma.user.findFirst({
    where: {
      id: userID,
    },
  });

  console.log("USUARIO: ", user);
}

//getUserByID(10000);

async function getUsersByName({ name }) {
  if (typeof name !== "string") return;

  const users = await prisma.user.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
  });

  console.log(
    `USUARIOS ENCONTRADOS CON EL CONTENIDO DE: ${name}, SON: `,
    users
  );
}

//getUsersByName({ name: "an" });

async function deleteUserByID({ userID }) {
  if (typeof userID !== "number") return;

  try {
    const user = await prisma.user.delete({
      where: {
        id: userID,
      },
    });

    console.log("USUARIO ELIMINADO: ", user);
  } catch (error) {
    if (error.code === "P2025") {
      console.log("Usuario no encontrado");
      return;
    }
    console.log(error);
  }
}

// deleteUserByID({ userID: 500 });

async function updateUserLastname({ userID, lastname }) {
  if (typeof userID !== "number") return;

  if (!lastname) return;

  const user = await prisma.user.update({
    where: {
      id: userID,
    },
    data: {
      lastname,
    },
  });

  console.log("SE ACTUALIZO EL USUARIO, ", user);
}

//updateUserLastname({ userID: 2, lastname: "Mercedes Gallegos" });

async function updateOrCreateUser() {
  const user = await prisma.user.upsert({
    where: {
      email: "chris.dev.software@gmail.com",
    },
    create: {
      name: "Christopher",
      email: "Romero Avendaño",
    },
    update: {
      lastname: "Romero Avendaño",
    },
  });

  console.log("SE CREO O ACTUALIZO: ", user);
}

updateOrCreateUser();
