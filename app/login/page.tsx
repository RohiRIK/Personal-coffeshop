import { AuthForm } from 'components/auth/auth-form';

export const metadata = {
    title: 'Login',
    description: 'Sign in to your Brista Coffee account',
};

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-stone-100 mb-2">
                    <span className="text-amber-400">Brista</span> Coffee
                </h1>
                <p className="text-stone-400">Sign in to place orders</p>
                <p className="text-sm text-stone-500 italic mt-2">
                    Powered by caffeine and questionable life choices ☕
                </p>
            </div>

            <AuthForm mode="login" />
        </div>
    );
}
