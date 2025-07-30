import KeycloakAdminClient from "@keycloak/keycloak-admin-client";
import { envs } from "../config/envs";
export const createKeycloakAdminClient = async () => {
    const keycloakAdminClient = new KeycloakAdminClient({
        baseUrl: envs.keycloak.url,
        realmName: envs.keycloak.realm,
    });
    await keycloakAdminClient.auth({
        username: envs.keycloak.clientId,
        password: envs.keycloak.clientSecret,
        grantType: "password",
        clientId: envs.keycloak.clientId
    });
    return keycloakAdminClient;
}