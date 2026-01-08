/**
 * Profile.jsx
 *
 * Description: User profile page with account settings,
 * profile information editing, and account management.
 *
 * Usage:
 *   <Route path="/profile" element={<Profile />} />
 */

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { validateEmail, validatePassword } from "../utils/validators";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Card from "../components/common/Card";

/**
 * Profile page component
 */
function Profile() {
  const { user, refreshUser } = useAuth();
  const { showSuccess, showError } = useNotification();

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  /**
   * Handles profile form changes
   */
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /**
   * Handles password form changes
   */
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /**
   * Validates profile form
   */
  const validateProfileForm = () => {
    const errors = {};

    if (!profileData.name.trim()) {
      errors.name = "Name is required";
    } else if (profileData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!profileData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(profileData.email)) {
      errors.email = "Please enter a valid email";
    }

    return errors;
  };

  /**
   * Validates password form
   */
  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else {
      const { isValid, errors: pwdErrors } = validatePassword(
        passwordData.newPassword
      );
      if (!isValid) {
        errors.newPassword = pwdErrors[0];
      }
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  /**
   * Handles profile form submission
   */
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const errors = validateProfileForm();
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    setIsUpdatingProfile(true);
    try {
      // API call would go here
      // await userService.updateProfile(profileData);
      await refreshUser();
      showSuccess("Profile updated successfully");
    } catch (err) {
      showError(err.message || "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  /**
   * Handles password form submission
   */
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const errors = validatePasswordForm();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setIsUpdatingPassword(true);
    try {
      // API call would go here
      // await userService.changePassword(passwordData);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showSuccess("Password changed successfully");
    } catch (err) {
      showError(err.message || "Failed to change password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-8 relative">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-100">Account Settings</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
          <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-zinc-100 mb-6">
                Profile Information
              </h2>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-linear-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <span className="text-2xl font-bold text-white">
                      {(user?.name || "U").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-100">
                      {user?.name}
                    </p>
                    <p className="text-sm text-zinc-500">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Full name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    error={profileErrors.name}
                    placeholder="John Doe"
                  />

                  <Input
                    label="Email address"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    error={profileErrors.email}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    loading={isUpdatingProfile}
                    disabled={isUpdatingProfile}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </Card>

          {/* Change Password */}
          <Card className="bg-zinc-900/50 backdrop-blur-sm border-zinc-800/50">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-zinc-100 mb-6">
                Change Password
              </h2>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <Input
                  label="Current password"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.currentPassword}
                  placeholder="••••••••"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="New password"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    error={passwordErrors.newPassword}
                    placeholder="••••••••"
                  />

                  <Input
                    label="Confirm new password"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    error={passwordErrors.confirmPassword}
                    placeholder="••••••••"
                  />
                </div>

                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                  <p className="text-sm font-medium text-zinc-300 mb-2">
                    Password requirements:
                  </p>
                  <ul className="text-sm text-zinc-500 space-y-1 list-disc list-inside">
                    <li>At least 8 characters long</li>
                    <li>Contains at least one uppercase letter</li>
                    <li>Contains at least one lowercase letter</li>
                    <li>Contains at least one number</li>
                    <li>Contains at least one special character</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    loading={isUpdatingPassword}
                    disabled={isUpdatingPassword}
                  >
                    Change Password
                  </Button>
                </div>
              </form>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-zinc-900/50 backdrop-blur-sm border-red-500/20">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-red-400 mb-2">
                Danger Zone
              </h2>
              <p className="text-sm text-zinc-500 mb-6">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>

              <Button variant="danger">Delete Account</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Profile;
