import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

const Nav: NextPage = () => {
    return (
        <div className='flex flex-row justify-between px-10 py-4 items-center    bg-green-100   ' >
            <div>
                <Link className='nav-button' href="/"   >Dashboard</Link>
                <Link className='nav-button' href="/post">Post Tweet</Link>
                <Link className='nav-button' href="/createProfile">Create Profile</Link>
                <Link className='nav-button' href="/profileManager">Set Profile Manager</Link>
            </div>
            <ConnectButton />
        </div>
    );
};

export default Nav;
