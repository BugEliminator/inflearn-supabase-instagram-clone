"use server";

import { createServerSupabaseClient } from "utils/supabase/server";

function handleError(error) {
  if (error) {
    console.error(error);
    throw error;
  }
}

export async function searchMovies({ search, page, pageSize }) {
  const supabase = await createServerSupabaseClient();

  const { data, count, error } = await supabase
    .from("movie")
    .select("*")
    .like("title", `%${search}%`)
    .order("id", { ascending: true })
    .range((page - 1) * pageSize, page * pageSize - 1);

  const hasNextPage = count > page * pageSize;

  handleError(error);

  return {
    data,
    page,
    pageSize,
    hasNextPage,
  };
}

export async function getMovie(id: number) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("movie")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  handleError(error);

  return data;
}

export async function toggleBookmark(id: number, current: boolean) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("movie")
    .update({ bookmark: !current })
    .eq("id", id);

  handleError(error);
}

export async function getBookmarkedMovies() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("movie")
    .select("*")
    .eq("bookmark", true)
    .order("id", { ascending: true });

  handleError(error);

  return data;
}
