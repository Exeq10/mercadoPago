const express = require("express");

const app = express();
const cors = require("cors");
const mercadopago = require("mercadopago");

const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
  access_token:
    " APP_USR-4677297199473245-091918-c42c5b30fea1421d98d2dc5172d80a29-1484391879",
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
      success: "http://localhost:5173/",
      failure: "http://localhost:5173/",
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

