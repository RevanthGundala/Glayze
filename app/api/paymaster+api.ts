export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("body:", body);
    const response = await fetch(process.env.PAYMASTER_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    let data = await response.json();

    if (!data) {
      throw new Error("No data received from paymaster");
    }

    // data.result.paymasterPostOpGasLimit = 1000000;

    console.log("data:", data);

    return Response.json({ data }); // Return data directly
  } catch (error) {
    console.error("Error in paymaster+api:", error);
    return Response.json({ error });
  }
}
