import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { useCallback } from "react";
import { FaGoogle } from "react-icons/fa";

interface GoogleButtonProps {
    disabled?: boolean;
}

export default function GoogleButton({ disabled = false }: GoogleButtonProps) {

    const {language} = useLanguageStore();

    const handleGoogleSignIn = useCallback(() => {
        if (!disabled) {
            window.location.href="http://localhost:8080/oauth2/authorization/google"
        }
    }, [disabled]);

    return (
        <Button 
            type="button" 
            onClick={handleGoogleSignIn} 
            disabled={disabled}
            className="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <FaGoogle size={20} className="mr-2" />
            {language === 'vi' ? 'Đăng nhập với Google' : 'Sign In with Google'}
        </Button>
    )
}