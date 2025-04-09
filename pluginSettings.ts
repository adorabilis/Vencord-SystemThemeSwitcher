/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { proxyLazy } from "@utils/lazy";
import { OptionType, SettingsDefinition } from "@utils/types";

import { ThemeLinksComponent } from "./themeLinksComponent";
import * as themeLister from "./themeLister";
import { ToggledTheme } from "./types";

function getToggledThemeSettings(
  theme: ToggledTheme,
  onChange: () => void,
): SettingsDefinition {
  const themeName = theme === ToggledTheme.Light ? "Light Theme" : "Dark Theme";

  return {
    theme: {
      description: `${themeName} to use when system is in ${theme === ToggledTheme.Light ? "light" : "dark"} mode`,
      type: OptionType.SELECT,
      options: proxyLazy(() => themeLister.getSelectOptions(theme)),
      onChange,
    },
    themeURLs: {
      type: OptionType.COMPONENT,
      onChange,
      component: (props) =>
        ThemeLinksComponent(
          props,
          theme === ToggledTheme.Light ? "lightThemeURLs" : "darkThemeURLs",
          `${themeName} CSS URLs (1 per line)`,
        ),
    },
  };
}

export function getPluginSettings(onChange: () => void) {
  const lightThemeSettings = getToggledThemeSettings(
    ToggledTheme.Light,
    onChange,
  );
  const darkThemeSettings = getToggledThemeSettings(
    ToggledTheme.Dark,
    onChange,
  );

  const settings = definePluginSettings({
    lightTheme: lightThemeSettings.theme,
    lightThemeURLs: lightThemeSettings.themeURLs,
    darkTheme: darkThemeSettings.theme,
    darkThemeURLs: darkThemeSettings.themeURLs,
  });

  return settings;
}
