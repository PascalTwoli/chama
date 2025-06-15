"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const serverless_1 = require("@neondatabase/serverless");
// Import routes
const saving_group_routes_1 = __importDefault(require("./routes/saving-group.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
// Initialize dotenv to load environment variables
dotenv_1.default.config();
// Setup database connection
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
}
const sql = (0, serverless_1.neon)(process.env.DATABASE_URL);
// Initialize Express app
const app = (0, express_1.default)();
// Use routes
app.use('/api/v1/saving-groups', saving_group_routes_1.default);
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/users', users_routes_1.default);
app.get('/', (req, res) => {
    res.send('Chama API is running successfully :)');
});
// Database version endpoint
app.get('/db-version', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield sql `SELECT version()`;
        const { version } = result[0];
        res.status(200).send(version);
    }
    catch (error) {
        console.error('Database query error:', error);
        res.status(500).send('Error connecting to database');
    }
}));
// Set port and start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running successfully on port ${PORT}`);
});
exports.default = app;
