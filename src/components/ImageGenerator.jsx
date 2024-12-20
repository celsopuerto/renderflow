import { useState } from 'react';
import axios from 'axios';

const ImageGenerator = () => {
    // state variables
    const [payload, setPayload] = useState({
        prompt: "",
        aspect_ratio: '1:1',
        seed: "5",
        style_preset: "anime",
        output_format: "png",
    });
    const [imageSrc, setImageSrc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // input change handler
    const handleChange = (e) => {
        const {name, value} = e.target;
        setPayload((prevPayload) =>  ({
            ...prevPayload,
            [name]: value,
        }));
    }

    // form submit handler
    const formSubmitHandler = async (e) => {
        e.preventDefault(); //prevent reload on form submit
        console.log("Request sent.", payload); // viewing all data

        setImageSrc(null);
        setLoading(true);
        setError(false);

        // api key and url
        const apiURL = import.meta.env.VITE_RENDERFLOW_API_URL;
        const apiKey = import.meta.env.VITE_RENDERFLOW_API_KEY;

        try {
            const response = await axios.post(apiURL, payload, {
                responseType: 'arraybuffer',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    Accept: "image/*",
                    "Content-Type": "multipart/form-data",
                }
            });

            if(response.status === 200) {
                setLoading(false)
                console.log('Success');
                const blob = new Blob([response.data], {type: 'image/webp'});
                const imageUrl = URL.createObjectURL(blob);
                setImageSrc(imageUrl);
            } else {
                console.log(`Error: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            setLoading(false);
            setError(true);
            console.log("Error generating image:.", error)
        }
    }

  return (
    <div className="max-w-screen-xl px-5 mx-auto">
        <div className="grid item-center gap-8 p-10 border-[1px] border-[#3f3f46] rounded-lg lg:grid-cols-2">

            {/* Options */}
            <form action="" onSubmit={formSubmitHandler}>
                {/* prompt */}
                <div className="mb-7">
                    <label htmlFor="prompt" className="form-label">Prompt</label>

                    <textarea 
                    name="prompt" 
                    onChange={handleChange} 
                    value={payload.prompt} 
                    id="prompt" 
                    rows="4" 
                    className="block w-full p-3 bg-transparent border-[1px] border-[#3f3f46] rounded-lg focus-within:outline-0 focus:border-[#71717a]" 
                    required 
                    placeholder="Enter your prompt"></textarea>
                </div>

                {/* image style */}
                <div className="mb-7">
                    <label htmlFor="style" className="form-label">Image Style</label>

                    <select name="style_preset" value={payload.style_preset} onChange={handleChange} id="style" className="block w-full p-3 bg-transparent border-[1px] border-[#3f3f46] rounded-lg focus:-within:outline-0 focus:border-[#71717a]">
                        <option value="anime">Anime</option>
                        <option value="cinematic">Cinematic</option>
                        <option value="photographic">Photographic</option>
                        <option value="neon-punk">Neon Punk</option>
                        <option value="3d-model">3D Model</option>
                    </select>
                </div>

                {/* image format */}
                <div className="mb-7">
                    <label htmlFor="format" className="form-label">Image Format</label>

                    <select id="format" value={payload.output_format} onChange={handleChange} name="output_format" className="block w-full p-3 bg-transparent border-[1px] border-[#3f3f46] rounded-lg focus:-within:outline-0 focus:border-[#71717a]">
                        <option value="png">PNG</option>
                        <option value="jpeg">JPEG</option>
                        <option value="webp">WEBP</option>
                    </select>
                </div>

                {/* button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`flex items-center justify-center w-full gap-2 px-10 py-3 text-xl font-extralight text-center rounded-md font-inter 
                        ${loading ? 'bg-[#fafafa] text-[#09090b] cursor-not-allowed' : 'bg-[#fafafa] text-[#09090b]'}`}
                    >
                    {loading ? (
                        <>
                        <span>Generating...</span>
                        <div className="w-6 h-6 border-4 border-t-4 border-transparent border-t-[#09090b] rounded-full animate-spin"></div>
                        </>
                    ) : (
                        <>
                        <span>Generate Image</span>
                        {/* <img className="w-6" src="/stars.png" alt="" /> */}
                        </>
                    )}
                </button>
            </form>

            {/* Generated Image TODO: */}
            <div className="grid relative content-center border-[1px] border-[#3f3f46] rounded-md mx-auto lg:ms-auto overflow-clip w-[500px] h-[500px]">
                {loading ?  <div className="flex flex-col justify-center items-center space-y-2">
                                <div className="w-12 h-12 border-4 border-t-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                                <p className="text-center text-sm font-medium text-gray-100">Generating Image...</p>
                            </div>
                : error ? <p className="text-center">Something went wrong, try again.</p> 
                : imageSrc ? 
                <>
                    <img className="mx-auto" src={imageSrc}/> 

                    <a href={imageSrc} download={`RenderFlow.${payload.output_format}`} className="absolute px-3 py-1 -translate-x-1/2 border-2 rounded-md left-1/2 bg-[#fafafa] font-bold text-[#09090b] bottom-5">Download</a>
                </>
                : <img src="/renderflow.png" alt="" className="w-[250px] mx-auto" />}
            </div>
        </div>
    </div>
  )
}

export default ImageGenerator