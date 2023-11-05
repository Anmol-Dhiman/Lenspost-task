import type { NextPage } from 'next';
import { LensClient, development } from "@lens-protocol/client";
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

import { ChangeProfileManagerActionType } from "@lens-protocol/client"

const ProfileManager: NextPage = () => {
    const lensClient = new LensClient({
        environment: development
    });

    const account = useAccount()

    const enableProfileManager = async () => {
        const typedDataResult = await lensClient.profile.createChangeProfileManagersTypedData({
            approveSignless: true,
            changeManagers: [
                {
                    action: ChangeProfileManagerActionType.Add,
                    address: account.address!,
                },
            ],
        });
    }





    return (
        <div>
            Profile Manager
        </div>
    );
};

export default ProfileManager;
