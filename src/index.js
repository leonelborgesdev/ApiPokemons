import app from "./app.js";
import { sequelize } from "./database/database.js";

async function main() {
  try {
    const PORT = process.env.PORT || 3000;
    await sequelize.sync({ force: true });
    console.log("conexion exitosa");
    app.listen(PORT);
    console.log("Server is listening on port ", PORT);
  } catch (error) {
    console.log("error en la conexion", error);
  }
}

main();
