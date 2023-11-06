
"use client"
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { ProfileID, getClient, isLoggedIn } from '../../utils/LensClient';
import Auth from '../../components/Auth';
import { textOnly } from "@lens-protocol/metadata"
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { isRelaySuccess } from "@lens-protocol/client"
import toast, { Toaster } from 'react-hot-toast';

// 0x02cf
const Post: NextPage = () => {

    const noManagerError = () => toast.error(`No Profile Manager for Profile ID : ${ProfileID}`);
    const noInput = () => toast(`Wirte Some Content`, {
        icon: '⚠',
    });
    const success = () => toast.success(`New Post created for Profile ID : ${ProfileID}`);

    const [loggedIn, setLoggedIn] = useState(false)
    const client = getClient()
    const [postText, setText] = useState("")
    const [loading, setLoading] = useState(false)

    const createPost = async () => {
        if (postText === "") {
            noInput()
            return
        }

        setLoading(true)
        const metaData = textOnly({
            content: postText
        })



        const storage = new ThirdwebStorage({
            clientId: "af1e6d20df64cf0fb056057617551289"
        });
        const uri = await storage.upload(metaData);


        const result = await client.publication.postOnchain({
            contentURI: uri
        });
        const resultValue = result.unwrap();

        if (!isRelaySuccess(resultValue)) {

            noManagerError()
            setLoading(false)
            return;
        }

        await client.transaction.waitUntilComplete({
            forTxId: resultValue.txId,
        })
        success()
        setLoading(false)

    }


    useEffect(() => {
        const auth = async () => {
            setLoggedIn(await isLoggedIn())
        }
        auth()
    }, [])
    return (
        <div>

            {!loggedIn ?
                <Auth setLoggedIn={setLoggedIn} />
                : <div className='flex flex-col justify-center items-center mt-12  ' >
                    <input
                        type="text"
                        value={postText}
                        onChange={(e) => setText(e.target.value)}
                        placeholder='Enter Post Content'
                        className='input-box'
                    />
                    {
                        loading ?
                            <p className='mt-12 font-semibold ' >Loading....</p> :
                            <button onClick={createPost} className='form-button'  >Post</button>
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

export default Post;
