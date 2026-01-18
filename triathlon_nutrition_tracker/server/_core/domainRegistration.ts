import { ENV } from "./env";

/**
 * Register the current domain with the Manus OAuth service
 * This ensures that the custom domain is recognized as a valid redirect URI
 */
export async function registerDomainWithOAuth(domain: string): Promise<void> {
  if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
    console.warn("[Domain Registration] Forge API not configured");
    return;
  }

  try {
    const baseUrl = ENV.forgeApiUrl.endsWith("/") ? ENV.forgeApiUrl : `${ENV.forgeApiUrl}/`;
    const fullUrl = new URL("webdevtoken.v1.WebDevService/RegisterOAuthDomain", baseUrl).toString();

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "connect-protocol-version": "1",
        authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        appId: ENV.appId,
        domain: domain,
        redirectUri: `https://${domain}/api/oauth/callback`,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(`[Domain Registration] Failed to register domain: ${response.status} ${response.statusText}${detail ? `: ${detail}` : ""}`);
      return;
    }

    console.log(`[Domain Registration] Successfully registered domain: ${domain}`);
  } catch (error) {
    console.warn("[Domain Registration] Error registering domain:", error);
  }
}
