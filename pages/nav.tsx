import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

const Nav: NextPage = () => {
    return (
        <div className='flex flex-row  items-center justify-center  ' >
            <Link href="/" >Dashboard</Link>
            <Link href="/post">Post Tweet</Link>
            <Link href="/createProfile">Create Profile</Link>
        </div>
    );
};

export default Nav;
