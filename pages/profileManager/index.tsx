import type { NextPage } from 'next';
import { LensClient, development } from "@lens-protocol/client";
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { signTypedData } from '@wagmi/core'
import { ChangeProfileManagerActionType, PaginatedResult, ProfileFragment, CreateChangeProfileManagersBroadcastItemResultFragment } from "@lens-protocol/client"
import { TypedDataDomain, walletActions } from 'viem';
import { getAuthenticatedClient, getClient } from '../../utils/LensClient';

const ProfileManager: NextPage = () => {

    const [userProfiles, setProfiles] = useState<PaginatedResult<ProfileFragment>>()
    const account = useAccount()
    const client = getClient()


    const toggleProjectManager = async (profile: ProfileFragment) => {
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
        console.log(JSON.stringify(typedData))


        const domain = typedData.domain as TypedDataDomain
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
            console.log(`Something went wrong`);
            return;
        }
        console.log("success")
        await getProfiles()

    }


    const getProfiles = async () => {
        console.log("fetching...")
        const allOwnedProfiles = await client.profile.fetchAll({
            where: {
                ownedBy: [account.address!],
            },
        })
        console.log("fetched")
        setProfiles(allOwnedProfiles)
    }
    useEffect(() => {
        if (account.isConnected)
            getProfiles()
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
                account.isConnected &&
                <div>
                    {
                        userProfiles?.items.map((item) => {
                            return <>
                                <div className='px-10 mb-6' key={item.id} >
                                    <div className='flex flex-row items-center   ' >
                                        <div className=' flex flex-row flex-1  items-center' >
                                            <div className='mr-8 flex-1 ' >
                                                <p className=' info-header ' >Handle</p>
                                                <p className='  info-text     ' >{item.handle?.fullHandle}</p>
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
                                        <button className=' bg-[#0e76fd]  rounded-lg px-8 py-2 text-white font-bold  ' onClick={() => toggleProjectManager(item)}  >
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

        </div>
    );
};

export default ProfileManager;
