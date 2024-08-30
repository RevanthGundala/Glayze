import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  LinkTokenCreateRequest,
  Products,
  CountryCode,
} from "plaid";

export async function POST(request: Request) {
  try {
    const environment =
      process.env.EXPO_PUBLIC_CHAIN === "base"
        ? PlaidEnvironments.production
        : PlaidEnvironments.sandbox;

    const config = new Configuration({
      basePath: environment,
      baseOptions: {
        headers: {
          "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
          "PLAID-SECRET": process.env.PLAID_SECRET,
          "Plaid-Version": "2020-09-14",
        },
      },
    });

    const plaidClient = new PlaidApi(config);

    const { client_user_id, phone_number: number } = await request.json();
    const phone_number =
      environment === PlaidEnvironments.sandbox
        ? "+12345678909"
        : "+" + number.replace(/\D/g, "");

    const linkTokenCreateRequest: LinkTokenCreateRequest = {
      user: {
        client_user_id,
        phone_number,
      },
      products: [Products.IdentityVerification],
      identity_verification: {
        template_id: process.env.PLAID_TEMPLATE_ID,
      },
      client_name: "Glayze",
      language: "en",
      country_codes: [CountryCode.Us],
    };

    const response = await plaidClient.linkTokenCreate(linkTokenCreateRequest);
    console.log(
      "Received response from Plaid:",
      JSON.stringify(
        {
          status: response.status,
          data: response.data,
        },
        null,
        2
      )
    );

    const linkToken = response.data.link_token;
    return Response.json({ linkToken, status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    return Response.json({ error: error, status: 500 });
  }
}
