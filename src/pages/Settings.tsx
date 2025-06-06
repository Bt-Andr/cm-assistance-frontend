import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { User, Bell, Settings as SettingsIcon, Shield, Globe, CreditCard, CheckCircle, Upload, X } from 'lucide-react';
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";
import { useUser } from "@/context/UserContext";
import { useUpdateProfile } from "@/hooks/useSettings";

const Settings = () => {
  const { user, isLoading: userLoading } = useUser();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    avatarUrl: "",
    avatarFile: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
  }>({});

  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordPending, setPasswordPending] = useState(false);

  useEffect(() => {
    if (user) {
      let firstName = "";
      let lastName = "";
      if (user.name) {
        const parts = user.name.trim().split(" ");
        firstName = parts[0] || "";
        lastName = parts.slice(1).join(" ") || "";
      }
      setProfile({
        firstName,
        lastName,
        email: user.email || "",
        avatarUrl: user.avatarUrl || "",
        avatarFile: user.avatarFile || "",
      });
      setAvatarPreview(user.avatarUrl || "");
    }
  }, [user]);

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordFields({ ...passwordFields, [e.target.id]: e.target.value });
    setPasswordError(null);
  };

  // Validation locale
  const validateProfile = () => {
    const errors: typeof fieldErrors = {};
    if (!profile.firstName || profile.firstName.trim().length < 2) {
      errors.firstName = "Le prénom doit contenir au moins 2 caractères.";
    }
    if (!profile.lastName || profile.lastName.trim().length < 2) {
      errors.lastName = "Le nom doit contenir au moins 2 caractères.";
    }
    if (!profile.email) {
      errors.email = "L'email est requis.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(profile.email)) {
      errors.email = "Format d'email invalide.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Prépare le payload pour le backend
  const buildProfilePayload = () => {
    const payload: any = {};

    const firstName = profile.firstName.trim();
    const lastName = profile.lastName.trim();
    const name = `${firstName} ${lastName}`.trim();
    if (firstName && lastName) payload.name = name;
    if (profile.email && profile.email.trim()) payload.email = profile.email.trim();
    if (profile.avatarUrl && profile.avatarUrl.trim()) payload.avatarUrl = profile.avatarUrl.trim();
    if (profile.avatarFile && profile.avatarFile.trim()) payload.avatarFile = profile.avatarFile.trim();

    return payload;
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorDetail(null);

    if (!validateProfile()) {
      setSaving(false);
      return;
    }

    let avatarUrlToSend = profile.avatarUrl;
    let avatarFileToSend = profile.avatarFile;

    // Upload avatar si besoin
    if (avatarFile) {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      try {
        const res = await fetch("https://backend-cm-assistance.onrender.com/api/profile/avatar", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("cm_token") || ""}`,
            // NE PAS mettre 'Content-Type': 'application/json' ici !
          },
        });
        const data = await res.json();
        if (res.ok && data.url) {
          avatarUrlToSend = data.url;
          avatarFileToSend = data.filename || "";
        } else {
          setErrorDetail(data?.message || "Erreur lors de l'upload de l'avatar.");
          toast.error(data?.message || "Erreur lors de l'upload de l'avatar.");
          setSaving(false);
          return;
        }
      } catch (err: any) {
        setErrorDetail(err?.message || "Erreur lors de l'upload de l'avatar.");
        toast.error(err?.message || "Erreur lors de l'upload de l'avatar.");
        setSaving(false);
        return;
      }
    }

    // Affiche immédiatement le message d'attente
    toast.info("Vous recevrez un mail de confirmation si la demande est acceptée.");
    setPendingConfirmation(true);
    localStorage.setItem("profile_update_pending", "true");

    updateProfile(
      {
        ...buildProfilePayload(),
        avatarUrl: avatarUrlToSend,
        avatarFile: avatarFileToSend,
      },
      {
        onSuccess: () => {
          toast.success("Le mail de confirmation pour modifier vos données a été envoyé, vérifiez votre boite mail et confirmez votre demande.");
          setSaving(false);
          setPendingConfirmation(false);
        },
        onError: (error: any) => {
          const msg = error?.message || error?.response?.data?.message || "Erreur lors de la demande de modification.";
          setErrorDetail(msg);
          toast.error(msg);
          setSaving(false);
          setPendingConfirmation(false);
        },
      }
    );
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    setProfile((prev) => ({
      ...prev,
      avatarUrl: "",
      avatarFile: "",
    }));
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordPending(true);

    // Validation locale moderne
    if (!passwordFields.currentPassword || !passwordFields.newPassword || !passwordFields.confirmPassword) {
      setPasswordError("Tous les champs sont requis.");
      setPasswordPending(false);
      return;
    }
    if (passwordFields.newPassword.length < 8) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      setPasswordPending(false);
      return;
    }
    if (passwordFields.newPassword === passwordFields.currentPassword) {
      setPasswordError("Le nouveau mot de passe doit être différent de l'ancien.");
      setPasswordPending(false);
      return;
    }
    // Validation complexité : majuscule, minuscule, chiffre, caractère spécial
    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!complexityRegex.test(passwordFields.newPassword)) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.");
      setPasswordPending(false);
      return;
    }
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas.");
      setPasswordPending(false);
      return;
    }

    try {
      const res = await fetch("https://backend-cm-assistance.onrender.com/api/profile/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("cm_token") || ""}`,
        },
        body: JSON.stringify({
          currentPassword: passwordFields.currentPassword,
          newPassword: passwordFields.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.info("Vous recevrez un mail de confirmation pour changer votre mot de passe.");
        setPasswordPending(true);
        setPasswordFields({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        localStorage.setItem("password_update_pending", "true");
      } else {
        setPasswordError(data?.message || "Erreur lors de la demande de changement de mot de passe.");
        setPasswordPending(false);
      }
    } catch (err: any) {
      setPasswordError(err?.message || "Erreur lors de la demande de changement de mot de passe.");
      setPasswordPending(false);
    }
  };

  useEffect(() => {
    const pending = localStorage.getItem("profile_update_pending") === "true";
    setPendingConfirmation(pending);
  }, []);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-secondary mb-6">Settings</h1>
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-white p-1 border border-secondary-light rounded-lg">
          <TabsTrigger value="account" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information Card */}
            <Card className="shadow-card w-full h-full flex flex-col">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your account details and profile picture</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                {pendingConfirmation && (
                  <div className="mb-4 p-3 rounded bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A4.125 4.125 0 119 14.625M15.75 9V3.75A.75.75 0 0015 3h-6a.75.75 0 00-.75.75V9m9.75 0h-9.75" />
                    </svg>
                    <span>
                      Modification en attente de confirmation. Veuillez vérifier votre boîte mail et cliquer sur le lien de confirmation pour appliquer les changements.
                    </span>
                  </div>
                )}
                {errorDetail && (
                  <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300 flex items-center gap-2">
                    <X className="w-5 h-5" />
                    <span>{errorDetail}</span>
                  </div>
                )}
                <form className="space-y-6" onSubmit={handleProfileSave}>
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center text-white text-xl overflow-hidden">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          (profile.firstName[0] || "") + (profile.lastName[0] || "")
                        )}
                      </div>
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow cursor-pointer"
                        title="Changer l'avatar"
                      >
                        <Upload className="h-4 w-4" />
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </label>
                      {avatarPreview && (
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow"
                          title="Supprimer l'avatar"
                          onClick={handleRemoveAvatar}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 flex-1">
                      <p className="text-sm text-secondary/70">
                        Upload a new profile picture or avatar. Recommended size is 200x200px.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-secondary mb-1">
                          First Name
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={profile.firstName}
                          onChange={handleProfileChange}
                          className={`w-full px-3 py-2 rounded-md border ${
                            fieldErrors.firstName ? "border-red-500" : "border-secondary-light"
                          } focus:ring-2 focus:ring-primary/20 focus:outline-none`}
                        />
                        <p className="text-xs text-secondary/60 mt-1">
                          Le prénom doit contenir au moins 2 caractères.
                        </p>
                        {fieldErrors.firstName && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-secondary mb-1">
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={profile.lastName}
                          onChange={handleProfileChange}
                          className={`w-full px-3 py-2 rounded-md border ${
                            fieldErrors.lastName ? "border-red-500" : "border-secondary-light"
                          } focus:ring-2 focus:ring-primary/20 focus:outline-none`}
                        />
                        <p className="text-xs text-secondary/60 mt-1">
                          Le nom doit contenir au moins 2 caractères.
                        </p>
                        {fieldErrors.lastName && (
                          <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-secondary mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        className={`w-full px-3 py-2 rounded-md border ${
                          fieldErrors.email ? "border-red-500" : "border-secondary-light"
                        } focus:ring-2 focus:ring-primary/20 focus:outline-none`}
                      />
                      {fieldErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={saving || isPending || pendingConfirmation}>
                      {saving || isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card className="shadow-card w-full h-full flex flex-col">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your password and security settings</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <form className="space-y-6" onSubmit={handlePasswordUpdate}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-secondary mb-1">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        value={passwordFields.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        autoComplete="current-password"
                        disabled={passwordPending}
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-secondary mb-1">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        value={passwordFields.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        autoComplete="new-password"
                        disabled={passwordPending}
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary mb-1">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={passwordFields.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        autoComplete="new-password"
                        disabled={passwordPending}
                      />
                    </div>
                    {passwordError && (
                      <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                    )}
                    {passwordPending && (
                      <div className="mb-4 p-3 rounded bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A4.125 4.125 0 119 14.625M15.75 9V3.75A.75.75 0 0015 3h-6a.75.75 0 00-.75.75V9m9.75 0h-9.75" />
                        </svg>
                        <span>
                          Changement de mot de passe en attente de confirmation. Veuillez vérifier votre boîte mail et cliquer sur le lien de confirmation.
                        </span>
                      </div>
                    )}
                    <div className="flex justify-end">
                      <Button type="submit" disabled={passwordPending}>
                        {passwordPending ? "En attente..." : "Update Password"}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Nouvelle carte Two-Factor Authentication */}
          <div className="mt-6">
            <Card className="shadow-card w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account by requiring more than just a password to sign in.
                  </CardDescription>
                </div>
                <Button variant="outline" className="flex items-center" type="button">
                  <Shield className="h-4 w-4 mr-2" />
                  Enable 2FA
                </Button>
              </CardHeader>
              {/* Pas de CardContent nécessaire ici */}
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-secondary">Email Notifications</h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-secondary">New Ticket Alerts</p>
                        <p className="text-xs text-secondary/70">Get notified when a new support ticket is created</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-secondary-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-secondary">Post Schedule Reminders</p>
                        <p className="text-xs text-secondary/70">Receive reminders before your scheduled posts go live</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-secondary-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-secondary">Analytics Reports</p>
                        <p className="text-xs text-secondary/70">Weekly and monthly performance reports</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-secondary-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-secondary">Client Communications</p>
                        <p className="text-xs text-secondary/70">Updates when clients send messages or feedback</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-secondary-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-secondary-light"></div>

                <div className="space-y-4">
                  <h3 className="text-md font-medium text-secondary">In-App Notifications</h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-secondary">Real-Time Alerts</p>
                        <p className="text-xs text-secondary/70">Show notifications for new activity as it happens</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-secondary-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium text-secondary">Sound Alerts</p>
                        <p className="text-xs text-secondary/70">Play sound when new notifications arrive</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-secondary-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>Customize your workspace experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-secondary">Display</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-secondary mb-1">
                        Language
                      </label>
                      <select
                        id="language"
                        className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        defaultValue="en"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="timezone" className="block text-sm font-medium text-secondary mb-1">
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        className="w-full px-3 py-2 rounded-md border border-secondary-light focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        defaultValue="utc"
                      >
                        <option value="utc">UTC</option>
                        <option value="est">Eastern Time (ET)</option>
                        <option value="pst">Pacific Time (PT)</option>
                        <option value="cet">Central European Time (CET)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-secondary">Compact Mode</p>
                      <p className="text-xs text-secondary/70">Display more information with less spacing</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-secondary-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-light after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <div className="h-px bg-secondary-light"></div>

                <div className="space-y-4">
                  <h3 className="text-md font-medium text-secondary">Social Media Integration</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary">Facebook</p>
                          <p className="text-xs text-secondary/70">Connected</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Disconnect</Button>
                    </div>

                    <div className="border rounded-md p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary">Twitter</p>
                          <p className="text-xs text-secondary/70">Connected</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Disconnect</Button>
                    </div>

                    <div className="border rounded-md p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E4405F] flex items-center justify-center text-white">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary">Instagram</p>
                          <p className="text-xs text-secondary/70">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>

                    <div className="border rounded-md p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center text-white">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary">LinkedIn</p>
                          <p className="text-xs text-secondary/70">Connected</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Disconnect</Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Subscription & Billing</CardTitle>
              <CardDescription>Manage your subscription and payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-secondary-light rounded-lg p-4 border border-secondary-light/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg text-secondary">Pro Plan</span>
                        <span className="bg-primary text-white text-xs py-1 px-2 rounded-full">Current</span>
                      </div>
                      <p className="text-secondary/70 mt-1">$29/month, billed monthly</p>
                    </div>
                    <Button variant="outline">Change Plan</Button>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-secondary">Unlimited tickets</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-secondary">Advanced analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-secondary">10 team members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-secondary">Priority support</span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-secondary-light"></div>

                <div>
                  <h3 className="text-md font-medium text-secondary mb-4">Payment Methods</h3>

                  <div className="space-y-3">
                    <div className="border rounded-md p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-secondary/10 rounded flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-secondary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary">•••• •••• •••• 4242</p>
                          <p className="text-xs text-secondary/70">Expires 04/25</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-secondary-light text-secondary text-xs py-1 px-2 rounded-full">Default</span>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                </div>

                <div className="h-px bg-secondary-light"></div>

                <div>
                  <h3 className="text-md font-medium text-secondary mb-4">Billing History</h3>

                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-secondary-light/50">
                          <th className="text-left px-4 py-3 text-xs font-medium text-secondary/70">Date</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-secondary/70">Description</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-secondary/70">Amount</th>
                          <th className="text-left px-4 py-3 text-xs font-medium text-secondary/70">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-secondary-light">
                        <tr>
                          <td className="px-4 py-3 text-sm text-secondary">May 1, 2023</td>
                          <td className="px-4 py-3 text-sm text-secondary">Pro Plan Subscription</td>
                          <td className="px-4 py-3 text-sm text-secondary">$29.00</td>
                          <td className="px-4 py-3">
                            <span className="bg-green-100 text-green-700 text-xs py-1 px-2 rounded-full">Paid</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-secondary">Apr 1, 2023</td>
                          <td className="px-4 py-3 text-sm text-secondary">Pro Plan Subscription</td>
                          <td className="px-4 py-3 text-sm text-secondary">$29.00</td>
                          <td className="px-4 py-3">
                            <span className="bg-green-100 text-green-700 text-xs py-1 px-2 rounded-full">Paid</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-secondary">Mar 1, 2023</td>
                          <td className="px-4 py-3 text-sm text-secondary">Pro Plan Subscription</td>
                          <td className="px-4 py-3 text-sm text-secondary">$29.00</td>
                          <td className="px-4 py-3">
                            <span className="bg-green-100 text-green-700 text-xs py-1 px-2 rounded-full">Paid</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
