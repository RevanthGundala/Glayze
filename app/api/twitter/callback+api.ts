export const GET = async (req: Request, res: Response) => {
  console.log("Callback");
  return Response.json({ message: "Hello, world!" });
};
