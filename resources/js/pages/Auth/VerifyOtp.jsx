import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Mail, ArrowLeft, RefreshCw, Shield } from 'lucide-react';
import MainLayout from '../../Layouts/MainLayout';

/**
 * Page de vérification OTP - Sécurité renforcée
 *
 * Après connexion Google, l'utilisateur doit saisir un code OTP envoyé par email
 */
const VerifyOtp = () => {
  const { email, message, errors } = usePage().props;
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post('/auth/verify-otp', { 
      email,
      otp 
    }, {
      onFinish: () => setIsSubmitting(false),
    });
  };

  const handleResendOtp = () => {
    setIsResending(true);

    router.post('/auth/resend-otp', { 
      email 
    }, {
      onFinish: () => setIsResending(false),
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Vérification de sécurité
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Un code de vérification a été envoyé à votre email
            </p>
            <p className="mt-1 font-medium text-blue-600">
              {email}
            </p>
          </div>

          {/* Message de succès/erreur */}
          {message && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <Mail className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {errors?.otp && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-800">
                {errors.otp}
              </p>
            </div>
          )}

          {/* Formulaire OTP */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="otp" className="sr-only">
                Code de vérification
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                autoComplete="one-time-code"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
              />
              <p className="mt-2 text-sm text-gray-500 text-center">
                Saisissez les 6 chiffres reçus par email
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <RefreshCw className="animate-spin h-5 w-5" />
                ) : (
                  'Vérifier le code'
                )}
              </button>
            </div>
          </form>

          {/* Bouton renvoyer le code */}
          <div className="text-center">
            <button
              onClick={handleResendOtp}
              disabled={isResending}
              className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
            >
              {isResending ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Renvoyer le code
                </>
              )}
            </button>
          </div>

          {/* Lien retour */}
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-500 flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la connexion
            </Link>
          </div>

          {/* Informations de sécurité */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <Shield className="h-5 w-5 text-blue-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Sécurité renforcée
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  Cette étape supplémentaire protège votre compte contre les accès non autorisés.
                  Le code expire dans 10 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VerifyOtp;