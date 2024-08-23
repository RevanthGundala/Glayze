// const { ComplyCube } = require("@complycube/api");

// export async function POST(request: Request) {
//   try {
//     const { firstName, lastName, email, themeName } = await request.json();
//     const complycube = new ComplyCube({
//       apiKey: process.env.COMPLY_CUBE_API_KEY,
//     });

//     const client = await complycube.client.create({
//       type: "person",
//       email,
//       personDetails: {
//         firstName,
//         lastName,
//       },
//     });
//     const session = await complycube.flow.createSession(client.id, {
//       checkTypes: [
//         "extensive_screening_check",
//         "identity_check",
//         "document_check",
//       ],
//       successUrl: "https://glayze.app/kyc/success",
//       cancelUrl: "https://glayze.app/kyc/cancel",
//       theme: themeName,
//     });
//     return Response.json({ hello: "world" });
//   } catch (error) {
//     return Response.json({ error }, { status: 400 });
//   }
// }
