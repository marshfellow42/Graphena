var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const argon2 = require("argon2");
const bodyParser = require("body-parser");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var allRouter = require("./routes/eloquent/all");
var addRouter = require("./routes/eloquent/add");
var delRouter = require("./routes/eloquent/delete");
var updateRouter = require("./routes/eloquent/update");
var convertRouter = require("./routes/eloquent/convert");
var loginRouter = require("./routes/eloquent/login");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
app.use(
    session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: false,
    })
);

app.use("/users", usersRouter);
app.use("/all", allRouter);
app.use("/add", addRouter);
app.use("/del", delRouter);
app.use("/update", updateRouter);
app.use("/convert", convertRouter);
app.use("/login", loginRouter);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.title = "Error " + err.status;
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
