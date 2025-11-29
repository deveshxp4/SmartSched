import React from 'react'

const Footer = () => {
    return (
        <>
            <footer className=' '>
                <div>
                    <div className="main89">

                        <div className='flex mt-28 ml-24 '>
                            <svg
                                className='logo w-9 mb-5 h-9 '
                                viewBox="0 0 200 200"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M158.026 23.5H41.974C31.771 23.5 23.5 31.771 23.5 41.974v116.052c0 10.203 8.271 18.474 18.474 18.474h116.052c10.203 0 18.474-8.271 18.474-18.474V41.974c0-10.203-8.271-18.474-18.474-18.474zM62.37 125.347c-8.382 1.206-16.154-4.611-17.36-12.992s4.611-16.154 12.992-17.36c8.382-1.206 16.154 4.611 17.36 12.992s-4.61 16.154-12.992 17.36zm89.787-43.89-47.193 63.061a14.978 14.978 0 0 1-12.021 6.014c-3.127 0-6.279-.974-8.976-2.992-6.633-4.964-7.985-14.364-3.022-20.997l47.193-63.061c4.964-6.633 14.363-7.985 20.997-3.022 6.632 4.964 7.985 14.365 3.022 20.997z"
                                    fill="#111010"
                                    data-color="1"
                                />
                            </svg>
                            <div className=''>
                                <div className="font-bold text-lg">SmartSched</div>
                                <div className="font-thin">Efficient Timetable Management for Students</div>
                            </div>
                        </div>

                        <div className="main80 flex">
                            <div className="main55 text-sm  font-thin">
                                <h1 className="font-bold text-xl mb-5">Contact</h1>
                                <div className="flex  gap-24">
                                    <div className="mb-5 main56">1234 University Street, Anytown, USA 12345</div>
                                    <div className="main57 w-3">Sales:sales@mysite.com</div>
                                </div>
                                <div className="flex gap-20">
                                    <div className="mb-5 w-40 ">General Inquiries:info@mysite.com</div>
                                    <div className="w-40">Support:support@mysite.com</div>
                                </div>
                            </div>

                            <div className="main90 text-sm font-thin">
                                <h1 className="text-xl mb-5 font-bold">Quick Links</h1>
                                <div className="main89 mb-5">Terms and Conditions</div>
                                <div className=" main89 mb-5">Privacy Policy</div>
                            </div>

                            <div className="ml-28 mt-11 text-sm font-thin">
                                <h1 className="text-xl mb-5 font-bold" >Connect with Us</h1>
                                <p className="mb-5 w-80 ">Stay informed with the latest updates on our timetable management solutions.</p>
                                <div className="input__container w-48 mt-8">
                                    <div className="shadow__input"></div>
                                    <button className="input__button__shadow">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="#000000"
                                            width="20px"
                                            height="20px"
                                        >
                                            <path d="M0 0h24v24H0z" fill="none"></path>
                                            <path
                                                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                                            ></path>
                                        </svg>
                                    </button>
                                    <input
                                        type="text"
                                        name="Email"
                                        className="input__search"
                                        placeholder="Email"
                                    />
                                </div>


                                <label
                                    className=" relative flex cursor-pointer items-center justify-center mt-10 gap-4"
                                    htmlFor="star"
                                >
                                    <input className="peer appearance-none" id="star" name="star" type="checkbox" />
                                    <span
                                        className="absolute left-0 top-1/2 h-[1.5em] w-[1.5em] -translate-x-full -translate-y-1/2 rounded-[0.25em] border-[1px] border-black"
                                    >
                                    </span>
                                    <svg
                                        className="absolute left-0 top-1/2 h-[1.5em] w-[1.5em] -translate-x-full -translate-y-1/2 duration-500 ease-out [stroke-dasharray:100] [stroke-dashoffset:100] peer-checked:[stroke-dashoffset:0]"
                                        viewBox="0 0 38 37"
                                        fill="none"
                                        height="28"
                                        width="28"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M6.617 36.785c-.676-5.093 4.49-10.776 6.318-14.952 1.887-4.31 4.315-10.701 6.055-15.506C20.343 2.59 20.456.693 20.57.789c3.262 2.744 1.697 10.518 2.106 14.675 1.926 19.575 4.62 12.875-7.635 4.43C12.194 17.933 2.911 12.1 1.351 8.82c-1.177-2.477 5.266 0 7.898 0 2.575 0 27.078-1.544 27.907-1.108.222.117-.312.422-.526.554-1.922 1.178-3.489 1.57-5.266 3.046-3.855 3.201-8.602 6.002-12.11 9.691-4.018 4.225-5.388 10.245-11.321 10.245"
                                            strokeWidth="1.5px"
                                            pathLength="100"
                                            stroke="#000"
                                        ></path>
                                    </svg>
                                    <p className="text-[0.875em] font-semibold [user-select:none]">Yes,subscribe me to your newsettler</p>
                                </label>
                                <button className="main relative px-8 py-2 rounded-md bg-white text-black isolation-auto z-10 border-2 border-zinc-950
        before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-black before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700 hover:text-yellow-400" style={{ width: '40%' }}>
                                    Subscribe
                                </button>

                            </div>

                            <div>
                                <div className="card1 flex ml-40  ">
                                    <a className="socialContainer containerOne" href="#">
                                        <svg viewBox="0 0 16 16" className="socialSvg instagramSvg">
                                            <path
                                                d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"
                                            ></path>
                                        </svg>
                                    </a>

                                    <a className="socialContainer containerTwo" href="#">
                                        <svg viewBox="0 0 16 16" className="socialSvg twitterSvg">
                                            <path
                                                d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"
                                            ></path>
                                        </svg>
                                    </a>

                                    <a className="socialContainer containerThree" href="#">
                                        <svg viewBox="0 0 448 512" className="socialSvg linkdinSvg">
                                            <path
                                                d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                                            ></path>
                                        </svg>
                                    </a>

                                    <a className="socialContainer containerFour" href="#">
                                        <svg viewBox="0 0 16 16" className="socialSvg whatsappSvg">
                                            <path
                                                d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"
                                            ></path>
                                        </svg>
                                    </a>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

                <div className='bg-black font-thin flex justify-center text-white text-sm'>
                    &copy; SmartSched.All rights reserved
                </div>
            </footer>
        </>
    )
}

export default Footer
