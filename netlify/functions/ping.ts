export const handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Pong!", version: "v3.2.19.dev" }),
  };
};
