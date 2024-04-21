const express = require("express");
const app = express();
const port = 8080;

// modules
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcrypt");
const multer = require("multer");
const methodOverride = require("method-override");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51OlCG7SHvJvGKgQIMc0ekAHUtFdp3JbutTcswQPQ3nAyQJUwMh2XBlZi5M6rUyOoE7ZVRvB8784xhq07v1t1zRyM002W4C8nDN"
);
const nodemailer = require("nodemailer");
const mailGen = require("mailgen");
const twilio = require("twilio");
require('dotenv').config();

// database
const { connectToDatabase } = require("./models/db");
const User = require("./models/user");
const Organiser = require("./models/organiser");
const Event = require("./models/event");
const PrivateEvent = require("./models/privateEvent");
const Blog = require("./models/blog");
try {
  connectToDatabase();
} catch (err) {
  console.error("Failed to start the application:", err);
}

// storage for uploaded images
const storage = multer.memoryStorage(); // Store image data in memory
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.static(path.join(__dirname, "/public/imgs")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cors());

app.use(
  session({
    secret: "we-love-events", //secret-key
    resave: true,
    saveUninitialized: false,
  })
);

// disable cache
app.use((req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});

// Twilio tokens
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = new twilio(accountSid, authToken);

// Authentication middlewares for User and Organiser
function isAuthenticatedandUser(req, res, next) {
  if (req.session && req.session.user) {
    if (req.session.user.typeUser === "user") {
      return next();
    } else {
      res.send("No Access");
    }
  } else {
    res.redirect("/login");
  }
}
function isAuthenticatedandOrganiser(req, res, next) {
  if (req.session && req.session.user) {
    if (req.session.user.typeUser === "organiser") {
      return next();
    } else {
      res.send("No Access");
    }
  } else {
    res.redirect("/login");
  }
}

// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

// Landing Page
app.get("/", (req, res) => {
  if (req.session && req.session.user) {
    res.redirect("/home");
  } else {
    res.render("landingpage");
  }
});

// Login
app.get("/login", (req, res) => {
  if (req.session && req.session.user) {
    res.redirect("home");
  } else {
    res.render("login");
  }
});
app.post("/login", async (req, res) => {
  if (req.session && req.session.user) {
    res.redirect("/home");
    return;
  }

  let { email, password, typeUser } = req.body;
  try {
    let data;
    if (typeUser === "user") {
      data = await User.findOne({ email: email });
    } else if (typeUser === "organiser") {
      data = await Organiser.findOne({ email: email });
    }
    if (data !== null) {
      let dbSavedPassword = data.password;
      async function checkUser(password, dbSavedPassword) {
        const match = await bcrypt.compare(password, dbSavedPassword);
        if (match) {
          if (typeUser === "user") {
            req.session.user = { data, typeUser };
            res.redirect("/home");
          } else if (typeUser === "organiser") {
            req.session.user = { data, typeUser };
            res.redirect("/dashboard");
          }
        } else {
          res.send("Password entered is wrong");
        }
      }
      checkUser(password, dbSavedPassword);
    } else {
      res.send("Email entered is wrong");
    }
  } catch (err) {
    console.log(err);
  }
});

// Signup
app.get("/signup", (req, res) => {
  if (req.session && req.session.user) {
    res.redirect("/home");
  } else {
    res.render("signup");
  }
});
app.post("/signup", async (req, res) => {
  if (req.session && req.session.user) {
    res.redirect("/home");
    return;
  }

  let {
    fullname,
    email,
    mobilenumber,
    city,
    state,
    pincode,
    date,
    month,
    year,
    interests,
    password,
    cpassword,
  } = req.body;
  let hash = "";

  // Check if user already exists
  const data = await User.findOne({ email: email });
  if (data === null) {
    if (password === cpassword) {
      let saltRounds = 10;
      hash = bcrypt.hashSync(password, saltRounds);

      let userData = new User({
        fullname: fullname,
        email: email,
        mobilenumber: mobilenumber,
        location: {
          city: city,
          state: state,
          pincode: pincode,
        },
        birthdate: {
          date: date,
          month: month,
          year: year,
        },
        interest: interests,
        password: hash,
      });

      userData.save();
      let typeUser = "user";
      req.session.user = { data, typeUser };
      res.redirect("/home");
    } else {
      res.send("Password does not match. Try Again!");
    }
  } else {
    res.send("Entered email already exists");
  }
});

// Organiser Signup
app.get("/organiserSignup", (req, res) => {
  res.render("organiserSignup");
});
app.post("/organiserSignup", async (req, res) => {
  // Check if the user is already authenticated
  if (req.session && req.session.user) {
    res.redirect("/dashboard");
    return;
  }
  let {
    fullname,
    email,
    mobilenumber,
    city,
    date,
    month,
    year,
    buisnessname,
    buisnessdesc,
    password,
    cpassword,
  } = req.body;

  // Check if user already exists
  const organiserData = await Organiser.findOne({ email: email });
  if (organiserData === null) {
    if (password === cpassword) {
      let saltRounds = 10;
      hash = bcrypt.hashSync(password, saltRounds);

      let data = new Organiser({
        fullname: fullname,
        email: email,
        mobilenumber: mobilenumber,
        city: city,
        birthdate: { date: date, month: month, year: year },
        buisnessname: buisnessname,
        buisnessdetails: buisnessdesc,
        password: hash,
      });

      data.save();

      let typeUser = "organiser";
      req.session.user = { data, typeUser };
      res.redirect("/dashboard");
    } else {
      res.send("Password does not match. Try Again!");
    }
  } else {
    res.send("Entered email already exists");
  }
});

// Send Message (Email)
app.post("/send-msg", (req, res) => {
  const { name, email, message } = req.body;

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "eventhubplatform@gmail.com",
      pass: "mxoi bmnn jrfs gpww",
    },
  });

  let mailOptions = {
    from: `"${name}" <${email}>`,
    to: "eventhubplatform@gmail.com",
    subject: "New Message from Your Website",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // Plain text body
    html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`, // HTML body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error occurred:", error.message);
      res.status(500).send("Error occurred while sending the email.");
    } else {
      res.redirect("/");
    }
  });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.redirect("login");
    }
  });
});

// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

// Home
app.get("/home", isAuthenticatedandUser, async (req, res) => {
  const eventData = await Event.find({});

  res.render("home", { eventData });
});

// User Details
app.get("/userProfile", isAuthenticatedandUser, async (req, res) => {
  const userId = req.session.user.data._id;
  const userData = await User.findOne({ _id: userId });
  const validCategories = [
    "sports",
    "technology",
    "arts",
    "music",
    "education",
    "history",
  ];
  res.render("userProfile", { userData, validCategories });
});

// Update User Details
app.patch(
  "/userProfile/updateUserData",
  isAuthenticatedandUser,
  async (req, res) => {
    let {
      fullname,
      email,
      mobilenumber,
      city,
      state,
      pincode,
      date,
      month,
      year,
      interest,
    } = req.body;
    const userId = req.session.user.data._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullname,
        email,
        mobilenumber,
        city,
        state,
        pincode,
        birthdate: {
          date,
          month,
          year,
        },
        interest,
      },
      { new: true }
    );
    const validCategories = [
      "sports",
      "technology",
      "arts",
      "music",
      "education",
      "history",
    ];
    res.render("userProfile", { userData: updatedUser, validCategories });
  }
);

// All Events
app.get("/events", isAuthenticatedandUser, async (req, res) => {
  let eventData = await Event.find({});
  const title = "All events";
  res.render("eventList", { eventData, title });
});

// Event category
app.get("/events/:category", isAuthenticatedandUser, async (req, res) => {
  const validCategories = [
    "sports",
    "technology",
    "arts",
    "music",
    "education",
    "history",
  ];
  const { category } = req.params;
  let title = category.charAt(0).toUpperCase() + category.slice(1);
  if (validCategories.includes(category)) {
    let eventContainer = [];
    let eventData = await Event.find({ category: category });
    eventData.forEach((element) => {
      if (element.category.includes(category)) {
        eventContainer.push(element);
      }
    });
    eventData = eventContainer;
    res.render("eventList", { eventData, title });
  } else {
    res.status(404).send("No such category exists.");
  }
});

// Show Event Details to User
app.get("/events/:category/:id", isAuthenticatedandUser, async (req, res) => {
  let { category, id } = req.params;
  const eventData = await Event.findById(id);
  res.render("showEvent.ejs", { eventData });
});

// Payment Gateway
const YOUR_DOMAIN = "http://localhost:8080";
app.get("/stripe-redirect/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  res.redirect(`https://checkout.stripe.com/c/${sessionId}`);
});
app.post(
  "/events/:eventName/:price/:id/create-checkout-session",
  async (req, res) => {
    let { eventName, price, id } = req.params;
    const email = req.session.user.data.email;
    const session = await stripe.checkout.sessions.create({
      submit_type: "pay",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["CA", "IN", "US"],
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            product_data: {
              name: eventName || "default",
            },
            unit_amount: Math.round(price * 100 * 0.012),
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
        },
      ],
      customer_email: email,
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/${id}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });

    res.redirect(303, session.url);
  }
);

// Payment Successful - Email Configuration
app.get("/:id/success", isAuthenticatedandUser, async (req, res) => {
  let { id } = req.params;
  const eventData = await Event.findOne({ _id: id });
  if (!eventData) {
    return res.status(404).send("Event not found");
  }
  let eventDataHost = eventData.hostedby;
  const organiserData = await Organiser.findOne({
    buisnessname: eventDataHost,
  });
  if (!organiserData) {
    return res.status(404).send("Organiser not found");
  }
  let userData = req.session.user.data;
  if (!userData) {
    return res.status(401).send("User not authenticated");
  }

  let config = {
    service: "gmail",
    auth: {
      user: "eventhubplatform@gmail.com",
      pass: "mxoi bmnn jrfs gpww",
    },
  };

  let transporter = nodemailer.createTransport(config);

  let mailGenerator = new mailGen({
    theme: "default",
    product: {
      name: "Eventhub",
      link: "https://localhost:8080/",
    },
  });

  let response = {
    body: {
      name: userData.fullname,
      intro: [
        "Event Registration Confirmation",
        `Ticket ID:  ${eventData.name}-${eventData.tickets}`,
      ],
      table: {
        data: [
          {
            event: `${eventData.name}`,
            host: organiserData.buisnessname,
            description: "Successfully Registered",
            price: `${eventData.ticketPrice} ₹`,
          },
        ],
      },
      outro: `Get Ready for ${eventData.name} event`,
    },
  };

  let mail = mailGenerator.generate(response);

  let message = {
    from: "eventhubplatform@gmail.com",
    to: userData.email,
    subject: "Event Registration Confirmation",
    html: mail,
  };

  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      databaseTicketsChange();
    }
  });

  const databaseTicketsChange = async () => {
    if (eventData.tickets <= 0) {
      return res.status(400).send("No more tickets available");
    }

    await Event.findByIdAndUpdate(eventData._id, { $inc: { tickets: -1 } });
  };

  res.redirect("/home");
});
// Payment Unsuccessful
app.get("/paymentUnsuccessful", isAuthenticatedandUser, (req, res) => {
  res.render("paymentUnsuccessful");
});

// Privacy Policy
app.get("/privacy-policy", (req, res) => {
  res.render("privacypolicy.ejs");
});

// --------------------------------------------------------------
// --------------------------------------------------------------
// --------------------------------------------------------------

// Organiser Dashboard
app.get("/dashboard", isAuthenticatedandOrganiser, async (req, res) => {
  const data = req.session.user.data;
  const events = await Event.find({ hostedby: data.buisnessname });
  const privateEvents = await PrivateEvent.find({
    hostedby: data.buisnessname,
  });
  res.render("dashboard.ejs", { events, privateEvents });
});

// Create Events
app.get("/newEvent", isAuthenticatedandOrganiser, (req, res) => {
  res.render("newEvent");
});
app.post(
  "/newEvent",
  isAuthenticatedandOrganiser,
  upload.single("uploadedIImage"),
  (req, res) => {
    let {
      ename,
      edesc,
      address,
      landmark,
      city,
      state,
      pincode,
      category,
      from,
      to,
      time,
      ticketcount,
      ticketprice,
    } = req.body;
    let data = req.session.user.data;
    let eventData = new Event({
      name: ename,
      desc: edesc,
      img: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
      location: {
        area: address,
        landmark: landmark,
        city: city,
        state: state,
        pincode: pincode,
      },
      hostedby: data.buisnessname,
      category: category,
      from: new Date(from),
      to: new Date(to),
      time: time,
      tickets: ticketcount,
      ticketPrice: ticketprice,
    });

    eventData.save();
    res.redirect("dashboard");
  }
);

// Create Private Events
app.get("/newPrivateEvent", isAuthenticatedandOrganiser, (req, res) => {
  res.render("newPrivateEvent");
});
app.post("/newPrivateEvent", isAuthenticatedandOrganiser, (req, res) => {
  const eventData = {
    name: req.body.ename,
    desc: req.body.edesc,
    location: {
      area: req.body.address,
      landmark: req.body.landmark,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
    },
    hostedby: req.session.user.data.buisnessname,
    from: new Date(req.body.from),
    to: new Date(req.body.to),
    time: req.body.time,
    mobileNumbers: req.body.mobileNumbers
      .filter((number) => number !== "")
      .map((number) => `+91${number}`), // Format numbers with country code
  };

  console.log(eventData);
  const newPrivateEvent = new PrivateEvent(eventData);

  newPrivateEvent
    .save()
    .then(() => {
      res.render("dashboard");
    })
    .catch((error) => {
      console.error("Error saving event:", error);
      // Handle error
      res.status(500).send("Error saving event");
    });
});

// Show Private Events to Organiser
app.get(
  "/dashboard/privateEvents/:id",
  isAuthenticatedandOrganiser,
  async (req, res) => {
    let { id } = req.params;
    const eventData = await PrivateEvent.findById(id);
    res.render("showPrivateEventToOrganiser.ejs", { eventData });
  }
);

// Send text message
app.post("/send-text-msg", isAuthenticatedandOrganiser, async (req, res) => {
  try {
    let { textMsg } = req.body;
    let hostedby = req.session.user.data.buisnessname;

    const eventData = await PrivateEvent.findOne({ hostedby });

    let messageBody = `${textMsg}\n\n`;
    messageBody += `Location: ${eventData.location.area}, ${eventData.location.landmark}, ${eventData.location.city}, ${eventData.location.state}, ${eventData.location.pincode}\n`;
    messageBody += `Time: ${eventData.from.toLocaleString()} to ${eventData.to.toLocaleString()}\n`;
    messageBody += `Hosted by: ${eventData.hostedby}\n`;

    for (let mobileNumber of eventData.mobileNumbers) {
      await client.messages.create({
        body: messageBody,
        from: "+12057721129",
        to: mobileNumber,
      });
    }

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error sending text message:", error);
    res.status(500).send("Error sending text message");
  }
});

// Show Event Details to Organiser
app.get(
  "/dashboard/events/:id",
  isAuthenticatedandOrganiser,
  async (req, res) => {
    let { id } = req.params;
    const eventData = await Event.findById(id);
    res.render("showEventToOrganiser.ejs", { eventData });
  }
);

// Create Blog
app.get("dashboard/createBlog", isAuthenticatedandOrganiser, (req, res)=>{

})

// Edit Event Details
app.get(
  "/dashboard/:id/edit",
  isAuthenticatedandOrganiser,
  async (req, res) => {
    let { id } = req.params;
    const eventData = await Event.findById(id);
    res.render("editEvent.ejs", { eventData });
  }
);
app.patch(
  "/dashboard/:id/edit",
  isAuthenticatedandOrganiser,
  upload.single("uploadedImage"),
  async (req, res) => {
    let { id } = req.params;
    const eventData = await Event.findById(id);
    if (req.file) {
      eventData.img.data = req.file.buffer;
      eventData.img.contentType = req.file.mimetype;
    }

    eventData.name = req.body.ename;
    eventData.desc = req.body.edesc;
    eventData.location.area = req.body.address;
    eventData.location.landmark = req.body.landmark;
    eventData.location.city = req.body.city;
    eventData.location.state = req.body.state;
    eventData.location.pincode = req.body.pincode;
    eventData.category = req.body.category;
    eventData.from = req.body.from;
    eventData.to = req.body.to;
    eventData.time = req.body.time;
    eventData.tickets = req.body.ticketcount;
    eventData.ticketPrice = req.body.ticketprice;

    await eventData.save();
    res.redirect("/dashboard");
  }
);

// Delete Event
app.delete(
  "/delete-event/:id",
  isAuthenticatedandOrganiser,
  async (req, res) => {
    try {
      const { id } = req.params;
      await Event.findByIdAndDelete(id);
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Error deleting private event:", error);
      res.status(500).send("Error deleting private event");
    }
  }
);

// Delete Private Event
app.delete(
  "/delete-private-event/:id",
  isAuthenticatedandOrganiser,
  async (req, res) => {
    try {
      const { id } = req.params;
      await PrivateEvent.findByIdAndDelete(id);
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Error deleting private event:", error);
      res.status(500).send("Error deleting private event");
    }
  }
);

// Organiser User Details
app.get("/organiserProfile", isAuthenticatedandOrganiser, async (req, res) => {
  const organiserId = req.session.user.data._id;
  const organiserData = await Organiser.findOne({ _id: organiserId });
  res.render("organiserProfile", { organiserData });
});

// Update Organiser Details
app.patch(
  "/organiserProfile/updateOrganiserData",
  isAuthenticatedandOrganiser,
  async (req, res) => {
    let {
      fullname,
      email,
      mobilenumber,
      city,
      date,
      month,
      year,
      buisnessname,
      buisnessdetails,
    } = req.body;
    const userId = req.session.user.data._id;

    const updatedOrganiser = await Organiser.findByIdAndUpdate(
      userId,
      {
        fullname,
        email,
        mobilenumber,
        city,
        birthdate: {
          date,
          month,
          year,
        },
        buisnessname,
        buisnessdetails,
      },
      { new: true }
    );
    res.render("organiserProfile", {
      organiserData: updatedOrganiser,
    });
  }
);

app.listen(port, () => {
  console.log(`Server is listening on port, ${port}`);
  console.log(`http://localhost:${port}/`);
});
