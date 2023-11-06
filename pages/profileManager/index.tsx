import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { signTypedData } from '@wagmi/core'
import { ChangeProfileManagerActionType, PaginatedResult, ProfileFragment, CreateChangeProfileManagersBroadcastItemResultFragment } from "@lens-protocol/client"
import { TypedDataDomain } from 'viem';
import { getAuthenticatedClient, getClient } from '../../utils/LensClient';
import toast, { Toaster } from 'react-hot-toast';

type Profile = {
    createdAt: string,
    signless: boolean,
    handle: string | undefined,
    id: string
}


const ProfileManager: NextPage = () => {

    const [userProfiles, setProfiles] = useState<Profile[]>([])
    const account = useAccount()
    const client = getClient()
    const [loading, setLoading] = useState(false)
    const authFailure = () => toast.error("You rejected authentication from metamask!")
    const signatureFailure = () => toast.error("You rejected message signing from metamask!")

    const toggleProjectManager = async (profile: Profile, index: number) => {
        try {

            const client = await getAuthenticatedClient(account.address!, profile.id)
            const typedDataResult = await client.profile.createChangeProfileManagersTypedData({
                approveSignless: !profile.signless,
                changeManagers: [
                    {
                        action: ChangeProfileManagerActionType.Add,
                        address: account.address!
                    },
                ],
            });
            const { id, typedData } = typedDataResult.unwrap();


            const domain = typedData.domain as TypedDataDomain
            try {
                const signedTypedData = await signTypedData({
                    domain: domain,
                    message: typedData.value,
                    types: typedData.types,
                    primaryType: "ChangeDelegatedExecutorsConfig"
                })
                const broadcastOnchainResult = await client.transaction.broadcastOnchain({
                    id,
                    signature: signedTypedData,
                });
                const onchainRelayResult = broadcastOnchainResult.unwrap();
                if (onchainRelayResult.__typename === "RelayError") {
                    const failure = () => toast.error(`Failed to ${profile.signless ? "remove" : "set"} Project Manager for ID : ${profile.id} `)
                    failure()
                    return;
                }

                const success = () => toast.success(`Project Manager successfully ${profile.signless ? "removed" : "set"} for ID :${profile.id}`)
                success()
                const updatedProfile = userProfiles[index]
                updatedProfile.signless = !profile.signless
                setProfiles([...userProfiles, updatedProfile])
            } catch (e) {
                signatureFailure()
            }
        } catch (e) {
            authFailure()
        }
    }


    const getProfiles = async () => {
        const allOwnedProfiles = await client.profile.fetchAll({
            where: {
                ownedBy: [account.address!],
            },
        })
        const profiles: Profile[] = []

        allOwnedProfiles.items.forEach((item) => {
            const id = item.id
            const createdAt = item.createdAt
            const handle = item.handle?.fullHandle
            const signless = item.signless
            profiles.push(
                {
                    id,
                    handle,
                    createdAt,
                    signless
                }
            )
        })
        setProfiles(profiles)
    }
    useEffect(() => {
        const profiles = async () => {
            if (account.isConnected) {
                setLoading(true)
                await getProfiles()
                setLoading(false)
            }
        }
        profiles()
    }, [account.isConnected])


    return (
        <div className='flex flex-col  mt-12  ' >
            {
                !account.isConnected &&
                <div className=' font-semibold text-2xl text-center  '  >
                    Connect Your Wallet With Polygon Mumbai Testnet
                </div>
            }
            {
                loading &&
                <div className=' font-semibold text-2xl text-center  '  >
                    Fetching User Profiles....
                </div>

            }
            {
                account.isConnected && !loading &&
                <div>
                    {
                        userProfiles.map((item, index) => {
                            return <>
                                <div className='px-10 mb-6' key={item.id} >
                                    <div className='flex flex-row items-center   ' >
                                        <div className=' flex flex-row flex-1  items-center' >
                                            <div className='mr-8 flex-1 ' >
                                                <p className=' info-header ' >Handle</p>
                                                <p className='  info-text     ' >{item.handle}</p>
                                            </div>
                                            <div className='mr-8 flex-1 ' >
                                                <p className=' info-header ' >ID</p>
                                                <p className='  info-text     ' >{item.id}</p>
                                            </div>
                                            <div className='mr-8 flex-1 ' >
                                                <p className=' info-header ' >Signless</p>
                                                <p className='  info-text     ' >{`${item.signless}`}</p>
                                            </div>

                                            <div className='mr-8 flex-1 ' >
                                                <p className=' info-header ' >Created At</p>
                                                <p className='  info-text     ' >{item.createdAt}</p>
                                            </div>
                                        </div>
                                        <button className=' bg-[#0e76fd]  rounded-lg px-8 py-2 text-white font-bold  ' onClick={() => toggleProjectManager(item, index)}  >
                                            {
                                                item.signless ? "Disable Project Manager" : "Enable Project Manager"
                                            }
                                        </button>
                                    </div>
                                    <div className='h-[1px]  bg-slate-400 w-full  mt-4 ' />
                                </div>
                            </>
                        })
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

export default ProfileManager;
