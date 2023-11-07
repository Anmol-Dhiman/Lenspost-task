"use client"
import { useEffect, useState } from "react"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi";
import { getAuthenticatedClient, getClient } from "../utils/LensClient";
const Auth = (props: { setLoggedIn: (value: boolean) => void }) => {

    const [profileId, setProfileId] = useState("")
    const { openConnectModal } = useConnectModal();
    const account = useAccount()
    const logIn = async () => {
        if (profileId === "") return;
        if (!account.isConnected && openConnectModal) {
            openConnectModal()
        } else {
            await auth()
        }
    }

    const auth = async () => {
        if (profileId !== "") {
            await getAuthenticatedClient(account.address!, profileId)
            props.setLoggedIn(true)
        }

    }
    useEffect(() => {
        const authentication = async () => {
            const isAuthenticated = await getClient().authentication.isAuthenticated();
            if (account.isConnected && !isAuthenticated)
                auth()
        }
        authentication()
    }, [account.isConnected])



    return (

        <div className="flex flex-col  justify-center items-center mt-12 " >
            <input
                type="text"
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
                placeholder='Enter Profile ID'
                className="input-box"
                onKeyDown={(event) => {
                    if (event.code === 'Space') event.preventDefault()
                }} />
            <button onClick={logIn} className="form-button" >Log In</button>
        </div>

    )
}
export default Auth