import { signup } from "../actions";
import { Button } from "@/components/ui/button";

export default async function Page() {

    return (
        <>
            <h1>Create an account</h1>
            <form action={signup} className="space-y-3 space-x-2">
                <label htmlFor="username">Username</label>
                <input name="username" id="username" className="border rounded-sm" />
                <br />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" className="border rounded-sm" />
                <br />
                <Button>Sign Up</Button>
            </form>
        </>
    );
}


interface ActionResult {
    error: string;
}