
"use client"
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { getClient } from '../../utils/LensClient';
import Auth from '../../components/Auth';
import { textOnly } from "@lens-protocol/metadata"
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { isRelaySuccess } from "@lens-protocol/client"
// 0x02cf
const Post: NextPage = () => {


    const [loggedIn, setLoggedIn] = useState(false)
    const client = getClient()
    const [postText, setText] = useState("")
    const createPost = async () => {
        if (postText === "") return
        const metaData = textOnly({
            content: postText
        })
        console.log(JSON.stringify(metaData))

        const storage = new ThirdwebStorage({
            clientId: "af1e6d20df64cf0fb056057617551289"
        });
        const uri = await storage.upload(metaData);


        const result = await client.publication.postOnchain({
            contentURI: uri
        });
        const resultValue = result.unwrap();

        if (!isRelaySuccess(resultValue)) {
            console.log(`Something went wrong`, resultValue);
            return;
        }

        console.log(`Transaction was successfully broadcasted with txId ${resultValue.txId}`);


    }

    return (
        <div>
            {!loggedIn ?
                <Auth setLoggedIn={setLoggedIn} />
                : <div className='flex flex-col   justify-center items-center mt-12  ' >
                    <input
                        type="text"
                        value={postText}
                        onChange={(e) => setText(e.target.value)}
                        placeholder='Enter Post Content'
                    />
                    <button onClick={createPost} >Post</button>
                </div>
            }
        </div>
    );
};

export default Post;
