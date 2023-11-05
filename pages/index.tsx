
"use client"
import type { NextPage } from 'next';
import Auth from '../components/Auth';
import { useEffect, useState } from 'react';
import { getClient, isLoggedIn } from '../utils/LensClient';

const Home: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const client = getClient()

  return (
    <div>
      {!loggedIn ?
        <Auth setLoggedIn={setLoggedIn} />
        : <div>
          hello world
        </div>
      }
    </div>
  );
};

export default Home;
