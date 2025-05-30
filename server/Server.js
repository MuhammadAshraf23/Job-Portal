const app = require("./App");

// DB Connection
const DBConnectionHandler = require("./Utils/DBconnect");
DBConnectionHandler();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Job Hunter Server is running!");
});
// 404 Error handler
app.use("*", (req, res) => {
    res.status(404).json({ message: "Not Found" });
});

// Error Handeling Middleware(default synchronous error handling middleware from express)
// Error middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: false,
        message: err.message || "Internal Server Error",
    });
});


app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
