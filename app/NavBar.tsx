'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';

const NavBar = () => {

    const pathname = usePathname();

    const [menuOpen, setMenuOpen] = useState(false);

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };


    return (
        <nav className="bg-black w-full sticky top-0 z-50">
            <div className="mx-0 w-full px-4 sm:px-6">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button */}
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white"
                            aria-controls="mobile-menu"
                            aria-expanded={menuOpen}
                            onClick={handleMenuToggle}
                        >
                            <span className="sr-only">Open main menu</span>
                            {menuOpen ? (
                                <svg
                                    className="block h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="block h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex-shrink-0">
                            {/* <Link href="/">
                                <img
                                    className="h-12 w-auto"
                                    src="https://apollodesign.net/media/catalog/product/cache/dbf21ea40c5a4552c901061577d4786d/M/S/MSDS-8017.png"
                                    alt="Your Company"
                                />
                            </Link> */}

                        </div>
                        <div className="hidden sm:flex sm:items-center sm:ml-6 justify-between w-full">
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/dashboard"
                                    className={clsx("px-3 py-2 rounded-md text-base font-normal text-gray-300 hover:text-white",
                                        {
                                            'text-white font-medium': pathname == "/dashboard",
                                        },
                                    )}
                                    aria-current="page"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/progress"
                                    className={clsx("px-3 py-2 rounded-md text-base font-normal text-gray-300 hover:text-white",
                                        {
                                            'text-white font-medium': pathname == "/progress",
                                        },
                                    )}
                                >
                                    Progress
                                </Link>
                                <Link
                                    href="/learn"
                                    className={clsx("px-3 py-2 rounded-md text-base font-normal text-gray-300 hover:text-white",
                                        {
                                            'text-white font-medium': pathname == "/learn",
                                        },
                                    )}
                                >
                                    Learn
                                </Link>
                            </div>
                            {/* {isSignedIn && (
                                <div className='text-gray-300 hover:text-white text-base font-normal'>
                                    <SignOutButton>Sign Out</SignOutButton>
                                </div>
                            )}
                            {!isSignedIn && (
                                <Link
                                    href="/sign-in"
                                    className={clsx("px-3 py-2 rounded-md text-base font-normal text-gray-300 hover:text-white",
                                        {
                                            'text-white font-medium': pathname == "/sign-in",
                                        },
                                    )}
                                >
                                    Sign In
                                </Link>
                            )} */}

                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="sm:hidden" id="mobile-menu">
                    <div className="px-2 pb-3">
                        <Link
                            href="/dashboard"
                            className={clsx(" block px-3 py-2 rounded-md text-base font-normal text-gray-300 hover:text-white",
                                {
                                    'text-white font-medium': pathname == "/dashboard",
                                },
                            )}
                            aria-current="page"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/progress"
                            className={clsx("block px-3 py-2 rounded-md text-base font-normal text-gray-300 hover:text-white",
                                {
                                    'text-white font-medium': pathname == "/progress",
                                },
                            )}
                        >
                            Progress
                        </Link>
                        <Link
                            href="/learn"
                            className={clsx(" block px-3 py-2 rounded-md text-base font-normal text-gray-300 hover:text-white",
                                {
                                    'text-white font-medium': pathname == "/learn",
                                },
                            )}
                        >
                            Learn
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavBar;