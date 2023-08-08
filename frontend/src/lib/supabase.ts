import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://upvmufxpvkpijpjjhbop.supabase.co'
export const supabase = createClient(
  supabaseUrl,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwdm11ZnhwdmtwaWpwampoYm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE0Nzk4MzgsImV4cCI6MjAwNzA1NTgzOH0.pmWOk00q1Knl602jCE-Hp6508pSmSBwGHcuOSRsjSAw'
)

export const getAgerImage = (name: number) => {
  return {
    input: `${supabaseUrl}/storage/v1/object/public/ager/input/${name}.jpg`,
    processed: `${supabaseUrl}/storage/v1/object/public/ager/processed/${name}.gif`
  }
}

export interface Ager {
  id: number
}

export const getAgers = () =>
  supabase
    .from('ager')
    .select()
    .order('id', {
      ascending: false
    })
    .then((x) => (x?.data as Ager[]) ?? [])

export const onNewAger = (callback: (data: Ager) => unknown) =>
  supabase
    .channel('any')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ager' }, (payload) =>
      callback(payload.new as Ager)
    )
    .subscribe()
