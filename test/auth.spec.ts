import { describe, it, expect, beforeAll, afterEach, mock } from "bun:test";
import {
  loginHandler,
  registerHandler,
  logoutHandler,
} from "../path/to/auth/routes";
import { UsersService } from "../path/to/services/users";
import HttpStatusCode from "../path/to/common/statusCodes";

// Mock Bun's password and jwt functionality
const mockJwt = { sign: mock(() => "mocked.jwt.token") };
const mockPasswordVerify = mock((password, hash) => password === "password123");

// Mock UsersService functions
mock(UsersService, {
  getUserByEmail: async (email) => {
    if (email === "test@example.com") {
      return { id: 1, email: "test@example.com", password: "hashedpassword" };
    }
    return null;
  },
  isUserAvailable: async (email) => email !== "test@example.com",
  createUser: async (user) => ({ id: 2, ...user }),
});

// Create a function to generate mock requests
const createMockRequest = (overrides = {}) => ({
  body: {},
  jwt: mockJwt,
  cookie: {
    auth: { set: mock(), remove: mock() },
    expiryCookie: { set: mock(), remove: mock() },
  },
  set: { status: mock() },
  error: mock(),
  hx: { redirect: mock() },
  ...overrides,
});

describe("Authentication Routes", () => {
  afterEach(() => {
    // Reset all mocks after each test to ensure clean state
    mock.resetAll();
  });

  describe("/login", () => {
    it("successfully logs in a user", async () => {
      const request = createMockRequest({
        body: { email: "test@example.com", password: "password123" },
      });

      await loginHandler(request);

      expect(request.set.status).toHaveBeenCalledWith(HttpStatusCode.OK_200);
      expect(request.cookie.auth.set).toHaveBeenCalled();
      expect(request.jwt.sign).toHaveBeenCalled();
      expect(request.hx.redirect).toHaveBeenCalledWith("/admin");
    });

    it("handles incorrect login credentials", async () => {
      const request = createMockRequest({
        body: { email: "wrong@example.com", password: "wrongpassword" },
      });

      await loginHandler(request);

      expect(request.error).toHaveBeenCalledWith(
        HttpStatusCode.UNPROCESSABLE_ENTITY_422,
        expect.anything(),
      );
    });
  });

  describe("/register", () => {
    it("successfully registers a new user", async () => {
      const request = createMockRequest({
        body: { email: "newuser@example.com", password: "newpassword123" },
      });

      await registerHandler(request);

      expect(request.set.status).toHaveBeenCalledWith(
        HttpStatusCode.CREATED_201,
      );
      expect(request.cookie.auth.set).toHaveBeenCalled();
      expect(request.jwt.sign).toHaveBeenCalled();
      expect(request.hx.redirect).toHaveBeenCalledWith("/admin");
    });

    it("prevents registration with a duplicate email", async () => {
      const request = createMockRequest({
        body: { email: "test@example.com", password: "password123" },
      });

      await registerHandler(request);

      expect(request.error).toHaveBeenCalledWith(
        HttpStatusCode.UNPROCESSABLE_ENTITY_422,
        expect.anything(),
      );
    });
  });

  describe("/logout", () => {
    it("logs out a user", async () => {
      const request = createMockRequest();

      await logoutHandler(request);

      expect(request.cookie.auth.remove).toHaveBeenCalled();
      expect(request.cookie.expiryCookie.remove).toHaveBeenCalled();
      expect(request.hx.redirect).toHaveBeenCalledWith("/login");
    });
  });
});
