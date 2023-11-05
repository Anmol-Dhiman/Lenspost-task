
import { LensClient, development } from "@lens-protocol/client";
import { signMessage } from '@wagmi/core'

const client = new LensClient({
    environment: development
});
export const getClient = () => {
    return client
}
export const getAuthenticatedClient = async (address: string, profileId: string) => {
    const { id, text } = await client.authentication.generateChallenge({
        signedBy: address,
        for: profileId

    });
    const signature = await signMessage({
        message: text,
    })
    await client.authentication.authenticate({ id, signature });
    return client
}
export const isLoggedIn = async () => {
    const isAuthenticated = await client.authentication.isAuthenticated();
    return isAuthenticated
}

