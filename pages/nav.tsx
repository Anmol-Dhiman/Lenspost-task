"use client"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getAuthenticatedClient, getClient } from '../utils/LensClient';




const Nav: NextPage = () => {
    return (
        <div className='flex flex-row justify-between px-10 py-4 items-center    bg-green-100   ' >
            <div>
                <Link className='nav-button' href="/"   >Dashboard</Link>
                <Link className='nav-button' href="/post">Post Tweet</Link>
                <Link className='nav-button' href="/createProfile">Create Profile</Link>
                <Link className='nav-button' href="/profileManager">Profile Manager</Link>
            </div>
            <div className='flex flex-row' >
                <ConnectButton />
            </div>
        </div>

    );
};

export default Nav;
