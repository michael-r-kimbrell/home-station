import { type Profile, normalize } from "@/lib/benefits/model";

const PROFILE_KEY = "homestation-profile-v1";
const LESSON_KEY = "homestation-lessons-v1";

export function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Profile;
    if (!parsed || typeof parsed !== "object" || !parsed.role || !parsed.place) return null;
    return normalize(parsed);
  } catch {
    return null;
  }
}

export function saveProfile(profile: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(normalize(profile)));
}

export function clearProfile() {
  localStorage.removeItem(PROFILE_KEY);
}

export function loadLessons(): string[] {
  try {
    const raw = localStorage.getItem(LESSON_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function saveLessons(ids: string[]) {
  localStorage.setItem(LESSON_KEY, JSON.stringify(ids));
}
