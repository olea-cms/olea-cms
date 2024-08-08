import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  mock,
  afterAll,
} from "bun:test";
import { NewUser } from "../src/models/user";
import { app } from "../src/olea";
import { db } from "../src/db";
import { users } from "../src/schema";
import { forEachObj, map, mapKeys, omit } from "remeda";
import HttpStatusCode from "../src/common/statusCodes";
import { IncorrectPasswordException } from "../src/exceptions/incorrectPassword";
import { eq } from "drizzle-orm";
import { UsersService } from "../src/services/users";
const API_URL = `http://localhost:3000`;
const AUTH_URL = `${API_URL}/auth`;

const mockUser0 = {
  email: "test0@user.com",
  password: "test0password",
};
const mockUser1 = {
  email: "test1@user.com",
  password: "test1password",
};

const formDataFromObj = (keyvals: Record<string, any>) => {
  const formData = new FormData();
  forEachObj(keyvals, (val, key) => {
    formData.append(key, val);
  });
  return formData;
};

const extractResponseBlob = async (response: Response, as = "text") =>
  await (await (<any>response.blob()))[as]();

describe("Authentication Routes", () => {
  beforeEach(async () => {
    await db.insert(users).values({
      ...mockUser0,
      password: await Bun.password.hash(mockUser0.password, {
        algorithm: "argon2id",
      }),
    });
  });

  afterEach(async () => {
    await db.delete(users);
  });

  it("errors without correct data (email/password) on /login and /register", async () => {
    const res = await app.fetch(
      new Request(`${AUTH_URL}/login`, {
        method: "POST",
        body: new FormData(),
      }),
    );

    expect(res.ok).toBeFalse();
    expect(res.status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY_422);
    expect(res.headers.get("set-cookie")).toBeNull();
    expect(res.headers.get("hx-redirect")).toBeNull();
    expect(res.redirected).toBeFalse();

    const jsonRes = JSON.parse(await extractResponseBlob(res));

    expect(jsonRes.type).toEqual("validation");
    expect(jsonRes.summary).toEqual("Property 'email' is missing");
    expect(jsonRes.errors.length).toBePositive();
  });

  describe("/login", () => {
    const LOGIN_URL = `${AUTH_URL}/login`;
    it("successfully logs in a user", async () => {
      const req = new Request(LOGIN_URL, {
        method: "POST",
        body: formDataFromObj(mockUser0),
      });
      const res = await app.fetch(req);

      expect(res.ok).toBeTrue();
      expect(res.status).toBe(HttpStatusCode.OK_200);
      expect(res.headers.get("set-cookie")).toBeTruthy();
      expect(res.headers.get("hx-redirect")).toEqual("/admin");
      expect(res.redirected).toBeFalse();
      expect(res.bodyUsed).toBeFalse();
    });

    it("handles incorrect credentials", async () => {
      const incorrectData = formDataFromObj({
        ...mockUser0,
        password: "thisisasuperduperextrasuperduperwrongpassword",
      });
      const res = await app.fetch(
        new Request(LOGIN_URL, {
          method: "POST",
          body: incorrectData,
        }),
      );

      expect(res.ok).toBeFalse();
      expect(res.status).toBe(HttpStatusCode.UNAUTHORIZED_401);
      expect(res.headers.get("set-cookie")).toBeNull();
      expect(res.headers.get("hx-redirect")).toBeNull();
      expect(res.redirected).toBeFalse();
      expect(await extractResponseBlob(res)).toEqual(
        IncorrectPasswordException(),
      );
    });
  });

  describe("/register", () => {
    const REGISTER_URL = `${AUTH_URL}/register`;
    it("errors if user already exists", async () => {
      const res = await app.fetch(
        new Request(REGISTER_URL, {
          method: "POST",
          body: formDataFromObj(mockUser0),
        }),
      );
    });

    it("creates new user", async () => {
      const res = await app.fetch(
        new Request(REGISTER_URL, {
          method: "POST",
          body: formDataFromObj(mockUser1),
        }),
      );

      const user = await db
        .select({ email: users.email, password: users.password })
        .from(users)
        .where(eq(users.email, mockUser1.email));

      expect(user.length).toBe(1);
    });

    it("sends appropriate response on successful registration", async () => {
      const res = await app.fetch(
        new Request(REGISTER_URL, {
          method: "POST",
          body: formDataFromObj(mockUser1),
        }),
      );

      expect(res.ok).toBeTrue();
      expect(res.status).toBe(HttpStatusCode.CREATED_201);
      expect(res.headers.get("set-cookie")).toBeTruthy();
      expect(res.headers.get("hx-redirect")).toEqual("/admin");
      expect(res.redirected).toBeFalse();
      expect(res.bodyUsed).toBeFalse();
    });
  });

  describe("/logout", () => {
    it("logs out a user", async () => {
      const loginRes = await app.fetch(
        new Request(`${AUTH_URL}/login`, {
          method: "POST",
          body: formDataFromObj(mockUser0),
        }),
      );

      expect(loginRes.ok).toBeTrue();
      expect(loginRes.status).toBe(HttpStatusCode.OK_200);
      expect(loginRes.headers.get("set-cookie")).toBeTruthy();
      expect(loginRes.headers.get("hx-redirect")).toEqual("/admin");
      expect(loginRes.redirected).toBeFalse();
      expect(loginRes.bodyUsed).toBeFalse();

      const logoutRes = await app.fetch(
        new Request(`${AUTH_URL}/logout`, {
          method: "POST",
        }),
      );

      expect(logoutRes.ok).toBeTrue();
      expect(logoutRes.status).toBe(HttpStatusCode.OK_200);
      expect(logoutRes.headers.get("set-cookie")).toBeNull();
      expect(logoutRes.headers.get("hx-redirect")).toEqual("/login");
    });
  });
});
