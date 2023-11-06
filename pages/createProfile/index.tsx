import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { LensClient, development } from "@lens-protocol/client";
import { RelaySuccessFragment } from "@lens-protocol/client"
import toast, { Toaster } from 'react-hot-toast';


const CreateProifle: NextPage = () => {

    const lensClient = new LensClient({
        environment: development
    });
    const handleTakeError = () => toast.error("This Handle name is already taken!")
    const success = () => toast.success(`New Profile created with handle name as : ${handle}`)

    const [loading, setLoading] = useState(false)
    const account = useAccount()
    const [handle, setHandle] = useState("")

    // {"__typename":"RelaySuccess","txHash":"0xf5bcffc0d925f0140d9a429fac840aa630be06e19a90cab1bcc3ab7e0f84ea62","txId":"ae9f80aa-4a72-4728-a177-432264f4763b"}
    const createProfile = async () => {

        setLoading(true)
        const profileCreateResult = await lensClient.profile.create({
            handle: handle,
            to: account.address!,
        })


        // getting error here while unwrapping the object 
        // const profileCreateResultValue = profileCreateResult.unwrap()
        /** error - 
         *  Property 'unwrap' does not exist on type 'RelaySuccessFragment | CreateProfileWithHandleErrorResultFragment'.
         *  Property 'unwrap' does not exist on type 'RelaySuccessFragment'.
         */

        const response = profileCreateResult as RelaySuccessFragment
        if (response.__typename !== "RelaySuccess") {
            handleTakeError()
            setLoading(false)
            return
        }

        await lensClient.transaction.waitUntilComplete({
            forTxId: response.txId,
        })



        const profiles = await lensClient.profile.fetchAll({
            where: {
                ownedBy: [account.address!]
            }
        })

        const newProfile = profiles.items.find(
            (item) => item.handle?.fullHandle === `test/${handle}`
        )

        if (newProfile) {
            success()
        }
        setLoading(false)

    }



    return (
        <div className='flex flex-col   mt-12  ' >
            {
                !account.isConnected &&
                <div className=' font-semibold text-2xl  text-center '  >
                    Connect Your Wallet With Polygon Mumbai Testnet
                </div>
            }
            {
                account.isConnected &&
                <div className='flex flex-col    justify-center items-center  ' >
                    <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        pattern="[A-Za-z]*"
                        placeholder='Enter User Handle'
                        className='input-box'
                        onKeyDown={(event) => {
                            if (event.code === 'Space') event.preventDefault()
                        }}
                    />
                    {

                        loading ? <p className='mt-12 font-semibold' >Loading...</p> : <button onClick={createProfile} className='form-button' >Make Profile</button>
                    }
                </div>
            }
            <Toaster
                toastOptions={{
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }} />
        </div>
    );
};

export default CreateProifle;
