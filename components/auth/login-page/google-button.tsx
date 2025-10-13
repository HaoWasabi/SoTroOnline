import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { useCallback } from "react";
import { FaGoogle } from "react-icons/fa";

export default function GoogleButton() {

    const {language} = useLanguageStore();

    const handleGoogleSignIn = useCallback(() => {
        window.location.href="http://localhost:8080/oauth2/authorization/google"
    }, []);

    return (
        <Button type="submit" onClick={handleGoogleSignIn} className="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer">
            <FaGoogle size={20} />
            {language === 'vi' ? 'Đăng nhập với Google' : 'Sign In with Google'}
        </Button>
    )
}