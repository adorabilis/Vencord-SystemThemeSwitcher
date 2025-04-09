/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin, { StartAt } from "@utils/types";

import * as pluginSettings from "./pluginSettings";
import * as themeToggler from "./themeToggler";
import { ToggledTheme } from "./types";

const settings = pluginSettings.getPluginSettings(onChange);

let currentTheme: ToggledTheme | null = null;
let mediaQueryList: MediaQueryList | null = null;
let pluginStarted: boolean = false;

function onChange() {
  if (pluginStarted) {
    updateTheme();
  }
}

function updateTheme(isDark?: boolean) {
  // If isDark is not provided, check the media query
  if (isDark === undefined && mediaQueryList) {
    isDark = mediaQueryList.matches;
  } else if (isDark === undefined) {
    // Fallback if media query is not available
    isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  const expectedTheme = isDark ? ToggledTheme.Dark : ToggledTheme.Light;
  const discordTheme =
    expectedTheme === ToggledTheme.Dark
      ? settings.store.darkTheme
      : settings.store.lightTheme;
  const customCssURLs =
    expectedTheme === ToggledTheme.Dark
      ? settings.store.darkThemeURLs
      : settings.store.lightThemeURLs;

  themeToggler.changeDiscordTheme(discordTheme as string);
  if (customCssURLs) {
    themeToggler.changeCustomCssUrls(customCssURLs);
  }

  currentTheme = expectedTheme;
}

function handleSystemThemeChange(event: MediaQueryListEvent) {
  updateTheme(event.matches);
}

export default definePlugin({
  name: "SystemThemeSwitcher",
  description:
    "Automatically switches between themes based on system appearance (light/dark mode)",
  authors: [
    {
      name: "adorabilis",
      id: 157156034136244224n,
    },
  ],
  settings,
  startAt: StartAt.WebpackReady,
  start() {
    mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQueryList.addEventListener("change", handleSystemThemeChange);
    updateTheme();
    pluginStarted = true;
  },
  stop() {
    if (mediaQueryList !== null) {
      mediaQueryList.removeEventListener("change", handleSystemThemeChange);
      mediaQueryList = null;
    }
    currentTheme = null;
    pluginStarted = false;
  },
});
