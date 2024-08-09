import HttpStatusCode from "../common/statusCodes";

export const beforeHandleAuthRoute = async ({
  cookie: { auth },
  set,
  jwt,
}: any) => {
  if (!auth || !auth.value) {
    set.status = HttpStatusCode.UNAUTHORIZED_401;

    return {
      status: "error",
      message: "Unauthorized",
    };
  }

  const profile = await jwt.verify(auth.value);

  if (!profile) {
    set.status = HttpStatusCode.UNAUTHORIZED_401;

    return {
      status: "error",
      message: "Unauthorized",
    };
  }
};
