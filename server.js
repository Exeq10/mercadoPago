const express = require("express");

const app = express();
const cors = require("cors");
const mercadopago = require("mercadopago");

const accessToken = process.env.TOKEN;
const client_id = process.env.CLIENTID
const client_secret = process.env.CLIENTSECRET

// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
  client_id : client_id,
  client_secret: client_secret,
  access_token: accessToken,
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
    payment_methods: {
      excluded_payment_methods: [
        // Excluye métodos de pago en efectivo (Ejemplo: Pago Fácil, Rapipago, etc.)
        {
          id: "cash",
        },
      ],
      installments: 12, // Configura el número máximo de cuotas
    },
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
