import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";
import { useUser } from '@/context/UserContext';
import { useLogin } from "@/hooks/useLogin";
import { useRegister } from "@/hooks/useRegister";
import { useForgotPassword } from "@/hooks/useForgotPassword";

const passwordComplexity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      passwordComplexity,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: z.string().min(8, "Confirm password is required"),
  companyType: z.enum(["freelancer", "agency", "sme"], {
    required_error: "Please select a company type",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;
type ForgotFormData = z.infer<typeof forgotSchema>;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();
  const { login: loginContext } = useUser();

  const { mutate: loginMutate, isPending: isLoginPending } = useLogin();
  const { mutate: registerMutate, isPending: isRegisterPending } = useRegister();
  const { mutate: forgotMutate, isPending: isForgotPending } = useForgotPassword();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      companyType: undefined,
    },
  });

  const forgotForm = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onLoginSubmit = (data: LoginFormData) => {
    loginMutate({ email: data.email, password: data.password }, {
      onSuccess: (result: any) => {
        loginContext(result.token, result.user);
        toast.success(result?.message || "Connexion réussie !");
        navigate("/dashboard");
      },
      onError: (error: any) => {
        // Prend en compte les différents formats d'erreur API
        toast.error(
          error?.message ||
          error?.response?.data?.message ||
          (typeof error === "string" ? error : "Erreur de connexion")
        );
      },
    });
  };

  const onSignupSubmit = (data: SignupFormData) => {
    const payload = {
      name: data.fullName,
      email: data.email,
      password: data.password,
      companyType: data.companyType,
    };
    registerMutate(payload, {
      onSuccess: (result: any) => {
        toast.success(result?.message || "Compte créé !");
        if (result.user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      },
      onError: (error: any) => {
        toast.error(
          error?.message ||
          error?.response?.data?.message ||
          (typeof error === "string" ? error : "Erreur lors de l'inscription")
        );
      },
    });
  };

  const onForgotSubmit = (data: ForgotFormData) => {
    forgotMutate({ email: data.email }, {
      onSuccess: (result: any) => {
        toast.success(result?.message || "Un email de réinitialisation a été envoyé.");
        setShowForgot(false);
        forgotForm.reset();
      },
      onError: (error: any) => {
        toast.error(
          error?.message ||
          error?.response?.data?.message ||
          (typeof error === "string" ? error : "Erreur lors de la demande.")
        );
      },
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowForgot(false);
  };

  return (
    <div className="flex min-h-screen bg-secondary-light/30">
      {/* Brand logo */}
      <div className="absolute top-6 left-6 z-10">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="bg-primary text-white w-8 h-8 rounded-md flex items-center justify-center mr-2">CM</span>
          <span className={cn(
            isLogin ? "text-gray-800" : "text-white",
            "md:text-inherit"
          )}>
            Assistance
          </span>
        </h2>
      </div>

      {/* Main content container */}
      <div className="relative w-full flex flex-col md:flex-row overflow-hidden">
        {/* Left panel - Sign In Form */}
        <div className={cn(
          "w-full md:w-1/2 p-6 md:p-12 transition-all duration-700 ease-in-out",
          "flex items-center justify-center",
          isLogin ? "opacity-100 z-10" : "opacity-0 md:opacity-100 absolute md:relative md:z-0"
        )}>
          <div className="w-full max-w-md">
            {isLogin ? (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground">Sign in to your account to continue</p>
                </div>

                {!showForgot ? (
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="Enter your password" 
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-between items-center">
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 text-xs"
                          onClick={() => setShowForgot(true)}
                        >
                          Mot de passe oublié ?
                        </Button>
                        <Button type="submit" className="w-fit" disabled={isLoginPending || loginForm.formState.isSubmitting}>
                          {isLoginPending || loginForm.formState.isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                              <Spinner />
                              Connexion...
                            </div>
                          ) : (
                            "Sign in"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <Form key="forgot" {...forgotForm}>
                    <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-4">
                      <FormField
                        control={forgotForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Votre email</FormLabel>
                            <FormControl>
                              <Input placeholder="Entrez votre email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-between items-center">
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 text-xs"
                          onClick={() => setShowForgot(false)}
                        >
                          Retour à la connexion
                        </Button>
                        <Button type="submit" className="w-fit" disabled={isForgotPending || forgotForm.formState.isSubmitting}>
                          {isForgotPending || forgotForm.formState.isSubmitting ? (
                            <div className="flex items-center justify-center gap-2">
                              <Spinner />
                              Envoi...
                            </div>
                          ) : (
                            "Envoyer"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Button variant="link" className="p-0" onClick={toggleMode}>
                      Sign up
                    </Button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="hidden md:block w-full max-w-lg">
                <div className="bg-primary rounded-xl p-10 flex flex-col items-center justify-center text-white">
                  <h2 className="text-2xl font-bold mb-4">Streamline Your Community Management</h2>
                  <p className="text-center">One platform for all your community engagement, support, and AI automation needs.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right panel - Sign Up Form */}
        <div className={cn(
          "w-full md:w-1/2 p-6 md:p-12 transition-all duration-700 ease-in-out",
          "flex items-center justify-center",
          !isLogin ? "opacity-100 z-10" : "opacity-0 md:opacity-100 absolute md:relative md:z-0"
        )}>
          <div className="w-full max-w-md">
            {!isLogin ? (
              <div className="space-y-6 animate-fade-in">
                {/* Mobile illustration (visible only on mobile) */}
                <div className="md:hidden mb-8">
                  <div className="bg-primary rounded-xl p-6 flex flex-col items-center justify-center text-white">
                    <h2 className="text-2xl font-bold mb-4">Streamline Your Community Management</h2>
                    <p className="text-center">One platform for all your community engagement, support, and AI automation needs.</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">Create an account</h1>
                  <p className="text-muted-foreground">Join our community and start managing your clients</p>
                </div>

                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email address</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                {...field} 
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="companyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your company type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="freelancer">Freelancer</SelectItem>
                              <SelectItem value="agency">Agency</SelectItem>
                              <SelectItem value="sme">Small or Medium Enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isRegisterPending || signupForm.formState.isSubmitting}>
                      {isRegisterPending || signupForm.formState.isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <Spinner />
                          Création...
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Button variant="link" className="p-0" onClick={toggleMode}>
                      Sign In
                    </Button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="hidden md:block w-full max-w-lg">
                <div className="bg-primary rounded-xl p-10 flex flex-col items-center justify-center text-white">
                  <h2 className="text-2xl font-bold mb-4">Streamline Your Community Management</h2>
                  <p className="text-center">One platform for all your community engagement, support, and AI automation needs.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Floating action button for mobile - switches between modes */}
        <div className="md:hidden fixed bottom-8 right-8 z-20">
          <Button 
            onClick={toggleMode}
            className="rounded-full shadow-lg"
          >
            {isLogin ? "Sign Up" : "Sign In"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
