export const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Pong!", version: "v3.2.23.dev" }),
  };
};
