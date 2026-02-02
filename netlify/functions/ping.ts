
export const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "pong", version: "v3.2.10.dev" }),
  };
};
