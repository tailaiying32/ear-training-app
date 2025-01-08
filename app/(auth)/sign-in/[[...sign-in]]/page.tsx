import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signin } from "./actions";

export default async function Page() {
    return (
        <>
            <h1 className="text-3xl font-semibold p-2 mb-6">Welcome Back!</h1>
            <form action={signin} className="space-y-3 space-x-2">
                <Label htmlFor="username">Username</Label>
                <Input name="username" id="username" className="border rounded-sm" />
                <br />
                <Label htmlFor="password">Password</Label>
                <Input type="password" name="password" id="password" className="border rounded-sm" />
                <br />
                <Button>Sign In</Button>
            </form >
        </>
    );
}


interface ActionResult {
    error: string;
}