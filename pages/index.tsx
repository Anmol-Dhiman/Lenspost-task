
"use client"
import type { NextPage } from 'next';
import Auth from '../components/Auth';
import { useEffect, useState } from 'react';
import { ProfileID, getClient, isLoggedIn } from '../utils/LensClient';
import { AnyPublicationFragment, PaginatedResult, PostFragment } from "@lens-protocol/client"
import { ThirdwebStorage } from '@thirdweb-dev/storage';
import { TextOnlyMetadata } from '@lens-protocol/metadata';
type Post = {
  createdAt: string,
  content: string
}
const Home: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const client = getClient()

  const [userPosts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const auth = async () => {
      setLoggedIn(await isLoggedIn())
    }
    auth()
  }, [])

  useEffect(() => {
    const getPosts = async () => {
      const result = await client.publication.fetchAll({
        where: {
          from: [ProfileID],
        },
      });
      const userData: Post[] = []
      const _post = result.items[0] as PostFragment

      result.items.forEach(async (item) => {
        const post = item as PostFragment
        const storage = new ThirdwebStorage({
          clientId: "af1e6d20df64cf0fb056057617551289"
        });
        const content: TextOnlyMetadata = await storage.downloadJSON(post.metadata.rawURI);
        userData.push({
          createdAt: post.createdAt,
          content: content.lens.content
        })
        setPosts(userData)
      })
    }

    if (loggedIn)
      getPosts()
  }, [loggedIn])

  return (
    <div>
      {!loggedIn ?
        <Auth setLoggedIn={setLoggedIn} />
        : <div className='grid grid-cols-4   mt-8 px-8   ' >
          {
            userPosts.map((item, index) => {

              return <>
                <div className='  bg-green-100  rounded-lg px-4 py-4 mx-4 ' key={item.createdAt} >
                  <p className='text-center text-lg font-bold '   >
                    {item.content}
                  </p>
                  <div className=' text-right mt-8' >
                    <p className='info-header' >Create At</p>
                    <p className='info-text' >{item.createdAt} </p>
                  </div>
                </div>
              </>
            })
          }
        </div>
      }

    </div>
  );
};

export default Home;
