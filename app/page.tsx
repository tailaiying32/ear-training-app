import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div>
            <Button asChild>
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
            </Button>
            <Button>Sign Out</Button>
        </div>
    );
}
