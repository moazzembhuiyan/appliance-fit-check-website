import { ApiError } from "../client";
import { readDb, writeDb, delay, uid, MOCK_OTP } from "./db";

const publicUser = ({ password: _p, ...u }) => u;
const fail = (message, extra) => {
  throw new ApiError(message, extra);
};

export const mockAuthApi = {
  async register({ name, email, password }) {
    await delay();
    const db = readDb();
    if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
      fail("An account with this email already exists.", { status: 409, fieldErrors: { email: "Email already in use" } });
    db.users.push({ id: uid(), name, email, password, phone: "", emailVerified: false, createdAt: new Date().toISOString() });
    writeDb(db);
    return { email };
  },
  async login({ email, password }) {
    await delay();
    const db = readDb();
    const u = db.users.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!u || u.password !== password) fail("Incorrect email or password.", { status: 401 });
    if (!u.emailVerified) return { requiresVerification: true, email };
    db.session = u.id;
    writeDb(db);
    return { user: publicUser(u) };
  },
  async logout() {
    await delay(250);
    const db = readDb();
    db.session = null;
    writeDb(db);
    return {};
  },
  async verifyOtp({ email, code }) {
    await delay();
    if (code !== MOCK_OTP) fail("That code is incorrect or has expired.", { status: 400 });
    const db = readDb();
    const u = db.users.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!u) fail("Account not found.", { status: 404 });
    u.emailVerified = true;
    db.session = u.id;
    writeDb(db);
    return { user: publicUser(u) };
  },
  async resendOtp() {
    await delay(500);
    return { cooldownSeconds: 30 };
  },
  async forgotPassword() {
    await delay();
    return {};
  },
  async verifyResetOtp({ email, code }) {
    await delay();
    if (code !== MOCK_OTP) fail("That code is incorrect or has expired.", { status: 400 });
    const db = readDb();
    const token = uid();
    db.resetTokens[email.toLowerCase()] = token;
    writeDb(db);
    return { resetToken: token };
  },
  async resetPassword({ email, resetToken, password }) {
    await delay();
    const db = readDb();
    if (db.resetTokens[email.toLowerCase()] !== resetToken) fail("Reset link expired. Start again.", { status: 400 });
    const u = db.users.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (u) u.password = password;
    delete db.resetTokens[email.toLowerCase()];
    writeDb(db);
    return {};
  },
  async getSession() {
    await delay(250);
    const db = readDb();
    const u = db.users.find((x) => x.id === db.session);
    if (!u) fail("Not signed in", { status: 401 });
    return { user: publicUser(u) };
  },
};

export const mockUserApi = {
  async getProfile() {
    return mockAuthApi.getSession();
  },
  async updateProfile({ name, email, phone }) {
    await delay();
    const db = readDb();
    const u = db.users.find((x) => x.id === db.session);
    if (!u) fail("Not signed in", { status: 401 });
    Object.assign(u, { name, email, phone: phone || "" });
    writeDb(db);
    return { user: publicUser(u) };
  },
  async changePassword({ currentPassword, password }) {
    await delay();
    const db = readDb();
    const u = db.users.find((x) => x.id === db.session);
    if (!u) fail("Not signed in", { status: 401 });
    if (u.password !== currentPassword)
      fail("Current password is incorrect.", { status: 400, fieldErrors: { currentPassword: "Incorrect password" } });
    u.password = password;
    writeDb(db);
    return {};
  },
};

export const mockFitChecksApi = {
  async list() {
    await delay(350);
    const db = readDb();
    return { items: (db.checks[db.session] || []).slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)) };
  },
  async save(payload) {
    await delay(400);
    const db = readDb();
    if (!db.session) fail("Not signed in", { status: 401 });
    const item = { id: uid(), createdAt: new Date().toISOString(), ...payload };
    db.checks[db.session] = [...(db.checks[db.session] || []), item];
    writeDb(db);
    return { item };
  },
  async remove(id) {
    await delay(300);
    const db = readDb();
    db.checks[db.session] = (db.checks[db.session] || []).filter((c) => c.id !== id);
    writeDb(db);
    return {};
  },
};

export const mockContactApi = {
  async send() {
    await delay(700);
    return {};
  },
};
