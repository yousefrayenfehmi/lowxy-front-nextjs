import { CodeConfirmationApi, ResendCodeApi } from "@/app/Api/AuthApi/ApiGlobale";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function CodeConfirmation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const types = searchParams.get('type');
    setType(types || '');
  }, [searchParams]);
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (!/^\d*$/.test(value)) return; // Permet seulement les chiffres
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Passage automatique à la case suivante si une valeur est saisie
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    console.log(newCode);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Gestion du retour en arrière avec Backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    
    const codeString = {
      code: code.join('')
    };
    
    try {
      console.log('Code soumis:', codeString);
      const response = await CodeConfirmationApi(codeString, type);
      console.log(response);
      
      if(response.success === true){
        console.log('success');
        console.log(response.message);
        setIsSuccess(true);
        setMessage(response.message || 'Code vérifié avec succès !');
        
        // Redirection après 2 second
        setTimeout(() => {
          router.push('/Auth/Connection?type=' + type);
        }, 2000);
      } else {
        setIsSuccess(false);
        setError(response.message || 'Code invalide. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      setIsSuccess(false);
      setError('Erreur lors de la vérification. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 2.26a2 2 0 001.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirmation du Code</h1>
          <p className="text-gray-600 mb-4">
            Nous avons envoyé un code de vérification à 6 chiffres à votre adresse email
          </p>
          
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Code Input Fields */}
          <div className="flex justify-center space-x-3 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-xl font-bold border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md hover:shadow-lg text-blue-900 placeholder-blue-300"
                autoComplete="off"
              />
            ))}
          </div>

          {/* Success/Error Messages */}
          <div className="text-center">
            {isSuccess && message && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm font-medium">{message}</p>
              </div>
            )}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Vérification...
                </>
              ) : isSuccess ? (
                'Code Vérifié ✓'
              ) : (
                'Confirmer le Code'
              )}
            </button>
          </div>


          {/* Resend Code */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Vous n'avez pas reçu le code ?
            </p>
            <button
              type="button"
              className="font-medium text-purple-600 hover:text-purple-500 underline transition-colors"
              onClick={() => ResendCodeApi(type)}
            >
              Renvoyer le code
            </button>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <a onClick={() => router.push('/Auth/Inscription?type=' + type)} className="text-sm text-gray-500 hover:text-gray-700 underline">
              ← Retour à l'inscription
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}