import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
    return (
        <div className="bg-black text-white min-h-[calc(100vh-64px)] flex flex-col justify-center items-center">
            <div className="text-center max-w-2xl px-4 animate-fade-in">
                <h1 className="text-6xl font-bold mb-6 ">Ear Trainer</h1>
                <h2 className="text-2xl mb-8 opacity-80">Simple ear training with thoughtful features</h2>
                <p className="text-lg mb-12 italic opacity-60">Made by a Royal Conservatory graduate</p>
                <div className="space-y-4">
                    <Button className="w-full bg-white text-black hover:bg-gray-200 transition-colors" asChild>
                        <Link href='/sign-up' className="">Start your journey</Link>
                    </Button>

                    <Button variant="link" className="text-white opacity-60 hover:opacity-80">
                        <Link href='/sign-in' className="">Already have an account?</Link>
                    </Button>

                </div>
            </div >
        </div >
    );
}

// Add this CSS to your global styles or a separate file
`
@keyframes fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
    animation: fade-in 1s ease-out;
}
`
