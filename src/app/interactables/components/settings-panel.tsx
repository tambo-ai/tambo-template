"use client";

import { withTamboInteractable } from "@tambo-ai/react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

const settingsSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  notifications: z
    .object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      sms: z.boolean().optional(),
    })
    .optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  language: z.enum(["en", "es", "fr", "de"]).optional(),
  privacy: z
    .object({
      shareAnalytics: z.boolean().optional(),
      personalizationEnabled: z.boolean().optional(),
    })
    .optional(),
});

type SettingsProps = z.infer<typeof settingsSchema>;

/** Internal state type where all values are resolved (non-null). */
type SettingsState = {
  name: string;
  email: string;
  notifications: { email: boolean; push: boolean; sms: boolean };
  theme: "light" | "dark" | "system";
  language: "en" | "es" | "fr" | "de";
  privacy: { shareAnalytics: boolean; personalizationEnabled: boolean };
};

function SettingsPanelBase(props: SettingsProps) {
  const [settings, setSettings] = useState<SettingsState>({
    name: props.name ?? "",
    email: props.email ?? "",
    notifications: {
      email: props.notifications?.email ?? false,
      push: props.notifications?.push ?? false,
      sms: props.notifications?.sms ?? false,
    },
    theme: props.theme ?? "light",
    language: props.language ?? "en",
    privacy: {
      shareAnalytics: props.privacy?.shareAnalytics ?? false,
      personalizationEnabled: props.privacy?.personalizationEnabled ?? false,
    },
  });
  const [emailError, setEmailError] = useState<string>("");
  const [updatedFields, setUpdatedFields] = useState<Set<string>>(new Set());
  const prevPropsRef = useRef<SettingsProps>(props);

  // Update local state when props change from Tambo, skipping null values
  useEffect(() => {
    const prevProps = prevPropsRef.current;

    // Find which fields actually changed (ignoring nulls)
    const changedFields = new Set<string>();

    if (props.name != null && props.name !== prevProps.name) {
      changedFields.add("name");
    }
    if (props.email != null && props.email !== prevProps.email) {
      changedFields.add("email");
    }
    if (props.theme != null && props.theme !== prevProps.theme) {
      changedFields.add("theme");
    }
    if (props.language != null && props.language !== prevProps.language) {
      changedFields.add("language");
    }

    // Check notification fields (guard against null parent and null children)
    if (props.notifications != null) {
      if (
        props.notifications.email != null &&
        props.notifications.email !== prevProps.notifications?.email
      ) {
        changedFields.add("notifications.email");
      }
      if (
        props.notifications.push != null &&
        props.notifications.push !== prevProps.notifications?.push
      ) {
        changedFields.add("notifications.push");
      }
      if (
        props.notifications.sms != null &&
        props.notifications.sms !== prevProps.notifications?.sms
      ) {
        changedFields.add("notifications.sms");
      }
    }

    // Check privacy fields
    if (props.privacy != null) {
      if (
        props.privacy.shareAnalytics != null &&
        props.privacy.shareAnalytics !== prevProps.privacy?.shareAnalytics
      ) {
        changedFields.add("privacy.shareAnalytics");
      }
      if (
        props.privacy.personalizationEnabled != null &&
        props.privacy.personalizationEnabled !==
          prevProps.privacy?.personalizationEnabled
      ) {
        changedFields.add("privacy.personalizationEnabled");
      }
    }

    // Merge only non-null values into current state
    setSettings((prev) => ({
      name: props.name ?? prev.name,
      email: props.email ?? prev.email,
      theme: props.theme ?? prev.theme,
      language: props.language ?? prev.language,
      notifications: {
        email: props.notifications?.email ?? prev.notifications.email,
        push: props.notifications?.push ?? prev.notifications.push,
        sms: props.notifications?.sms ?? prev.notifications.sms,
      },
      privacy: {
        shareAnalytics:
          props.privacy?.shareAnalytics ?? prev.privacy.shareAnalytics,
        personalizationEnabled:
          props.privacy?.personalizationEnabled ??
          prev.privacy.personalizationEnabled,
      },
    }));
    prevPropsRef.current = props;

    if (changedFields.size > 0) {
      setUpdatedFields(changedFields);
      // Clear highlights after animation
      const timer = setTimeout(() => {
        setUpdatedFields(new Set());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [props]);

  const handleChange = (updates: Partial<SettingsState>) => {
    setSettings((prev) => ({ ...prev, ...updates }));

    // Validate email if it's being updated
    if ("email" in updates) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email as string)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h2>

      {/* Personal Information */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Personal Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => handleChange({ name: e.target.value })}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  updatedFields.has("name") ? "animate-pulse" : ""
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange({ email: e.target.value })}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  emailError ? "border-red-500" : "border-gray-300"
                } ${updatedFields.has("email") ? "animate-pulse" : ""}`}
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Notifications
          </h3>
          <div className="space-y-3">
            <label
              className={`flex items-center ${
                updatedFields.has("notifications.email") ? "animate-pulse" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) =>
                  handleChange({
                    notifications: {
                      ...settings.notifications,
                      email: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Email notifications
              </span>
            </label>
            <label
              className={`flex items-center ${
                updatedFields.has("notifications.push") ? "animate-pulse" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) =>
                  handleChange({
                    notifications: {
                      ...settings.notifications,
                      push: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Push notifications
              </span>
            </label>
            <label
              className={`flex items-center ${
                updatedFields.has("notifications.sms") ? "animate-pulse" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={settings.notifications.sms}
                onChange={(e) =>
                  handleChange({
                    notifications: {
                      ...settings.notifications,
                      sms: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                SMS notifications
              </span>
            </label>
          </div>
        </div>

        {/* Appearance */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Appearance</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) =>
                  handleChange({
                    theme: e.target.value as "light" | "dark" | "system",
                  })
                }
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  updatedFields.has("theme") ? "animate-pulse" : ""
                }`}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) =>
                  handleChange({
                    language: e.target.value as "en" | "es" | "fr" | "de",
                  })
                }
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  updatedFields.has("language") ? "animate-pulse" : ""
                }`}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy</h3>
          <div className="space-y-3">
            <label
              className={`flex items-center ${
                updatedFields.has("privacy.shareAnalytics")
                  ? "animate-pulse"
                  : ""
              }`}
            >
              <input
                type="checkbox"
                checked={settings.privacy.shareAnalytics}
                onChange={(e) =>
                  handleChange({
                    privacy: {
                      ...settings.privacy,
                      shareAnalytics: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Share usage analytics
              </span>
            </label>
            <label
              className={`flex items-center ${
                updatedFields.has("privacy.personalizationEnabled")
                  ? "animate-pulse"
                  : ""
              }`}
            >
              <input
                type="checkbox"
                checked={settings.privacy.personalizationEnabled}
                onChange={(e) =>
                  handleChange({
                    privacy: {
                      ...settings.privacy,
                      personalizationEnabled: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Enable personalization
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Current Settings Display */}
      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Current Settings (JSON)
        </h4>
        <pre className="text-xs text-gray-600 overflow-auto">
          {JSON.stringify(settings, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// Create the interactable component
const InteractableSettingsPanel = withTamboInteractable(SettingsPanelBase, {
  componentName: "SettingsForm",
  description:
    "User settings form with personal info, notifications, and preferences",
  propsSchema: settingsSchema,
});

// Export a wrapper that provides default props and handles state
export function SettingsPanel() {
  return (
    <InteractableSettingsPanel
      name="Alice Johnson"
      email="alice@example.com"
      notifications={{
        email: true,
        push: false,
        sms: true,
      }}
      theme="light"
      language="en"
      privacy={{
        shareAnalytics: false,
        personalizationEnabled: true,
      }}
      onPropsUpdate={(newProps: Record<string, unknown>) => {
        console.log("Settings updated from Tambo:", newProps);
      }}
    />
  );
}
