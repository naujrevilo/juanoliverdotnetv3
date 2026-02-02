export const handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Pong!", version: "v3.2.18.dev" }),
  };
};
