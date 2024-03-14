import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import profile from '../../public/default_profile.jpg';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { deleteCookie } from 'cookies-next';

export default function Navbar(props: { username: string, photo_url: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [photo_url, setPhotoUrl] = useState("");

  useEffect(() => {
    setUsername(props.username)
    setPhotoUrl(props.photo_url)
  }, [props.username, props.photo_url])

  const node = useRef<any>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: any) => {
    // Handle option click logic
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (node.current && node.current.contains(e.target)) {
        // inside click
        return;
      }
      // outside click
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const router = useRouter();
  const handleLogout = async () => {
    try {
      const res = await fetch(`${process.env.BACKEND_API}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await res.json();
      await deleteCookie("token")
      console.log("Logout")

      if (responseData.success) {
        router.push("/");
      } else {
        console.log("Gagal Logout")
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-orange w-screen justify-end p-2 shadow-lg shadow-red-500/20 flex">
      <div className="relative" ref={node}>
        <div
          className="flex items-center hover:bg-gray-100/50 rounded-md p-1 cursor-pointer mr-5"
          onClick={handleToggle}
        >
          <div className="w-10 mr-3">
            <Image
              className="rounded-full aspect-square object-cover"
              src={photo_url ? `${process.env.BACKEND_API}${photo_url}` : profile}
              width={500}
              height={500}
              alt="profile-pic" />
          </div>
          <p className="text-center mr-1 text-white">{username}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-5 h-5"
          >
            <path
              fill="#fff"
              fillRule="evenodd"
              d="M12.707 14.707a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L12 12.586l4.293-4.293a1 1 0 1 1 1.414 1.414l-5 5Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white border rounded-md shadow-md p-1 mr-5 z-50">
            <div>
              <Link href="/profile">
                <div className="flex items-center flex-row p-2 hover:bg-gray-100 rounded-t-lg cursor-pointer" onClick={() => handleOptionClick('')}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2"
                  >
                    <g clipPath="url(#a)">
                      <path fill="#fff" d="M0 0h24v24H0z" />
                      <g filter="url(#b)">
                        <path
                          fill="#000"
                          d="m14.336 12.347-.26-.428a.5.5 0 0 0 .115.906l.145-.478Zm-4.673 0 .146.478a.5.5 0 0 0 .114-.905l-.26.427Zm-5.601 6.655-.497-.062.497.062Zm15.876 0 .497-.062-.497.062ZM16 8.5c0 1.448-.77 2.717-1.924 3.42l.52.854A4.997 4.997 0 0 0 17 8.5h-1Zm-4-4a4 4 0 0 1 4 4h1a5 5 0 0 0-5-5v1Zm-4 4a4 4 0 0 1 4-4v-1a5 5 0 0 0-5 5h1Zm1.923 3.42A3.997 3.997 0 0 1 8 8.5H7c0 1.811.963 3.397 2.403 4.274l.52-.854Zm-.405-.052a8.509 8.509 0 0 0-5.953 7.072l.993.124a7.508 7.508 0 0 1 5.251-6.24l-.291-.956ZM3.565 18.94c-.11.888.626 1.56 1.435 1.56v-1c-.295 0-.468-.228-.442-.436l-.993-.124ZM5 20.5h14v-1H5v1Zm14 0c.81 0 1.545-.672 1.434-1.56l-.992.124c.026.208-.147.436-.442.436v1Zm1.434-1.56a8.509 8.509 0 0 0-5.952-7.072l-.291.957a7.508 7.508 0 0 1 5.251 6.239l.992-.124Z"
                        />
                      </g>
                    </g>
                    <defs>
                      <clipPath id="a">
                        <path fill="#fff" d="M0 0h24v24H0z" />
                      </clipPath>
                      <filter
                        id="b"
                        width={18.891}
                        height={19}
                        x={2.554}
                        y={3.5}
                        colorInterpolationFilters="sRGB"
                        filterUnits="userSpaceOnUse"
                      >
                        <feFlood floodOpacity={0} result="BackgroundImageFix" />
                        <feColorMatrix
                          in="SourceAlpha"
                          result="hardAlpha"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        />
                        <feOffset dy={1} />
                        <feGaussianBlur stdDeviation={0.5} />
                        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_15_82" />
                        <feBlend
                          in="SourceGraphic"
                          in2="effect1_dropShadow_15_82"
                          result="shape"
                        />
                      </filter>
                    </defs>
                  </svg>
                  <p>Profil</p>
                </div>
              </Link>
            </div>

            <div>
              <Link href="/">
                <div className="flex items-center flex-row p-2 hover:bg-gray-100 rounded-t-lg cursor-pointer" onClick={() => handleOptionClick('')}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={800}
                    height={800}
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      stroke="#000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M8 8l-4 4m0 0 4 4m-4-4h12"
                    />
                  </svg>
                  <p>Logout</p>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
