const express = require("express");

const app = express();
const cors = require("cors");
const mercadopago = require("mercadopago");

const accessToken = process.env.TOKEN

// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
  access_token:
    accessToken,
});

app.use(express.json());

app.use(cors());
app.get("/", function (req, res) {
  res.status(200).send("Servidor Funcionando");
});


app.post("/create_preference", (req, res) => {
  let preference = {
    items: [
      {
        title: req.body.description,
        unit_price: Number(req.body.price),
        quantity: Number(req.body.quantity),
      },
    ],
    back_urls: {
      success: "https://conduzcamosalrefugio.org/",
      failure: "https://conduzcamosalrefugio.org/",
      pending: "",
    },
    auto_return: "approved",
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.json({
        preferenceId: response.body.id,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`The server is now running on Port ${PORT} `);
});

