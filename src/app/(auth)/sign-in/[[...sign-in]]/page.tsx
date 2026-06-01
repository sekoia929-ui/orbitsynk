import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        variables: {
          colorBackground: '#0f0f0f',
          colorText: '#ffffff',
          colorTextSecondary: '#888',
          colorInputBackground: '#1a1a1a',
          colorInputText: '#ffffff',
          colorPrimary: '#6366f1',
          borderRadius: '12px',
        },
        elements: {
          card: 'bg-[#0f0f0f] border border-white/8 shadow-2xl',
          headerTitle: 'text-white text-xl font-bold',
          headerSubtitle: 'text-white/50',
          formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-500',
          footerActionLink: 'text-indigo-400',
        }
      }}
    />
  )
}
